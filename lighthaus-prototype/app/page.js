"use client";

import { useState, useRef, useEffect } from "react";

const OPENING_MESSAGE =
  "Hi, I'm Lighthaus. Tell me about the wedding you're picturing — whatever comes to mind first is exactly the right place to start.";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "Something went wrong.";
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Something went wrong reaching the server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <main
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "32px 20px 24px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "#a98f6b" }}>
          Lighthaus
        </div>
        <div style={{ fontSize: 12, color: "#9a8f80", marginTop: 4 }}>
          early prototype — just the first conversation
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              background: m.role === "user" ? "#2b2621" : "#fff",
              color: m.role === "user" ? "#faf6f0" : "#2b2621",
              padding: "12px 16px",
              borderRadius: 16,
              borderBottomRightRadius: m.role === "user" ? 4 : 16,
              borderBottomLeftRadius: m.role === "assistant" ? 4 : 16,
              lineHeight: 1.5,
              boxShadow: m.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              color: "#9a8f80",
              fontStyle: "italic",
              padding: "0 4px",
            }}
          >
            thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 20,
          borderTop: "1px solid #e8ddcc",
          paddingTop: 16,
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type here..."
          rows={1}
          style={{
            flex: 1,
            resize: "none",
            fontFamily: "inherit",
            fontSize: 15,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #d9cdb8",
            background: "#fff",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{
            border: "none",
            borderRadius: 12,
            padding: "0 20px",
            background: "#2b2621",
            color: "#faf6f0",
            fontSize: 15,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}
