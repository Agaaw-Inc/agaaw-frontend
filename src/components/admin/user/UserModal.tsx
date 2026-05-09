"use client";

/**
 * User Detail Modal
 *
 * Displays detailed information about a single user.
 * Fetches full user detail from GET /api/admin/users/:id.
 * Shows OAuth accounts, profiles (mentor/student/admin), and counts.
 *
 * Note: This replaces the old create/edit UserModal.
 * Admins don't create users — users self-register.
 */

import { useState, useEffect } from "react";
import { X, Loader2, ShieldCheck, ShieldOff, Ban } from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import type { UserDetail } from "@/lib/adminTypes";

interface UserDetailModalProps {
  userId: string;
  onClose: () => void;
}

export default function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        setIsLoading(true);
        const data = await adminApi.getUserDetail(userId);
        if (!cancelled) setUser(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-teal-700 to-teal-600 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">User Detail</h2>
            <p className="text-teal-100 text-sm mt-0.5">Full profile information</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm text-center py-8">{error}</p>
          ) : user ? (
            <div className="space-y-5">
              {/* Basic info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-bold text-lg">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (user.firstName?.[0] || "U").toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{user.role}</span>
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs"><ShieldCheck size={12} /> Verified</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-xs"><ShieldOff size={12} /> Unverified</span>
                    )}
                    {user.isBanned && <span className="inline-flex items-center gap-1 text-red-600 text-xs"><Ban size={12} /> Banned</span>}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <InfoRow label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
              <InfoRow label="Updated" value={new Date(user.updatedAt).toLocaleDateString()} />

              {/* Counts */}
              <div className="grid grid-cols-2 gap-3">
                <CountCard label="Sessions" count={user._count.sessions} />
                <CountCard label="OAuth Accounts" count={user._count.oauthAccounts} />
                <CountCard label="Blogs" count={user._count.blogs} />
                <CountCard label="Saved Items" count={user._count.savedItems} />
              </div>

              {/* OAuth Accounts */}
              {user.oauthAccounts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">OAuth Accounts</h4>
                  <div className="space-y-1">
                    {user.oauthAccounts.map((oa, i) => (
                      <div key={i} className="text-sm text-gray-600 flex justify-between">
                        <span className="capitalize">{oa.provider}</span>
                        <span className="text-gray-400 text-xs">{new Date(oa.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentor profile */}
              {user.mentorProfile && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mentor Profile</h4>
                  <InfoRow label="Approved" value={user.mentorProfile.isApproved ? "Yes" : "No"} />
                  <InfoRow label="Available" value={user.mentorProfile.isAvailable ? "Yes" : "No"} />
                  {user.mentorProfile.currentUniversity && <InfoRow label="University" value={user.mentorProfile.currentUniversity} />}
                </div>
              )}

              {/* Student profile */}
              {user.studentProfile && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Student Profile</h4>
                  {user.studentProfile.studyLevel && <InfoRow label="Study Level" value={user.studentProfile.studyLevel} />}
                  {user.studentProfile.nationality && <InfoRow label="Nationality" value={user.studentProfile.nationality} />}
                </div>
              )}

              {/* Admin profile */}
              {user.adminProfile && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Admin Profile</h4>
                  <InfoRow label="Admin Role" value={user.adminProfile.adminRole.replace("_", " ")} />
                  <InfoRow label="Active" value={user.adminProfile.isActive ? "Yes" : "No"} />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}

function CountCard({ label, count }: { label: string; count: number }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-lg font-bold text-gray-900">{count}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
