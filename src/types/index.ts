export interface RetroCard {
  id: string;
  text: string;
  author: string;
  authorId: string;
  category: 'start' | 'stop' | 'action';
  timestamp: number;
  votes: number;
  votedBy: string[];
  customFields?: { [key: string]: string };
  deleted?: boolean;

}

export interface Participant {
  id: string;
  name: string;
  lastActive: number;
  isCreator?: boolean;
}

export interface Room {
  id: string;
  name: string;
  createdAt: number;
  lastActive: number;
  creatorId: string;
  customFields: CustomField[];
  settings: RoomSettings;
  timer?: {
    isRunning: boolean;
    startTimestamp: number;
    duration: number; 
    isEnded:boolean;
  };
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  required: boolean;
}

export interface RoomSettings {
  showTimerVoting: boolean;
  allowAnonymousCards: boolean;
  showAuthorToCreator: boolean;
  sortBy: 'timestamp' | 'votes' | 'author';
  sortOrder: 'asc' | 'desc';
}