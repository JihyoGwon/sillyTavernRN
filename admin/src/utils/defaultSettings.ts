import type { Settings } from '../types/settings';

/**
 * 기본 설정값 반환
 */
export function getDefaultSettings(): Partial<Settings> {
  return {
    username: '',
    user_avatar: '',
    main_api: 'openai',
    swipes: true,
    amount_gen: 150,
    max_context: 2048,
    oai_settings: {
      chat_completion_source: 'openai',
      api_key: '',
      temperature: 1.0,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    },
    textgenerationwebui_settings: {
      api_server: 'http://127.0.0.1:5000',
      temperature: 0.7,
      max_tokens: 150,
      top_p: 0.9,
      top_k: 40,
      repetition_penalty: 1.1,
    },
    kai_settings: {
      api_server: 'http://127.0.0.1:5000',
      temperature: 0.7,
      max_tokens: 150,
      top_p: 0.9,
      top_k: 40,
      repetition_penalty: 1.1,
    },
    nai_settings: {
      api_key: '',
      model: 'clio-v1',
      temperature: 1.0,
      max_tokens: 150,
      top_p: 1.0,
      top_k: 1,
      repetition_penalty: 1.0,
    },
    horde_settings: {
      api_key: '',
      model: '',
      temperature: 0.7,
      max_tokens: 150,
      top_p: 0.9,
      top_k: 40,
      repetition_penalty: 1.1,
    },
    power_user: {},
    world_info_settings: {
      enabled: true,
      include_names: false,
      anchor_position: 'before',
      depth: 0,
      scan_global: false,
    },
    extension_settings: {},
    tags: [],
    tag_map: {},
    background: {},
    proxies: [],
    selected_proxy: '',
  };
}

/**
 * 특정 필드의 기본값 반환
 */
export function getDefaultValue(fieldPath: string): any {
  const defaults = getDefaultSettings();
  const parts = fieldPath.split('.');
  let current: any = defaults;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  
  return current;
}

