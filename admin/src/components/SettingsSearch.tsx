import { useState, useMemo } from 'react';
import type { Settings } from '../types/settings';
import './SettingsSearch.css';

interface SettingsSearchProps {
  settings: Settings;
  onResultClick?: (tab: string, fieldId?: string) => void;
}

interface SearchResult {
  tab: string;
  tabLabel: string;
  fieldId?: string;
  fieldLabel: string;
  value: any;
  path: string;
}

const TAB_LABELS: Record<string, string> = {
  general: '일반 설정',
  generation: '생성 파라미터',
  openai: 'OpenAI',
  textgen: 'TextGen',
  kobold: 'Kobold',
  novelai: 'NovelAI',
  horde: 'Horde',
  'power-user': '고급 설정',
  'world-info': 'World Info',
  extensions: '확장 기능',
  others: '기타 설정',
};

export default function SettingsSearch({
  settings,
  onResultClick,
}: SettingsSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 설정을 평탄화하여 검색 가능한 형태로 변환
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // 재귀적으로 객체를 순회하며 검색
    const searchObject = (
      obj: any,
      path: string[],
      tab: string,
      tabLabel: string
    ) => {
      if (obj === null || obj === undefined) return;

      if (typeof obj === 'object' && !Array.isArray(obj)) {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = [...path, key];
          const pathString = currentPath.join('.');

          // 키워드 검색 (한글/영문)
          const keyLower = key.toLowerCase();
          if (keyLower.includes(query)) {
            results.push({
              tab,
              tabLabel,
              fieldId: pathString,
              fieldLabel: key,
              value: typeof value === 'object' ? JSON.stringify(value) : String(value),
              path: pathString,
            });
          }

          // 값 검색
          if (typeof value === 'string' && value.toLowerCase().includes(query)) {
            results.push({
              tab,
              tabLabel,
              fieldId: pathString,
              fieldLabel: key,
              value: value,
              path: pathString,
            });
          }

          // 재귀적으로 하위 객체 검색
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            searchObject(value, currentPath, tab, tabLabel);
          }
        }
      }
    };

    // 각 탭별로 검색
    if (settings.username && 'username'.includes(query)) {
      results.push({
        tab: 'general',
        tabLabel: TAB_LABELS.general,
        fieldId: 'username',
        fieldLabel: '사용자 이름',
        value: settings.username,
        path: 'username',
      });
    }

    if (settings.amount_gen !== undefined && String(settings.amount_gen).includes(query)) {
      results.push({
        tab: 'generation',
        tabLabel: TAB_LABELS.generation,
        fieldId: 'amount_gen',
        fieldLabel: '생성 토큰 수',
        value: settings.amount_gen,
        path: 'amount_gen',
      });
    }

    if (settings.max_context !== undefined && String(settings.max_context).includes(query)) {
      results.push({
        tab: 'generation',
        tabLabel: TAB_LABELS.generation,
        fieldId: 'max_context',
        fieldLabel: '최대 컨텍스트',
        value: settings.max_context,
        path: 'max_context',
      });
    }

    // API별 설정 검색
    if (settings.oai_settings) {
      searchObject(settings.oai_settings, ['oai_settings'], 'openai', TAB_LABELS.openai);
    }
    if (settings.textgenerationwebui_settings) {
      searchObject(settings.textgenerationwebui_settings, ['textgenerationwebui_settings'], 'textgen', TAB_LABELS.textgen);
    }
    if (settings.kai_settings) {
      searchObject(settings.kai_settings, ['kai_settings'], 'kobold', TAB_LABELS.kobold);
    }
    if (settings.nai_settings) {
      searchObject(settings.nai_settings, ['nai_settings'], 'novelai', TAB_LABELS.novelai);
    }
    if (settings.horde_settings) {
      searchObject(settings.horde_settings, ['horde_settings'], 'horde', TAB_LABELS.horde);
    }
    if (settings.power_user) {
      searchObject(settings.power_user, ['power_user'], 'power-user', TAB_LABELS['power-user']);
    }
    if (settings.world_info_settings) {
      searchObject(settings.world_info_settings, ['world_info_settings'], 'world-info', TAB_LABELS['world-info']);
    }
    if (settings.extension_settings) {
      searchObject(settings.extension_settings, ['extension_settings'], 'extensions', TAB_LABELS.extensions);
    }

    return results.slice(0, 20); // 최대 20개 결과만 표시
  }, [searchQuery, settings]);

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result.tab, result.fieldId);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="settings-search">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="설정 검색..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchQuery.trim()) {
              setIsOpen(true);
            }
          }}
          onBlur={() => {
            // 약간의 지연을 두어 클릭 이벤트가 처리되도록 함
            setTimeout(() => setIsOpen(false), 200);
          }}
        />
        <span className="search-icon">🔍</span>
      </div>

      {isOpen && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="search-result-item"
              onMouseDown={(e) => {
                e.preventDefault(); // blur 이벤트 방지
                handleResultClick(result);
              }}
            >
              <div className="result-header">
                <span className="result-tab">{result.tabLabel}</span>
                <span className="result-field">{result.fieldLabel}</span>
              </div>
              <div className="result-value">
                {typeof result.value === 'string' && result.value.length > 50
                  ? result.value.substring(0, 50) + '...'
                  : String(result.value)}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && searchQuery.trim() && searchResults.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">검색 결과가 없습니다.</div>
        </div>
      )}
    </div>
  );
}

