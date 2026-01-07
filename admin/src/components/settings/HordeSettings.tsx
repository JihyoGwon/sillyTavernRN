import { useState, useEffect } from 'react';
import type { Settings, HordeSettings as HordeSettingsType } from '../../types/settings';
import './HordeSettings.css';

interface HordeSettingsProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
}

export default function HordeSettings({
  settings,
  onChange,
}: HordeSettingsProps) {
  const hordeSettings = settings.horde_settings || {};
  
  const [localSettings, setLocalSettings] = useState<Partial<HordeSettingsType>>({
    api_key: hordeSettings.api_key || '',
    model: hordeSettings.model || '',
    temperature: hordeSettings.temperature ?? 0.7,
    max_tokens: hordeSettings.max_tokens ?? 150,
    top_p: hordeSettings.top_p ?? 0.9,
    top_k: hordeSettings.top_k ?? 0,
    typical_p: hordeSettings.typical_p ?? 1,
    tfs: hordeSettings.tfs ?? 1,
    top_a: hordeSettings.top_a ?? 0,
    repetition_penalty: hordeSettings.repetition_penalty ?? 1.1,
    repetition_penalty_range: hordeSettings.repetition_penalty_range ?? 0,
    repetition_penalty_slope: hordeSettings.repetition_penalty_slope ?? 0,
    stream: hordeSettings.stream !== undefined ? hordeSettings.stream : true,
  });

  useEffect(() => {
    const horde = settings.horde_settings || {};
    setLocalSettings({
      api_key: horde.api_key || '',
      model: horde.model || '',
      temperature: horde.temperature ?? 0.7,
      max_tokens: horde.max_tokens ?? 150,
      top_p: horde.top_p ?? 0.9,
      top_k: horde.top_k ?? 0,
      typical_p: horde.typical_p ?? 1,
      tfs: horde.tfs ?? 1,
      top_a: horde.top_a ?? 0,
      repetition_penalty: horde.repetition_penalty ?? 1.1,
      repetition_penalty_range: horde.repetition_penalty_range ?? 0,
      repetition_penalty_slope: horde.repetition_penalty_slope ?? 0,
      stream: horde.stream !== undefined ? horde.stream : true,
    });
  }, [settings]);

  const handleChange = (field: keyof HordeSettingsType, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    onChange({ horde_settings: updated });
  };

  return (
    <div className="horde-settings">
      <div className="settings-section">
        <h2>연결 설정</h2>
        <div className="settings-field">
          <label htmlFor="api_key">API 키 (선택사항)</label>
          <input
            id="api_key"
            type="password"
            value={localSettings.api_key || ''}
            onChange={(e) => handleChange('api_key', e.target.value)}
            placeholder="0000000000"
          />
          <p className="field-description">
            AI Horde API 키를 입력하세요. API 키가 없어도 사용할 수 있지만, 우선순위가 낮습니다.
            (비밀번호로 표시됩니다)
          </p>
        </div>
      </div>

      <div className="settings-section">
        <h2>모델 설정</h2>
        <div className="settings-field">
          <label htmlFor="model">모델</label>
          <input
            id="model"
            type="text"
            value={localSettings.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="모델 이름을 입력하거나 비워두세요"
          />
          <p className="field-description">
            사용할 모델 이름을 입력하세요. 비워두면 Horde 네트워크에서 사용 가능한 모델을 자동으로 선택합니다.
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

