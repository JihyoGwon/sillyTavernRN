import { useState, useEffect } from 'react';
import type { Settings, ProxyPreset } from '../../types/settings';
import './OtherSettings.css';

interface OtherSettingsProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
}

export default function OtherSettings({
  settings,
  onChange,
}: OtherSettingsProps) {
  const [localSettings, setLocalSettings] = useState<Partial<Settings>>({
    tags: Array.isArray(settings.tags) ? settings.tags : [],
    tag_map: settings.tag_map || {},
    background: settings.background || {},
    proxies: Array.isArray(settings.proxies) ? settings.proxies : [],
    selected_proxy: settings.selected_proxy || '',
  });

  useEffect(() => {
    setLocalSettings({
      tags: Array.isArray(settings.tags) ? settings.tags : [],
      tag_map: settings.tag_map || {},
      background: settings.background || {},
      proxies: Array.isArray(settings.proxies) ? settings.proxies : [],
      selected_proxy: settings.selected_proxy || '',
    });
  }, [settings]);

  const handleChange = (field: keyof Settings, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    onChange(updated);
  };

  // 태그 관리
  const [newTag, setNewTag] = useState('');
  
  // 태그가 문자열 배열인지 객체 배열인지 확인
  const getTagName = (tag: any): string => {
    if (typeof tag === 'string') return tag;
    if (typeof tag === 'object' && tag !== null) {
      return tag.name || tag.id || String(tag);
    }
    return String(tag);
  };

  const getTagId = (tag: any, index: number): string => {
    if (typeof tag === 'string') return tag;
    if (typeof tag === 'object' && tag !== null) {
      return tag.id || tag.name || `tag-${index}`;
    }
    return `tag-${index}`;
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const tagsArray = Array.isArray(localSettings.tags) ? localSettings.tags : [];
    const tagNames = tagsArray.map(getTagName);
    
    if (!tagNames.includes(newTag.trim())) {
      const updatedTags = [...tagsArray, newTag.trim()];
      handleChange('tags', updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: any) => {
    const tagsArray = Array.isArray(localSettings.tags) ? localSettings.tags : [];
    const updatedTags = tagsArray.filter((t) => {
      const currentTagName = getTagName(t);
      const removeTagName = getTagName(tagToRemove);
      return currentTagName !== removeTagName;
    });
    handleChange('tags', updatedTags);
  };

  // 프록시 관리
  const [newProxy, setNewProxy] = useState<Partial<ProxyPreset>>({ name: '', url: '' });
  const [editingProxy, setEditingProxy] = useState<ProxyPreset | null>(null);

  const handleAddProxy = () => {
    if (newProxy.name?.trim() && newProxy.url?.trim()) {
      const updatedProxies = [...(localSettings.proxies || []), newProxy as ProxyPreset];
      handleChange('proxies', updatedProxies);
      setNewProxy({ name: '', url: '' });
    }
  };

  const handleEditProxy = (proxy: ProxyPreset) => {
    setEditingProxy(proxy);
    setNewProxy({ name: proxy.name || '', url: proxy.url || '' });
  };

  const handleUpdateProxy = () => {
    if (editingProxy && newProxy.name?.trim() && newProxy.url?.trim()) {
      const proxiesArray = Array.isArray(localSettings.proxies) ? localSettings.proxies : [];
      const editingProxyName = typeof editingProxy === 'object' && editingProxy !== null 
        ? (editingProxy.name || '') 
        : String(editingProxy);
      const updatedProxies = proxiesArray.map((p) => {
        const pName = typeof p === 'object' && p !== null ? (p.name || '') : String(p);
        return pName === editingProxyName ? { ...(typeof p === 'object' ? p : {}), ...newProxy } : p;
      });
      handleChange('proxies', updatedProxies);
      setEditingProxy(null);
      setNewProxy({ name: '', url: '' });
    }
  };

  const handleRemoveProxy = (proxy: ProxyPreset) => {
    const proxiesArray = Array.isArray(localSettings.proxies) ? localSettings.proxies : [];
    const proxyName = typeof proxy === 'object' && proxy !== null ? (proxy.name || '') : String(proxy);
    const updatedProxies = proxiesArray.filter((p) => {
      const pName = typeof p === 'object' && p !== null ? (p.name || '') : String(p);
      return pName !== proxyName;
    });
    handleChange('proxies', updatedProxies);
    if (localSettings.selected_proxy === proxyName) {
      handleChange('selected_proxy', '');
    }
  };

  const handleCancelEditProxy = () => {
    setEditingProxy(null);
    setNewProxy({ name: '', url: '' });
  };

  return (
    <div className="other-settings">
      <div className="settings-section">
        <h2>태그 관리</h2>
        <div className="settings-field">
          <label htmlFor="new_tag">새 태그 추가</label>
          <div className="input-group">
            <input
              id="new_tag"
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="태그 이름을 입력하세요"
            />
            <button type="button" className="btn-primary" onClick={handleAddTag}>
              추가
            </button>
          </div>
          <p className="field-description">
            캐릭터를 분류하는 데 사용할 태그를 추가하세요.
          </p>
        </div>

        <div className="settings-field">
          <label>현재 태그 목록</label>
          {Array.isArray(localSettings.tags) && localSettings.tags.length > 0 ? (
            <div className="tag-list">
              {localSettings.tags.map((tag, index) => {
                const tagName = getTagName(tag);
                const tagId = getTagId(tag, index);
                return (
                  <div key={tagId} className="tag-item">
                    <span>{tagName}</span>
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty-message">태그가 없습니다.</p>
          )}
        </div>
      </div>

      <div className="settings-section">
        <h2>배경 설정</h2>
        <div className="settings-field">
          <label htmlFor="background_url">배경 이미지 URL</label>
          <input
            id="background_url"
            type="text"
            value={(localSettings.background as any)?.url || ''}
            onChange={(e) =>
              handleChange('background', { ...(localSettings.background as any), url: e.target.value })
            }
            placeholder="https://example.com/background.jpg"
          />
          <p className="field-description">
            채팅 화면의 배경 이미지 URL을 입력하세요.
          </p>
        </div>
      </div>

      <div className="settings-section">
        <h2>프록시 프리셋 관리</h2>
        <div className="settings-field">
          <label>프록시 프리셋 {editingProxy ? '편집' : '추가'}</label>
          <div className="proxy-form">
            <input
              type="text"
              value={newProxy.name || ''}
              onChange={(e) => setNewProxy({ ...newProxy, name: e.target.value })}
              placeholder="프리셋 이름"
            />
            <input
              type="text"
              value={newProxy.url || ''}
              onChange={(e) => setNewProxy({ ...newProxy, url: e.target.value })}
              placeholder="프록시 URL"
            />
            {editingProxy ? (
              <>
                <button type="button" className="btn-primary" onClick={handleUpdateProxy}>
                  저장
                </button>
                <button type="button" className="btn-secondary" onClick={handleCancelEditProxy}>
                  취소
                </button>
              </>
            ) : (
              <button type="button" className="btn-primary" onClick={handleAddProxy}>
                추가
              </button>
            )}
          </div>
          <p className="field-description">
            API 요청에 사용할 프록시 프리셋을 추가하세요.
          </p>
        </div>

        <div className="settings-field">
          <label>프록시 프리셋 목록</label>
          {Array.isArray(localSettings.proxies) && localSettings.proxies.length > 0 ? (
            <div className="proxy-list">
              {localSettings.proxies.map((proxy, index) => {
                const proxyName = typeof proxy === 'object' && proxy !== null 
                  ? (proxy.name || String(proxy)) 
                  : String(proxy);
                const proxyUrl = typeof proxy === 'object' && proxy !== null 
                  ? (proxy.url || '') 
                  : '';
                const proxyKey = typeof proxy === 'object' && proxy !== null && proxy.name
                  ? proxy.name
                  : `proxy-${index}`;
                
                return (
                <div key={index} className="proxy-item">
                  <div className="proxy-info">
                    <strong>{proxyName || '이름 없음'}</strong>
                    <span className="proxy-url">{proxyUrl}</span>
                  </div>
                  <div className="proxy-actions">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="selected_proxy"
                        checked={localSettings.selected_proxy === proxyName}
                        onChange={() => handleChange('selected_proxy', proxyName || '')}
                      />
                      <span>선택</span>
                    </label>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleEditProxy(typeof proxy === 'object' ? proxy : { name: proxyName, url: proxyUrl })}
                    >
                      편집
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleRemoveProxy(typeof proxy === 'object' ? proxy : { name: proxyName, url: proxyUrl })}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <p className="empty-message">프록시 프리셋이 없습니다.</p>
          )}
        </div>

        {Array.isArray(localSettings.proxies) && localSettings.proxies.length > 0 && (
          <div className="settings-field">
            <label>선택된 프록시</label>
            <select
              value={localSettings.selected_proxy || ''}
              onChange={(e) => handleChange('selected_proxy', e.target.value)}
            >
              <option value="">없음</option>
              {localSettings.proxies.map((proxy, index) => {
                const proxyName = typeof proxy === 'object' && proxy !== null 
                  ? (proxy.name || String(proxy)) 
                  : String(proxy);
                return (
                  <option key={index} value={proxyName}>
                    {proxyName || '이름 없음'}
                  </option>
                );
              })}
            </select>
            <p className="field-description">
              기본으로 사용할 프록시 프리셋을 선택하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

