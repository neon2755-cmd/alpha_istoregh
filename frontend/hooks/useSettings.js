import { useState, useEffect } from 'react';
import { settingsAPI } from '../lib/api';

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    settingsAPI.get().then(res => {
      if (active && res.settings) setSettings(res.settings);
    }).catch(() => {}).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false };
  }, []);

  return { settings, loading };
}
