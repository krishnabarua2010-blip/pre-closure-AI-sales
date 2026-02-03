"use client";
import { useState } from "react";
import ChatLayout from "@/components/chat/ChatLayout";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import WelcomeState from "@/components/chat/WelcomeState";
import { sendMessageToBackend } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  async function handleSend(text: string) {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, timestamp: time },
    ]);

    setIsTyping(true);

    try {
      const data = await sendMessageToBackend(text);

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

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
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

  return (
    <ChatLayout>
      <ChatHeader title="Official Assistant" />

      <div className="flex-1 overflow-y-auto p-4">
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

      <ChatInput onSend={handleSend} />
    </ChatLayout>
  );
}

