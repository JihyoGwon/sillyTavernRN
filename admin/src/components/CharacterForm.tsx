import { useState, useEffect } from 'react';
import type { Character } from '../services/characters';
import './CharacterForm.css';

interface CharacterFormProps {
  character?: Character | null;
  onSave: (data: Partial<Character>) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

export default function CharacterForm({
  character,
  onSave,
  onCancel,
  isOpen,
}: CharacterFormProps) {
  const [formData, setFormData] = useState<Partial<Character>>({
    name: '',
    description: '',
    personality: '',
    scenario: '',
    avatar: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name || '',
        description: character.description || '',
        personality: character.personality || '',
        scenario: character.scenario || '',
        avatar: character.avatar || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        personality: '',
        scenario: '',
        avatar: '',
      });
    }
  }, [character, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      alert('캐릭터 이름을 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      await onSave(formData);
    } catch (err) {
      alert(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{character ? '캐릭터 수정' : '새 캐릭터 생성'}</h2>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="character-form">
          <div className="form-group">
            <label>캐릭터 이름 *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="캐릭터 이름을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>아바타 URL</label>
            <input
              type="text"
              value={formData.avatar || ''}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="이미지 URL을 입력하세요"
            />
            {formData.avatar && (
              <img src={formData.avatar} alt="미리보기" className="avatar-preview" />
            )}
          </div>

          <div className="form-group">
            <label>설명 (Description)</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="캐릭터에 대한 설명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>성격 (Personality)</label>
            <textarea
              value={formData.personality || ''}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              rows={4}
              placeholder="캐릭터의 성격을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>시나리오 (Scenario)</label>
            <textarea
              value={formData.scenario || ''}
              onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
              rows={4}
              placeholder="캐릭터의 배경 시나리오를 입력하세요"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              취소
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? '저장 중...' : character ? '수정' : '생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

