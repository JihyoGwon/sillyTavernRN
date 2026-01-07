/**
 * SillyTavern 설정 타입 정의
 */

/**
 * 기본 설정
 */
export interface GeneralSettings {
  username?: string;
  user_avatar?: string;
  active_character?: string;
  active_group?: string;
  main_api?: string;
  swipes?: boolean;
  firstRun?: boolean;
  currentVersion?: string;
}

/**
 * 생성 파라미터
 */
export interface GenerationSettings {
  amount_gen?: number;
  max_context?: number;
}

/**
 * OpenAI 설정
 */
export interface OpenAISettings {
  api_key?: string;
  custom_url?: string;
  reverse_proxy?: string;
  proxy_password?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  top_p?: number;
  stream?: boolean;
  chat_completion_source?: string;
  vertexai_region?: string;
  zai_endpoint?: string;
  [key: string]: any;
}

/**
 * TextGen 설정
 */
export interface TextGenSettings {
  api_server?: string;
  api_type?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  typical_p?: number;
  tfs?: number;
  top_a?: number;
  repetition_penalty?: number;
  repetition_penalty_range?: number;
  repetition_penalty_slope?: number;
  sampler_order?: number[];
  stream?: boolean;
  [key: string]: any;
}

/**
 * Kobold 설정
 */
export interface KoboldSettings {
  api_server?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  typical_p?: number;
  tfs?: number;
  top_a?: number;
  repetition_penalty?: number;
  repetition_penalty_range?: number;
  repetition_penalty_slope?: number;
  sampler_order?: number[];
  stream?: boolean;
  [key: string]: any;
}

/**
 * NovelAI 설정
 */
export interface NovelAISettings {
  api_key?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  typical_p?: number;
  tfs?: number;
  top_a?: number;
  repetition_penalty?: number;
  repetition_penalty_range?: number;
  repetition_penalty_slope?: number;
  sampler_order?: number[];
  stream?: boolean;
  [key: string]: any;
}

/**
 * Horde 설정
 */
export interface HordeSettings {
  api_key?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  typical_p?: number;
  tfs?: number;
  top_a?: number;
  repetition_penalty?: number;
  repetition_penalty_range?: number;
  repetition_penalty_slope?: number;
  sampler_order?: number[];
  stream?: boolean;
  [key: string]: any;
}

/**
 * Power User - Instruct 모드 설정
 */
export interface InstructSettings {
  enabled?: boolean;
  user_alignment_message?: string;
  wrap?: boolean;
  input_sequence?: string;
  output_sequence?: string;
  stop_sequence?: string;
}

/**
 * Power User - Auto Continue 설정
 */
export interface AutoContinueSettings {
  enabled?: boolean;
  target_length?: number;
  allow_chat_completions?: boolean;
}

/**
 * Power User - Reasoning 설정
 */
export interface ReasoningSettings {
  prefix?: string;
  suffix?: string;
}

/**
 * Power User 설정
 */
export interface PowerUserSettings {
  // UI/UX
  show_card_avatar_urls?: boolean;
  auto_scroll_chat_to_bottom?: boolean;
  media_display?: string;
  timestamp_model_icon?: boolean;
  waifuMode?: boolean;
  
  // 채팅 관련
  chat_truncation?: number;
  continue_on_send?: boolean;
  auto_swipe?: boolean;
  auto_continue?: AutoContinueSettings;
  
  // 프롬프트 관련
  user_prompt_bias?: string;
  show_user_prompt_bias?: boolean;
  encode_tags?: boolean;
  allow_name1_display?: boolean;
  allow_name2_display?: boolean;
  
  // 마크다운
  auto_fix_generated_markdown?: boolean;
  
  // Instruct 모드
  instruct?: InstructSettings;
  
  // Reasoning
  reasoning?: ReasoningSettings;
  
  // 캐릭터 관리
  bogus_folders?: boolean;
  sort_order?: string;
  sort_field?: string;
  aux_field?: string;
  
  [key: string]: any;
}

/**
 * World Info 설정
 */
export interface WorldInfoSettings {
  enabled?: boolean;
  include_names?: boolean; // world_info_include_names: 이름 포함 여부
  anchor_position?: string; // wi_anchor_position: 앵커 위치
  depth?: number; // World Info 깊이 설정
  scan_global?: boolean; // 전역 스캔 여부
  [key: string]: any;
}

/**
 * 배경 설정
 */
export interface BackgroundSettings {
  [key: string]: any;
}

/**
 * 프록시 프리셋
 */
export interface ProxyPreset {
  name?: string;
  url?: string;
  [key: string]: any;
}

/**
 * 전체 설정
 */
export interface Settings {
  // 기본 설정
  username?: string;
  user_avatar?: string;
  active_character?: string;
  active_group?: string;
  main_api?: string;
  swipes?: boolean;
  firstRun?: boolean;
  currentVersion?: string;
  
  // 생성 파라미터
  amount_gen?: number;
  max_context?: number;
  
  // API별 설정
  oai_settings?: OpenAISettings;
  textgenerationwebui_settings?: TextGenSettings;
  kai_settings?: KoboldSettings;
  nai_settings?: NovelAISettings;
  horde_settings?: HordeSettings;
  
  // 고급 설정
  power_user?: PowerUserSettings;
  
  // World Info
  world_info_settings?: WorldInfoSettings;
  
  // 확장 기능
  extension_settings?: Record<string, any>;
  
  // 기타
  tags?: string[];
  tag_map?: Record<string, any>;
  background?: BackgroundSettings;
  proxies?: ProxyPreset[];
  selected_proxy?: string;
  
  // 기타 필드
  accountStorage?: any;
  [key: string]: any;
}

