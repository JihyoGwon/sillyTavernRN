import { useEffect, useState } from 'react';
import { getAllCharacters, deleteCharacter, duplicateCharacter, createCharacter, editCharacter, type Character } from '../services/characters';
import CharacterForm from '../components/CharacterForm';
import './Characters.css';

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCharacters();
      setCharacters(data);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : '캐릭터 목록을 불러올 수 없습니다.';
      setError(errorMessage);
      console.error('캐릭터 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const handleDelete = async (avatarUrl: string, characterName: string) => {
    if (!confirm(`"${characterName}" 캐릭터를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteCharacter(avatarUrl);
      await loadCharacters();
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  const handleDuplicate = async (avatarUrl: string) => {
    try {
      await duplicateCharacter(avatarUrl);
      await loadCharacters();
      alert('캐릭터가 복제되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : '복제에 실패했습니다.');
    }
  };

  const handleCreate = () => {
    setEditingCharacter(null);
    setIsFormOpen(true);
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setIsFormOpen(true);
  };

  const handleSave = async (characterData: Partial<Character>) => {
    try {
      if (editingCharacter) {
        // 수정 - avatar_url 필드 필요
        await editCharacter({
          ...characterData,
          avatar_url: editingCharacter.avatar,
        });
        alert('캐릭터가 수정되었습니다.');
      } else {
        // 생성
        await createCharacter(characterData);
        alert('캐릭터가 생성되었습니다.');
      }
      setIsFormOpen(false);
      setEditingCharacter(null);
      await loadCharacters();
    } catch (err) {
      throw err; // CharacterForm에서 처리
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCharacter(null);
  };

  if (loading) {
    return (
      <div className="characters">
        <h1>캐릭터 관리</h1>
        <div className="characters-content">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="characters">
        <h1>캐릭터 관리</h1>
        <div className="characters-content">
          <p className="error">{error}</p>
          <button onClick={loadCharacters}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="characters">
      <div className="characters-header">
        <h1>캐릭터 관리</h1>
        <button className="btn-primary" onClick={handleCreate}>
          새 캐릭터 생성
        </button>
      </div>

      <div className="characters-content">
        {characters.length === 0 ? (
          <p>캐릭터가 없습니다.</p>
        ) : (
          <div className="characters-grid">
            {characters.map((character) => (
              <div key={character.avatar} className="character-card">
                <div className="character-avatar">
                  {character.avatar ? (
                    <img src={character.avatar} alt={character.name} />
                  ) : (
                    <div className="avatar-placeholder">{character.name[0]}</div>
                  )}
                </div>
                <div className="character-info">
                  <h3>{character.name}</h3>
                  {character.description && (
                    <p className="character-description">
                      {character.description.substring(0, 100)}
                      {character.description.length > 100 ? '...' : ''}
                    </p>
                  )}
                </div>
                <div className="character-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(character)}
                  >
                    수정
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => handleDuplicate(character.avatar)}
                  >
                    복제
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(character.avatar, character.name)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CharacterForm
        character={editingCharacter}
        onSave={handleSave}
        onCancel={handleCancel}
        isOpen={isFormOpen}
      />
    </div>
  );
}
