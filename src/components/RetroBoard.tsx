import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users as UsersIcon, RefreshCw, Crown, Info } from "lucide-react";
import { useRetroCards, useParticipants, useRoom } from "../hooks/useFirestore";
import { RetroCard } from "./RetroCard";
import { AddCardForm } from "./AddCardForm";
import { NamePrompt } from "./NamePrompt";
import { CreatorControls } from "./CreatorControls";
import { CardEditModal } from "./CardEditModal";
import { CountdownTimer } from "./Timer";
import { RetroCard as RetroCardType } from "../types";
import logo from "../assets/logo.png";
import { RoomInfoModal } from "./RoomInfo";
export const RetroBoard: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [showCreatorControls, setShowCreatorControls] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<RetroCardType | null>(null);

  const {
    room,
    loading: roomLoading,
    updateRoom,
    setCreator,
    updateTimer,
  } = useRoom(roomId || "");
  const {
    cards,
    loading: cardsLoading,
    addCard,
    updateCard,
    voteCard,
  } = useRetroCards(
    roomId || "",
    room?.settings.sortBy || "timestamp",
    room?.settings.sortOrder || "desc"
  );
  const participants = useParticipants(
    roomId || "",
    userName,
    userId,
    isCreator
  );

  useEffect(() => {
    let storedId = localStorage.getItem(`retroboard_userId_${roomId}`);
    if (!storedId) {
      storedId = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem(`retroboard_userId_${roomId}`, storedId);
    }
    setUserId(storedId);

    const storedName = localStorage.getItem(`retroboard_name_${roomId}`);
    if (storedName) {
      setUserName(storedName);
    }

    const storedCreatorId = localStorage.getItem(
      `retroboard_creator_${roomId}`
    );
    if (storedCreatorId === storedId) {
      setIsCreator(true);
    }
  }, [roomId]);

  useEffect(() => {
    if (room && !room.creatorId && userId && userName) {
      setCreator(userId);
      setIsCreator(true);
      localStorage.setItem(`retroboard_creator_${roomId}`, userId);
    } else if (room && room.creatorId === userId) {
      setIsCreator(true);
    }
  }, [room, userId, userName, roomId, setCreator]);
  const handleNameSubmit = (name: string, boardNameInput?: string) => {
    setUserName(name);
    localStorage.setItem(`retroboard_name_${roomId}`, boardNameInput || "");
    if (boardNameInput) {
      updateRoom({ name: boardNameInput });
    }
  };

  const handleAddCard = (
    text: string,
    category: "start" | "stop" | "action",
    customFields?: { [key: string]: string }
  ) => {
    addCard(text, userName, userId, category, customFields);
  };

  const handleVoteCard = (cardId: string, isUpvote: boolean) => {
    voteCard(cardId, userId, isUpvote);
  };

  const handleEditCard = (card: RetroCardType) => {
    setEditingCard(card);
  };

  const handleSaveCard = (updates: Partial<RetroCardType>) => {
    if (editingCard) {
      updateCard(editingCard.id, updates);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await updateCard(cardId, { deleted: true });
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const getCustomFieldCards = (fieldId: string) =>
    cards.filter(
      (card) => card.customFields && card.customFields[fieldId] && !card.deleted
    );

  if (
    !userName ||
    (!room?.creatorId && !room?.name) ||
    (isCreator && !room?.name)
  ) {
    return (
      <NamePrompt
        onNameSubmit={handleNameSubmit}
        roomId={roomId || ""}
        isCreatorPrompt={!room?.creatorId || (isCreator && !room?.name)}
        boardName={room?.name || ""}
      />
    );
  }

  if (roomLoading || cardsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="text-lg text-gray-700">Loading retro board...</span>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Room not found
          </h1>
          <p className="text-gray-600">
            The room you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }
  const categorizedCards = {
    start: cards.filter((card) => card.category === "start" && !card.deleted),
    stop: cards.filter((card) => card.category === "stop" && !card.deleted),
    action: cards.filter(
      (card) =>
        card.category === "action" &&
        !card.deleted &&
        (!card.customFields || Object.keys(card.customFields).length === 0)
    ),
  };
  const activeParticipants = participants.filter(
    (p) => Date.now() - p.lastActive < 60000 // Active within 2 minutes
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between relative">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Retro Board
                  </h1>
                  <p className="text-gray-600">
                    Room:{" "}
                    <span className="font-semibold text-blue-600">
                      {roomId}
                    </span>
                  </p>
                  {isCreator && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      <Crown className="w-3 h-3" />
                      <span>Creator</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                    <UsersIcon className="w-4 h-4" />
                    <span>{activeParticipants.length} active</span>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-900">
                  {room.name || "Untitled Board"}
                </h1>
              </div>
              <div>
                <div>
                  {room.settings.showTimerVoting &&
                    (categorizedCards.start.length > 0 ||
                      categorizedCards.stop.length > 0 ||
                      categorizedCards.action.length > 0) && (
                      <CountdownTimer
                        timer={room.timer}
                        updateTimer={updateTimer}
                        isCreator={isCreator}
                      />
                    )}
                </div>
                <div className="fixed bottom-13 right-6 group">
                  <button
                    className="p-3 rounded-full shadow-lg 
               bg-gradient-to-r from-blue-500 to-indigo-600 
               text-white hover:from-blue-600 hover:to-indigo-700 
               focus:outline-none focus:ring-2 focus:ring-offset-2 
               focus:ring-blue-500 transition-all"
                    onClick={() => setIsOpen(true)}
                  >
                    <Info className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Main Content */}
          <div>
            {/* Cards by Category */}
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
              }}
            >
              {/* Went Well */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-green-500">
                  <h2 className="text-xl font-bold text-green-700 mb-4">
                    Went well ({categorizedCards.start.length})
                  </h2>
                  <AddCardForm
                    category="start"
                    onAddCard={handleAddCard}
                    userName={userName}
                    customFields={[]}
                  />
                </div>
                {/* Cards list... */}
              </div>

              {/* Not Went Well */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-red-500">
                  <h2 className="text-xl font-bold text-red-700 mb-4">
                    Not went well ({categorizedCards.stop.length})
                  </h2>
                  <AddCardForm
                    category="stop"
                    onAddCard={handleAddCard}
                    userName={userName}
                    customFields={[]}
                  />
                </div>
                {/* Cards list... */}
              </div>

              {/* Action Items */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-blue-500">
                  <h2 className="text-xl font-bold text-blue-700 mb-4">
                    Action items ({categorizedCards.action.length})
                  </h2>
                  <AddCardForm
                    category="action"
                    onAddCard={handleAddCard}
                    userName={userName}
                    customFields={[]}
                  />
                </div>
                {/* Cards list... */}
              </div>

              {/* Custom Fields */}
              {room.customFields.map((field) => (
                <div key={field.id} className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-blue-500">
                    <h2 className="text-xl font-bold text-blue-700 mb-4">
                      {field.name} ({getCustomFieldCards(field.id).length})
                    </h2>
                    <AddCardForm
                      category="action"
                      onAddCard={(text, category, customFields) => {
                        const updatedFields = {
                          ...customFields,
                          [field.id]: text,
                        };
                        handleAddCard(text, category, updatedFields);
                      }}
                      userName={userName}
                      customFields={[]}
                    />
                  </div>
                  {/* Cards list... */}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
        </div>
      </div>

      {/* Creator Controls */}
      {isCreator && (
        <CreatorControls
          room={room}
          onUpdateRoom={updateRoom}
          isVisible={showCreatorControls}
          onToggle={() => setShowCreatorControls(!showCreatorControls)}
        />
      )}

      <RoomInfoModal
        cards={cards}
        userName={userName}
        room={room}
        roomId={roomId || ""}
        participants={participants}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* Card Edit Modal */}
      {editingCard && (
        <CardEditModal
          card={editingCard}
          customFields={room.customFields}
          onSave={handleSaveCard}
          onClose={() => setEditingCard(null)}
        />
      )}
    </div>
  );
};
