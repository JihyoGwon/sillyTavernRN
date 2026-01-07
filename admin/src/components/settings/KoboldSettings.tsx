import { useState, useEffect } from 'react';
import type { Settings, KoboldSettings as KoboldSettingsType } from '../../types/settings';
import './KoboldSettings.css';

interface KoboldSettingsProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
}

export default function KoboldSettings({
  settings,
  onChange,
}: KoboldSettingsProps) {
  const koboldSettings = settings.kai_settings || {};
  
  const [localSettings, setLocalSettings] = useState<Partial<KoboldSettingsType>>({
    api_server: koboldSettings.api_server || 'http://127.0.0.1:5000',
    temperature: koboldSettings.temperature ?? 0.7,
    max_tokens: koboldSettings.max_tokens ?? 150,
    top_p: koboldSettings.top_p ?? 0.9,
    top_k: koboldSettings.top_k ?? 0,
    typical_p: koboldSettings.typical_p ?? 1,
    tfs: koboldSettings.tfs ?? 1,
    top_a: koboldSettings.top_a ?? 0,
    repetition_penalty: koboldSettings.repetition_penalty ?? 1.1,
    repetition_penalty_range: koboldSettings.repetition_penalty_range ?? 0,
    repetition_penalty_slope: koboldSettings.repetition_penalty_slope ?? 0,
    stream: koboldSettings.stream !== undefined ? koboldSettings.stream : true,
  });

  useEffect(() => {
    const kb = settings.kai_settings || {};
    setLocalSettings({
      api_server: kb.api_server || 'http://127.0.0.1:5000',
      temperature: kb.temperature ?? 0.7,
      max_tokens: kb.max_tokens ?? 150,
      top_p: kb.top_p ?? 0.9,
      top_k: kb.top_k ?? 0,
      typical_p: kb.typical_p ?? 1,
      tfs: kb.tfs ?? 1,
      top_a: kb.top_a ?? 0,
      repetition_penalty: kb.repetition_penalty ?? 1.1,
      repetition_penalty_range: kb.repetition_penalty_range ?? 0,
      repetition_penalty_slope: kb.repetition_penalty_slope ?? 0,
      stream: kb.stream !== undefined ? kb.stream : true,
    });
  }, [settings]);

  const handleChange = (field: keyof KoboldSettingsType, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    onChange({ kai_settings: updated });
  };

  return (
    <div className="kobold-settings">
      <div className="settings-section">
        <h2>연결 설정</h2>
        <div className="settings-field">
          <label htmlFor="api_server">API 서버 URL</label>
          <input
            id="api_server"
            type="text"
            value={localSettings.api_server || ''}
            onChange={(e) => handleChange('api_server', e.target.value)}
            placeholder="http://127.0.0.1:5000"
          />
          <p className="field-description">
            Kobold AI 서버의 URL을 입력하세요. (기본값: http://127.0.0.1:5000)
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
            응답의 창의성을 조절합니다. (0.0 ~ 2.0, 권장: 0.7 ~ 1.0)
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
            Top-p: {localSettings.top_p?.toFixed(2) ?? 0.9}
          </label>
          <input
            id="top_p"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={localSettings.top_p ?? 0.9}
            onChange={(e) => handleChange('top_p', parseFloat(e.target.value))}
          />
          <p className="field-description">
            Nucleus 샘플링. (0.0 ~ 1.0, 권장: 0.9 ~ 1.0)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="top_k">Top-k</label>
          <input
            id="top_k"
            type="number"
            min="0"
            max="100"
            value={localSettings.top_k ?? 0}
            onChange={(e) => handleChange('top_k', parseInt(e.target.value) || 0)}
          />
          <p className="field-description">
            상위 k개 토큰만 고려합니다. 0이면 비활성화. (권장: 0 또는 20-40)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="typical_p">
            Typical P: {localSettings.typical_p?.toFixed(2) ?? 1.0}
          </label>
          <input
            id="typical_p"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={localSettings.typical_p ?? 1}
            onChange={(e) => handleChange('typical_p', parseFloat(e.target.value))}
          />
          <p className="field-description">
            Typical sampling. (0.0 ~ 1.0, 권장: 1.0)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="tfs">
            TFS (Tail Free Sampling): {localSettings.tfs?.toFixed(2) ?? 1.0}
          </label>
          <input
            id="tfs"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={localSettings.tfs ?? 1}
            onChange={(e) => handleChange('tfs', parseFloat(e.target.value))}
          />
          <p className="field-description">
            Tail Free Sampling. (0.0 ~ 1.0, 권장: 1.0)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="top_a">Top-a</label>
          <input
            id="top_a"
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={localSettings.top_a ?? 0}
            onChange={(e) => handleChange('top_a', parseFloat(e.target.value) || 0)}
          />
          <p className="field-description">
            Top-a 샘플링. (0.0 ~ 1.0, 권장: 0)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="repetition_penalty">
            Repetition Penalty: {localSettings.repetition_penalty?.toFixed(2) ?? 1.1}
          </label>
          <input
            id="repetition_penalty"
            type="range"
            min="1"
            max="2"
            step="0.01"
            value={localSettings.repetition_penalty ?? 1.1}
            onChange={(e) => handleChange('repetition_penalty', parseFloat(e.target.value))}
          />
          <p className="field-description">
            반복을 줄이는 페널티입니다. (1.0 ~ 2.0, 권장: 1.1 ~ 1.2)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="repetition_penalty_range">Repetition Penalty Range</label>
          <input
            id="repetition_penalty_range"
            type="number"
            min="0"
            max="2048"
            value={localSettings.repetition_penalty_range ?? 0}
            onChange={(e) => handleChange('repetition_penalty_range', parseInt(e.target.value) || 0)}
          />
          <p className="field-description">
            반복 페널티를 적용할 범위입니다. 0이면 전체 컨텍스트에 적용.
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="repetition_penalty_slope">Repetition Penalty Slope</label>
          <input
            id="repetition_penalty_slope"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={localSettings.repetition_penalty_slope ?? 0}
            onChange={(e) => handleChange('repetition_penalty_slope', parseFloat(e.target.value) || 0)}
          />
          <p className="field-description">
            반복 페널티의 기울기입니다. (권장: 0)
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
            응답을 실시간으로 스트리밍하여 표시합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

