import { apiPost } from './api';
import type { Character } from './types';

/**
 * 모든 캐릭터 목록 가져오기
 * @returns 캐릭터 배열
 */
export async function getAllCharacters(): Promise<Character[]> {
  const response = await apiPost<Character[]>('/api/characters/all', {});
  return response;
}

/**
 * 특정 캐릭터 정보 가져오기
 * @param avatarUrl 캐릭터 아바타 URL
 * @returns 캐릭터 정보
 */
export async function getCharacter(avatarUrl: string): Promise<Character> {
  const response = await apiPost<Character>('/api/characters/get', {
    avatar_url: avatarUrl,
  });
  return response;
}

/**
 * 캐릭터의 채팅 목록 가져오기
 * @param avatarUrl 캐릭터 아바타 URL
 * @returns 채팅 목록 (파일명과 메타데이터)
 */
export async function getCharacterChats(
  avatarUrl: string
): Promise<Record<string, { file_name: string; last_mes?: number }>> {
  const response = await apiPost<Record<string, any>>(
    '/api/characters/chats',
    {
      avatar_url: avatarUrl,
    }
  );
  return response;
}

