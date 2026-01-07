import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../services/settings';
import type { Settings } from '../types/settings';
import SettingsHeader from '../components/SettingsHeader';
import SettingsTabs, { type SettingsTab } from '../components/SettingsTabs';
import GeneralSettings from '../components/settings/GeneralSettings';
import './Settings.css';

export default function Settings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [localSettings, setLocalSettings] = useState<Partial<Settings>>({});
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 설정 불러오기
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSettings();
      setSettings(data);
      setLocalSettings({});
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '설정을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 설정 변경 핸들러
  const handleSettingsChange = (updated: Partial<Settings>) => {
    setLocalSettings((prev) => ({ ...prev, ...updated }));
    setHasUnsavedChanges(true);
  };

  // 설정 저장
  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);

      // 로컬 변경사항과 원본 설정을 병합
      const mergedSettings: Settings = {
        ...settings,
        ...localSettings,
      };

      await saveSettings(mergedSettings);
      
      // 저장 성공 후 원본 설정 업데이트
      setSettings(mergedSettings);
      setLocalSettings({});
      setHasUnsavedChanges(false);
      
      alert('설정이 저장되었습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 취소
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!confirm('저장하지 않은 변경사항이 있습니다. 정말 취소하시겠습니까?')) {
        return;
      }
    }
    setLocalSettings({});
    setHasUnsavedChanges(false);
  };

  if (loading) {
    return (
      <div className="settings">
        <div className="settings-loading">설정을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings">
        <div className="settings-error">
          <p>{error}</p>
          <button onClick={loadSettings} className="btn-primary">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="settings">
        <div className="settings-error">설정을 불러올 수 없습니다.</div>
      </div>
    );
  }

  // 현재 설정 (로컬 변경사항 반영)
  const currentSettings: Settings = {
    ...settings,
    ...localSettings,
  };

  return (
    <div className="settings">
      <SettingsHeader
        onSave={handleSave}
        onCancel={handleCancel}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={saving}
      />
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="settings-content">
        {activeTab === 'general' && (
          <GeneralSettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'generation' && (
          <div className="settings-placeholder">
            생성 파라미터 설정 (구현 예정)
          </div>
        )}
        {activeTab === 'openai' && (
          <div className="settings-placeholder">
            OpenAI 설정 (구현 예정)
          </div>
        )}
        {activeTab === 'textgen' && (
          <div className="settings-placeholder">
            TextGen 설정 (구현 예정)
          </div>
        )}
        {activeTab === 'kobold' && (
          <div className="settings-placeholder">
            Kobold 설정 (구현 예정)
          </div>
        )}
        {activeTab === 'novelai' && (
          <div className="settings-placeholder">
            NovelAI 설정 (구현 예정)
          </div>
        )}
        {activeTab === 'horde' && (
          <div className="settings-placeholder">
            Horde 설정 (구현 예정)
          </div>
        )}
        {activeTab === 'power-user' && (
          <div className="settings-placeholder">
            고급 설정 (구현 예정)
          </div>
        )}
        {activeTab === 'world-info' && (
          <div className="settings-placeholder">
            World Info 설정 (구현 예정)
          </div>
        )}
        {activeTab === 'extensions' && (
          <div className="settings-placeholder">
            확장 기능 설정 (구현 예정)
          </div>
        )}
        {activeTab === 'others' && (
          <div className="settings-placeholder">
            기타 설정 (구현 예정)
          </div>
        )}
      </div>
    </div>
  );
}

