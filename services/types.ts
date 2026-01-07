/**
 * SillyTavern API 타입 정의
 */

/**
 * 채팅 메시지
 */
export interface ChatMessage {
  mes: string;
  name?: string;
  is_user: boolean;
  is_system?: boolean;
  extra?: {
    title?: string;
    reasoning?: string;
    image?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * 캐릭터 정보
 */
export interface Character {
  name: string;
  avatar: string;
  chat?: string;
  description?: string;
  personality?: string;
  scenario?: string;
  [key: string]: any;
}

/**
 * 채팅 데이터
 */
export interface ChatData {
  ch_name: string;
  file_name: string;
  chat: ChatMessage[];
  avatar_url?: string;
}

/**
 * AI 생성 요청 메시지
 */
export interface ChatCompletionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  name?: string;
}

/**
 * AI 생성 요청
 */
export interface ChatCompletionRequest {
  stream?: boolean;
  messages: ChatCompletionMessage[];
  model?: string;
  chat_completion_source?: string;
  max_tokens?: number;
  temperature?: number;
  [key: string]: any;
}

/**
 * AI 생성 응답
 */
export interface ChatCompletionResponse {
  content: string;
  reasoning?: string;
  [key: string]: any;
}

/**
 * 설정 정보
 */
export interface Settings {
  username?: string;
  main_api?: string;
  max_context?: number;
  amount_gen?: number;
  power_user?: any;
  oai_settings?: any;
  [key: string]: any;
}

