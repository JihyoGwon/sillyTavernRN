import type { ChatMessage } from '@/services/types';

// MMKV 인스턴스 생성 (조건부 - Expo Go에서는 사용 불가)
let storage: any = null;

try {
  // 네이티브 모듈이 사용 가능한 경우에만 import
  const { MMKV } = require('react-native-mmkv');
  storage = new MMKV('chat-storage');
} catch (error) {
  // Expo Go나 웹에서는 MMKV 사용 불가 - 서버만 사용
  console.warn('MMKV를 사용할 수 없습니다. 서버 저장소만 사용합니다:', error);
}

/**
 * 채팅 저장소 키 생성
 */
function getChatKey(chName: string, fileName: string): string {
  return `chat:${chName}:${fileName}`;
}

/**
 * 채팅 메시지를 로컬에 저장
 * @param chName 캐릭터 이름
 * @param fileName 채팅 파일명
 * @param messages 채팅 메시지 배열
 */
export function saveChatToLocal(
  chName: string,
  fileName: string,
  messages: ChatMessage[]
): void {
  if (!storage) {
    // MMKV를 사용할 수 없으면 로컬 저장 스킵
    return;
  }
  
  try {
    const key = getChatKey(chName, fileName);
    storage.set(key, JSON.stringify(messages));
    // 마지막 업데이트 시간 저장
    storage.set(`${key}:updated`, Date.now());
  } catch (error) {
    console.error('로컬 채팅 저장 실패:', error);
  }
}

/**
 * 로컬에서 채팅 메시지 불러오기
 * @param chName 캐릭터 이름
 * @param fileName 채팅 파일명
 * @returns 채팅 메시지 배열 또는 null
 */
export function getChatFromLocal(
  chName: string,
  fileName: string
): ChatMessage[] | null {
  if (!storage) {
    // MMKV를 사용할 수 없으면 null 반환
    return null;
  }
  
  try {
    const key = getChatKey(chName, fileName);
    const data = storage.getString(key);
    if (data) {
      return JSON.parse(data) as ChatMessage[];
    }
    return null;
  } catch (error) {
    console.error('로컬 채팅 불러오기 실패:', error);
    return null;
  }
}

/**
 * 로컬 채팅 삭제
 * @param chName 캐릭터 이름
 * @param fileName 채팅 파일명
 */
export function deleteChatFromLocal(
  chName: string,
  fileName: string
): void {
  if (!storage) {
    // MMKV를 사용할 수 없으면 삭제 스킵
    return;
  }
  
  try {
    const key = getChatKey(chName, fileName);
    storage.delete(key);
    storage.delete(`${key}:updated`);
  } catch (error) {
    console.error('로컬 채팅 삭제 실패:', error);
  }
}

/**
 * 로컬 채팅의 마지막 업데이트 시간 가져오기
 * @param chName 캐릭터 이름
 * @param fileName 채팅 파일명
 * @returns 마지막 업데이트 시간 (타임스탬프) 또는 null
 */
export function getChatLastUpdated(
  chName: string,
  fileName: string
): number | null {
  if (!storage) {
    // MMKV를 사용할 수 없으면 null 반환
    return null;
  }
  
  try {
    const key = getChatKey(chName, fileName);
    const updated = storage.getNumber(`${key}:updated`);
    return updated ?? null;
  } catch (error) {
    console.error('로컬 채팅 업데이트 시간 불러오기 실패:', error);
    return null;
  }
}

