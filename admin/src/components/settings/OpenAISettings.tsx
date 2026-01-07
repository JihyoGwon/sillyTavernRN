import { useState, useEffect } from 'react';
import type { Settings, OpenAISettings as OpenAISettingsType } from '../../types/settings';
import './OpenAISettings.css';

interface OpenAISettingsProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
}

const CHAT_COMPLETION_SOURCES = [
  { value: 'openai', label: 'OpenAI 공식 API' },
  { value: 'custom', label: '커스텀 API' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'vertexai', label: 'Google Vertex AI' },
  { value: 'makersuite', label: 'Google MakerSuite' },
  { value: 'claude', label: 'Anthropic Claude' },
  { value: 'perplexity', label: 'Perplexity AI' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'ai21', label: 'AI21 Labs' },
  { value: 'groq', label: 'Groq' },
];

export default function OpenAISettings({
  settings,
  onChange,
}: OpenAISettingsProps) {
  const oaiSettings = settings.oai_settings || {};
  
  const [localSettings, setLocalSettings] = useState<Partial<OpenAISettingsType>>({
    api_key: oaiSettings.api_key || '',
    custom_url: oaiSettings.custom_url || '',
    reverse_proxy: oaiSettings.reverse_proxy || '',
    proxy_password: oaiSettings.proxy_password || '',
    model: oaiSettings.model || 'gpt-3.5-turbo',
    temperature: oaiSettings.temperature ?? 0.7,
    max_tokens: oaiSettings.max_tokens ?? 150,
    frequency_penalty: oaiSettings.frequency_penalty ?? 0,
    presence_penalty: oaiSettings.presence_penalty ?? 0,
    top_p: oaiSettings.top_p ?? 1,
    stream: oaiSettings.stream !== undefined ? oaiSettings.stream : true,
    chat_completion_source: oaiSettings.chat_completion_source || 'openai',
    vertexai_region: oaiSettings.vertexai_region || '',
    zai_endpoint: oaiSettings.zai_endpoint || '',
  });

  useEffect(() => {
    const oai = settings.oai_settings || {};
    setLocalSettings({
      api_key: oai.api_key || '',
      custom_url: oai.custom_url || '',
      reverse_proxy: oai.reverse_proxy || '',
      proxy_password: oai.proxy_password || '',
      model: oai.model || 'gpt-3.5-turbo',
      temperature: oai.temperature ?? 0.7,
      max_tokens: oai.max_tokens ?? 150,
      frequency_penalty: oai.frequency_penalty ?? 0,
      presence_penalty: oai.presence_penalty ?? 0,
      top_p: oai.top_p ?? 1,
      stream: oai.stream !== undefined ? oai.stream : true,
      chat_completion_source: oai.chat_completion_source || 'openai',
      vertexai_region: oai.vertexai_region || '',
      zai_endpoint: oai.zai_endpoint || '',
    });
  }, [settings]);

  const handleChange = (field: keyof OpenAISettingsType, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    onChange({ oai_settings: updated });
  };

  const showVertexAIRegion = localSettings.chat_completion_source === 'vertexai';
  const showCustomUrl = ['custom', 'openrouter'].includes(localSettings.chat_completion_source || '');

  return (
    <div className="openai-settings">
      <div className="settings-section">
        <h2>연결 설정</h2>
        <div className="settings-field">
          <label htmlFor="chat_completion_source">채팅 완성 소스</label>
          <select
            id="chat_completion_source"
            value={localSettings.chat_completion_source || 'openai'}
            onChange={(e) => handleChange('chat_completion_source', e.target.value)}
          >
            {CHAT_COMPLETION_SOURCES.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
          <p className="field-description">
            사용할 AI 서비스 제공자를 선택하세요.
          </p>
        </div>

        {localSettings.chat_completion_source !== 'vertexai' && (
          <div className="settings-field">
            <label htmlFor="api_key">API 키</label>
            <input
              id="api_key"
              type="password"
              value={localSettings.api_key || ''}
              onChange={(e) => handleChange('api_key', e.target.value)}
              placeholder="sk-..."
            />
            <p className="field-description">
              선택한 서비스의 API 키를 입력하세요. (비밀번호로 표시됩니다)
            </p>
          </div>
        )}

        {localSettings.chat_completion_source === 'vertexai' && (
          <div className="settings-field">
            <div className="info-box">
              <strong>Vertex AI 인증 안내</strong>
              <p>
                Vertex AI는 서비스 계정 키 JSON 파일을 사용하여 인증합니다.
              </p>
              <p>
                백엔드 서버에서 다음 중 하나의 방법으로 인증을 설정하세요:
              </p>
              <ul>
                <li>환경 변수 <code>GOOGLE_APPLICATION_CREDENTIALS</code>에 JSON 파일 경로 설정</li>
                <li>서버 설정에서 서비스 계정 키 JSON 파일 경로 지정</li>
              </ul>
              <p className="field-description">
                프론트엔드에서는 API 키 입력이 필요하지 않습니다.
              </p>
            </div>
          </div>
        )}

        {showCustomUrl && (
          <div className="settings-field">
            <label htmlFor="custom_url">커스텀 API URL</label>
            <input
              id="custom_url"
              type="text"
              value={localSettings.custom_url || ''}
              onChange={(e) => handleChange('custom_url', e.target.value)}
              placeholder="https://api.example.com/v1"
            />
            <p className="field-description">
              커스텀 API 또는 프록시 서버의 URL을 입력하세요.
            </p>
          </div>
        )}

        {showVertexAIRegion && (
          <div className="settings-field">
            <label htmlFor="vertexai_region">Vertex AI 리전</label>
            <input
              id="vertexai_region"
              type="text"
              value={localSettings.vertexai_region || ''}
              onChange={(e) => handleChange('vertexai_region', e.target.value)}
              placeholder="us-central1"
            />
            <p className="field-description">
              Google Cloud Vertex AI 리전을 입력하세요. (예: us-central1, asia-northeast1)
            </p>
          </div>
        )}

        <div className="settings-field">
          <label htmlFor="reverse_proxy">리버스 프록시 URL (선택사항)</label>
          <input
            id="reverse_proxy"
            type="text"
            value={localSettings.reverse_proxy || ''}
            onChange={(e) => handleChange('reverse_proxy', e.target.value)}
            placeholder="https://proxy.example.com"
          />
          <p className="field-description">
            리버스 프록시를 사용하는 경우 URL을 입력하세요.
          </p>
        </div>

        {localSettings.reverse_proxy && (
          <div className="settings-field">
            <label htmlFor="proxy_password">프록시 비밀번호 (선택사항)</label>
            <input
              id="proxy_password"
              type="password"
              value={localSettings.proxy_password || ''}
              onChange={(e) => handleChange('proxy_password', e.target.value)}
            />
            <p className="field-description">
              프록시에 인증이 필요한 경우 비밀번호를 입력하세요.
            </p>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h2>모델 설정</h2>
        <div className="settings-field">
          <label htmlFor="model">모델</label>
          <input
            id="model"
            type="text"
            value={localSettings.model || 'gpt-3.5-turbo'}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="gpt-3.5-turbo"
          />
          <p className="field-description">
            사용할 모델 이름을 입력하세요. (예: gpt-4, gpt-3.5-turbo, claude-3-opus 등)
          </p>
        </div>
      </div>

      <div className="settings-section">
        <h2>생성 파라미터</h2>
        <div className="settings-field">
          <label htmlFor="temperature">
            Temperature: {localSettings.temperature?.toFixed(1) ?? 0.7}
          </label>
          <input
            id="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={localSettings.temperature ?? 0.7}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
          />
          <p className="field-description">
            응답의 창의성을 조절합니다. 값이 낮을수록 일관되고 예측 가능하며, 높을수록 창의적이고 다양합니다.
            (0.0 ~ 2.0, 권장: 0.7 ~ 1.0)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="max_tokens">최대 토큰 수</label>
          <input
            id="max_tokens"
            type="number"
            min="1"
            max="8192"
            value={localSettings.max_tokens ?? 150}
            onChange={(e) => handleChange('max_tokens', parseInt(e.target.value) || 150)}
          />
          <p className="field-description">
            생성할 최대 토큰 수입니다. (권장: 150-500)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="top_p">
            Top-p: {localSettings.top_p?.toFixed(2) ?? 1.0}
          </label>
          <input
            id="top_p"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={localSettings.top_p ?? 1}
            onChange={(e) => handleChange('top_p', parseFloat(e.target.value))}
          />
          <p className="field-description">
            Nucleus 샘플링. 확률 분포에서 상위 p%만 고려합니다. (0.0 ~ 1.0, 권장: 0.9 ~ 1.0)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="frequency_penalty">
            Frequency Penalty: {localSettings.frequency_penalty?.toFixed(1) ?? 0.0}
          </label>
          <input
            id="frequency_penalty"
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={localSettings.frequency_penalty ?? 0}
            onChange={(e) => handleChange('frequency_penalty', parseFloat(e.target.value))}
          />
          <p className="field-description">
            자주 나타나는 토큰에 대한 페널티입니다. 값이 높을수록 반복을 줄입니다. (-2.0 ~ 2.0)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="presence_penalty">
            Presence Penalty: {localSettings.presence_penalty?.toFixed(1) ?? 0.0}
          </label>
          <input
            id="presence_penalty"
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={localSettings.presence_penalty ?? 0}
            onChange={(e) => handleChange('presence_penalty', parseFloat(e.target.value))}
          />
          <p className="field-description">
            새로운 토픽에 대한 페널티입니다. 값이 높을수록 새로운 주제를 탐색합니다. (-2.0 ~ 2.0)
          </p>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.stream || false}
              onChange={(e) => handleChange('stream', e.target.checked)}
            />
            <span>스트리밍 활성화</span>
          </label>
          <p className="field-description">
            응답을 실시간으로 스트리밍하여 표시합니다. 사용자 경험이 향상됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

