// app/chat/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
  imageUrl?: string;
  isPrompt?: boolean;
}

export default function ChatPage() {
  const [chat, setChat] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input.trim() };
    const updatedChat = [...chat, userMessage];
    setChat(updatedChat);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedChat.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
          confirmPrompt: true,
        }),
      });

      const data = await res.json();
      const botMessage: Message = { sender: "bot", text: data.reply };
      setChat((prev) => [...prev, botMessage]);

      // If API returns a proposed prompt, ask for confirmation
      if (data.isPrompt) {
        setPendingPrompt(data.reply);
        const confirmMsg: Message = {
          sender: "bot",
          text: "Would you like me to generate this as a tattoo image?",
        };
        setChat((prev) => [...prev, confirmMsg]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChat((prev) => [...prev, { sender: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  async function confirmPromptGeneration() {
    if (!pendingPrompt) return;
    setLoading(true);
    const confirmMessage: Message = { sender: "user", text: "Yes, generate the image." };
    setChat((prev) => [...prev, confirmMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [],
          prompt: pendingPrompt,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        const imageMessage: Message = {
          sender: "bot",
          text: "Here is your generated tattoo image:",
          imageUrl: data.imageUrl,
        };
        setChat((prev) => [...prev, imageMessage]);
      } else {
        setChat((prev) => [...prev, { sender: "bot", text: data.reply || "Image generation failed." }]);
      }
      setPendingPrompt(null);
    } catch (err) {
      console.error("Image generation error:", err);
      setChat((prev) => [...prev, { sender: "bot", text: "Failed to generate image." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Tattoo AI Assistant</h2>
      <div className="h-[400px] overflow-y-auto border rounded p-4 bg-muted space-y-2">
        {chat.map((msg, idx) => (
          <div key={idx} className="space-y-1">
            <div
              className={`text-sm p-2 rounded max-w-[75%] whitespace-pre-line ${
                msg.sender === "user" ? "bg-primary text-white ml-auto" : "bg-white text-black"
              }`}
            >
              {msg.text}
            </div>
            {msg.imageUrl && (
              <div className="text-center">
                <img
                  src={msg.imageUrl}
                  alt="Tattoo Art"
                  className="rounded border w-full max-w-sm mx-auto"
                />
                <a
                  href={msg.imageUrl}
                  download="tattoo.png"
                  className="text-sm underline text-blue-600"
                >
                  Download Image
                </a>
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">Thinking...</div>}
      </div>
      {pendingPrompt && (
        <div className="flex gap-2">
          <Button onClick={confirmPromptGeneration} disabled={loading}>
            Yes, generate image
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Describe your tattoo idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} disabled={loading}>Send</Button>
      </div>
    </div>
  );
}
