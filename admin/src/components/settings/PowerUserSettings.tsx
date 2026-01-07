import { useState, useEffect } from 'react';
import type { Settings, PowerUserSettings as PowerUserSettingsType } from '../../types/settings';
import './PowerUserSettings.css';

interface PowerUserSettingsProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
}

export default function PowerUserSettings({
  settings,
  onChange,
}: PowerUserSettingsProps) {
  const powerUserSettings = settings.power_user || {};
  
  const [localSettings, setLocalSettings] = useState<Partial<PowerUserSettingsType>>({
    // UI/UX
    show_card_avatar_urls: powerUserSettings.show_card_avatar_urls ?? false,
    auto_scroll_chat_to_bottom: powerUserSettings.auto_scroll_chat_to_bottom !== undefined ? powerUserSettings.auto_scroll_chat_to_bottom : true,
    media_display: powerUserSettings.media_display || 'LIST',
    timestamp_model_icon: powerUserSettings.timestamp_model_icon ?? false,
    waifuMode: powerUserSettings.waifuMode ?? false,
    
    // 채팅 관련
    chat_truncation: powerUserSettings.chat_truncation,
    continue_on_send: powerUserSettings.continue_on_send ?? false,
    auto_swipe: powerUserSettings.auto_swipe ?? false,
    auto_continue: powerUserSettings.auto_continue || {
      enabled: false,
      target_length: 0,
      allow_chat_completions: false,
    },
    
    // 프롬프트 관련
    user_prompt_bias: powerUserSettings.user_prompt_bias || '',
    show_user_prompt_bias: powerUserSettings.show_user_prompt_bias ?? false,
    encode_tags: powerUserSettings.encode_tags ?? false,
    allow_name1_display: powerUserSettings.allow_name1_display !== undefined ? powerUserSettings.allow_name1_display : true,
    allow_name2_display: powerUserSettings.allow_name2_display !== undefined ? powerUserSettings.allow_name2_display : true,
    
    // 마크다운
    auto_fix_generated_markdown: powerUserSettings.auto_fix_generated_markdown ?? false,
    
    // Instruct 모드
    instruct: powerUserSettings.instruct || {
      enabled: false,
      user_alignment_message: '',
      wrap: false,
      input_sequence: '',
      output_sequence: '',
      stop_sequence: '',
    },
    
    // Reasoning
    reasoning: powerUserSettings.reasoning || {
      prefix: '',
      suffix: '',
    },
    
    // 캐릭터 관리
    bogus_folders: powerUserSettings.bogus_folders ?? false,
    sort_order: powerUserSettings.sort_order || 'asc',
    sort_field: powerUserSettings.sort_field || 'name',
    aux_field: powerUserSettings.aux_field || 'character_version',
  });

  useEffect(() => {
    const pu = settings.power_user || {};
    setLocalSettings({
      show_card_avatar_urls: pu.show_card_avatar_urls ?? false,
      auto_scroll_chat_to_bottom: pu.auto_scroll_chat_to_bottom !== undefined ? pu.auto_scroll_chat_to_bottom : true,
      media_display: pu.media_display || 'LIST',
      timestamp_model_icon: pu.timestamp_model_icon ?? false,
      waifuMode: pu.waifuMode ?? false,
      chat_truncation: pu.chat_truncation,
      continue_on_send: pu.continue_on_send ?? false,
      auto_swipe: pu.auto_swipe ?? false,
      auto_continue: pu.auto_continue || {
        enabled: false,
        target_length: 0,
        allow_chat_completions: false,
      },
      user_prompt_bias: pu.user_prompt_bias || '',
      show_user_prompt_bias: pu.show_user_prompt_bias ?? false,
      encode_tags: pu.encode_tags ?? false,
      allow_name1_display: pu.allow_name1_display !== undefined ? pu.allow_name1_display : true,
      allow_name2_display: pu.allow_name2_display !== undefined ? pu.allow_name2_display : true,
      auto_fix_generated_markdown: pu.auto_fix_generated_markdown ?? false,
      instruct: pu.instruct || {
        enabled: false,
        user_alignment_message: '',
        wrap: false,
        input_sequence: '',
        output_sequence: '',
        stop_sequence: '',
      },
      reasoning: pu.reasoning || {
        prefix: '',
        suffix: '',
      },
      bogus_folders: pu.bogus_folders ?? false,
      sort_order: pu.sort_order || 'asc',
      sort_field: pu.sort_field || 'name',
      aux_field: pu.aux_field || 'character_version',
    });
  }, [settings]);

  const handleChange = (field: keyof PowerUserSettingsType, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    onChange({ power_user: updated });
  };

  const handleNestedChange = (parentField: keyof PowerUserSettingsType, nestedField: string, value: any) => {
    const parent = localSettings[parentField] as any;
    const updated = { ...localSettings, [parentField]: { ...parent, [nestedField]: value } };
    setLocalSettings(updated);
    onChange({ power_user: updated });
  };

  return (
    <div className="poweruser-settings">
      <div className="settings-section">
        <h2>UI/UX 설정</h2>
        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.show_card_avatar_urls || false}
              onChange={(e) => handleChange('show_card_avatar_urls', e.target.checked)}
            />
            <span>카드에 아바타 URL 표시</span>
          </label>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.auto_scroll_chat_to_bottom !== false}
              onChange={(e) => handleChange('auto_scroll_chat_to_bottom', e.target.checked)}
            />
            <span>채팅 자동 스크롤 (하단으로)</span>
          </label>
        </div>

        <div className="settings-field">
          <label htmlFor="media_display">미디어 표시 방식</label>
          <select
            id="media_display"
            value={localSettings.media_display || 'LIST'}
            onChange={(e) => handleChange('media_display', e.target.value)}
          >
            <option value="LIST">리스트</option>
            <option value="GRID">그리드</option>
          </select>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.timestamp_model_icon || false}
              onChange={(e) => handleChange('timestamp_model_icon', e.target.checked)}
            />
            <span>타임스탬프에 모델 아이콘 표시</span>
          </label>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.waifuMode || false}
              onChange={(e) => handleChange('waifuMode', e.target.checked)}
            />
            <span>와이푸 모드</span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>채팅 관련 설정</h2>
        <div className="settings-field">
          <label htmlFor="chat_truncation">채팅 잘라내기 (최대 메시지 수)</label>
          <input
            id="chat_truncation"
            type="number"
            min="0"
            value={localSettings.chat_truncation || ''}
            onChange={(e) => handleChange('chat_truncation', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="비워두면 제한 없음"
          />
          <p className="field-description">
            로드할 최대 메시지 수를 제한합니다. 비워두면 모든 메시지를 로드합니다.
          </p>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.continue_on_send || false}
              onChange={(e) => handleChange('continue_on_send', e.target.checked)}
            />
            <span>전송 시 자동 계속</span>
          </label>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.auto_swipe || false}
              onChange={(e) => handleChange('auto_swipe', e.target.checked)}
            />
            <span>자동 스와이프</span>
          </label>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.auto_continue?.enabled || false}
              onChange={(e) => handleNestedChange('auto_continue', 'enabled', e.target.checked)}
            />
            <span>자동 계속 활성화</span>
          </label>
        </div>

        {localSettings.auto_continue?.enabled && (
          <>
            <div className="settings-field">
              <label htmlFor="auto_continue_target_length">목표 길이 (토큰 수)</label>
              <input
                id="auto_continue_target_length"
                type="number"
                min="0"
                value={localSettings.auto_continue?.target_length || 0}
                onChange={(e) => handleNestedChange('auto_continue', 'target_length', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="settings-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localSettings.auto_continue?.allow_chat_completions || false}
                  onChange={(e) => handleNestedChange('auto_continue', 'allow_chat_completions', e.target.checked)}
                />
                <span>Chat Completions API 허용</span>
              </label>
            </div>
          </>
        )}
      </div>

      <div className="settings-section">
        <h2>프롬프트 관련 설정</h2>
        <div className="settings-field">
          <label htmlFor="user_prompt_bias">사용자 프롬프트 바이어스</label>
          <textarea
            id="user_prompt_bias"
            rows={3}
            value={localSettings.user_prompt_bias || ''}
            onChange={(e) => handleChange('user_prompt_bias', e.target.value)}
            placeholder="사용자 메시지 앞에 추가할 텍스트"
          />
          <p className="field-description">
            모든 사용자 메시지 앞에 자동으로 추가될 텍스트입니다.
          </p>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.show_user_prompt_bias || false}
              onChange={(e) => handleChange('show_user_prompt_bias', e.target.checked)}
            />
            <span>사용자 프롬프트 바이어스 표시</span>
          </label>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.encode_tags || false}
              onChange={(e) => handleChange('encode_tags', e.target.checked)}
            />
            <span>태그 인코딩</span>
          </label>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.allow_name1_display !== false}
              onChange={(e) => handleChange('allow_name1_display', e.target.checked)}
            />
            <span>사용자 이름 표시 허용</span>
          </label>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.allow_name2_display !== false}
              onChange={(e) => handleChange('allow_name2_display', e.target.checked)}
            />
            <span>캐릭터 이름 표시 허용</span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>마크다운 설정</h2>
        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.auto_fix_generated_markdown || false}
              onChange={(e) => handleChange('auto_fix_generated_markdown', e.target.checked)}
            />
            <span>생성된 마크다운 자동 수정</span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Instruct 모드 설정</h2>
        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.instruct?.enabled || false}
              onChange={(e) => handleNestedChange('instruct', 'enabled', e.target.checked)}
            />
            <span>Instruct 모드 활성화</span>
          </label>
        </div>

        {localSettings.instruct?.enabled && (
          <>
            <div className="settings-field">
              <label htmlFor="instruct_user_alignment_message">사용자 정렬 메시지</label>
              <textarea
                id="instruct_user_alignment_message"
                rows={2}
                value={localSettings.instruct?.user_alignment_message || ''}
                onChange={(e) => handleNestedChange('instruct', 'user_alignment_message', e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localSettings.instruct?.wrap || false}
                  onChange={(e) => handleNestedChange('instruct', 'wrap', e.target.checked)}
                />
                <span>래핑</span>
              </label>
            </div>

            <div className="settings-field">
              <label htmlFor="instruct_input_sequence">입력 시퀀스</label>
              <input
                id="instruct_input_sequence"
                type="text"
                value={localSettings.instruct?.input_sequence || ''}
                onChange={(e) => handleNestedChange('instruct', 'input_sequence', e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label htmlFor="instruct_output_sequence">출력 시퀀스</label>
              <input
                id="instruct_output_sequence"
                type="text"
                value={localSettings.instruct?.output_sequence || ''}
                onChange={(e) => handleNestedChange('instruct', 'output_sequence', e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label htmlFor="instruct_stop_sequence">중지 시퀀스</label>
              <input
                id="instruct_stop_sequence"
                type="text"
                value={localSettings.instruct?.stop_sequence || ''}
                onChange={(e) => handleNestedChange('instruct', 'stop_sequence', e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="settings-section">
        <h2>Reasoning 설정</h2>
        <div className="settings-field">
          <label htmlFor="reasoning_prefix">Reasoning 접두사</label>
          <input
            id="reasoning_prefix"
            type="text"
            value={localSettings.reasoning?.prefix || ''}
            onChange={(e) => handleNestedChange('reasoning', 'prefix', e.target.value)}
          />
        </div>

        <div className="settings-field">
          <label htmlFor="reasoning_suffix">Reasoning 접미사</label>
          <input
            id="reasoning_suffix"
            type="text"
            value={localSettings.reasoning?.suffix || ''}
            onChange={(e) => handleNestedChange('reasoning', 'suffix', e.target.value)}
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>캐릭터 관리 설정</h2>
        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.bogus_folders || false}
              onChange={(e) => handleChange('bogus_folders', e.target.checked)}
            />
            <span>가짜 폴더 활성화</span>
          </label>
        </div>

        <div className="settings-field">
          <label htmlFor="sort_order">정렬 순서</label>
          <select
            id="sort_order"
            value={localSettings.sort_order || 'asc'}
            onChange={(e) => handleChange('sort_order', e.target.value)}
          >
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>

        <div className="settings-field">
          <label htmlFor="sort_field">정렬 필드</label>
          <input
            id="sort_field"
            type="text"
            value={localSettings.sort_field || 'name'}
            onChange={(e) => handleChange('sort_field', e.target.value)}
          />
        </div>

        <div className="settings-field">
          <label htmlFor="aux_field">보조 필드</label>
          <input
            id="aux_field"
            type="text"
            value={localSettings.aux_field || 'character_version'}
            onChange={(e) => handleChange('aux_field', e.target.value)}
          />
          <p className="field-description">
            캐릭터 정렬에 사용할 보조 필드입니다. (기본값: character_version)
          </p>
        </div>
      </div>
    </div>
  );
}

