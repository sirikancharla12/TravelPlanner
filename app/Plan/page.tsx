"use client";
import { useState, useEffect } from "react";
import TripPlanner from "../components/PlanTrip/chatArea";
import Sidebar from "../components/PlanTrip/sidebar";

interface Chat {
  id: string;
  title: string;
  messages: any[];
}

export default function Workspace() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("trip_chats");
    if (saved) {
      const parsed: Chat[] = JSON.parse(saved);
      setChats(parsed);
      if (parsed.length > 0) setActiveChatId(parsed[0].id);
    } else {
      const firstChat = {
        id: Date.now().toString(),
        title: "Trip 1",
        messages: [],
      };
      setChats([firstChat]);
      setActiveChatId(firstChat.id);
    }
  }, []);

useEffect(() => {
  const saved = localStorage.getItem("trip_chats");
  if (saved) {
    const parsed: Chat[] = JSON.parse(saved);

    const fixedChats = parsed.map((chat, index) => ({
      ...chat,
      title: chat.title || `Trip ${index + 1}`,
      messages: chat.messages || [],
    }));

    setChats(fixedChats);
    if (fixedChats.length > 0) setActiveChatId(fixedChats[0].id);
  } else {
    const firstChat = {
      id: Date.now().toString(),
      title: "Trip 1",
      messages: [],
    };
    setChats([firstChat]);
    setActiveChatId(firstChat.id);
  }
}, []);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `Trip ${chats.length + 1}`,
      messages: [],
    };
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };

  const handleUpdateMessages = (updatedMessages: any[]) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages: updatedMessages } : chat
      )
    );
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats.map(({ id, title }) => ({ id, title }))}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      <div className="flex-1 ml-64 overflow-hidden">
        {activeChat ? (
          <TripPlanner
            key={activeChat.id}
            initialMessages={activeChat.messages}
            onMessagesChange={handleUpdateMessages}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading your chat...
          </div>
        )}
      </div>
    </div>
  );
}
