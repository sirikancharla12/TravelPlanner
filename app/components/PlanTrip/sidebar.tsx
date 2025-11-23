"use client";
import React from "react";

interface Chat {
  id: string;
  title: string;
}

interface SavedTrip {
  id: number;
  title?: string;
}

export default function Sidebar({
  chats,
  savedTrips = [],
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onOpenSavedTrip,
}: {
  chats: Chat[];
  savedTrips?: SavedTrip[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onOpenSavedTrip?: (id: number) => void;
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

      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-gray-700">Saved Trips</h3>
          <span className="text-xs text-gray-500">{savedTrips.length}</span>
        </div>

        {savedTrips.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No saved trips</p>
        ) : (
          <ul className="space-y-2 max-h-40 overflow-auto">
            {savedTrips.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => onOpenSavedTrip?.(t.id)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
                  title={t.title || `Trip ${t.id}`}
                >
                  {t.title || `Trip ${t.id}`}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">Drafts</h3>
          <button onClick={onNewChat} className="text-sm text-blue-600">New</button>
        </div>

        {chats.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No drafts yet</p>
        ) : (
          <ul className="space-y-2">
            {chats.map((chat) => (
              <li key={chat.id} className="flex items-center justify-between">
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className="text-left px-3 py-2 w-full text-sm rounded hover:bg-gray-100 truncate"
                  title={chat.title}
                >
                  {chat.title || "Untitled Trip"}
                </button>
                <button onClick={() => onDeleteChat(chat.id)} className="px-2 text-xs text-red-500">✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
