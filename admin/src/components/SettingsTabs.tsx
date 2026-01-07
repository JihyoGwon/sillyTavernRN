import './SettingsTabs.css';

export type SettingsTab = 
  | 'general'
  | 'generation'
  | 'openai'
  | 'textgen'
  | 'kobold'
  | 'novelai'
  | 'horde'
  | 'power-user'
  | 'world-info'
  | 'extensions'
  | 'others';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'general', label: '기본 설정' },
  { id: 'generation', label: '생성 파라미터' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'textgen', label: 'TextGen' },
  { id: 'kobold', label: 'Kobold' },
  { id: 'novelai', label: 'NovelAI' },
  { id: 'horde', label: 'Horde' },
  { id: 'power-user', label: '고급 설정' },
  { id: 'world-info', label: 'World Info' },
  { id: 'extensions', label: '확장 기능' },
  { id: 'others', label: '기타' },
];

export default function SettingsTabs({
  activeTab,
  onTabChange,
}: SettingsTabsProps) {
  return (
    <div className="settings-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

