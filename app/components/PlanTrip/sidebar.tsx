"use client";
import React from "react";

interface Chat {
  id: string;
  title: string;
}

export default function Sidebar({
  chats,
  onNewChat,
  onSelectChat,
}: {
  chats: Chat[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}) {
  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-[#FFF7F4] border-r border-gray-200 flex flex-col shadow-md">
      <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-[#FFF7F4] z-10">
        <h2 className="text-[#f55612] font-semibold text-lg mb-2">Trip Planner</h2>
        <button
          onClick={onNewChat}
          className="bg-[#f55612] hover:bg-[#e34c10] w-full py-2 px-4 rounded-lg text-white font-semibold transition"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chats.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No chats yet</p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="w-full text-center bg-white hover:bg-gray-100 border border-gray-200 p-2 rounded-lg transition truncate"
              title={chat.title}
            >
              {chat.title}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
