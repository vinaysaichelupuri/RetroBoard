import React from "react";
import { Heart, Clock, User, Edit2, Trash2 } from "lucide-react";
import { RetroCard as RetroCardType } from "../types";

interface RetroCardProps {
  card: RetroCardType;
  onVote: (cardId: string, isUpvote: boolean) => void;
  currentUser: string;
  isCreator?: boolean;
  showAuthorToCreator?: boolean;
  onEdit?: (card: RetroCardType) => void;
  onDelete?: (cardId: string) => void;
  votingEnabled: boolean;
}

export const RetroCard: React.FC<RetroCardProps> = ({
  card,
  onVote,
  currentUser,
  isCreator = false,
  showAuthorToCreator = false,
  onEdit,
  onDelete,
  votingEnabled,
}) => {
  const hasVoted = card.votedBy.includes(currentUser);
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "start":
        return "bg-green-50 border-green-200 text-green-800";
      case "stop":
        return "bg-red-50 border-red-200 text-red-800";
      case "action":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div
      className={`border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-lg ${getCategoryColor(
        card.category
      )}`}
    >
      <div className="flex items-center justify-end mb-3 ml-auto space-x-2">
        {currentUser === card.authorId && (
          <>
            {onEdit && (
              <button
                onClick={() => onEdit(card)}
                className="p-1 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                title="Edit card"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(card.id)}
                className="p-1 text-gray-500 hover:bg-red-100 rounded transition-colors"
                title="Delete card"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
        {votingEnabled && (
          <button
            onClick={() => onVote(card.id, !hasVoted)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-all duration-200 ${
              hasVoted
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
            }`}
          >
            <Heart className={`w-4 h-4 ${hasVoted ? "fill-current" : ""}`} />
            <span>{card.votes}</span>
          </button>
        )}
      </div>

      <p className="text-gray-800 mb-3 leading-relaxed break-words whitespace-pre-wrap">
        {card.text}
      </p>

      {/* Custom Fields */}
      {card.customFields && Object.keys(card.customFields).length > 0 && (
        <div className="mb-3 space-y-1">
          {Object.entries(card.customFields).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-medium text-gray-600">{key}:</span>
              <span className="ml-1 text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          {isCreator && showAuthorToCreator ? (
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span className="font-medium">{card.author}</span>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formatTimestamp(card.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};
