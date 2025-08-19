import { ParticipantsList } from "./ParticipantsList";

interface RoomInfoModalProps {
  participants: any[];
  cards: { deleted?: boolean }[];
  userName: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  roomId: string;
  room: {
    settings: {
      sortBy: string;
      sortOrder: string;
    };
  };
}

export const RoomInfoModal: React.FC<RoomInfoModalProps> = ({
  participants,
  isOpen,
  cards,
  setIsOpen,
  userName,
  roomId,
  room,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with fade-in */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-blue-200 p-6 w-full max-w-3xl mx-4 transform transition-all duration-300 scale-100 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Participants Section */}
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-100 pb-2">
              Participants
            </h4>
            <div className="max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              <ParticipantsList participants={participants} />
            </div>
          </div>

          {/* Info Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Room Info
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-900">Total Cards:</span>{" "}
                {cards.filter((card) => !card.deleted).length}
              </p>
              <p>
                <span className="font-medium text-gray-900">Your Name:</span>{" "}
                {userName}
              </p>
              <p>
                <span className="font-medium text-gray-900">Room ID:</span>{" "}
                {roomId}
              </p>
              <p>
                <span className="font-medium text-gray-900">Sort:</span>{" "}
                {room.settings.sortBy} ({room.settings.sortOrder})
              </p>
            </div>

            {/* Close Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
};
