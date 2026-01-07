import './SettingsHeader.css';

interface SettingsHeaderProps {
  onSave: () => void;
  onCancel: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

export default function SettingsHeader({
  onSave,
  onCancel,
  hasUnsavedChanges,
  isSaving,
}: SettingsHeaderProps) {
  return (
    <div className="settings-header">
      <h1>설정</h1>
      <div className="settings-header-actions">
        {hasUnsavedChanges && (
          <span className="unsaved-indicator">저장되지 않은 변경사항</span>
        )}
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

