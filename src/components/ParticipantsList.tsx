import React from 'react';
import { Users, Circle } from 'lucide-react';
import { Participant } from '../types';

interface ParticipantsListProps {
  participants: Participant[];
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  const activeParticipants = participants.filter(
    p => Date.now() - p.lastActive < 120000 // Active within 2 minutes
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">
          Participants ({activeParticipants.length})
        </h3>
      </div>
      
      <div className="space-y-2">
        {activeParticipants.map((participant) => (
          <div key={participant.id} className="flex items-center space-x-2">
            <Circle className="w-2 h-2 text-green-500 fill-current" />
            <span className="text-sm text-gray-700">{participant.name}</span>
          </div>
        ))}
        
        {activeParticipants.length === 0 && (
          <p className="text-sm text-gray-500 italic">No active participants</p>
        )}
      </div>
    </div>
  );
};