import { apiPost } from './api';

export interface Character {
  name: string;
  avatar: string;
  chat?: string;
  description?: string;
  personality?: string;
  scenario?: string;
  [key: string]: any;
}

/**
 * 모든 캐릭터 목록 가져오기
 */
export async function getAllCharacters(): Promise<Character[]> {
  return await apiPost<Character[]>('/api/characters/all', {});
}

/**
 * 특정 캐릭터 정보 가져오기
 */
export async function getCharacter(avatarUrl: string): Promise<Character> {
  return await apiPost<Character>('/api/characters/get', {
    avatar_url: avatarUrl,
  });
}

/**
 * 캐릭터 생성
 */
export async function createCharacter(characterData: Partial<Character>): Promise<Character> {
  return await apiPost<Character>('/api/characters/create', characterData);
}

/**
 * 캐릭터 수정
 */
export async function editCharacter(characterData: Partial<Character>): Promise<void> {
  await apiPost('/api/characters/edit', characterData);
}

/**
 * 캐릭터 삭제
 */
export async function deleteCharacter(avatarUrl: string): Promise<void> {
  await apiPost('/api/characters/delete', {
    avatar_url: avatarUrl,
  });
}

/**
 * 캐릭터 복제
 */
export async function duplicateCharacter(avatarUrl: string): Promise<Character> {
  return await apiPost<Character>('/api/characters/duplicate', {
    avatar_url: avatarUrl,
  });
}

