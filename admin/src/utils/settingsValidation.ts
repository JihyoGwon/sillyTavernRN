import type { Settings, OpenAISettings } from '../types/settings';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * 설정 검증 함수
 */
export function validateSettings(settings: Settings): ValidationError[] {
  const errors: ValidationError[] = [];

  // 생성 파라미터 검증
  if (settings.amount_gen !== undefined) {
    if (settings.amount_gen < 1 || settings.amount_gen > 8192) {
      errors.push({
        field: 'amount_gen',
        message: '생성할 토큰 수는 1~8192 사이여야 합니다.',
      });
    }
  }

  if (settings.max_context !== undefined) {
    if (settings.max_context < 512 || settings.max_context > 32768) {
      errors.push({
        field: 'max_context',
        message: '최대 컨텍스트 크기는 512~32768 사이여야 합니다.',
      });
    }
  }

  // OpenAI 설정 검증
  if (settings.oai_settings) {
    const oaiErrors = validateOpenAISettings(settings.oai_settings);
    errors.push(...oaiErrors);
  }

  return errors;
}

/**
 * OpenAI 설정 검증
 */
function validateOpenAISettings(oaiSettings: OpenAISettings): ValidationError[] {
  const errors: ValidationError[] = [];

  // API 키 검증 (일부 소스는 필수, Vertex AI는 제외)
  const requiresApiKey = ['openai', 'claude', 'perplexity', 'deepseek', 'ai21', 'groq'];
  if (requiresApiKey.includes(oaiSettings.chat_completion_source || '')) {
    if (!oaiSettings.api_key || oaiSettings.api_key.trim() === '') {
      errors.push({
        field: 'oai_settings.api_key',
        message: 'API 키는 필수입니다.',
      });
    }
  }
  
  // Vertex AI는 API 키가 필요 없음 (JSON 파일로 인증)

  // Vertex AI 리전 검증
  if (oaiSettings.chat_completion_source === 'vertexai') {
    if (!oaiSettings.vertexai_region || oaiSettings.vertexai_region.trim() === '') {
      errors.push({
        field: 'oai_settings.vertexai_region',
        message: 'Vertex AI 리전은 필수입니다.',
      });
    }
  }

  // 커스텀 URL 검증
  if (['custom', 'openrouter'].includes(oaiSettings.chat_completion_source || '')) {
    if (!oaiSettings.custom_url || oaiSettings.custom_url.trim() === '') {
      errors.push({
        field: 'oai_settings.custom_url',
        message: '커스텀 API URL은 필수입니다.',
      });
    } else if (!isValidUrl(oaiSettings.custom_url)) {
      errors.push({
        field: 'oai_settings.custom_url',
        message: '유효한 URL 형식이 아닙니다.',
      });
    }
  }

  // Temperature 검증
  if (oaiSettings.temperature !== undefined) {
    if (oaiSettings.temperature < 0 || oaiSettings.temperature > 2) {
      errors.push({
        field: 'oai_settings.temperature',
        message: 'Temperature는 0.0~2.0 사이여야 합니다.',
      });
    }
  }

  // Max tokens 검증
  if (oaiSettings.max_tokens !== undefined) {
    if (oaiSettings.max_tokens < 1 || oaiSettings.max_tokens > 8192) {
      errors.push({
        field: 'oai_settings.max_tokens',
        message: '최대 토큰 수는 1~8192 사이여야 합니다.',
      });
    }
  }

  // Top-p 검증
  if (oaiSettings.top_p !== undefined) {
    if (oaiSettings.top_p < 0 || oaiSettings.top_p > 1) {
      errors.push({
        field: 'oai_settings.top_p',
        message: 'Top-p는 0.0~1.0 사이여야 합니다.',
      });
    }
  }

  // Frequency/Presence penalty 검증
  if (oaiSettings.frequency_penalty !== undefined) {
    if (oaiSettings.frequency_penalty < -2 || oaiSettings.frequency_penalty > 2) {
      errors.push({
        field: 'oai_settings.frequency_penalty',
        message: 'Frequency Penalty는 -2.0~2.0 사이여야 합니다.',
      });
    }
  }

  if (oaiSettings.presence_penalty !== undefined) {
    if (oaiSettings.presence_penalty < -2 || oaiSettings.presence_penalty > 2) {
      errors.push({
        field: 'oai_settings.presence_penalty',
        message: 'Presence Penalty는 -2.0~2.0 사이여야 합니다.',
      });
    }
  }

  return errors;
}

/**
 * URL 유효성 검증
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 검증 에러를 사용자 친화적인 메시지로 변환
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return '';
  }

  if (errors.length === 1) {
    return errors[0].message;
  }

  return `다음 오류가 있습니다:\n${errors.map((e) => `- ${e.message}`).join('\n')}`;
}

