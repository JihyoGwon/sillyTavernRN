import { useState, useEffect } from 'react';
import type { Settings } from '../../types/settings';
import './GeneralSettings.css';

interface GeneralSettingsProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
}

const MAIN_API_OPTIONS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'textgenerationwebui', label: 'TextGen WebUI' },
  { value: 'kobold', label: 'Kobold' },
  { value: 'novel', label: 'NovelAI' },
  { value: 'horde', label: 'Horde' },
];

export default function GeneralSettings({
  settings,
  onChange,
}: GeneralSettingsProps) {
  const [localSettings, setLocalSettings] = useState<Partial<Settings>>({
    username: settings.username || '',
    user_avatar: settings.user_avatar || '',
    main_api: settings.main_api || 'openai',
    swipes: settings.swipes !== undefined ? settings.swipes : true,
  });

  useEffect(() => {
    setLocalSettings({
      username: settings.username || '',
      user_avatar: settings.user_avatar || '',
      main_api: settings.main_api || 'openai',
      swipes: settings.swipes !== undefined ? settings.swipes : true,
    });
  }, [settings]);

  const handleChange = (field: keyof Settings, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    onChange(updated);
  };

  return (
    <div className="general-settings">
      <div className="settings-section">
        <h2>사용자 정보</h2>
        <div className="settings-field">
          <label htmlFor="username">사용자 이름</label>
          <input
            id="username"
            type="text"
            value={localSettings.username || ''}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="사용자 이름을 입력하세요"
          />
        </div>
        <div className="settings-field">
          <label htmlFor="user_avatar">사용자 아바타 URL</label>
          <input
            id="user_avatar"
            type="text"
            value={localSettings.user_avatar || ''}
            onChange={(e) => handleChange('user_avatar', e.target.value)}
            placeholder="아바타 이미지 URL을 입력하세요"
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>API 설정</h2>
        <div className="settings-field">
          <label htmlFor="main_api">메인 API</label>
          <select
            id="main_api"
            value={localSettings.main_api || 'openai'}
            onChange={(e) => handleChange('main_api', e.target.value)}
          >
            {MAIN_API_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="field-description">
            사용할 메인 AI API를 선택하세요.
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
            생성된 응답을 스와이프하여 다른 버전을 볼 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

