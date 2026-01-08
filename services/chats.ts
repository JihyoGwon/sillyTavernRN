import { apiPost } from './api';
import type { ChatMessage, ChatData } from './types';
import {
  getChatFromLocal,
  saveChatToLocal,
  getChatLastUpdated,
} from '@/utils/chatStorage';

/**
 * 채팅 불러오기 (하이브리드: 로컬 캐시 먼저, 서버에서 최신 확인)
 * @param chName 캐릭터 이름
 * @param fileName 채팅 파일명 (확장자 제외)
 * @returns 채팅 메시지 배열
 */
export async function getChat(
  chName: string,
  fileName: string
): Promise<ChatMessage[]> {
  // 1. 로컬 캐시에서 먼저 불러오기 (빠른 표시)
  const localChat = getChatFromLocal(chName, fileName);
  const localUpdated = getChatLastUpdated(chName, fileName);

  // 2. 서버에서 최신 데이터 가져오기
  try {
    const serverChat = await apiPost<ChatMessage[]>('/api/chats/get', {
      ch_name: chName,
      file_name: fileName,
    });

    // 3. 서버 데이터가 있으면 로컬에 저장 (캐시 업데이트)
    if (Array.isArray(serverChat) && serverChat.length > 0) {
      saveChatToLocal(chName, fileName, serverChat);
      return serverChat;
    }

    // 4. 서버에 데이터가 없고 로컬에 있으면 로컬 데이터 반환
    if (localChat && localChat.length > 0) {
      return localChat;
    }

    return [];
  } catch (error) {
    // 5. 서버 요청 실패 시 로컬 캐시 반환 (오프라인 지원)
    console.warn('서버에서 채팅 불러오기 실패, 로컬 캐시 사용:', error);
    if (localChat && localChat.length > 0) {
      return localChat;
    }
    throw error;
  }
}

/**
 * 채팅 저장 (하이브리드: 서버 저장 후 로컬 캐시에도 저장)
 * @param chatData 채팅 데이터
 * @param force 강제 저장 여부 (무결성 검사 실패 시에도 저장)
 * @returns 저장 결과
 */
export async function saveChat(
  chatData: ChatData,
  force: boolean = false
): Promise<void> {
  try {
    // 1. 서버에 저장
    await apiPost('/api/chats/save', {
      ...chatData,
      force,
    });

    // 2. 서버 저장 성공 시 로컬 캐시에도 저장
    if (Array.isArray(chatData.chat)) {
      saveChatToLocal(chatData.ch_name, chatData.file_name, chatData.chat);
    }
  } catch (error) {
    // 3. 서버 저장 실패해도 로컬에는 저장 (오프라인 지원)
    console.warn('서버 저장 실패, 로컬에만 저장:', error);
    if (Array.isArray(chatData.chat)) {
      saveChatToLocal(chatData.ch_name, chatData.file_name, chatData.chat);
    }
    // 에러를 다시 던져서 호출자가 처리할 수 있도록 함
    throw error;
  }
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

