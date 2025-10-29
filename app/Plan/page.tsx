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
      const fixedChats = parsed.map((chat, index) => ({
        ...chat,
        title: chat.title || `Trip ${index + 1}`,
        messages: chat.messages || [],
      }));

      if (fixedChats.length > 0) {
        setChats(fixedChats);
        setActiveChatId(fixedChats[0].id);
      } else {
        createDefaultChat();
      }
    } else {
      createDefaultChat();
    }
  }, []);

  const createDefaultChat = () => {
    const firstChat = {
      id: Date.now().toString(),
      title: "Trip 1",
      messages: [],
    };
    setChats([firstChat]);
    setActiveChatId(firstChat.id);
    localStorage.setItem("trip_chats", JSON.stringify([firstChat]));
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `Trip ${chats.length + 1}`,
      messages: [],
    };
    const updated = [...chats, newChat];
    setChats(updated);
    setActiveChatId(newChat.id);
    localStorage.setItem("trip_chats", JSON.stringify(updated));
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };

  const handleDeleteChat = (id: string) => {
    const updated = chats.filter((chat) => chat.id !== id);

    if (updated.length === 0) {
      createDefaultChat(); 
    } else {
      setChats(updated);
      localStorage.setItem("trip_chats", JSON.stringify(updated));
      if (activeChatId === id) {
        setActiveChatId(updated[0].id);
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
        {!activeChat ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
            <p className="text-lg font-medium">No trips yet 🚀</p>
            <button
              onClick={handleNewChat}
              className="bg-[#f55612] hover:bg-[#e34c10] text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              + Create a New Trip
            </button>
          </div>
        ) : (
          <TripPlanner
            key={activeChat.id}
            initialMessages={activeChat.messages}
            onMessagesChange={handleUpdateMessages}
          />
        )}
      </div>
    </div>
  );
}
