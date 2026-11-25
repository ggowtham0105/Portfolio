import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { PortfolioContext } from './portfolioContext';
import {
  DEFAULT_CERTIFICATIONS,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_EXPERIENCES,
  DEFAULT_SITE_SETTINGS,
} from '../data/portfolioDefaults';

const PREVIEW_STORAGE_KEY = 'portfolio_admin_preview_v1';

function readPreviewStorage() {
  try {
    const raw = localStorage.getItem(PREVIEW_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getInitialData() {
  const preview = !supabase ? readPreviewStorage() : null;
  return {
    certifications: preview?.certifications ?? DEFAULT_CERTIFICATIONS,
    projects: preview?.projects ?? DEFAULT_PROJECTS,
    skills: preview?.skills ?? DEFAULT_SKILLS,
    experiences: preview?.experiences ?? DEFAULT_EXPERIENCES,
    settings: { ...DEFAULT_SITE_SETTINGS, ...(preview?.settings || {}) },
    usingRemote: {
      certifications: false,
      projects: false,
      skills: false,
      experiences: false,
      settings: false,
    },
  };
}

async function fetchRemotePortfolioData() {
  const [certsRes, projectsRes, skillsRes, expRes, settingsRes] = await Promise.all([
    supabase
      .from('certifications')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('experiences')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase.from('site_settings').select('key, value'),
  ]);

  const settingsMap = {};
  if (!settingsRes.error && Array.isArray(settingsRes.data)) {
    for (const row of settingsRes.data) {
      if (row.key) settingsMap[row.key] = row.value;
    }
  }

  return {
    certifications:
      !certsRes.error && certsRes.data?.length > 0 ? certsRes.data : DEFAULT_CERTIFICATIONS,
    projects:
      !projectsRes.error && projectsRes.data?.length > 0 ? projectsRes.data : DEFAULT_PROJECTS,
    skills: !skillsRes.error && skillsRes.data?.length > 0 ? skillsRes.data : DEFAULT_SKILLS,
    experiences:
      !expRes.error && expRes.data?.length > 0 ? expRes.data : DEFAULT_EXPERIENCES,
    settings: { ...DEFAULT_SITE_SETTINGS, ...settingsMap },
    usingRemote: {
      certifications: !certsRes.error && (certsRes.data?.length || 0) > 0,
      projects: !projectsRes.error && (projectsRes.data?.length || 0) > 0,
      skills: !skillsRes.error && (skillsRes.data?.length || 0) > 0,
      experiences: !expRes.error && (expRes.data?.length || 0) > 0,
      settings: !settingsRes.error && (settingsRes.data?.length || 0) > 0,
    },
  };
}

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(getInitialData);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [syncError, setSyncError] = useState('');

  const refreshData = useCallback(async () => {
    if (!supabase) {
      setData(getInitialData());
      setLoading(false);
      return;
    }

    setLoading(true);
    setSyncError('');
    try {
      const next = await fetchRemotePortfolioData();
      setData(next);
    } catch (err) {
      setSyncError(err?.message || 'Unable to fetch remote portfolio data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    fetchRemotePortfolioData()
      .then((next) => {
        if (active) {
          setData(next);
          setSyncError('');
        }
      })
      .catch((err) => {
        if (active) {
          setSyncError(err?.message || 'Unable to fetch remote portfolio data.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const savePreviewData = useCallback((updater) => {
    if (supabase) return;
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(
          PREVIEW_STORAGE_KEY,
          JSON.stringify({
            certifications: next.certifications,
            projects: next.projects,
            skills: next.skills,
            experiences: next.experiences,
            settings: next.settings,
          })
        );
      } catch {
        // Ignore storage quota errors in preview mode
      }
      return next;
    });
  }, []);

  const resetPreviewData = useCallback(() => {
    if (supabase) return;
    try {
      localStorage.removeItem(PREVIEW_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setData(getInitialData());
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        ...data,
        loading,
        syncError,
        isSupabaseConfigured: Boolean(supabase),
        refreshData,
        savePreviewData,
        resetPreviewData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
