import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  MessageSquare,
  Users as UsersIcon,
  RefreshCw,
  Crown,
} from "lucide-react";
import { useRetroCards, useParticipants, useRoom } from "../hooks/useFirestore";
import { RetroCard } from "./RetroCard";
import { AddCardForm } from "./AddCardForm";
import { ParticipantsList } from "./ParticipantsList";
import { NamePrompt } from "./NamePrompt";
import { CreatorControls } from "./CreatorControls";
import { CardEditModal } from "./CardEditModal";
import { RetroCard as RetroCardType } from "../types";
import logo from "../assets/logo.png";
export const RetroBoard: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [showCreatorControls, setShowCreatorControls] = useState(false);
  const [editingCard, setEditingCard] = useState<RetroCardType | null>(null);

  const {
    room,
    loading: roomLoading,
    updateRoom,
    setCreator,
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
    // Generate a unique user ID for voting
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setUserId(id);

    // Check if user name is stored in localStorage
    const storedName = localStorage.getItem(`retroboard_name_${roomId}`);
    if (storedName) {
      setUserName(storedName);
    }

    // Check if user is stored as creator
    const storedCreatorId = localStorage.getItem(
      `retroboard_creator_${roomId}`
    );
    if (storedCreatorId === id) {
      setIsCreator(true);
    }
  }, [roomId]);

  useEffect(() => {
    // Set creator if room has no creator yet
    if (room && !room.creatorId && userId && userName) {
      setCreator(userId);
      setIsCreator(true);
      localStorage.setItem(`retroboard_creator_${roomId}`, userId);
    } else if (room && room.creatorId === userId) {
      setIsCreator(true);
    }
  }, [room, userId, userName, roomId, setCreator]);
  const handleNameSubmit = (name: string) => {
    setUserName(name);
    localStorage.setItem(`retroboard_name_${roomId}`, name);
  };

  const handleAddCard = (
    text: string,
    category: "start" | "stop" | "continue",
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
  if (!userName) {
    return <NamePrompt onNameSubmit={handleNameSubmit} roomId={roomId || ""} />;
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
    start: cards.filter((card) => card.category === "start"),
    stop: cards.filter((card) => card.category === "stop"),
    continue: cards.filter((card) => card.category === "continue"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
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
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UsersIcon className="w-4 h-4" />
                <span>{participants.length} active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Add Card Form */}
            <AddCardForm
              onAddCard={handleAddCard}
              userName={userName}
              customFields={room.customFields}
            />

            {/* Cards by Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Start Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-green-500">
                  <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                    Went well ({categorizedCards.start.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {categorizedCards.start.map((card) => (
                    <RetroCard
                      key={card.id}
                      card={card}
                      onVote={handleVoteCard}
                      currentUser={userId}
                      isCreator={isCreator}
                      showAuthorToCreator={room.settings.showAuthorToCreator}
                      onEdit={isCreator ? handleEditCard : undefined}
                    />
                  ))}
                  {categorizedCards.start.length === 0 && (
                    <div className="bg-green-50 border-2 border-dashed border-green-200 rounded-xl p-6 text-center">
                      <p className="text-green-600 font-medium">
                        No "Went well" cards yet
                      </p>
                      <p className="text-green-500 text-sm mt-1">
                        Add what the team is doing good
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stop Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-red-500">
                  <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                    Not went well ({categorizedCards.stop.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {categorizedCards.stop.map((card) => (
                    <RetroCard
                      key={card.id}
                      card={card}
                      onVote={handleVoteCard}
                      currentUser={userId}
                      isCreator={isCreator}
                      showAuthorToCreator={room.settings.showAuthorToCreator}
                      onEdit={isCreator ? handleEditCard : undefined}
                    />
                  ))}
                  {categorizedCards.stop.length === 0 && (
                    <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-xl p-6 text-center">
                      <p className="text-red-600 font-medium">
                        No "Not went well" cards yet
                      </p>
                      <p className="text-red-500 text-sm mt-1">
                        Add what the team should stop doing
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-blue-500">
                  <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                    Actions items ({categorizedCards.continue.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {categorizedCards.continue.map((card) => (
                    <RetroCard
                      key={card.id}
                      card={card}
                      onVote={handleVoteCard}
                      currentUser={userId}
                      isCreator={isCreator}
                      showAuthorToCreator={room.settings.showAuthorToCreator}
                      onEdit={isCreator ? handleEditCard : undefined}
                    />
                  ))}
                  {categorizedCards.continue.length === 0 && (
                    <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-6 text-center">
                      <p className="text-blue-600 font-medium">
                        No "Action items" cards yet
                      </p>
                      <p className="text-blue-500 text-sm mt-1">
                        Add what actions need to take
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ParticipantsList participants={participants} />

            {/* Room Info */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Room Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Total Cards:</span>{" "}
                  {cards.length}
                </p>
                <p>
                  <span className="font-medium">Your Name:</span> {userName}
                </p>
                <p>
                  <span className="font-medium">Room ID:</span> {roomId}
                </p>
                <p>
                  <span className="font-medium">Sort:</span>{" "}
                  {room.settings.sortBy} ({room.settings.sortOrder})
                </p>
              </div>
            </div>
          </div>
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
