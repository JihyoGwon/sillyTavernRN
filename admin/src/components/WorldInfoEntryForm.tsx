import { useState, useEffect } from 'react';
import type { WorldInfoEntry } from '../services/worldinfo';
import './WorldInfoEntryForm.css';

interface WorldInfoEntryFormProps {
  entry: WorldInfoEntry | null;
  onSave: (entry: WorldInfoEntry) => void;
  onCancel: () => void;
}

export default function WorldInfoEntryForm({
  entry,
  onSave,
  onCancel,
}: WorldInfoEntryFormProps) {
  const [formData, setFormData] = useState<Partial<WorldInfoEntry>>({
    name: '',
    keys: [],
    content: '',
    comment: '',
    priority: 0,
    selective: false,
    secondary_keys: [],
    constant: false,
    position: 'before',
    disable: false,
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        name: entry.name || '',
        keys: entry.keys || [],
        content: entry.content || '',
        comment: entry.comment || '',
        priority: entry.priority ?? 0,
        selective: entry.selective ?? false,
        secondary_keys: entry.secondary_keys || [],
        constant: entry.constant ?? false,
        position: entry.position || 'before',
        disable: entry.disable ?? false,
        uid: entry.uid,
      });
    } else {
      setFormData({
        name: '',
        keys: [],
        content: '',
        comment: '',
        priority: 0,
        selective: false,
        secondary_keys: [],
        constant: false,
        position: 'before',
        disable: false,
      });
    }
  }, [entry]);

  const handleChange = (field: keyof WorldInfoEntry, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKeysChange = (value: string) => {
    const keys = value.split(',').map((k) => k.trim()).filter((k) => k.length > 0);
    handleChange('keys', keys);
  };

  const handleSecondaryKeysChange = (value: string) => {
    const keys = value.split(',').map((k) => k.trim()).filter((k) => k.length > 0);
    handleChange('secondary_keys', keys);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.name.trim() === '') {
      alert('이름은 필수입니다.');
      return;
    }

    if (!formData.keys || formData.keys.length === 0) {
      alert('키워드는 최소 1개 이상 필요합니다.');
      return;
    }

    if (!formData.content || formData.content.trim() === '') {
      alert('내용은 필수입니다.');
      return;
    }

    onSave(formData as WorldInfoEntry);
  };

  return (
    <div className="worldinfo-entry-form-overlay" onClick={onCancel}>
      <div className="worldinfo-entry-form" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{entry ? 'World Info 편집' : '새 World Info 생성'}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">이름 *</label>
            <input
              id="name"
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              placeholder="World Info 이름"
            />
          </div>

          <div className="form-field">
            <label htmlFor="keys">키워드 (쉼표로 구분) *</label>
            <input
              id="keys"
              type="text"
              value={formData.keys?.join(', ') || ''}
              onChange={(e) => handleKeysChange(e.target.value)}
              required
              placeholder="키워드1, 키워드2, 키워드3"
            />
            <p className="field-description">
              채팅에서 이 키워드들이 나타나면 World Info가 활성화됩니다.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="content">내용 *</label>
            <textarea
              id="content"
              rows={8}
              value={formData.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              required
              placeholder="World Info 내용을 입력하세요..."
            />
            <p className="field-description">
              이 World Info가 활성화될 때 프롬프트에 주입될 내용입니다.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="comment">주석</label>
            <textarea
              id="comment"
              rows={3}
              value={formData.comment || ''}
              onChange={(e) => handleChange('comment', e.target.value)}
              placeholder="메모나 설명 (프롬프트에 포함되지 않음)"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="priority">우선순위</label>
              <input
                id="priority"
                type="number"
                value={formData.priority ?? 0}
                onChange={(e) => handleChange('priority', parseInt(e.target.value) || 0)}
              />
              <p className="field-description">
                값이 높을수록 우선순위가 높습니다.
              </p>
            </div>

            <div className="form-field">
              <label htmlFor="position">위치</label>
              <select
                id="position"
                value={formData.position || 'before'}
                onChange={(e) => handleChange('position', e.target.value)}
              >
                <option value="before">Before</option>
                <option value="after">After</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="secondary_keys">보조 키워드 (쉼표로 구분)</label>
            <input
              id="secondary_keys"
              type="text"
              value={formData.secondary_keys?.join(', ') || ''}
              onChange={(e) => handleSecondaryKeysChange(e.target.value)}
              placeholder="보조 키워드1, 보조 키워드2"
            />
            <p className="field-description">
              선택적 키워드입니다. 선택적 모드에서 사용됩니다.
            </p>
          </div>

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.selective || false}
                onChange={(e) => handleChange('selective', e.target.checked)}
              />
              <span>선택적 (Selective)</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.constant || false}
                onChange={(e) => handleChange('constant', e.target.checked)}
              />
              <span>상수 (Constant) - 항상 활성화</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.disable || false}
                onChange={(e) => handleChange('disable', e.target.checked)}
              />
              <span>비활성화</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              취소
            </button>
            <button type="submit" className="btn-primary">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

