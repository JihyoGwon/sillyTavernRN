import { apiPost } from './api';

/**
 * World Info 항목
 */
export interface WorldInfoEntry {
  uid?: string;
  name?: string;
  keys?: string[];
  content?: string;
  comment?: string;
  priority?: number;
  selective?: boolean;
  secondary_keys?: string[];
  constant?: boolean;
  position?: string;
  disable?: boolean;
  [key: string]: any;
}

/**
 * World Info 가져오기
 */
export async function getWorldInfo(): Promise<WorldInfoEntry[]> {
  try {
    // 응답 형식 확인: 배열일 수도 있고, 객체일 수도 있음
    const response = await apiPost<any>('/api/worldinfo/get', {});
    
    // 응답이 배열인 경우
    if (Array.isArray(response)) {
      return response;
    }
    
    // 응답이 객체인 경우 (entries 필드 또는 다른 필드)
    if (response.entries && Array.isArray(response.entries)) {
      return response.entries;
    }
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    // 빈 배열 반환
    return [];
  } catch (err) {
    console.error('World Info 가져오기 실패:', err);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
}

/**
 * World Info 편집/생성
 */
export async function editWorldInfo(entry: WorldInfoEntry): Promise<void> {
  await apiPost('/api/worldinfo/edit', entry);
}

/**
 * World Info 삭제
 */
export async function deleteWorldInfo(uid: string): Promise<void> {
  await apiPost('/api/worldinfo/delete', { uid });
}

/**
 * World Info 가져오기
 */
export async function importWorldInfo(data: any): Promise<void> {
  await apiPost('/api/worldinfo/import', data);
}
