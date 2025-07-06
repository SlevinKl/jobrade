import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { MatchingScreen } from './components/MatchingScreen';
import { ChatScreen } from './components/ChatScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Navigation } from './components/Navigation';

function AppContent() {
  const { state } = useApp();
  const { currentUser, currentView } = state;

  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'matching':
        return <MatchingScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 mb-16 md:mb-0">
        {currentView === 'matching' ? (
          <div className="h-screen flex flex-col">
            {renderCurrentView()}
          </div>
        ) : currentView === 'chat' ? (
          <div className="h-screen">
            {renderCurrentView()}
          </div>
        ) : (
          <div className="min-h-screen py-4">
            {renderCurrentView()}
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;