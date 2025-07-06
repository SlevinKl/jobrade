import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Smile, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockCandidates, mockRecruiters } from '../data/mockData';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

export function ChatScreen() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations
  const mockChats = [
    {
      id: 'chat1',
      participant: mockCandidates[0],
      lastMessage: {
        content: 'Merci pour cette opportunité, j\'aimerais en savoir plus sur le poste.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isOwn: false,
      },
      unreadCount: 2,
      messages: [
        {
          id: 'msg1',
          senderId: mockCandidates[0].id,
          content: 'Bonjour ! Je suis très intéressée par votre offre de développeur frontend.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isOwn: false,
        },
        {
          id: 'msg2',
          senderId: currentUser?.id || '',
          content: 'Bonjour Marie ! Ravi de voir votre intérêt. Pouvez-vous me parler de votre expérience avec React ?',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          isOwn: true,
        },
        {
          id: 'msg3',
          senderId: mockCandidates[0].id,
          content: 'J\'ai 5 ans d\'expérience avec React, et j\'ai travaillé sur plusieurs projets utilisant TypeScript et Next.js. Je serais ravie de vous montrer mon portfolio !',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          isOwn: false,
        },
        {
          id: 'msg4',
          senderId: mockCandidates[0].id,
          content: 'Merci pour cette opportunité, j\'aimerais en savoir plus sur le poste.',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          isOwn: false,
        },
      ] as ChatMessage[],
    },
    {
      id: 'chat2',
      participant: mockCandidates[1],
      lastMessage: {
        content: 'Parfait, à quelle heure ?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOwn: false,
      },
      unreadCount: 0,
      messages: [
        {
          id: 'msg5',
          senderId: currentUser?.id || '',
          content: 'Bonjour Alexandre, votre profil backend nous intéresse beaucoup.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isOwn: true,
        },
        {
          id: 'msg6',
          senderId: mockCandidates[1].id,
          content: 'Merci ! Je serais ravi d\'échanger avec vous. Quand pourriez-vous organiser un appel ?',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
          isOwn: false,
        },
        {
          id: 'msg7',
          senderId: currentUser?.id || '',
          content: 'Que diriez-vous de demain à 14h pour un premier échange ?',
          timestamp: new Date(Date.now() - 2.2 * 60 * 60 * 1000),
          isOwn: true,
        },
        {
          id: 'msg8',
          senderId: mockCandidates[1].id,
          content: 'Parfait, à quelle heure ?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isOwn: false,
        },
      ] as ChatMessage[],
    },
    {
      id: 'chat3',
      participant: mockCandidates[2],
      lastMessage: {
        content: 'Merci, j\'ai hâte de commencer !',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isOwn: false,
      },
      unreadCount: 0,
      messages: [] as ChatMessage[],
    },
  ];

  const currentChat = selectedChat ? mockChats.find(chat => chat.id === selectedChat) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    // Here you would normally send the message to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex h-full">
        {/* Chat List */}
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <div className="w-6" />
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {mockChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className="w-full p-4 hover:bg-gray-50 border-b border-gray-100 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={chat.participant.avatar}
                      alt={chat.participant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {chat.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {chat.participant.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(chat.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage.content}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* No Chat Selected */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Sélectionnez une conversation</h2>
            <p className="text-gray-600">Choisissez une conversation pour commencer à échanger</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Chat List - Hidden on mobile when chat is open */}
      <div className="hidden md:block w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto">
          {mockChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full p-4 hover:bg-gray-50 border-b border-gray-100 text-left transition-colors ${
                selectedChat === chat.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={chat.participant.avatar}
                    alt={chat.participant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {chat.participant.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(chat.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage.content}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <img
                src={currentChat?.participant.avatar}
                alt={currentChat?.participant.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-medium text-gray-900">{currentChat?.participant.name}</h2>
                <p className="text-sm text-gray-500">
                  {'profile' in currentChat?.participant! && currentChat.participant.profile.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChat?.messages.map((message, index) => {
            const showDate = index === 0 || 
              formatDate(message.timestamp) !== formatDate(currentChat.messages[index - 1].timestamp);
            
            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isOwn
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tapez votre message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}