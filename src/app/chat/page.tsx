"use client";
import { useState, useEffect } from "react";
import ChatLayout from "@/components/chat/ChatLayout";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import WelcomeState from "@/components/chat/WelcomeState";
import { PreviewPaywall } from "@/components/chat/PreviewPaywall";
import {
  isPreviewMode,
  hasReachedPreviewLimit,
  incrementPreviewMessageCount,
  getRemainingPreviewMessages,
  PREVIEW_LIMIT,
} from "@/lib/previewMode";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inPreviewMode, setInPreviewMode] = useState(false);
  const [previewLimitReached, setPreviewLimitReached] = useState(false);

  // Initialize preview mode on mount
  useEffect(() => {
    setInPreviewMode(isPreviewMode());
    setPreviewLimitReached(hasReachedPreviewLimit());
  }, []);

  async function handleSend(text: string) {
    // If preview limit reached, don't allow more messages
    if (inPreviewMode && hasReachedPreviewLimit()) {
      setPreviewLimitReached(true);
      return;
    }

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, timestamp: time },
    ]);

    // Increment preview message count if in preview mode
    if (inPreviewMode) {
      incrementPreviewMessageCount();
    }

    setIsTyping(true);

    try {
        const { apiRequest } = await import("@/lib/api");
        const resp = await apiRequest("/generate_reply", "POST", { message: text }, true);
        console.log("generate_reply response:", resp);

        const data = resp.data;

        if (resp.status === 200 && data && data.status === "LIMIT_REACHED") {
          setPreviewLimitReached(true);
          return;
        }

      function extractReply(d: unknown): string | undefined {
        if (!d || typeof d !== 'object') return undefined;
        const obj = d as Record<string, unknown>;
        if (typeof obj.reply === 'string') return obj.reply;
        if (typeof obj.assistant_reply === 'string') return obj.assistant_reply;
        if (obj.data && typeof obj.data === 'object') {
          const nested = obj.data as Record<string, unknown>;
          if (typeof nested.reply === 'string') return nested.reply;
        }
        if (typeof d === 'string') return d;
        return undefined;
      }

      const reply = extractReply(data) ?? "Thanks! We’ll get back to you shortly.";

      // If Xano returns lead classification, keep it for later (no UI yet)
      if (data && typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        if ('lead_type' in obj) {
          console.log('Lead type:', obj['lead_type']);
        }
      }

      const responseTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          timestamp: responseTime,
        },
      ]);

      // Check if limit reached after response
      if (inPreviewMode && hasReachedPreviewLimit()) {
        setPreviewLimitReached(true);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  // Show preview paywall if limit reached
  if (previewLimitReached) {
    return <PreviewPaywall />;
  }

  return (
    <ChatLayout>
      <ChatHeader 
        title={inPreviewMode ? "Preview Mode - Official Assistant" : "Official Assistant"}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {/* Preview Mode Banner */}
        {inPreviewMode && (
          <div
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "16px",
              color: "#d1d1d6",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            📊 Preview Mode: {getRemainingPreviewMessages()} / {PREVIEW_LIMIT} messages remaining
          </div>
        )}
        {messages.length === 0 && <WelcomeState />}

        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {!previewLimitReached && <ChatInput onSend={handleSend} />}
    </ChatLayout>
  );
}

