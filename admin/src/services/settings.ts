import { apiPost } from './api';
import type { Settings } from '../types/settings';

/**
 * 설정 가져오기
 */
export async function getSettings(): Promise<Settings> {
  const response = await apiPost<{ settings: string }>('/api/settings/get', {});
  
  if (!response.settings) {
    throw new Error('설정을 불러올 수 없습니다.');
  }
  
  try {
    return JSON.parse(response.settings) as Settings;
  } catch (err) {
    throw new Error('설정 파싱에 실패했습니다.');
  }
}

/**
 * 설정 저장
 */
export async function saveSettings(settings: Settings): Promise<void> {
  await apiPost('/api/settings/save', settings);
}

