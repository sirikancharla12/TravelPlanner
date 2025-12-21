"use client";

import { useEffect, useState } from "react";
import TripPlanner from "../components/PlanTrip/chatArea";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface Chat {
  id: string;
  title: string;
  messages: any[];
  savedTripId?: number | null;
}

interface SavedTrip {
  id: number;
  title?: string;
  itinerary?: any;
  fromLocation?: string | null;
  toLocation?: string | null;
  date?: string | null;
}

export default function Workspace() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [activeSavedTripId, setActiveSavedTripId] = useState<number | null>(null);


  const createDefaultChat = () => {
    const firstChat: Chat = {
      id: Date.now().toString(),
      title: "Trip 1",
      messages: [],
      savedTripId: null,
    };
    setChats([firstChat]);
    setActiveChatId(firstChat.id);
    localStorage.setItem("trip_chats", JSON.stringify([firstChat]));
  };


  const fetchSavedTrips = async (uid: string) => {
    try {
      const res = await fetch(`/api/trips/list?uid=${uid}`);
      if (!res.ok) throw new Error("Failed to load saved trips");
      const json = await res.json();
      const trips: SavedTrip[] = json.trips || [];
      setSavedTrips(trips);

      if (trips.length > 0) {
        setActiveSavedTripId(trips[0].id);
        setActiveChatId(null);
      }
    } catch (err) {
      console.warn("fetchSavedTrips error", err);
      setSavedTrips([]);
    }
  };


  useEffect(() => {
    const saved = localStorage.getItem("trip_chats");
    if (saved) {
      const parsed: Chat[] = JSON.parse(saved);
      const fixedChats = parsed.map((chat, index) => ({
        ...chat,
        title: chat.title || `Trip ${index + 1}`,
        messages: chat.messages || [],
        savedTripId: chat.savedTripId ?? null,
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

  useEffect(() => {
  const pending = localStorage.getItem("pending_trip_chat");
  if (!pending) return;

  try {
    const parsed = JSON.parse(pending);

    const newChat: Chat = {
      id: Date.now().toString(),
      title: parsed.title || `Trip ${chats.length + 1}`,
      messages: parsed.messages || [],
      savedTripId: null,
    };

    const updatedChats = [newChat, ...chats];

    setChats(updatedChats);
    setActiveChatId(newChat.id);
    setActiveSavedTripId(null);

    localStorage.setItem("trip_chats", JSON.stringify(updatedChats));
    localStorage.removeItem("pending_trip_chat"); 
  } catch (err) {
    console.error("Failed to load pending trip chat", err);
  }
}, []);



  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        fetchSavedTrips(user.uid);
      } else {
        setSavedTrips([]);
        setActiveSavedTripId(null);
      }
    });

    return () => unsubscribe();
  }, []);


  const handleSaveTrip = async (payload: {
    title?: string;
    itinerary: any;
    fromLocation?: string | null;
    toLocation?: string | null;
    date?: string | null;
    chatId?: number | null;
  }) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("Please login to save trips.");
        return;
      }


      const res = await fetch("/api/trips/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          title: payload.title || `Trip ${new Date().toLocaleString()}`,
          itinerary: payload.itinerary,
          fromLocation: payload.fromLocation || null,
          toLocation: payload.toLocation || null,
          date: payload.date || null,
          chatId: payload.chatId ?? null,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Save failed");
      }

      const json = await res.json();

      if (json.alreadyExists) {
        const existingId: number = json.trip.id;
        setActiveSavedTripId(existingId);
        setActiveChatId(null);

        if (activeChatId) {
          setChats((prev) => {
            const updated = prev.map((chat) =>
              chat.id === activeChatId ? { ...chat, savedTripId: existingId } : chat
            );
            localStorage.setItem("trip_chats", JSON.stringify(updated));
            return updated;
          });
        }

        setSavedTrips((prev) => {
          const without = prev.filter((t) => t.id !== existingId);
          const updatedTrip: SavedTrip = {
            id: json.trip.id,
            title: json.trip.title,
            itinerary: json.trip.itinerary,
            fromLocation: json.trip.fromLocation,
            toLocation: json.trip.toLocation,
            date: json.trip.date ? String(json.trip.date) : null,
          };
          return [updatedTrip, ...without];
        });

        alert("This trip already exists. Opened existing trip.");
        return;
      }

      const newTrip: SavedTrip = {
        id: json.trip.id,
        title: json.trip.title,
        itinerary: json.trip.itinerary,
        fromLocation: json.trip.fromLocation,
        toLocation: json.trip.toLocation,
        date: json.trip.date ? String(json.trip.date) : null,
      };

      setSavedTrips((prev) => [newTrip, ...prev]);
      setActiveSavedTripId(newTrip.id);
      setActiveChatId(null);
      if (activeChatId) {
        setChats((prev) => {
          const updated = prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, savedTripId: newTrip.id } : chat
          );
          localStorage.setItem("trip_chats", JSON.stringify(updated));
          return updated;
        });
      }
      alert("Trip saved!");
    } catch (err: any) {
      console.error("handleSaveTrip error", err);
      alert("Failed to save trip: " + (err.message || err));
    }
  };


  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `Trip ${chats.length + 1}`,
      messages: [],
      savedTripId: null,
    };
    const updated = [...chats, newChat];
    setChats(updated);
    setActiveChatId(newChat.id);
    setActiveSavedTripId(null);
    localStorage.setItem("trip_chats", JSON.stringify(updated));
  };

  const handleSelectChat = (id: string) => {
    setActiveSavedTripId(null);
    setActiveChatId(id);
  };

  const handleDeleteChat = (id: string) => {
    const updated = chats.filter((chat) => chat.id !== id);
    if (updated.length === 0) {
      createDefaultChat();
    } else {
      setChats(updated);
      localStorage.setItem("trip_chats", JSON.stringify(updated));
      if (activeChatId === id) setActiveChatId(updated[0].id);
    }
  };

  const handleUpdateMessages = (updatedMessages: any[]) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages: updatedMessages } : chat
      )
    );
    setTimeout(() => {
      const updated = (chats || []).map((c) =>
        c.id === activeChatId ? { ...c, messages: updatedMessages } : c
      );
      localStorage.setItem("trip_chats", JSON.stringify(updated));
    }, 0);
  };

  const openSavedTrip = (id: number) => {
    setActiveSavedTripId(id);
    setActiveChatId(null);
  };

  const activeChat = chats.find((c) => c.id === activeChatId);
  const activeSavedTrip = savedTrips.find((t) => t.id === activeSavedTripId);

  return (
    <div className="flex height: 100%; overflow-hidden">
     <div className="flex-1 ml-64 overflow-hidden">
        {activeSavedTrip ? (
          <TripPlanner
            key={`saved-${activeSavedTrip.id}`}
            initialMessages={activeSavedTrip.itinerary || []}
            onMessagesChange={() => { }}
            initiallySaved={true}
            existingChatId={undefined}
          />
        ) : !activeChat ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
            <p className="text-lg font-medium">No trips yet</p>
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
            onSaveTrip={handleSaveTrip}
            initiallySaved={!!activeChat.savedTripId}
          />
        )}
      </div>
    </div>
  );
}
