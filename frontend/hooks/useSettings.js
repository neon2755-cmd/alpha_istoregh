import { useState, useEffect } from 'react';
import { settingsAPI } from '../lib/api';

let cachedSettings = null;
let pendingSettingsPromise = null;

export async function loadSettings() {
  if (cachedSettings) return cachedSettings;
  if (pendingSettingsPromise) return pendingSettingsPromise;

  pendingSettingsPromise = settingsAPI.get()
    .then((res) => {
      cachedSettings = res?.settings || null;
      return cachedSettings;
    })
    .catch(() => null)
    .finally(() => {
      pendingSettingsPromise = null;
    });

  return pendingSettingsPromise;
}

export function useSettings() {
  const [settings, setSettings] = useState(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    let active = true;
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return () => { active = false };
    }

    setLoading(true);
    loadSettings()
      .then((data) => {
        if (active) setSettings(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false };
  }, []);

  return { settings, loading };
}
