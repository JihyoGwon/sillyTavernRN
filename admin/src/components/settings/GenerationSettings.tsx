import { useState, useEffect } from 'react';
import type { Settings } from '../../types/settings';
import './GenerationSettings.css';

interface GenerationSettingsProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
}

export default function GenerationSettings({
  settings,
  onChange,
}: GenerationSettingsProps) {
  const [localSettings, setLocalSettings] = useState<Partial<Settings>>({
    amount_gen: settings.amount_gen ?? 150,
    max_context: settings.max_context ?? 2048,
    swipes: settings.swipes !== undefined ? settings.swipes : true,
  });

  useEffect(() => {
    setLocalSettings({
      amount_gen: settings.amount_gen ?? 150,
      max_context: settings.max_context ?? 2048,
      swipes: settings.swipes !== undefined ? settings.swipes : true,
    });
  }, [settings]);

  const handleChange = (field: keyof Settings, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    onChange(updated);
  };

  return (
    <div className="generation-settings">
      <div className="settings-section">
        <h2>생성 파라미터</h2>
        <div className="settings-field">
          <label htmlFor="amount_gen">생성할 토큰 수 (최대 응답 길이)</label>
          <input
            id="amount_gen"
            type="number"
            min="1"
            max="8192"
            value={localSettings.amount_gen ?? 150}
            onChange={(e) => handleChange('amount_gen', parseInt(e.target.value) || 150)}
          />
          <p className="field-description">
            AI가 생성할 최대 토큰 수입니다. 값이 클수록 더 긴 응답을 생성합니다.
            (권장: 150-500)
          </p>
        </div>

        <div className="settings-field">
          <label htmlFor="max_context">최대 컨텍스트 크기 (토큰 수)</label>
          <input
            id="max_context"
            type="number"
            min="512"
            max="32768"
            step="512"
            value={localSettings.max_context ?? 2048}
            onChange={(e) => handleChange('max_context', parseInt(e.target.value) || 2048)}
          />
          <p className="field-description">
            AI가 참고할 수 있는 최대 컨텍스트 크기입니다. 값이 클수록 더 많은 대화 내역을 기억합니다.
            (권장: 2048-8192, 모델에 따라 다름)
          </p>
        </div>
      </div>

      <div className="settings-section">
        <h2>기타 설정</h2>
        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.swipes || false}
              onChange={(e) => handleChange('swipes', e.target.checked)}
            />
            <span>스와이프 기능 활성화</span>
          </label>
          <p className="field-description">
            생성된 응답을 스와이프하여 다른 버전을 생성하고 비교할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

