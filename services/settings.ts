import { apiPost } from './api';
import type { Settings } from './types';

/**
 * 설정 불러오기
 * @returns 설정 객체
 */
export async function getSettings(): Promise<Settings> {
  const response = await apiPost<{ settings: string }>('/api/settings/get', {});
  
  // SillyTavern은 settings를 JSON 문자열로 반환함
  if (response.settings) {
    return JSON.parse(response.settings) as Settings;
  }
  
  return {} as Settings;
}

