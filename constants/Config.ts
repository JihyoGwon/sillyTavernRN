/**
 * SillyTavern 서버 설정
 */
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://127.0.0.1:8000'  // 개발 환경
    : 'http://127.0.0.1:8000', // 프로덕션 환경 (나중에 실제 서버 주소로 변경)
};

