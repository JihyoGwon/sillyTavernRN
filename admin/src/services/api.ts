// Vite 프록시를 사용하므로 상대 경로 사용
const API_BASE_URL = '';

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
    // 프록시를 통해 요청 (Vite 프록시 설정 사용)
    const response = await fetch('/csrf-token', {
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
 * API 요청 래퍼
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = await getRequestHeaders();
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API 요청 실패: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } catch {
        // JSON 파싱 실패 시 텍스트로 시도
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = `${errorMessage}: ${errorText.substring(0, 200)}`;
          }
        } catch {
          // 텍스트도 읽을 수 없으면 기본 메시지 사용
        }
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    // 네트워크 오류 등
    throw new Error('서버에 연결할 수 없습니다. SillyTavern 서버가 실행 중인지 확인하세요.');
  }
}

/**
 * POST 요청
 */
export async function apiPost<T>(endpoint: string, body: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

