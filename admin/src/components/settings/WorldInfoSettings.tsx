import { useState, useEffect } from 'react';
import type { Settings, WorldInfoSettings as WorldInfoSettingsType } from '../../types/settings';
import { getWorldInfo, editWorldInfo, deleteWorldInfo, type WorldInfoEntry } from '../../services/worldinfo';
import WorldInfoEntryForm from '../WorldInfoEntryForm';
import './WorldInfoSettings.css';

interface WorldInfoSettingsProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
}

const ANCHOR_POSITIONS = [
  { value: 'before', label: 'Before (이전)' },
  { value: 'after', label: 'After (이후)' },
  { value: 'both', label: 'Both (양쪽)' },
];

export default function WorldInfoSettings({
  settings,
  onChange,
}: WorldInfoSettingsProps) {
  const worldInfoSettings = settings.world_info_settings || {};
  
  const [localSettings, setLocalSettings] = useState<Partial<WorldInfoSettingsType>>({
    enabled: worldInfoSettings.enabled !== undefined ? worldInfoSettings.enabled : true,
    include_names: worldInfoSettings.include_names !== undefined ? worldInfoSettings.include_names : false,
    anchor_position: worldInfoSettings.anchor_position || 'before',
    depth: worldInfoSettings.depth ?? 0,
    scan_global: worldInfoSettings.scan_global !== undefined ? worldInfoSettings.scan_global : false,
  });

  const [entries, setEntries] = useState<WorldInfoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WorldInfoEntry | null>(null);

  useEffect(() => {
    const wi = settings.world_info_settings || {};
    setLocalSettings({
      enabled: wi.enabled !== undefined ? wi.enabled : true,
      include_names: wi.include_names !== undefined ? wi.include_names : false,
      anchor_position: wi.anchor_position || 'before',
      depth: wi.depth ?? 0,
      scan_global: wi.scan_global !== undefined ? wi.scan_global : false,
    });
  }, [settings]);

  useEffect(() => {
    // World Info가 활성화되어 있을 때만 항목 로드
    if (localSettings.enabled !== false) {
      loadEntries();
    }
  }, [localSettings.enabled]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWorldInfo();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'World Info를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof WorldInfoSettingsType, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    onChange({ world_info_settings: updated });
  };

  const handleCreateNew = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleEdit = (entry: WorldInfoEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleSave = async (entryData: WorldInfoEntry) => {
    try {
      await editWorldInfo(entryData);
      setIsFormOpen(false);
      setEditingEntry(null);
      await loadEntries();
      alert('World Info가 저장되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'World Info 저장에 실패했습니다.');
      throw err;
    }
  };

  const handleDelete = async (uid: string) => {
    if (!confirm('정말 이 World Info를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteWorldInfo(uid);
      await loadEntries();
      alert('World Info가 삭제되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'World Info 삭제에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  return (
    <div className="worldinfo-settings">
      <div className="settings-section">
        <h2>World Info 기본 설정</h2>
        <div className="info-box">
          <p>
            <strong>World Info란?</strong>
          </p>
          <p>
            World Info는 캐릭터나 세계관에 대한 추가 정보를 저장하고 관리하는 기능입니다.
            채팅 중 특정 키워드나 문맥에 따라 자동으로 관련 정보를 프롬프트에 주입합니다.
          </p>
        </div>

        <div className="settings-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={localSettings.enabled !== false}
              onChange={(e) => handleChange('enabled', e.target.checked)}
            />
            <span>World Info 활성화</span>
          </label>
          <p className="field-description">
            World Info 기능을 활성화합니다. 비활성화하면 World Info가 프롬프트에 포함되지 않습니다.
          </p>
        </div>
      </div>

      {localSettings.enabled !== false && (
        <>
          <div className="settings-section">
            <h2>프롬프트 설정</h2>
            <div className="settings-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localSettings.include_names || false}
                  onChange={(e) => handleChange('include_names', e.target.checked)}
                />
                <span>이름 포함 (Include Names)</span>
              </label>
              <p className="field-description">
                World Info를 프롬프트에 주입할 때 메시지 작성자 이름을 포함합니다.
                예: "사용자: 메시지" 형식으로 포함됩니다.
              </p>
            </div>

            <div className="settings-field">
              <label htmlFor="anchor_position">앵커 위치 (Anchor Position)</label>
              <select
                id="anchor_position"
                value={localSettings.anchor_position || 'before'}
                onChange={(e) => handleChange('anchor_position', e.target.value)}
              >
                {ANCHOR_POSITIONS.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
              <p className="field-description">
                World Info를 프롬프트의 어느 위치에 주입할지 결정합니다.
                - Before: 시스템 프롬프트 이전
                - After: 시스템 프롬프트 이후
                - Both: 양쪽 모두
              </p>
            </div>

            <div className="settings-field">
              <label htmlFor="depth">World Info 깊이 (Depth)</label>
              <input
                id="depth"
                type="number"
                min="0"
                max="10"
                value={localSettings.depth ?? 0}
                onChange={(e) => handleChange('depth', parseInt(e.target.value) || 0)}
              />
              <p className="field-description">
                World Info를 검색할 때 고려할 깊이 레벨입니다. (0~10, 권장: 0)
              </p>
            </div>
          </div>

          <div className="settings-section">
            <h2>스캔 설정</h2>
            <div className="settings-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={localSettings.scan_global || false}
                  onChange={(e) => handleChange('scan_global', e.target.checked)}
                />
                <span>전역 스캔 활성화 (Global Scan)</span>
              </label>
              <p className="field-description">
                전역 World Info를 스캔하여 모든 캐릭터에 적용합니다.
              </p>
            </div>
          </div>
        </>
      )}

      {localSettings.enabled !== false && (
        <div className="settings-section">
          <div className="section-header">
            <h2>World Info 항목 관리</h2>
            <button className="btn-primary" onClick={handleCreateNew}>
              새 World Info 생성
            </button>
          </div>

          {loading && <p>로딩 중...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && !error && (
            <>
              {entries.length === 0 ? (
                <p>World Info 항목이 없습니다. 새 항목을 생성하세요.</p>
              ) : (
                <div className="worldinfo-entries">
                  {entries.map((entry) => (
                    <div key={entry.uid || entry.name} className="worldinfo-entry-card">
                      <div className="entry-header">
                        <h3>{entry.name || '이름 없음'}</h3>
                        <div className="entry-actions">
                          <button
                            className="btn-secondary"
                            onClick={() => handleEdit(entry)}
                          >
                            편집
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => entry.uid && handleDelete(entry.uid)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                      <div className="entry-content">
                        <div className="entry-field">
                          <strong>키워드:</strong> {entry.keys?.join(', ') || '없음'}
                        </div>
                        {entry.secondary_keys && entry.secondary_keys.length > 0 && (
                          <div className="entry-field">
                            <strong>보조 키워드:</strong> {entry.secondary_keys.join(', ')}
                          </div>
                        )}
                        <div className="entry-field">
                          <strong>내용:</strong>
                          <p className="entry-content-text">
                            {entry.content || '내용 없음'}
                          </p>
                        </div>
                        {entry.comment && (
                          <div className="entry-field">
                            <strong>주석:</strong> {entry.comment}
                          </div>
                        )}
                        <div className="entry-meta">
                          {entry.priority !== undefined && (
                            <span>우선순위: {entry.priority}</span>
                          )}
                          {entry.selective && <span>선택적</span>}
                          {entry.constant && <span>상수</span>}
                          {entry.disable && <span>비활성화</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {isFormOpen && (
        <WorldInfoEntryForm
          entry={editingEntry}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

