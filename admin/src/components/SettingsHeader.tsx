import { useState, useRef, useEffect } from 'react';
import './SettingsHeader.css';

interface SettingsHeaderProps {
  onSave: () => void;
  onCancel: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onExport?: () => void;
  onImport?: (file: File) => void;
  onPresetSave?: (name: string) => void;
  onPresetLoad?: (name: string) => void;
  onSearchResultClick?: (tab: string, fieldId?: string) => void;
  onResetDefaults?: () => void;
  settings?: any;
}

export default function SettingsHeader({
  onSave,
  onCancel,
  hasUnsavedChanges,
  isSaving,
  onExport,
  onImport,
  onPresetSave,
  onPresetLoad,
  onSearchResultClick,
  onResetDefaults,
  settings,
}: SettingsHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [savedPresets, setSavedPresets] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 저장된 프리셋 목록 불러오기
    const presets = localStorage.getItem('settings_presets');
    if (presets) {
      try {
        const presetList = JSON.parse(presets);
        setSavedPresets(Object.keys(presetList));
      } catch (e) {
        // 무시
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setShowPresetMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // 기본 내보내기 동작
      if (settings) {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `settings-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    }
    setShowMenu(false);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImport) {
      onImport(file);
    }
    // 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowMenu(false);
  };

  const handlePresetSave = () => {
    if (!presetName.trim()) {
      alert('프리셋 이름을 입력하세요.');
      return;
    }

    if (settings) {
      const presets = localStorage.getItem('settings_presets');
      const presetData = presets ? JSON.parse(presets) : {};
      presetData[presetName.trim()] = settings;
      localStorage.setItem('settings_presets', JSON.stringify(presetData));
      setSavedPresets(Object.keys(presetData));
      setPresetName('');
      setShowPresetMenu(false);
      alert('프리셋이 저장되었습니다.');
    }
  };

  const handlePresetLoad = (name: string) => {
    const presets = localStorage.getItem('settings_presets');
    if (presets) {
      try {
        const presetData = JSON.parse(presets);
        const preset = presetData[name];
        if (preset && onPresetLoad) {
          onPresetLoad(name);
        }
      } catch (e) {
        alert('프리셋을 불러오는데 실패했습니다.');
      }
    }
    setShowPresetMenu(false);
  };

  const handlePresetDelete = (name: string) => {
    if (!confirm(`프리셋 "${name}"을 삭제하시겠습니까?`)) {
      return;
    }

    const presets = localStorage.getItem('settings_presets');
    if (presets) {
      try {
        const presetData = JSON.parse(presets);
        delete presetData[name];
        localStorage.setItem('settings_presets', JSON.stringify(presetData));
        setSavedPresets(Object.keys(presetData));
      } catch (e) {
        alert('프리셋 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="settings-header">
      <h1>설정</h1>
      <div className="settings-header-actions">
        {hasUnsavedChanges && (
          <span className="unsaved-indicator">저장되지 않은 변경사항</span>
        )}
        
        <div className="header-menu-wrapper" ref={menuRef}>
          <button
            className="btn-secondary"
            onClick={() => setShowPresetMenu(!showPresetMenu)}
            disabled={isSaving}
          >
            프리셋 ▼
          </button>
          {showPresetMenu && (
            <div className="dropdown-menu">
              <div className="dropdown-section">
                <input
                  type="text"
                  placeholder="프리셋 이름"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePresetSave()}
                />
                <button className="btn-primary" onClick={handlePresetSave}>
                  저장
                </button>
              </div>
              {savedPresets.length > 0 && (
                <>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-section">
                    <div className="dropdown-label">저장된 프리셋:</div>
                    {savedPresets.map((name) => (
                      <div key={name} className="dropdown-item">
                        <span onClick={() => handlePresetLoad(name)}>{name}</span>
                        <button
                          className="btn-danger-small"
                          onClick={() => handlePresetDelete(name)}
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="header-menu-wrapper" ref={menuRef}>
          <button
            className="btn-secondary"
            onClick={() => setShowMenu(!showMenu)}
            disabled={isSaving}
          >
            더보기 ▼
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button className="dropdown-item-button" onClick={handleExport}>
                설정 내보내기 (JSON)
              </button>
              <button className="dropdown-item-button" onClick={handleImport}>
                설정 가져오기 (JSON)
              </button>
              {onResetDefaults && (
                <>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item-button" onClick={onResetDefaults}>
                    기본값으로 복원
                  </button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        <button
          className="btn-secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          취소
        </button>
        <button
          className="btn-primary"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}

