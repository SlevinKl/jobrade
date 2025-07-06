import React from 'react';
import { 
  Home, 
  Heart, 
  MessageCircle, 
  User, 
  LogOut,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navigation() {
  const { state, dispatch } = useApp();
  const { currentView, notifications } = state;

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'matching', icon: Heart, label: 'Découvrir' },
    { id: 'chat', icon: MessageCircle, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex-col z-40">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">JobSwipe</span>
          </div>

          <div className="space-y-2">
            {navItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: id as any })}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  currentView === id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
                {id === 'chat' && unreadNotifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all mb-2">
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
            {unreadNotifications > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadNotifications}
              </span>
            )}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => dispatch({ type: 'SET_VIEW', payload: id as any })}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
                currentView === id
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {id === 'chat' && unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}