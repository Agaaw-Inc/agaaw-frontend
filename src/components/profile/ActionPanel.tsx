"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  DollarSign,
  Clock,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import type { Conversation } from "@/data/profileTypes";

interface ActionPanelProps {
  conversation: Conversation;
  currentUserRole: "mentor" | "student";
}

export default function ActionPanel({ conversation, currentUserRole }: ActionPanelProps) {
  const [status, setStatus] = useState(conversation.status);

  const statusConfig = {
    pending: {
      label: "Pending",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
    },
    accepted: {
      label: "Accepted",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    "in-progress": {
      label: "In Progress",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Sparkles,
    },
    completed: {
      label: "Completed",
      color: "bg-gray-50 text-gray-600 border-gray-200",
      icon: CheckCircle2,
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-50 text-red-600 border-red-200",
      icon: XCircle,
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      {/* Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
          Status
        </h3>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold ${currentStatus.color}`}
        >
          <StatusIcon size={14} />
          {currentStatus.label}
        </div>
      </div>

      {/* Proposal details */}
      {conversation.proposalTitle && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            📋 Proposal Details
          </h3>
          <p className="text-sm font-medium text-gray-800 mb-1">
            {conversation.proposalTitle}
          </p>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            {conversation.proposalDescription}
          </p>
          {conversation.proposalPrice && (
            <div className="flex items-center gap-1.5 text-lg font-bold text-teal-700">
              <DollarSign size={18} />
              {conversation.proposalPrice}
              <span className="text-xs font-normal text-gray-400 ml-1">USD</span>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-2">
        {status === "pending" && currentUserRole === "student" && (
          <>
            <button
              onClick={() => setStatus("accepted")}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle2 size={16} />
              Accept Proposal
            </button>
            <button
              onClick={() => setStatus("rejected")}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 font-semibold text-sm rounded-xl hover:bg-red-50 transition-colors"
            >
              <XCircle size={16} />
              Decline
            </button>
          </>
        )}

        {status === "pending" && currentUserRole === "mentor" && (
          <div className="text-center py-2">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <AlertCircle size={12} />
              Waiting for student response...
            </p>
          </div>
        )}

        {status === "accepted" && (
          <button
            onClick={() => setStatus("in-progress")}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 transition-colors"
          >
            <Sparkles size={16} />
            Start Session
          </button>
        )}

        {status === "in-progress" && (
          <button
            onClick={() => setStatus("completed")}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 text-white font-semibold text-sm rounded-xl hover:bg-gray-900 transition-colors"
          >
            <CheckCircle2 size={16} />
            Mark as Complete
          </button>
        )}

        {/* Document request (always available) */}
        {status !== "completed" && status !== "rejected" && (
          <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-50 transition-colors">
            <FileText size={16} />
            Request Document
          </button>
        )}
      </div>
    </div>
  );
}
