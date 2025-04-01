# 🌤️ 대한민국 날씨 정보 대시보드

실시간 한국 주요 도시의 
날씨 정보를 제공하고 채팅 기능이 포함된 반응형 웹 애플리케이션입니다.

## 🌟 주요 기능

### 날씨 정보 표시
- 주요 도시별 실시간 날씨 정보 제공
- 기온, 강수 확률, 하늘 상태, 풍속 등 상세 정보 표시
- 직관적인 날씨 아이콘으로 현재 상태 시각화

### 테마 커스터마이징
- Forest 테마: 자연친화적인 녹색 계열
- Sea 테마: 시원한 블루 계열
- Warm 테마: 따뜻한 파스텔톤 계열

### 실시간 날씨 채팅
- 사용자 간 실시간 날씨 정보 공유
- 인터랙티브한 채팅 인터페이스
- 애니메이션 효과가 적용된 메시지 표시

## 🛠️ 기술 스택

### Frontend
- React
- TypeScript
- Tailwind CSS
- Framer Motion (애니메이션)
- Zustand (상태 관리)
- Axios (HTTP 클라이언트)

### API
- 기상청 초단기예보 API 활용
- RESTful API 통신

## 📦 주요 패키지

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "zustand": "^4.0.0",
    "axios": "^1.0.0",
    "tailwindcss": "^3.0.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.294.0"
  }
}
```

## 🚀 시작하기

1. 저장소 클론
```bash
git clone [repository-url]
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```env
VITE_WEATHER_API_KEY=your_api_key
VITE_WEATHER_BASE_URL=your_api_url
```

4. 개발 서버 실행
```bash
npm run dev
```

## 📱 반응형 디자인
- 데스크톱, 태블릿, 모바일 환경 지원
- 유동적인 그리드 레이아웃
- 디바이스별 최적화된 UI/UX

## 🎨 테마 커스터마이징

### Forest 테마
```css
--forest-primary: #2C5530;
--forest-secondary: #8BA888;
--forest-background: #F1F7E7;
```

### Sea 테마
```css
--sea-primary: #1B4965;
--sea-secondary: #62B6CB;
--sea-background: #EBF5F7;
```

### Warm 테마
```css
--warm-primary: #F9B384;
--warm-secondary: #FFD9C0;
--warm-background: #FFF1E6;
```

