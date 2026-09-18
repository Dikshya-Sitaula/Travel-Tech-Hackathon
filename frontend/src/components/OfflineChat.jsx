import React, { useEffect, useRef, useState } from "react";
import { Send, WifiOff, Wifi, Loader2, Cpu } from "lucide-react";
import { askOfflineAgent, checkOfflineStatus } from "../services/offlineLlmService";

const STATUS_POLL_MS = 8000;

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! I'm Wayfinder Nepal, running fully on this device. Ask me about Kathmandu, Pokhara, treks, buses, food, or permits — even with no internet.",
};

export default function OfflineChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ serverUp: false, modelReady: false });
  const scrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const result = await checkOfflineStatus();
      if (!cancelled) setStatus(result);
    }

    poll();
    const interval = setInterval(poll, STATUS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const history = nextMessages.filter(
        (m, idx) => idx > 0 && !m.isError && (m.role === "user" || m.role === "assistant")
      );
      history.pop();
      const reply = await askOfflineAgent(trimmed, { history });
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${err.message || "Couldn't reach the local model."}`,
          isError: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  const isOnline = status.serverUp && status.modelReady;

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[75vh]">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-brand-600" />
            Offline AI Assistant
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Runs locally via Gemma 2B (Ollama) as Wayfinder Nepal — works without internet.
          </p>
        </div>

        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
            isOnline
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {isOnline ? "Local model ready" : "Local model offline"}
        </div>
      </header>

      {!isOnline && (
        <div className="mb-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          Ollama isn't reachable at <code className="font-mono">localhost:11434</code>, or the{" "}
          <code className="font-mono">gemma-offline</code> model isn't built yet. Run{" "}
          <code className="font-mono">ollama serve</code> and{" "}
          <code className="font-mono">bash ./models/build_offline.sh</code>.
        </div>
      )}

      <div
        ref={scrollRef}
        className="chat-scroll flex-1 overflow-y-auto bg-white rounded-2xl border border-slate-200 p-4 space-y-3"
      >
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} role={msg.role} content={msg.content} isError={msg.isError} />
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-slate-400 text-sm pl-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Thinking locally…
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a quick travel question…"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="inline-flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

function ChatBubble({ role, content, isError }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-brand-600 text-white rounded-br-sm"
            : isError
            ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-sm"
            : "bg-slate-100 text-slate-800 rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
