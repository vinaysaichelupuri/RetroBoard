import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  arrayUnion, 
  arrayRemove,
  setDoc} from 'firebase/firestore';
import { db } from '../firebase/config';
import { RetroCard, Participant, Room } from '../types';

export const useRetroCards = (roomId: string, sortBy: 'timestamp' | 'votes' | 'author' = 'timestamp', sortOrder: 'asc' | 'desc' = 'desc') => {
  const [cards, setCards] = useState<RetroCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const cardsRef = collection(db, 'rooms', roomId, 'cards');
    let q;
    
    if (sortBy === 'votes') {
      q = query(cardsRef, orderBy('votes', sortOrder), orderBy('timestamp', 'desc'));
    } else if (sortBy === 'author') {
      q = query(cardsRef, orderBy('author', sortOrder), orderBy('timestamp', 'desc'));
    } else {
      q = query(cardsRef, orderBy('timestamp', sortOrder));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RetroCard[];
      
      setCards(cardsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [roomId, sortBy, sortOrder]);

  const addCard = async (
    text: string, 
    author: string, 
    authorId: string,
    category: 'start' | 'stop' | 'action',
    customFields?: { [key: string]: string }
  ) => {
    if (!roomId || !text.trim()) return;

    const cardsRef = collection(db, 'rooms', roomId, 'cards');
    await addDoc(cardsRef, {
      text: text.trim(),
      author,
      authorId,
      category,
      timestamp: Date.now(),
      votes: 0,
      votedBy: [],
      customFields: customFields || {}
    });
  };

  const updateCard = async (cardId: string, updates: Partial<RetroCard>) => {
    if (!roomId) return;
    
    const cardRef = doc(db, 'rooms', roomId, 'cards', cardId);
    await updateDoc(cardRef, updates);
  };

  const voteCard = async (cardId: string, userId: string, isUpvote: boolean) => {
    if (!roomId) return;

    const cardRef = doc(db, 'rooms', roomId, 'cards', cardId);
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const hasVoted = card.votedBy.includes(userId);

    if (isUpvote && !hasVoted) {
      await updateDoc(cardRef, {
        votes: card.votes + 1,
        votedBy: arrayUnion(userId)
      });
    } else if (!isUpvote && hasVoted) {
      await updateDoc(cardRef, {
        votes: Math.max(0, card.votes - 1),
        votedBy: arrayRemove(userId)
      });
    }
  };

  return { cards, loading, addCard, updateCard, voteCard };
};

export const useParticipants = (roomId: string, userName: string, userId: string, isCreator: boolean = false) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!roomId || !userName || !userId) return;

    const participantRef = doc(db, 'rooms', roomId, 'participants', userId);
    
    setDoc(participantRef, {
      name: userName,
      lastActive: Date.now(),
      isCreator
    });

    // Listen to participants
    const participantsRef = collection(db, 'rooms', roomId, 'participants');
    const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
      const participantsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Participant[];
      
      setParticipants(participantsData);
    });

    // Update last active periodically
    const interval = setInterval(() => {
      setDoc(participantRef, {
        name: userName,
        lastActive: Date.now(),
        isCreator
      });
    }, 30000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [roomId, userName, userId, isCreator]);

  return participants;
};

export const useRoom = (roomId: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setRoom({ id: snapshot.id, ...snapshot.data() } as Room);
      } else {
        // Create default room if it doesn't exist
        const defaultRoom: Omit<Room, 'id'> = {
          name: `Room ${roomId}`,
          createdAt: Date.now(),
          lastActive: Date.now(),
          creatorId: '',
          customFields: [],
          settings: {
            allowAnonymousCards: true,
            showAuthorToCreator: true,
            sortBy: 'timestamp',
            sortOrder: 'desc',
            showTimerVoting: false
          }
        };
        setDoc(roomRef, defaultRoom);
        setRoom({ id: roomId, ...defaultRoom });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [roomId]);

  const updateRoom = async (updates: Partial<Room>) => {
    if (!roomId) return;
    
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, updates);
  };

  const setCreator = async (creatorId: string) => {
    if (!roomId) return;
    
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, { creatorId });
  };
  const updateTimer = async (timer: { isRunning: boolean; startTimestamp: number; duration: number ; isEnded:boolean}) => {
    if (!roomId) return;
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, { timer });
  };

  return { room, loading, updateRoom, setCreator,updateTimer};
};