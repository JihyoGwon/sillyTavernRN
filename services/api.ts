import { API_CONFIG } from '@/constants/Config';

/**
 * API 요청 헤더 생성
 */
function getRequestHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    // CSRF 토큰이 필요하면 여기에 추가
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
    ...getRequestHeaders(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API 요청 실패: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
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

