import { apiPost } from './api';
import type { ChatMessage, ChatData } from './types';

/**
 * 채팅 불러오기
 * @param chName 캐릭터 이름
 * @param fileName 채팅 파일명 (확장자 제외)
 * @returns 채팅 메시지 배열
 */
export async function getChat(
  chName: string,
  fileName: string
): Promise<ChatMessage[]> {
  const response = await apiPost<ChatMessage[]>('/api/chats/get', {
    ch_name: chName,
    file_name: fileName,
  });
  return response;
}

/**
 * 채팅 저장
 * @param chatData 채팅 데이터
 * @param force 강제 저장 여부 (무결성 검사 실패 시에도 저장)
 * @returns 저장 결과
 */
export async function saveChat(
  chatData: ChatData,
  force: boolean = false
): Promise<void> {
  await apiPost('/api/chats/save', {
    ...chatData,
    force,
  });
}

/**
 * 채팅 이름 변경
 * @param chName 캐릭터 이름
 * @param oldFileName 기존 파일명
 * @param newFileName 새 파일명
 * @returns 변경 결과
 */
export async function renameChat(
  chName: string,
  oldFileName: string,
  newFileName: string
): Promise<void> {
  await apiPost('/api/chats/rename', {
    ch_name: chName,
    file_name: oldFileName,
    new_file_name: newFileName,
  });
}

/**
 * 채팅 삭제
 * @param chName 캐릭터 이름
 * @param fileName 채팅 파일명
 * @returns 삭제 결과
 */
export async function deleteChat(
  chName: string,
  fileName: string
): Promise<void> {
  await apiPost('/api/chats/delete', {
    ch_name: chName,
    file_name: fileName,
  });
}

