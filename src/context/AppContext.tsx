import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Match, Chat, Notification, JobOffer, Candidate, Recruiter } from '../types';

interface AppState {
  currentUser: User | null;
  candidates: Candidate[];
  recruiters: Recruiter[];
  jobOffers: JobOffer[];
  matches: Match[];
  chats: Chat[];
  notifications: Notification[];
  currentView: 'login' | 'dashboard' | 'matching' | 'chat' | 'profile';
  isLoading: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_VIEW'; payload: AppState['currentView'] }
  | { type: 'ADD_MATCH'; payload: Match }
  | { type: 'UPDATE_MATCH'; payload: { id: string; updates: Partial<Match> } }
  | { type: 'ADD_CHAT'; payload: Chat }
  | { type: 'UPDATE_CHAT'; payload: { id: string; message: any } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  currentUser: null,
  candidates: [],
  recruiters: [],
  jobOffers: [],
  matches: [],
  chats: [],
  notifications: [],
  currentView: 'login',
  isLoading: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'ADD_MATCH':
      return { ...state, matches: [...state.matches, action.payload] };
    case 'UPDATE_MATCH':
      return {
        ...state,
        matches: state.matches.map(match =>
          match.id === action.payload.id ? { ...match, ...action.payload.updates } : match
        ),
      };
    case 'ADD_CHAT':
      return { ...state, chats: [...state.chats, action.payload] };
    case 'UPDATE_CHAT':
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.id 
            ? { ...chat, messages: [...chat.messages, action.payload.message] }
            : chat
        ),
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}