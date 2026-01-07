import { API_CONFIG } from '@/constants/Config';
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionMessage,
} from './types';

/**
 * API 요청 헤더 생성
 */
function getRequestHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

/**
 * API 기본 URL 생성
 */
function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * 비스트리밍 채팅 생성 요청
 * @param request 생성 요청 데이터
 * @param signal AbortSignal (요청 취소용)
 * @returns 생성된 응답
 */
export async function sendChatCompletion(
  request: ChatCompletionRequest,
  signal?: AbortSignal
): Promise<ChatCompletionResponse> {
  const url = getApiUrl('/api/backends/chat-completions/generate');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: getRequestHeaders(),
    body: JSON.stringify({
      ...request,
      stream: false,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `채팅 생성 실패: ${response.status}`
    );
  }

  const data = await response.json();
  
  // 응답에서 메시지 추출 (SillyTavern 형식에 맞게)
  return {
    content: extractMessageFromData(data),
    reasoning: extractReasoningFromData(data),
  };
}

/**
 * 스트리밍 채팅 생성 요청
 * @param request 생성 요청 데이터
 * @param onChunk 스트리밍 청크 수신 콜백
 * @param signal AbortSignal (요청 취소용)
 * @returns Promise<void>
 */
export async function sendStreamingChatCompletion(
  request: ChatCompletionRequest,
  onChunk: (chunk: { text: string; reasoning?: string }) => void,
  signal?: AbortSignal
): Promise<void> {
  const url = getApiUrl('/api/backends/chat-completions/generate');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: getRequestHeaders(),
    body: JSON.stringify({
      ...request,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const text = await response.text();
    try {
      const errorData = JSON.parse(text);
      throw new Error(errorData.error?.message || `스트리밍 실패: ${response.status}`);
    } catch {
      throw new Error(`스트리밍 실패: ${response.status}`);
    }
  }

  // React Native에서는 ReadableStream을 직접 사용
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('스트리밍 응답을 읽을 수 없습니다.');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let reasoning = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      // 청크를 텍스트로 디코딩
      buffer += decoder.decode(value, { stream: true });
      
      // 줄 단위로 파싱 (SSE 형식: "data: {...}\n\n")
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 마지막 불완전한 줄은 버퍼에 보관

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6); // "data: " 제거
          
          if (dataStr === '[DONE]') {
            return;
          }

          try {
            const data = JSON.parse(dataStr);
            
            // 에러 체크
            if (data.error) {
              throw new Error(data.error.message || '스트리밍 중 오류 발생');
            }

            // 텍스트 추출
            const textChunk = extractStreamingText(data);
            if (textChunk) {
              fullText += textChunk;
              onChunk({ text: fullText });
            }

            // Reasoning 추출
            const reasoningChunk = extractStreamingReasoning(data);
            if (reasoningChunk) {
              reasoning += reasoningChunk;
              onChunk({ text: fullText, reasoning });
            }
          } catch (parseError) {
            // JSON 파싱 실패는 무시 (불완전한 데이터일 수 있음)
            console.warn('스트리밍 데이터 파싱 실패:', parseError);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * 응답 데이터에서 메시지 추출
 */
function extractMessageFromData(data: any): string {
  // OpenAI 형식
  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  
  // TextGen 형식
  if (data.results?.[0]?.text) {
    return data.results[0].text;
  }
  
  // 직접 content 필드
  if (data.content) {
    return data.content;
  }
  
  return '';
}

/**
 * 응답 데이터에서 Reasoning 추출
 */
function extractReasoningFromData(data: any): string {
  if (data.choices?.[0]?.reasoning) {
    return data.choices[0].reasoning;
  }
  
  if (data.reasoning) {
    return data.reasoning;
  }
  
  return '';
}

/**
 * 스트리밍 데이터에서 텍스트 추출
 */
function extractStreamingText(data: any): string {
  // OpenAI 형식
  if (data.choices?.[0]?.delta?.content) {
    return data.choices[0].delta.content;
  }
  
  if (data.choices?.[0]?.text) {
    return data.choices[0].text;
  }
  
  // TextGen 형식
  if (data.token) {
    return data.token;
  }
  
  return '';
}

/**
 * 스트리밍 데이터에서 Reasoning 추출
 */
function extractStreamingReasoning(data: any): string {
  if (data.choices?.[0]?.delta?.reasoning) {
    return data.choices[0].delta.reasoning;
  }
  
  if (data.choices?.[0]?.reasoning) {
    return data.choices[0].reasoning;
  }
  
  return '';
}

