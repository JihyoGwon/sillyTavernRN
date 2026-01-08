/**
 * SillyTavern 서버 설정
 * 
 * Android 애뮬레이터에서는 127.0.0.1 대신 10.0.2.2를 사용해야 함
 * iOS 시뮬레이터와 웹에서는 127.0.0.1 사용 가능
 */

// 웹 환경 체크 (번들 타임에 최적화됨)
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// BASE_URL을 지연 평가하여 웹 환경에서 require가 실행되지 않도록 함
let _baseUrl: string | null = null;

const getBaseUrl = (): string => {
  // 이미 계산된 값이 있으면 재사용
  if (_baseUrl !== null) {
    return _baseUrl;
  }
  
  if (__DEV__) {
    // 웹 환경이면 바로 반환 (Platform 사용 안 함)
    if (isWeb) {
      _baseUrl = 'http://127.0.0.1:8000';
      return _baseUrl;
    }
    
    // React Native 환경에서만 Platform 사용
    // 웹 번들러가 이 코드를 실행하지 않도록 조건부 처리
    if (!isWeb && typeof require !== 'undefined') {
      try {
        // @ts-ignore - 웹 환경에서는 실행되지 않음
        const reactNative = require('react-native');
        if (reactNative && reactNative.Platform && reactNative.Platform.OS === 'android') {
          _baseUrl = 'http://10.0.2.2:8000';
          return _baseUrl;
        }
      } catch {
        // Platform을 불러올 수 없으면 기본값 사용
      }
    }
    
    _baseUrl = 'http://127.0.0.1:8000';
    return _baseUrl;
  }
  // 프로덕션 환경 (나중에 실제 서버 주소로 변경)
  _baseUrl = 'http://127.0.0.1:8000';
  return _baseUrl;
};

export const API_CONFIG = {
  get BASE_URL() {
    return getBaseUrl();
  },
};

