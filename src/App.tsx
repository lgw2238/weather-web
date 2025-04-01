import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, MessageCircle, Droplets, Moon, Leaf, Waves, Sunset } from 'lucide-react';
import { useWeatherStore, CITIES, SKY_CONDITIONS, PTY_TYPES, ALL_CITIES } from './store/weatherStore';
import { useChatStore } from './store/chatStore';
import { useThemeStore } from './store/themeStore';

const WeatherIcon = ({ sky, pty }: { sky: string; pty: string }) => {
  if (pty !== '0') {
    switch (pty) {
      case '1':
      case '4':
        return <CloudRain className="w-8 h-8 text-blue-500 weather-icon" />;
      case '2':
      case '3':
        return <CloudSnow className="w-8 h-8 text-blue-300 weather-icon" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500 weather-icon" />;
    }
  }

  switch (sky) {
    case '1':
      return <Sun className="w-8 h-8 text-yellow-500 weather-icon" />;
    case '3':
      return <Cloud className="w-8 h-8 text-gray-400 weather-icon" />;
    case '4':
      return <Cloud className="w-8 h-8 text-gray-600 weather-icon" />;
    default:
      return <Sun className="w-8 h-8 text-yellow-500 weather-icon" />;
  }
};

function App() {
  const { weatherData, loading, error, fetchWeather } = useWeatherStore();
  const { messages, addMessage } = useChatStore();
  const { theme, setTheme } = useThemeStore();
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태
  const [popupCity, setPopupCity] = useState<string | null>(null); // 팝업에 표시할 도시

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    Object.entries(ALL_CITIES).forEach(([_, coords]) => {
      fetchWeather(coords.nx, coords.ny);
    });
  }, []);

  const getWeatherData = (cityName: string) => {
    const coords = ALL_CITIES[cityName as keyof typeof ALL_CITIES];
    const data = weatherData[`${coords.nx}-${coords.ny}`];
    if (!data) return null;

    return {
      temp: data.TMP?.[0]?.fcstValue || '--',
      sky: data.SKY?.[0]?.fcstValue || '1',
      pty: data.PTY?.[0]?.fcstValue || '0',
      pop: data.POP?.[0]?.fcstValue || '0',
      reh: data.REH?.[0]?.fcstValue || '--',
      wsd: data.WSD?.[0]?.fcstValue || '--',
    };
  };

  const popupCityWeather = popupCity ? getWeatherData(popupCity) : null;

  return (
    <div className="relative min-h-screen">
      {/* 테마 버튼 컨테이너 */}
      <div className="absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end gap-2">
          <button
            onClick={() => setTheme('forest')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              theme === 'forest' 
                ? 'bg-primary text-background shadow-lg' 
                : 'bg-secondary/50 text-text hover:bg-secondary/70'
            }`}
            aria-label="Forest Theme"
          >
            <Leaf className="w-5 h-5" />
            <span>Forest</span>
          </button>
          <button
            onClick={() => setTheme('sea')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              theme === 'sea' 
                ? 'bg-primary text-background shadow-lg' 
                : 'bg-secondary/50 text-text hover:bg-secondary/70'
            }`}
            aria-label="Sea Theme"
          >
            <Waves className="w-5 h-5" />
            <span>Sea</span>
          </button>
          <button
            onClick={() => setTheme('warm')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              theme === 'warm' 
                ? 'bg-primary text-background shadow-lg' 
                : 'bg-secondary/50 text-text hover:bg-secondary/70'
            }`}
            aria-label="Warm Theme"
          >
            <Sunset className="w-5 h-5" />
            <span>Warm</span>
          </button>
        </div>
      </div>

      {showPopup && popupCityWeather && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-text">{popupCity} 날씨 정보</h3>
            <div className="space-y-2 text-text/80">
              <p>온도: {popupCityWeather.temp}°C</p>
              <p>하늘 상태: {SKY_CONDITIONS[popupCityWeather.sky as keyof typeof SKY_CONDITIONS]}</p>
              <p>강수 확률: {popupCityWeather.pop}%</p>
              <p>습도: {popupCityWeather.reh}%</p>
              <p>풍속: {popupCityWeather.wsd}m/s</p>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-4 py-2 bg-primary text-background rounded-lg shadow hover:bg-accent transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="pt-16 p-8 flex">
        <div className="main-container flex-1 mr-4 h-[calc(100vh-7rem)] bg-secondary/20 backdrop-blur-md rounded-3xl p-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8 text-text"
          >
            대한민국 날씨 정보
          </motion.h1>

          {loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-text/70"
            >
              날씨 정보를 불러오는 중...
            </motion.p>
          )}
          
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500"
            >
              에러: {error}
            </motion.p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(CITIES).map((cityName, index) => {
              const weatherInfo = getWeatherData(cityName);
              if (!weatherInfo) return null;

              return (
                <motion.div 
                  key={cityName}
                  className="weather-card p-6 bg-secondary/30 backdrop-blur-sm rounded-xl border border-accent/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-4">
                    <WeatherIcon sky={weatherInfo.sky} pty={weatherInfo.pty} />
                    <h3 className="text-xl font-semibold ml-3 text-text">{cityName}</h3>
                  </div>
                  <p className="text-3xl font-bold mb-2 text-primary">{weatherInfo.temp}°C</p>
                  <div className="space-y-2 text-text/80">
                    <p className="flex items-center">
                      <Cloud className="w-4 h-4 mr-2" />
                      {SKY_CONDITIONS[weatherInfo.sky as keyof typeof SKY_CONDITIONS]}
                      {weatherInfo.pty !== '0' && ` (${PTY_TYPES[weatherInfo.pty as keyof typeof PTY_TYPES]})`}
                    </p>
                    <p className="flex items-center">
                      <Droplets className="w-4 h-4 mr-2" />
                      강수확률: {weatherInfo.pop}%
                    </p>
                    <p className="flex items-center">
                      <Wind className="w-4 h-4 mr-2" />
                      풍속: {weatherInfo.wsd}m/s
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="w-96">
          <div className="chat-container p-6 h-[calc(100vh-7rem)] bg-secondary/20 backdrop-blur-md rounded-3xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-text">
              <MessageCircle className="mr-2" />
              실시간 날씨 문의
            </h2>
            
            <div className="h-[calc(100%-8rem)] overflow-y-auto mb-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-primary text-background'
                          : 'bg-secondary/50 text-text'
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                const inputValue = input.value.trim();

                if (inputValue) {
                  addMessage(inputValue, true);

                  if (ALL_CITIES[inputValue]) {
                    setPopupCity(inputValue); // 입력한 값을 기준으로 팝업 데이터 설정
                    setShowPopup(true); // 팝업 표시
                  } else {
                    alert("해당 도시는 존재하지 않습니다"); // 도시 이름이 매칭되지 않을 경우
                  }

                  input.value = ''; // 입력 필드 초기화
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                name="message"
                className="flex-1 px-4 py-2 rounded-full border border-accent/20 
                  bg-background/80 text-text 
                  shadow-inner 
                  placeholder:text-text/50
                  focus:outline-none focus:ring-2 focus:ring-primary/50 
                  focus:border-primary/50 
                  transition-all duration-300"
                placeholder="메시지를 입력하세요..."
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-background rounded-full 
                  shadow-lg hover:shadow-xl
                  hover:bg-accent hover:scale-105 
                  active:scale-95
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                전송
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;