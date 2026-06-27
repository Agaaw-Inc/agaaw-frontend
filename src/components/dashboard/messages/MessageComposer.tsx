import { ImageIcon, Paperclip, Plus, SendHorizontal, Smile } from "lucide-react";

interface MessageComposerProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}

export default function MessageComposer({ draft, onDraftChange, onSend }: MessageComposerProps) {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end gap-3 rounded-xl border border-slate-300 bg-slate-50 p-2 shadow-sm transition focus-within:border-[#20B2AA] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#20B2AA]/15">
          <button
            type="button"
            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900"
            aria-label="Add more message options"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="mb-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-900 sm:flex"
            aria-label="Add emoji"
          >
            <Smile className="h-5 w-5" />
          </button>
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            rows={1}
            placeholder="Type your message..."
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2.5 text-base leading-6 text-slate-900 outline-none placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!draft.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0F766E] text-white shadow-sm transition hover:-translate-y-px hover:bg-[#0B625C] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:translate-y-0"
            aria-label="Send message"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-5">
            <button type="button" className="inline-flex items-center gap-2 transition hover:text-slate-900">
              <Paperclip className="h-4 w-4" />
              Attach File
            </button>
            <button type="button" className="inline-flex items-center gap-2 transition hover:text-slate-900">
              <ImageIcon className="h-4 w-4" />
              Image
            </button>
          </div>
          <p className="text-slate-400">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </footer>
  );
}
