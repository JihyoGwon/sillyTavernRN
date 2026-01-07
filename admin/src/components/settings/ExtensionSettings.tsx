import { useState, useEffect } from 'react';
import type { Settings } from '../../types/settings';
import './ExtensionSettings.css';

interface ExtensionSettingsProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
}

export default function ExtensionSettings({
  settings,
  onChange,
}: ExtensionSettingsProps) {
  const extensionSettings = settings.extension_settings || {};
  
  const [localSettings, setLocalSettings] = useState<Record<string, any>>(extensionSettings);

  useEffect(() => {
    setLocalSettings(settings.extension_settings || {});
  }, [settings]);

  const handleChange = (extensionName: string, field: string, value: any) => {
    const extension = localSettings[extensionName] || {};
    const updated = {
      ...localSettings,
      [extensionName]: {
        ...extension,
        [field]: value,
      },
    };
    setLocalSettings(updated);
    onChange({ extension_settings: updated });
  };

  const handleExtensionToggle = (extensionName: string, enabled: boolean) => {
    const extension = localSettings[extensionName] || {};
    const updated = {
      ...localSettings,
      [extensionName]: {
        ...extension,
        enabled,
      },
    };
    setLocalSettings(updated);
    onChange({ extension_settings: updated });
  };

  // 확장 기능 목록 (예시 - 실제로는 동적으로 로드되어야 함)
  const extensions = Object.keys(localSettings).length > 0 
    ? Object.keys(localSettings)
    : ['memory', 'vectors', 'chromadb'];

  return (
    <div className="extension-settings">
      <div className="settings-section">
        <h2>확장 기능 관리</h2>
        <div className="info-box">
          <p>
            <strong>확장 기능이란?</strong>
          </p>
          <p>
            확장 기능은 SillyTavern의 기능을 확장하는 추가 모듈입니다.
            각 확장 기능은 고유한 설정을 가질 수 있으며, 런타임에 동적으로 로드됩니다.
          </p>
        </div>

        {extensions.length === 0 ? (
          <p>설치된 확장 기능이 없습니다.</p>
        ) : (
          extensions.map((extensionName) => {
            const extension = localSettings[extensionName] || {};
            return (
              <div key={extensionName} className="extension-card">
                <div className="extension-header">
                  <h3>{extensionName}</h3>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={extension.enabled !== false}
                      onChange={(e) => handleExtensionToggle(extensionName, e.target.checked)}
                    />
                    <span>활성화</span>
                  </label>
                </div>

                {extension.enabled !== false && (
                  <div className="extension-content">
                    {extensionName === 'memory' && (
                      <div className="extension-fields">
                        <div className="settings-field">
                          <label>요약 주기 (메시지 수)</label>
                          <input
                            type="number"
                            min="1"
                            value={extension.summarize_interval || 50}
                            onChange={(e) => handleChange(extensionName, 'summarize_interval', parseInt(e.target.value) || 50)}
                          />
                          <p className="field-description">
                            N개 메시지마다 채팅을 요약하여 장기 메모리로 저장합니다.
                          </p>
                        </div>
                      </div>
                    )}

                    {extensionName === 'vectors' && (
                      <div className="extension-fields">
                        <div className="settings-field">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={extension.chat_vectors !== false}
                              onChange={(e) => handleChange(extensionName, 'chat_vectors', e.target.checked)}
                            />
                            <span>채팅 벡터 활성화</span>
                          </label>
                          <p className="field-description">
                            과거 대화에서 유사한 맥락의 메시지를 자동으로 찾아 프롬프트에 포함합니다.
                          </p>
                        </div>

                        <div className="settings-field">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={extension.data_bank_vectors !== false}
                              onChange={(e) => handleChange(extensionName, 'data_bank_vectors', e.target.checked)}
                            />
                            <span>데이터뱅크 벡터 활성화</span>
                          </label>
                          <p className="field-description">
                            외부 데이터베이스나 문서를 벡터로 저장하여 검색합니다.
                          </p>
                        </div>

                        <div className="settings-field">
                          <label>검색 결과 개수 (Top-k)</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={extension.top_k || 5}
                            onChange={(e) => handleChange(extensionName, 'top_k', parseInt(e.target.value) || 5)}
                          />
                        </div>

                        <div className="settings-field">
                          <label>유사도 임계값</label>
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={extension.similarity_threshold || 0.7}
                            onChange={(e) => handleChange(extensionName, 'similarity_threshold', parseFloat(e.target.value) || 0.7)}
                          />
                        </div>
                      </div>
                    )}

                    {/* 기타 확장 기능의 설정은 동적으로 표시 */}
                    {extensionName !== 'memory' && extensionName !== 'vectors' && (
                      <div className="extension-fields">
                        <p className="field-description">
                          이 확장 기능의 설정은 JSON 형식으로 관리됩니다.
                        </p>
                        <pre className="extension-json">
                          {JSON.stringify(extension, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

