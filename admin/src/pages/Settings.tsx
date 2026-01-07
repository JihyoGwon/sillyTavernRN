import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../services/settings';
import type { Settings } from '../types/settings';
import { validateSettings, formatValidationErrors } from '../utils/settingsValidation';
import { getDefaultSettings } from '../utils/defaultSettings';
import SettingsHeader from '../components/SettingsHeader';
import SettingsTabs, { type SettingsTab } from '../components/SettingsTabs';
import SettingsSearch from '../components/SettingsSearch';
import GeneralSettings from '../components/settings/GeneralSettings';
import GenerationSettings from '../components/settings/GenerationSettings';
import OpenAISettings from '../components/settings/OpenAISettings';
import TextGenSettings from '../components/settings/TextGenSettings';
import KoboldSettings from '../components/settings/KoboldSettings';
import NovelAISettings from '../components/settings/NovelAISettings';
import HordeSettings from '../components/settings/HordeSettings';
import WorldInfoSettings from '../components/settings/WorldInfoSettings';
import PowerUserSettings from '../components/settings/PowerUserSettings';
import ExtensionSettings from '../components/settings/ExtensionSettings';
import OtherSettings from '../components/settings/OtherSettings';
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

      // 설정 검증
      const validationErrors = validateSettings(mergedSettings);
      if (validationErrors.length > 0) {
        const errorMessage = formatValidationErrors(validationErrors);
        alert(errorMessage);
        setError(errorMessage);
        return;
      }

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

  // 설정 내보내기
  const handleExport = () => {
    const dataStr = JSON.stringify(currentSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 설정 가져오기
  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const importedSettings = JSON.parse(text);
      
      if (confirm('가져온 설정으로 현재 설정을 덮어쓰시겠습니까?')) {
        setSettings(importedSettings);
        setLocalSettings({});
        setHasUnsavedChanges(false);
        alert('설정이 가져와졌습니다. 저장 버튼을 눌러 적용하세요.');
      }
    } catch (err) {
      alert('설정 파일을 읽는데 실패했습니다. 올바른 JSON 파일인지 확인하세요.');
    }
  };

  // 프리셋 불러오기
  const handlePresetLoad = (name: string) => {
    const presets = localStorage.getItem('settings_presets');
    if (presets) {
      try {
        const presetData = JSON.parse(presets);
        const preset = presetData[name];
        if (preset) {
          if (confirm(`프리셋 "${name}"을 불러오시겠습니까? 현재 변경사항은 취소됩니다.`)) {
            setSettings(preset);
            setLocalSettings({});
            setHasUnsavedChanges(false);
            alert('프리셋이 불러와졌습니다.');
          }
        }
      } catch (e) {
        alert('프리셋을 불러오는데 실패했습니다.');
      }
    }
  };

  // 검색 결과 클릭 핸들러
  const handleSearchResultClick = (tab: string, fieldId?: string) => {
    setActiveTab(tab as SettingsTab);
    // 필드로 스크롤하는 기능은 나중에 추가 가능
    if (fieldId) {
      setTimeout(() => {
        const element = document.getElementById(fieldId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
    }
  };

  // 기본값 복원
  const handleResetToDefaults = () => {
    if (!confirm('모든 설정을 기본값으로 복원하시겠습니까? 저장하지 않은 변경사항은 모두 사라집니다.')) {
      return;
    }
    
    const defaults = getDefaultSettings();
    const mergedDefaults: Settings = {
      ...settings,
      ...defaults,
    } as Settings;
    
    setSettings(mergedDefaults);
    setLocalSettings({});
    setHasUnsavedChanges(false);
    alert('설정이 기본값으로 복원되었습니다. 저장 버튼을 눌러 적용하세요.');
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
        onExport={handleExport}
        onImport={handleImport}
        onPresetLoad={handlePresetLoad}
        onResetDefaults={handleResetToDefaults}
        settings={currentSettings}
      />
      <div className="settings-search-wrapper">
        <SettingsSearch
          settings={currentSettings}
          onResultClick={handleSearchResultClick}
        />
      </div>
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="settings-content">
        {activeTab === 'general' && (
          <GeneralSettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'generation' && (
          <GenerationSettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'openai' && (
          <OpenAISettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'textgen' && (
          <TextGenSettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'kobold' && (
          <KoboldSettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'novelai' && (
          <NovelAISettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'horde' && (
          <HordeSettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'power-user' && (
          <PowerUserSettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'world-info' && (
          <WorldInfoSettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'extensions' && (
          <ExtensionSettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
        {activeTab === 'others' && (
          <OtherSettings
            settings={currentSettings}
            onChange={handleSettingsChange}
          />
        )}
      </div>
    </div>
  );
}

