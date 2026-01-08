import { API_CONFIG } from '@/constants/Config';

// CSRF 토큰 저장
let csrfToken: string | null = null;

/**
 * CSRF 토큰 가져오기
 */
async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/csrf-token`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`CSRF 토큰 요청 실패: ${response.status}`);
    }

    // Content-Type 확인
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('CSRF 토큰 응답이 JSON이 아닙니다:', text.substring(0, 200));
      throw new Error('서버가 JSON을 반환하지 않습니다. SillyTavern 서버가 실행 중인지 확인하세요.');
    }

    const data = await response.json();
    
    if (!data.token) {
      throw new Error('CSRF 토큰이 응답에 없습니다.');
    }

    csrfToken = data.token;
    return csrfToken;
  } catch (err) {
    console.error('CSRF 토큰 가져오기 실패:', err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('CSRF 토큰을 가져올 수 없습니다.');
  }
}

/**
 * API 요청 헤더 생성
 */
async function getRequestHeaders(): Promise<HeadersInit> {
  const token = await getCsrfToken();
  return {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token,
  };
}

/**
 * API 기본 URL 생성
 */
function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * API 요청 래퍼 (에러 처리 포함)
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  const headers = {
    ...(await getRequestHeaders()),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API 요청 실패: ${response.status}`;
      console.error(`API Error [${endpoint}]:`, errorMessage, errorData);
      
      // CSRF 토큰 오류인 경우 토큰을 재요청
      if (response.status === 403 && errorMessage.includes('CSRF')) {
        console.log('CSRF 토큰 오류 감지, 토큰 재요청...');
        csrfToken = null; // 토큰 초기화
        const newHeaders = {
          ...(await getRequestHeaders()),
          ...options.headers,
        };
        // 재시도
        const retryResponse = await fetch(url, {
          ...options,
          headers: newHeaders,
        });
        if (!retryResponse.ok) {
          const retryErrorData = await retryResponse.json().catch(() => ({}));
          throw new Error(retryErrorData.error?.message || `API 요청 실패: ${retryResponse.status}`);
        }
        return await retryResponse.json();
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      // 네트워크 오류인 경우 더 자세한 정보 제공
      if (error.message.includes('fetch') || error.message.includes('network')) {
        console.error(`Network Error [${endpoint}]:`, error.message);
        throw new Error(`서버에 연결할 수 없습니다. SillyTavern 서버가 실행 중인지 확인하세요. (${url})`);
      }
      console.error(`API Request Error [${endpoint}]:`, error.message);
      throw error;
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
}

/**
 * POST 요청 헬퍼
 */
export async function apiPost<T>(
  endpoint: string,
  body: any
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * GET 요청 헬퍼 (필요시)
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
  });
}

