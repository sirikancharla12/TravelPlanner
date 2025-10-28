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

  
const handleDeleteChat = (id: string) => {
  const updated = chats.filter((chat) => chat.id !== id);
  setChats(updated);
  localStorage.setItem("trip_chats", JSON.stringify(updated));

  if (activeChatId === id) {
    if (updated.length > 0) {
      setActiveChatId(updated[0].id);
    } else {
      setActiveChatId(null);
    }
  }
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
      onDeleteChat={handleDeleteChat}
    />

    <div className="flex-1 ml-64 overflow-hidden">
      {chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
          <p className="text-lg font-medium">No trips yet 🚀</p>
          <button
            onClick={handleNewChat}
            className="bg-[#f55612] hover:bg-[#e34c10] text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
          >
            + Create a New Trip
          </button>
        </div>
      ) : activeChat ? (
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
)}
