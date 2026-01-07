# AI 상담사 앱

Expo SDK 54 + Expo Router v6 + TypeScript + Zustand를 사용한 AI 상담사 모바일 앱입니다.

## 기술 스택

- **프레임워크**: React Native (Expo SDK 54)
- **라우팅**: Expo Router v6
- **언어**: TypeScript
- **상태 관리**: Zustand v5
- **백엔드**: SillyTavern API

## 시작하기

### 설치

```bash
npm install
```

### 실행

```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행
npm run android

# 웹 브라우저에서 실행
npm run web
```

## 프로젝트 구조

```
├── app/              # Expo Router 라우팅 파일
├── components/       # 재사용 가능한 UI 컴포넌트
│   └── ui/          # 기본 UI 컴포넌트
├── hooks/           # 커스텀 React 훅
├── store/           # Zustand 스토어
├── constants/       # 앱 전반의 상수
└── assets/          # 이미지, 폰트 등 정적 자산
```

## 개발 규칙

- 모든 문서와 주석은 한글로 작성
- TypeScript Strict 모드 준수
- 함수형 컴포넌트와 화살표 함수 사용
- 텍스트와 컨테이너는 `ThemedText`와 `ThemedView` 사용 (다크 모드 지원)

