"use client";

import { useState } from "react";
import {
  Globe2,
  Users,
  Mail,
  ShieldCheck,
  Palette,
  Bell,
  Save,
  CheckCircle2,
} from "lucide-react";

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ onHide }: { onHide: () => void }) {
  setTimeout(onHide, 2500);
  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2">
      <CheckCircle2 size={16} className="text-emerald-400" />
      Settings saved successfully!
    </div>
  );
}

/* ─── Section wrapper ────────────────────────────────────────── */
function Section({ title, description, children, onSave }: { title: string; description: string; children: React.ReactNode; onSave: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="p-6 space-y-5">{children}</div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 px-5 py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium"
        >
          <Save size={15} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ─── Form controls ──────────────────────────────────────────── */
function TextField({ label, hint, value, onChange, type = "text", placeholder = "" }: { label: string; hint?: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

function SelectField({ label, hint, value, onChange, options }: { label: string; hint?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
      </label>
    </div>
  );
}

function NumberField({ label, hint, value, onChange, min = 0, max }: { label: string; hint?: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

/* ─── Tab definitions ────────────────────────────────────────── */
const TABS = [
  { key: "general",       label: "General",         icon: Globe2 },
  { key: "users",         label: "User Management", icon: Users },
  { key: "email",         label: "Email",           icon: Mail },
  { key: "security",      label: "Security",        icon: ShieldCheck },
  { key: "appearance",    label: "Appearance",      icon: Palette },
  { key: "notifications", label: "Notifications",   icon: Bell },
] as const;

type TabKey = typeof TABS[number]["key"];

/* ─── Main Settings Page ─────────────────────────────────────── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [toast, setToast] = useState(false);
  const showToast = () => setToast(true);

  /* ── General ── */
  const [general, setGeneral] = useState({
    siteName: "Agaaw",
    siteTagline: "Your global scholarship companion",
    contactEmail: "admin@agaaw.com",
    logoUrl: "",
    maintenanceMode: false,
  });

  /* ── User Management ── */
  const [userSettings, setUserSettings] = useState({
    defaultRole: "student",
    allowSelfRegistration: true,
    requireEmailVerification: true,
    maxLoginAttempts: 5,
  });

  /* ── Email ── */
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.mailgun.org",
    smtpPort: "587",
    senderName: "Agaaw Platform",
    senderEmail: "noreply@agaaw.com",
    emailVerificationEnabled: true,
  });

  /* ── Security ── */
  const [security, setSecurity] = useState({
    sessionTimeout: 60,
    forceHttps: true,
    twoFactorEnabled: false,
    passwordMinLength: 8,
  });

  /* ── Appearance ── */
  const [appearance, setAppearance] = useState({
    primaryColor: "#0f766e",
    darkModeDefault: false,
    fontChoice: "inter",
  });

  /* ── Notifications ── */
  const [notifications, setNotifications] = useState({
    notifyOnSignup: true,
    notifyOnApplication: true,
    notificationEmail: "admin@agaaw.com",
    weeklyDigest: false,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your platform configuration and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar tabs ── */}
        <aside className="lg:w-56 shrink-0">
          <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-1 sticky top-4">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                id={`settings-tab-${key}`}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === key
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={16} className={activeTab === key ? "text-teal-600" : "text-gray-400"} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Tab content ── */}
        <div className="flex-1 min-w-0">
          {/* ── GENERAL ── */}
          {activeTab === "general" && (
            <Section title="General Settings" description="Basic information and configuration for the platform" onSave={showToast}>
              <TextField label="Site Name" value={general.siteName} onChange={(v) => setGeneral({ ...general, siteName: v })} placeholder="Agaaw" />
              <TextField label="Site Tagline" value={general.siteTagline} onChange={(v) => setGeneral({ ...general, siteTagline: v })} placeholder="Your global scholarship companion" />
              <TextField label="Contact Email" type="email" value={general.contactEmail} onChange={(v) => setGeneral({ ...general, contactEmail: v })} placeholder="admin@agaaw.com" />
              <TextField label="Logo URL" hint="Link to your site logo image" value={general.logoUrl} onChange={(v) => setGeneral({ ...general, logoUrl: v })} placeholder="https://example.com/logo.png" />
              <div className="border-t border-gray-100 pt-4">
                <ToggleField
                  label="Maintenance Mode"
                  description="When enabled, the site will show a maintenance page to all visitors except admins"
                  checked={general.maintenanceMode}
                  onChange={(v) => setGeneral({ ...general, maintenanceMode: v })}
                />
              </div>
            </Section>
          )}

          {/* ── USER MANAGEMENT ── */}
          {activeTab === "users" && (
            <Section title="User Management" description="Control how users register and access the platform" onSave={showToast}>
              <SelectField
                label="Default Role for New Signups"
                hint="Role assigned when a user registers online"
                value={userSettings.defaultRole}
                onChange={(v) => setUserSettings({ ...userSettings, defaultRole: v })}
                options={[
                  { value: "student", label: "Student" },
                  { value: "mentor", label: "Mentor" },
                ]}
              />
              <NumberField
                label="Max Login Attempts"
                hint="Number of failed attempts before account is temporarily locked"
                value={userSettings.maxLoginAttempts}
                onChange={(v) => setUserSettings({ ...userSettings, maxLoginAttempts: v })}
                min={1}
                max={20}
              />
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <ToggleField
                  label="Allow Self-Registration"
                  description="Users can sign up themselves on the public site"
                  checked={userSettings.allowSelfRegistration}
                  onChange={(v) => setUserSettings({ ...userSettings, allowSelfRegistration: v })}
                />
                <ToggleField
                  label="Require Email Verification"
                  description="New accounts must verify their email before gaining access"
                  checked={userSettings.requireEmailVerification}
                  onChange={(v) => setUserSettings({ ...userSettings, requireEmailVerification: v })}
                />
              </div>
            </Section>
          )}

          {/* ── EMAIL ── */}
          {activeTab === "email" && (
            <Section title="Email Configuration" description="Configure how transactional emails are sent" onSave={showToast}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField label="SMTP Host" value={emailSettings.smtpHost} onChange={(v) => setEmailSettings({ ...emailSettings, smtpHost: v })} placeholder="smtp.mailgun.org" />
                <TextField label="SMTP Port" value={emailSettings.smtpPort} onChange={(v) => setEmailSettings({ ...emailSettings, smtpPort: v })} placeholder="587" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField label="Sender Name" value={emailSettings.senderName} onChange={(v) => setEmailSettings({ ...emailSettings, senderName: v })} placeholder="Agaaw Platform" />
                <TextField label="Sender Email" type="email" value={emailSettings.senderEmail} onChange={(v) => setEmailSettings({ ...emailSettings, senderEmail: v })} placeholder="noreply@agaaw.com" />
              </div>
              <div className="border-t border-gray-100 pt-4">
                <ToggleField
                  label="Email Verification Emails"
                  description="Send a verification email to new users upon registration"
                  checked={emailSettings.emailVerificationEnabled}
                  onChange={(v) => setEmailSettings({ ...emailSettings, emailVerificationEnabled: v })}
                />
              </div>
            </Section>
          )}

          {/* ── SECURITY ── */}
          {activeTab === "security" && (
            <Section title="Security" description="Configure authentication and session security settings" onSave={showToast}>
              <NumberField
                label="Session Timeout (minutes)"
                hint="How long before an idle session is automatically logged out"
                value={security.sessionTimeout}
                onChange={(v) => setSecurity({ ...security, sessionTimeout: v })}
                min={5}
                max={1440}
              />
              <NumberField
                label="Minimum Password Length"
                hint="Minimum number of characters required for user passwords"
                value={security.passwordMinLength}
                onChange={(v) => setSecurity({ ...security, passwordMinLength: v })}
                min={6}
                max={32}
              />
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <ToggleField
                  label="Force HTTPS"
                  description="Redirect all HTTP traffic to HTTPS"
                  checked={security.forceHttps}
                  onChange={(v) => setSecurity({ ...security, forceHttps: v })}
                />
                <ToggleField
                  label="Two-Factor Authentication (2FA)"
                  description="Require 2FA for all admin accounts"
                  checked={security.twoFactorEnabled}
                  onChange={(v) => setSecurity({ ...security, twoFactorEnabled: v })}
                />
              </div>
            </Section>
          )}

          {/* ── APPEARANCE ── */}
          {activeTab === "appearance" && (
            <Section title="Appearance" description="Customize the look and feel of the platform" onSave={showToast}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Color</label>
                <p className="text-xs text-gray-400 mb-2">Used for buttons, links, and accents across the site</p>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={appearance.primaryColor}
                    onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-xl cursor-pointer border border-gray-200 p-1"
                  />
                  <input
                    type="text"
                    value={appearance.primaryColor}
                    onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-36"
                    placeholder="#0f766e"
                  />
                  <div
                    className="w-10 h-10 rounded-xl shadow-sm border border-gray-100"
                    style={{ backgroundColor: appearance.primaryColor }}
                  />
                </div>
              </div>

              <SelectField
                label="Default Font"
                value={appearance.fontChoice}
                onChange={(v) => setAppearance({ ...appearance, fontChoice: v })}
                options={[
                  { value: "inter", label: "Inter (default)" },
                  { value: "roboto", label: "Roboto" },
                  { value: "outfit", label: "Outfit" },
                  { value: "poppins", label: "Poppins" },
                ]}
              />

              <div className="border-t border-gray-100 pt-4">
                <ToggleField
                  label="Dark Mode as Default"
                  description="Users will see dark mode by default when they first visit"
                  checked={appearance.darkModeDefault}
                  onChange={(v) => setAppearance({ ...appearance, darkModeDefault: v })}
                />
              </div>
            </Section>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "notifications" && (
            <Section title="Notifications" description="Choose when and how you receive admin notifications" onSave={showToast}>
              <TextField
                label="Admin Notification Email"
                hint="This address receives all platform notification emails"
                type="email"
                value={notifications.notificationEmail}
                onChange={(v) => setNotifications({ ...notifications, notificationEmail: v })}
                placeholder="admin@agaaw.com"
              />
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <ToggleField
                  label="New User Signup"
                  description="Send an email when a new user registers on the platform"
                  checked={notifications.notifyOnSignup}
                  onChange={(v) => setNotifications({ ...notifications, notifyOnSignup: v })}
                />
                <ToggleField
                  label="New Scholarship Application"
                  description="Notify when a student applies for a scholarship"
                  checked={notifications.notifyOnApplication}
                  onChange={(v) => setNotifications({ ...notifications, notifyOnApplication: v })}
                />
                <ToggleField
                  label="Weekly Activity Digest"
                  description="Receive a weekly summary of platform activity every Monday"
                  checked={notifications.weeklyDigest}
                  onChange={(v) => setNotifications({ ...notifications, weeklyDigest: v })}
                />
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast onHide={() => setToast(false)} />}
    </div>
  );
}
