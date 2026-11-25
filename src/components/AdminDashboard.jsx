import { useState, useEffect } from 'react';
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSignOutAlt,
  FaUpload,
  FaCloudUploadAlt,
  FaUndo,
} from 'react-icons/fa';
import { supabase } from '../supabase';
import { usePortfolio } from '../context/portfolioContext';
import {
  DEFAULT_CERTIFICATIONS,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_EXPERIENCES,
} from '../data/portfolioDefaults';
import {
  uploadAssetFile,
  upsertRecord,
  deleteRecord,
  seedRecords,
  saveSiteSettings,
} from '../utils/adminApi';

const TABS = [
  { id: 'certifications', label: 'Certificates' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experiences', label: 'Experience' },
  { id: 'settings', label: 'Profile & Text' },
];

const EMPTY_CERT = {
  title: '',
  provider: '',
  date: String(new Date().getFullYear()),
  skills: '',
  link: '',
  featured: true,
  sort_order: 0,
};

const EMPTY_PROJECT = {
  title: '',
  description: '',
  techText: '',
  architecture_image: '',
  architecture_alt: '',
  github: '',
  demo: '',
  sort_order: 0,
};

const EMPTY_SKILL = {
  group_name: 'Data engineering',
  name: '',
  sort_order: 0,
};

const EMPTY_EXPERIENCE = {
  role: '',
  organization: '',
  period: '',
  bulletsText: '',
  sort_order: 0,
};

const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-border-subtle text-heading text-sm focus:outline-none focus:border-accent';

const ADMIN_PASS_HASH = '90f2a8d6ef3450a2a333cee9f4bb1e48c3130ccf9f85be863549f70c3a14b2db';
const ADMIN_SESSION_KEY = 'portfolio_admin_unlocked_v1';

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const AdminDashboard = ({ onBack }) => {
  const {
    certifications,
    projects,
    skills,
    experiences,
    settings,
    usingRemote,
    isSupabaseConfigured,
    refreshData,
    savePreviewData,
    resetPreviewData,
  } = usePortfolio();

  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('certifications');
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [certForm, setCertForm] = useState(EMPTY_CERT);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [skillForm, setSkillForm] = useState(EMPTY_SKILL);
  const [expForm, setExpForm] = useState(EMPTY_EXPERIENCE);
  const [settingsDraft, setSettingsDraft] = useState(null);
  const settingsForm = settingsDraft ?? settings;

  const updateSetting = (key, value) => {
    setSettingsDraft((prev) => ({ ...(prev ?? settings), [key]: value }));
  };

  useEffect(() => {
    if (!supabase) return undefined;
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session ?? null);
        setAuthLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const notify = (type, text) => setStatusMsg({ type, text });

  const switchTab = (tabId) => {
    setActiveTab(tabId);
    setEditingId(null);
    setCertForm(EMPTY_CERT);
    setProjectForm(EMPTY_PROJECT);
    setSkillForm(EMPTY_SKILL);
    setExpForm(EMPTY_EXPERIENCE);
    setStatusMsg({ type: '', text: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    notify('', '');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setPassword('');
    } catch (err) {
      notify('error', err.message || 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const handleFileUpload = async (file, folder, onUrl) => {
    if (!file) return;
    if (!isSupabaseConfigured) {
      notify('error', 'File upload requires Supabase Storage. In local preview mode, paste a file URL or path (e.g. /certificates/your-file.pdf).');
      return;
    }
    setBusy(true);
    try {
      const url = await uploadAssetFile(file, folder);
      onUrl(url);
      notify('success', `Uploaded ${file.name}`);
    } catch (err) {
      notify('error', err.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const runAction = async (fn, successMessage) => {
    setBusy(true);
    notify('', '');
    try {
      await fn();
      if (isSupabaseConfigured) {
        await refreshData();
      }
      notify('success', successMessage);
    } catch (err) {
      notify('error', err.message || 'Operation failed.');
    } finally {
      setBusy(false);
    }
  };

  // --- CRUD Handlers ---
  const saveCert = (e) => {
    e.preventDefault();
    const payload = {
      title: certForm.title.trim(),
      provider: certForm.provider.trim(),
      date: certForm.date.trim(),
      skills: certForm.skills.trim(),
      link: certForm.link.trim(),
      featured: Boolean(certForm.featured),
      sort_order: Number(certForm.sort_order) || 0,
    };

    if (isSupabaseConfigured) {
      runAction(async () => {
        await upsertRecord('certifications', payload, editingId);
        setEditingId(null);
        setCertForm(EMPTY_CERT);
      }, editingId ? 'Certificate updated.' : 'Certificate added.');
      return;
    }

    savePreviewData((prev) => {
      const list = editingId
        ? prev.certifications.map((c) => (c.id === editingId ? { ...c, ...payload } : c))
        : [...prev.certifications, { id: `preview-cert-${Date.now()}`, ...payload }];
      return { ...prev, certifications: list };
    });
    setEditingId(null);
    setCertForm(EMPTY_CERT);
    notify('success', editingId ? 'Certificate updated (local preview).' : 'Certificate added (local preview).');
  };

  const removeItem = (table, stateKey, id, label) => {
    if (isSupabaseConfigured) {
      if (String(id).startsWith('default-')) {
        notify('error', `Seed starter ${label} into Supabase first before deleting individual rows.`);
        return;
      }
      runAction(() => deleteRecord(table, id), `${label} deleted.`);
      return;
    }

    savePreviewData((prev) => ({
      ...prev,
      [stateKey]: prev[stateKey].filter((item) => item.id !== id),
    }));
    notify('success', `${label} removed (local preview).`);
  };

  const saveProject = (e) => {
    e.preventDefault();
    const tech = projectForm.techText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      tech,
      architecture_image: projectForm.architecture_image.trim(),
      architecture_alt: projectForm.architecture_alt.trim(),
      github: projectForm.github.trim(),
      demo: projectForm.demo.trim(),
      sort_order: Number(projectForm.sort_order) || 0,
    };

    if (isSupabaseConfigured) {
      runAction(async () => {
        await upsertRecord('projects', payload, editingId);
        setEditingId(null);
        setProjectForm(EMPTY_PROJECT);
      }, editingId ? 'Project updated.' : 'Project added.');
      return;
    }

    savePreviewData((prev) => {
      const list = editingId
        ? prev.projects.map((p) => (p.id === editingId ? { ...p, ...payload } : p))
        : [...prev.projects, { id: `preview-project-${Date.now()}`, ...payload }];
      return { ...prev, projects: list };
    });
    setEditingId(null);
    setProjectForm(EMPTY_PROJECT);
    notify('success', editingId ? 'Project updated (local preview).' : 'Project added (local preview).');
  };

  const saveSkill = (e) => {
    e.preventDefault();
    const payload = {
      group_name: skillForm.group_name.trim(),
      name: skillForm.name.trim(),
      sort_order: Number(skillForm.sort_order) || 0,
    };

    if (isSupabaseConfigured) {
      runAction(async () => {
        await upsertRecord('skills', payload, null);
        setSkillForm((prev) => ({ ...prev, name: '' }));
      }, 'Skill added.');
      return;
    }

    savePreviewData((prev) => ({
      ...prev,
      skills: [...prev.skills, { id: `preview-skill-${Date.now()}`, ...payload }],
    }));
    setSkillForm((prev) => ({ ...prev, name: '' }));
    notify('success', 'Skill added (local preview).');
  };

  const saveExperience = (e) => {
    e.preventDefault();
    const bullets = expForm.bulletsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      role: expForm.role.trim(),
      organization: expForm.organization.trim(),
      period: expForm.period.trim(),
      bullets,
      sort_order: Number(expForm.sort_order) || 0,
    };

    if (isSupabaseConfigured) {
      runAction(async () => {
        await upsertRecord('experiences', payload, editingId);
        setEditingId(null);
        setExpForm(EMPTY_EXPERIENCE);
      }, editingId ? 'Experience updated.' : 'Experience added.');
      return;
    }

    savePreviewData((prev) => {
      const list = editingId
        ? prev.experiences.map((item) => (item.id === editingId ? { ...item, ...payload } : item))
        : [{ id: `preview-exp-${Date.now()}`, ...payload }, ...prev.experiences];
      return { ...prev, experiences: list };
    });
    setEditingId(null);
    setExpForm(EMPTY_EXPERIENCE);
    notify('success', editingId ? 'Experience updated (local preview).' : 'Experience added (local preview).');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (isSupabaseConfigured) {
      runAction(async () => {
        await saveSiteSettings(settingsForm);
        setSettingsDraft(null);
      }, 'Site text updated.');
      return;
    }
    savePreviewData((prev) => ({ ...prev, settings: settingsForm }));
    setSettingsDraft(null);
    notify('success', 'Site text updated (local preview).');
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setPassError('');
    try {
      const hash = await sha256Hex(passcode);
      if (hash === ADMIN_PASS_HASH) {
        try {
          sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
        } catch {
          // Ignore storage restrictions
        }
        setUnlocked(true);
        setPasscode('');
      } else {
        setPassError('Invalid access password.');
      }
    } catch {
      setPassError('Unable to verify password in this browser.');
    }
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // Ignore
    }
    setUnlocked(false);
  };

  // --- Password Gate (always required before showing admin UI) ---
  if (!unlocked) {
    return (
      <main className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="surface-card p-8 w-full max-w-sm">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent mb-6 cursor-pointer"
          >
            <FaArrowLeft aria-hidden="true" />
            <span>Back</span>
          </button>

          <h1 className="text-xl font-bold text-heading mb-2">Access Restricted</h1>
          <p className="text-sm text-muted mb-6">Enter the access password to continue.</p>

          {passError && (
            <p
              role="alert"
              className="mb-4 p-3 rounded-lg text-sm bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
            >
              {passError}
            </p>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label htmlFor="access-password" className="block text-sm font-medium text-heading mb-1">
                Password
              </label>
              <input
                id="access-password"
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={inputCls}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-2.5 text-sm cursor-pointer"
            >
              Unlock
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- Auth Gate when Supabase is configured ---
  if (isSupabaseConfigured && authLoading) {
    return (
      <main className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <p className="text-body">Checking admin session...</p>
      </main>
    );
  }

  if (isSupabaseConfigured && !session) {
    return (
      <main className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="surface-card p-8 w-full max-w-md">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent mb-6 cursor-pointer"
          >
            <FaArrowLeft aria-hidden="true" />
            <span>Back to portfolio</span>
          </button>

          <h1 className="text-2xl font-bold text-heading mb-2">Portfolio Admin</h1>
          <p className="text-sm text-muted mb-6">
            Sign in with your Supabase admin account to manage certificates, projects, skills, and site copy.
          </p>

          {statusMsg.text && (
            <p
              role="alert"
              className="mb-4 p-3 rounded-lg text-sm bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
            >
              {statusMsg.text}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-heading mb-1">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="gowthamrajb.dev@gmail.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-heading mb-1">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-lg bg-accent text-on-accent hover:bg-accent-hover font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {busy ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-body">
      <header className="sticky top-0 z-40 border-b border-border-subtle bg-canvas">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-medium text-heading hover:text-accent cursor-pointer"
            >
              <FaArrowLeft aria-hidden="true" />
              <span>View Portfolio</span>
            </button>
            <h1 className="text-lg font-bold text-heading">Portfolio Admin</h1>
          </div>

          <div className="flex items-center gap-3">
            {!isSupabaseConfigured ? (
              <button
                type="button"
                onClick={() => {
                  resetPreviewData();
                  notify('success', 'Local preview reset to starter data.');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border-subtle text-heading hover:border-accent cursor-pointer"
              >
                <FaUndo aria-hidden="true" />
                <span>Reset preview</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-surface border border-border-subtle text-heading hover:border-accent cursor-pointer"
              >
                <FaSignOutAlt aria-hidden="true" />
                <span>Sign out</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleLock}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border-subtle text-heading hover:border-accent cursor-pointer"
            >
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isSupabaseConfigured && (
          <div className="surface-card p-5 mb-6 border-accent">
            <h2 className="text-base font-bold text-heading mb-1">
              Local Preview Mode (Supabase not connected yet)
            </h2>
            <p className="text-sm text-body leading-relaxed">
              Changes made right now save to this browser&apos;s <code>localStorage</code> so you can test the admin UI.
              To persist changes globally on Vercel: (1) set <code>VITE_SUPABASE_URL</code> and{' '}
              <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code> and Vercel env vars, (2) run{' '}
              <code>supabase_schema.sql</code> in Supabase SQL Editor, and (3) create your admin user in Supabase Auth.
            </p>
          </div>
        )}

        {statusMsg.text && (
          <div
            role="status"
            className={`mb-6 p-3.5 rounded-lg text-sm border ${
              statusMsg.type === 'error'
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25'
                : 'bg-surface text-accent border-accent'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Tabs */}
        <div role="tablist" aria-label="Admin sections" className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 border-b border-border-subtle">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => switchTab(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-accent text-on-accent hover:bg-accent-hover'
                  : 'bg-surface text-body border border-border-subtle hover:border-accent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CERTIFICATES TAB */}
        {activeTab === 'certifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={saveCert} className="surface-card p-6 lg:col-span-5 space-y-4 self-start">
              <h2 className="text-lg font-bold text-heading">
                {editingId ? 'Edit Certificate' : 'Add Certificate'}
              </h2>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Title *</label>
                <input
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. AWS Certified Data Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Provider *</label>
                  <input
                    required
                    value={certForm.provider}
                    onChange={(e) => setCertForm({ ...certForm, provider: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. AWS"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Year / Date *</label>
                  <input
                    required
                    value={certForm.date}
                    onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                    className={inputCls}
                    placeholder="2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Skills covered</label>
                <input
                  value={certForm.skills}
                  onChange={(e) => setCertForm({ ...certForm, skills: e.target.value })}
                  className={inputCls}
                  placeholder="Python, SQL, Cloud"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Certificate File URL or Upload *
                </label>
                <input
                  required
                  value={certForm.link}
                  onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
                  className={inputCls}
                  placeholder="/certificates/file.pdf or https://..."
                />
                <label className="mt-2 inline-flex items-center gap-2 text-xs text-accent hover:underline cursor-pointer">
                  <FaUpload aria-hidden="true" />
                  <span>Upload PDF / image to Supabase Storage</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="sr-only"
                    onChange={(e) =>
                      handleFileUpload(e.target.files?.[0], 'certificates', (url) =>
                        setCertForm((prev) => ({ ...prev, link: url }))
                      )
                    }
                  />
                </label>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-heading cursor-pointer">
                  <input
                    type="checkbox"
                    checked={certForm.featured}
                    onChange={(e) => setCertForm({ ...certForm, featured: e.target.checked })}
                  />
                  <span>Show in Featured section</span>
                </label>

                <div className="w-24">
                  <label className="block text-xs font-medium text-muted mb-1">Order</label>
                  <input
                    type="number"
                    value={certForm.sort_order}
                    onChange={(e) => setCertForm({ ...certForm, sort_order: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-on-accent hover:bg-accent-hover text-sm font-semibold hover:opacity-90 cursor-pointer"
                >
                  <FaPlus aria-hidden="true" />
                  <span>{editingId ? 'Save changes' : 'Add certificate'}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setCertForm(EMPTY_CERT);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-canvas text-heading text-sm border border-border-subtle cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 space-y-4">
              {isSupabaseConfigured && !usingRemote.certifications && (
                <div className="surface-card p-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-body">
                    Using starter certificates. Import them to Supabase to edit or reorder them.
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      runAction(
                        () => seedRecords('certifications', DEFAULT_CERTIFICATIONS),
                        'Starter certificates imported to Supabase.'
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-on-accent hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                  >
                    <FaCloudUploadAlt aria-hidden="true" />
                    <span>Import starter certificates</span>
                  </button>
                </div>
              )}

              {certifications.map((cert) => (
                <div key={cert.id} className="surface-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-accent">
                      {cert.provider} · {cert.date} {cert.featured ? '· Featured' : '· Collapsed'}
                    </p>
                    <h3 className="text-base font-bold text-heading">{cert.title}</h3>
                    <p className="text-xs text-muted truncate max-w-md">{cert.link}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(cert.id);
                        setCertForm({
                          title: cert.title,
                          provider: cert.provider,
                          date: cert.date,
                          skills: cert.skills || '',
                          link: cert.link,
                          featured: Boolean(cert.featured),
                          sort_order: cert.sort_order ?? 0,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas text-heading border border-border-subtle text-xs font-medium hover:border-accent cursor-pointer"
                    >
                      <FaEdit aria-hidden="true" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem('certifications', 'certifications', cert.id, 'Certificate')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-medium cursor-pointer"
                    >
                      <FaTrash aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={saveProject} className="surface-card p-6 lg:col-span-5 space-y-4 self-start">
              <h2 className="text-lg font-bold text-heading">
                {editingId ? 'Edit Project' : 'Add Project'}
              </h2>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Project Title *</label>
                <input
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Tech tags (comma separated)
                </label>
                <input
                  value={projectForm.techText}
                  onChange={(e) => setProjectForm({ ...projectForm, techText: e.target.value })}
                  className={inputCls}
                  placeholder="AWS S3, Glue, Athena, Power BI"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Architecture Diagram / Image URL
                </label>
                <input
                  value={projectForm.architecture_image}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, architecture_image: e.target.value })
                  }
                  className={inputCls}
                  placeholder="/diagram.png or https://..."
                />
                <label className="mt-2 inline-flex items-center gap-2 text-xs text-accent hover:underline cursor-pointer">
                  <FaUpload aria-hidden="true" />
                  <span>Upload diagram image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) =>
                      handleFileUpload(e.target.files?.[0], 'projects', (url) =>
                        setProjectForm((prev) => ({ ...prev, architecture_image: url }))
                      )
                    }
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">GitHub URL</label>
                  <input
                    value={projectForm.github}
                    onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Live Demo URL</label>
                  <input
                    value={projectForm.demo}
                    onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-on-accent hover:bg-accent-hover text-sm font-semibold hover:opacity-90 cursor-pointer"
                >
                  <FaPlus aria-hidden="true" />
                  <span>{editingId ? 'Save project' : 'Add project'}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setProjectForm(EMPTY_PROJECT);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-canvas text-heading text-sm border border-border-subtle cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 space-y-4">
              {isSupabaseConfigured && !usingRemote.projects && (
                <div className="surface-card p-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-body">
                    Using starter project. Import it to Supabase to manage it here.
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      runAction(
                        () => seedRecords('projects', DEFAULT_PROJECTS),
                        'Starter project imported to Supabase.'
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-on-accent hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                  >
                    <FaCloudUploadAlt aria-hidden="true" />
                    <span>Import starter project</span>
                  </button>
                </div>
              )}

              {projects.map((proj) => (
                <div key={proj.id} className="surface-card p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-heading">{proj.title}</h3>
                    <p className="text-xs text-muted mt-1 line-clamp-2">{proj.description}</p>
                    <p className="text-xs text-accent mt-2">
                      {Array.isArray(proj.tech) ? proj.tech.join(' · ') : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(proj.id);
                        setProjectForm({
                          title: proj.title,
                          description: proj.description,
                          techText: Array.isArray(proj.tech) ? proj.tech.join(', ') : '',
                          architecture_image: proj.architecture_image || '',
                          architecture_alt: proj.architecture_alt || '',
                          github: proj.github || '',
                          demo: proj.demo || '',
                          sort_order: proj.sort_order ?? 0,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas text-heading border border-border-subtle text-xs font-medium cursor-pointer"
                    >
                      <FaEdit aria-hidden="true" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem('projects', 'projects', proj.id, 'Project')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-medium cursor-pointer"
                    >
                      <FaTrash aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={saveSkill} className="surface-card p-6 lg:col-span-4 space-y-4 self-start">
              <h2 className="text-lg font-bold text-heading">Add Skill</h2>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Group *</label>
                <input
                  required
                  list="skill-groups"
                  value={skillForm.group_name}
                  onChange={(e) => setSkillForm({ ...skillForm, group_name: e.target.value })}
                  className={inputCls}
                />
                <datalist id="skill-groups">
                  <option value="Programming" />
                  <option value="Backend & Databases" />
                  <option value="Frontend" />
                  <option value="Data Analysis & Visualization" />
                  <option value="Tools & Practices" />
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Skill Name *</label>
                <input
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. dbt, Snowflake, Docker"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-on-accent hover:bg-accent-hover text-sm font-semibold hover:opacity-90 cursor-pointer"
              >
                <FaPlus aria-hidden="true" />
                <span>Add skill</span>
              </button>
            </form>

            <div className="lg:col-span-8 space-y-4">
              {isSupabaseConfigured && !usingRemote.skills && (
                <div className="surface-card p-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-body">
                    Using starter skills. Import them to Supabase to manage them here.
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      runAction(() => seedRecords('skills', DEFAULT_SKILLS), 'Starter skills imported.')
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-on-accent hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                  >
                    <FaCloudUploadAlt aria-hidden="true" />
                    <span>Import starter skills</span>
                  </button>
                </div>
              )}

              <div className="surface-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-canvas border border-border-subtle"
                  >
                    <div>
                      <p className="text-sm font-semibold text-heading">{skill.name}</p>
                      <p className="text-xs text-muted">{skill.group_name}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Delete ${skill.name}`}
                      onClick={() => removeItem('skills', 'skills', skill.id, 'Skill')}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-md cursor-pointer"
                    >
                      <FaTrash className="text-xs" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === 'experiences' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={saveExperience} className="surface-card p-6 lg:col-span-5 space-y-4 self-start">
              <h2 className="text-lg font-bold text-heading">
                {editingId ? 'Edit Experience' : 'Add Experience'}
              </h2>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Role *</label>
                <input
                  required
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Organization *</label>
                  <input
                    required
                    value={expForm.organization}
                    onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Period *</label>
                  <input
                    required
                    value={expForm.period}
                    onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    className={inputCls}
                    placeholder="Jan–Mar 2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Bullet points (one per line)
                </label>
                <textarea
                  rows={5}
                  value={expForm.bulletsText}
                  onChange={(e) => setExpForm({ ...expForm, bulletsText: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-on-accent hover:bg-accent-hover text-sm font-semibold hover:opacity-90 cursor-pointer"
                >
                  <FaPlus aria-hidden="true" />
                  <span>{editingId ? 'Save experience' : 'Add experience'}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setExpForm(EMPTY_EXPERIENCE);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-canvas text-heading text-sm border border-border-subtle cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="lg:col-span-7 space-y-4">
              {isSupabaseConfigured && !usingRemote.experiences && (
                <div className="surface-card p-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-body">
                    Using starter experiences. Import them to Supabase to edit them here.
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      runAction(
                        () => seedRecords('experiences', DEFAULT_EXPERIENCES),
                        'Starter experiences imported.'
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-on-accent hover:bg-accent-hover text-xs font-semibold cursor-pointer"
                  >
                    <FaCloudUploadAlt aria-hidden="true" />
                    <span>Import starter experiences</span>
                  </button>
                </div>
              )}

              {experiences.map((exp) => (
                <div key={exp.id} className="surface-card p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-heading">{exp.role}</h3>
                    <p className="text-xs text-accent font-medium">
                      {exp.organization} · {exp.period}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(exp.id);
                        setExpForm({
                          role: exp.role,
                          organization: exp.organization,
                          period: exp.period,
                          bulletsText: Array.isArray(exp.bullets) ? exp.bullets.join('\n') : '',
                          sort_order: exp.sort_order ?? 0,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas text-heading border border-border-subtle text-xs font-medium cursor-pointer"
                    >
                      <FaEdit aria-hidden="true" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem('experiences', 'experiences', exp.id, 'Experience')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-medium cursor-pointer"
                    >
                      <FaTrash aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SITE TEXT TAB */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="surface-card p-6 max-w-3xl space-y-4">
            <h2 className="text-lg font-bold text-heading">Profile, Links &amp; Site Text</h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-canvas border border-border-subtle">
              <img
                src={settingsForm.profile_image_url || '/profile.png'}
                alt="Current profile preview"
                className="w-20 h-20 rounded-full object-cover object-top border border-border-subtle shrink-0"
              />
              <div className="flex-1 space-y-2">
                <label className="block text-xs font-medium text-muted">Profile Photo URL</label>
                <input
                  value={settingsForm.profile_image_url || ''}
                  onChange={(e) => updateSetting('profile_image_url', e.target.value)}
                  className={inputCls}
                  placeholder="/profile.png or https://..."
                />
                <label className="inline-flex items-center gap-2 text-xs text-accent hover:underline cursor-pointer">
                  <FaUpload aria-hidden="true" />
                  <span>Upload new profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) =>
                      handleFileUpload(e.target.files?.[0], 'profile', (url) =>
                        updateSetting('profile_image_url', url)
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Hero Badge</label>
                <input
                  value={settingsForm.hero_badge || ''}
                  onChange={(e) => updateSetting('hero_badge', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Hero Name</label>
                <input
                  value={settingsForm.hero_name || ''}
                  onChange={(e) => updateSetting('hero_name', e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Hero Subtitle</label>
              <input
                value={settingsForm.hero_subtitle || ''}
                onChange={(e) => updateSetting('hero_subtitle', e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Hero Bio</label>
              <textarea
                rows={3}
                value={settingsForm.hero_bio || ''}
                onChange={(e) => updateSetting('hero_bio', e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Résumé PDF URL</label>
              <input
                value={settingsForm.resume_url || ''}
                onChange={(e) => updateSetting('resume_url', e.target.value)}
                className={inputCls}
              />
              <label className="mt-2 inline-flex items-center gap-2 text-xs text-accent hover:underline cursor-pointer">
                <FaUpload aria-hidden="true" />
                <span>Upload updated résumé PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={(e) =>
                    handleFileUpload(e.target.files?.[0], 'resume', (url) =>
                      updateSetting('resume_url', url)
                    )
                  }
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1">Contact Copy</label>
              <textarea
                rows={2}
                value={settingsForm.contact_copy || ''}
                onChange={(e) => updateSetting('contact_copy', e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Email</label>
                <input
                  value={settingsForm.contact_email || ''}
                  onChange={(e) => updateSetting('contact_email', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">GitHub URL</label>
                <input
                  value={settingsForm.github_url || ''}
                  onChange={(e) => updateSetting('github_url', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">LinkedIn URL</label>
                <input
                  value={settingsForm.linkedin_url || ''}
                  onChange={(e) => updateSetting('linkedin_url', e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="px-6 py-2.5 rounded-lg bg-accent text-on-accent hover:bg-accent-hover text-sm font-semibold hover:opacity-90 cursor-pointer"
            >
              Save site text
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
