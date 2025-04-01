import create from 'zustand';
import axios from 'axios';

interface WeatherData {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

interface WeatherState {
  weatherData: Record<string, Record<string, WeatherData[]>>;
  loading: boolean;
  error: string | null;
  fetchWeather: (nx: number, ny: number) => Promise<void>;
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL;

// 주요 도시 좌표
const CITIES = {
  서울: { nx: 60, ny: 127 },
  부산: { nx: 98, ny: 76 },
  대구: { nx: 89, ny: 90 },
  인천: { nx: 55, ny: 124 },
  광주: { nx: 58, ny: 74 },
  대전: { nx: 67, ny: 100 },
  울산: { nx: 102, ny: 84 },
  세종: { nx: 66, ny: 103 },
};

const ALL_CITIES = {
  // 서울특별시
  서울: { nx: 60, ny: 127 },
  
  // 경기도
  수원: { nx: 60, ny: 121 },
  성남: { nx: 63, ny: 124 },
  용인: { nx: 64, ny: 119 },
  안양: { nx: 59, ny: 123 },
  안산: { nx: 58, ny: 121 },
  고양: { nx: 57, ny: 128 },
  의정부: { nx: 61, ny: 130 },
  파주: { nx: 56, ny: 131 },
  
  // 인천광역시
  인천: { nx: 55, ny: 124 },
  
  // 강원도
  춘천: { nx: 73, ny: 134 },
  원주: { nx: 76, ny: 122 },
  강릉: { nx: 92, ny: 131 },
  속초: { nx: 87, ny: 141 },
  
  // 충청북도
  청주: { nx: 69, ny: 107 },
  충주: { nx: 76, ny: 114 },
  제천: { nx: 81, ny: 118 },
  
  // 충청남도
  천안: { nx: 63, ny: 110 },
  공주: { nx: 63, ny: 102 },
  보령: { nx: 54, ny: 100 },
  아산: { nx: 60, ny: 110 },
  
  // 대전광역시
  대전: { nx: 67, ny: 100 },
  
  // 세종특별자치시
  세종: { nx: 66, ny: 103 },
  
  // 전라북도
  전주: { nx: 63, ny: 89 },
  군산: { nx: 56, ny: 92 },
  익산: { nx: 60, ny: 91 },
  정읍: { nx: 58, ny: 83 },
  
  // 전라남도
  목포: { nx: 50, ny: 67 },
  여수: { nx: 73, ny: 66 },
  순천: { nx: 70, ny: 70 },
  나주: { nx: 56, ny: 71 },
  
  // 광주광역시
  광주: { nx: 58, ny: 74 },
  
  // 경상북도
  포항: { nx: 102, ny: 94 },
  경주: { nx: 100, ny: 91 },
  안동: { nx: 91, ny: 106 },
  구미: { nx: 84, ny: 96 },
  
  // 대구광역시
  대구: { nx: 89, ny: 90 },
  
  // 경상남도
  창원: { nx: 91, ny: 77 },
  진주: { nx: 81, ny: 75 },
  통영: { nx: 87, ny: 68 },
  김해: { nx: 95, ny: 77 },
  
  // 부산광역시
  부산: { nx: 98, ny: 76 },
  
  // 울산광역시
  울산: { nx: 102, ny: 84 },
  
  // 제주특별자치도
  제주: { nx: 52, ny: 38 },
  서귀포: { nx: 53, ny: 32 }
};


const formatDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const formatTime = () => {
  const today = new Date();
  let hours = today.getHours();
  // 매 시간 30분에 생성되는 초단기예보
  let minutes = today.getMinutes();
  if (minutes < 30) {
    hours = hours - 1;
  }
  return String(hours).padStart(2, '0') + '00';
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weatherData: {},
  loading: false,
  error: null,
  fetchWeather: async (nx: number, ny: number) => {
    set({ loading: true });
    try {
      const params = {
        serviceKey: API_KEY,
        pageNo: '1',
        numOfRows: '300',
        dataType: 'JSON',
        base_date: formatDate(),
        base_time: '0500',
        nx: nx.toString(),
        ny: ny.toString(),
      };

      console.log('API 요청 파라미터:', params);
      const queryString = new URLSearchParams(params).toString();
      const url = `${BASE_URL}?${queryString}`;
      console.log('요청 URL:', url);

      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.data?.response?.body?.items?.item) {
        console.error('잘못된 API 응답 형식:', response.data);
        throw new Error('Invalid API response format');
      }

      if (response.data.response.header.resultCode !== '00') {
        throw new Error(response.data.response.header.resultMsg || 'API Error');
      }

      const items = response.data.response.body.items.item;
      
      // Filter items by fcstTime matching formatTime
      const filteredItems = items.filter((item: WeatherData) => item.fcstTime === formatTime());
     
      // Group filtered items by category
      const groupedData = filteredItems.reduce((acc: Record<string, WeatherData[]>, item: WeatherData) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});

      set((state) => ({
        weatherData: {
          ...state.weatherData,
          [`${nx}-${ny}`]: groupedData,
        },
        error: null,
      }));
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.response?.header?.resultMsg || error.message;
        set({ error: `API Error: ${errorMessage}` });
        console.error('Weather API Error:', error.toJSON());
      } else {
        set({ error: 'Failed to fetch weather data' });
        console.error('Weather API Error:', error);
      }
    } finally {
      set({ loading: false });
    }
  },
}));

// Weather category codes
export const WEATHER_CATEGORIES = {
  POP: '강수확률',
  PTY: '강수형태',
  PCP: '1시간 강수량',
  REH: '습도',
  SNO: '1시간 신적설',
  SKY: '하늘상태',
  TMP: '1시간 기온',
  TMN: '일 최저기온',
  TMX: '일 최고기온',
  UUU: '풍속(동서성분)',
  VVV: '풍속(남북성분)',
  WAV: '파고',
  VEC: '풍향',
  WSD: '풍속',
};

// Sky condition codes
export const SKY_CONDITIONS: Record<string, string> = {
  '1': '맑음',
  '3': '구름많음',
  '4': '흐림',
};

// Precipitation type codes
export const PTY_TYPES: Record<string, string> = {
  '0': '없음',
  '1': '비',
  '2': '비/눈',
  '3': '눈',
  '4': '소나기',
};

export { CITIES, ALL_CITIES };