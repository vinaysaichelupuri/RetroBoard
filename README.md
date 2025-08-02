# Collaborative Retro Board

A real-time collaborative retrospective board application built with React, Firebase Firestore, and TailwindCSS.

## Features

- **Real-time Collaboration**: Multiple users can join and interact simultaneously
- **Room-based Sessions**: Users join specific rooms via shareable URLs
- **Card Categories**: Organize feedback into Start, Stop, and Continue categories
- **Voting System**: Vote on cards to prioritize discussion points
- **Live Participants**: See who's currently active in the room
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Choose a location for your database

3. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on "Web app" icon to create a web app
   - Copy the configuration object

4. Update the Firebase configuration in `src/firebase/config.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

## Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId}/cards/{cardId} {
      allow read, write: if true;
    }
    match /rooms/{roomId}/participants/{participantId} {
      allow read, write: if true;
    }
  }
}
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Update Firebase configuration in `src/firebase/config.ts`

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Create a Room**: Click "Create New Room" on the homepage or enter a custom room ID
2. **Join a Room**: Enter your name when prompted
3. **Add Cards**: Click "Add Retro Card" and select a category (Start, Stop, Action)
4. **Vote on Cards**: Click the heart icon to vote on cards you find important
5. **Collaborate**: Share the room URL with team members for real-time collaboration

## Project Structure

```
src/
├── components/
│   ├── HomePage.tsx          # Landing page with room creation/joining
│   ├── RetroBoard.tsx        # Main retro board interface
│   ├── RetroCard.tsx         # Individual card component
│   ├── AddCardForm.tsx       # Form for adding new cards
│   ├── ParticipantsList.tsx  # Live participants sidebar
│   └── NamePrompt.tsx        # User name input modal
├── hooks/
│   └── useFirestore.ts       # Custom hooks for Firestore operations
├── types/
│   └── index.ts              # TypeScript type definitions
├── firebase/
│   └── config.ts             # Firebase configuration
└── App.tsx                   # Main app component with routing
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Firebase Firestore** - Real-time database
- **React Router** - Client-side routing
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own retrospectives!