import React from 'react';
import { 
  Heart, 
  MessageCircle, 
  User, 
  TrendingUp, 
  Eye,
  MapPin,
  Clock,
  Star,
  Briefcase,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Dashboard() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;

  if (!currentUser) return null;

  const isCandidate = currentUser.type === 'candidate';

  const stats = {
    candidate: {
      matches: 12,
      views: 48,
      messages: 5,
      applications: 8,
    },
    recruiter: {
      matches: 25,
      views: 156,
      messages: 12,
      candidates: 89,
    },
  };

  const currentStats = isCandidate ? stats.candidate : stats.recruiter;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            {currentUser.avatar && (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{currentUser.location}</span>
              {currentUser.verified && (
                <div className="flex items-center gap-1 text-green-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">Vérifié</span>
                </div>
              )}
            </div>
            {isCandidate && 'profile' in currentUser && (
              <p className="text-gray-700 font-medium">{currentUser.profile.title}</p>
            )}
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'profile' })}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentStats.matches}</p>
              <p className="text-sm text-gray-600">Matches</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentStats.views}</p>
              <p className="text-sm text-gray-600">Vues profil</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentStats.messages}</p>
              <p className="text-sm text-gray-600">Messages</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              {isCandidate ? (
                <Briefcase className="w-5 h-5 text-purple-600" />
              ) : (
                <Users className="w-5 h-5 text-purple-600" />
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {isCandidate ? currentStats.applications : currentStats.candidates}
              </p>
              <p className="text-sm text-gray-600">
                {isCandidate ? 'Candidatures' : 'Candidats'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'matching' })}
            className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-[1.02]"
          >
            <Heart className="w-6 h-6 mb-2" />
            <h3 className="font-semibold">Découvrir</h3>
            <p className="text-sm opacity-90">
              {isCandidate ? 'Nouvelles offres' : 'Nouveaux profils'}
            </p>
          </button>

          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'chat' })}
            className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02]"
          >
            <MessageCircle className="w-6 h-6 mb-2" />
            <h3 className="font-semibold">Messages</h3>
            <p className="text-sm opacity-90">Conversations actives</p>
          </button>

          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'profile' })}
            className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all transform hover:scale-[1.02]"
          >
            <User className="w-6 h-6 mb-2" />
            <h3 className="font-semibold">Profil</h3>
            <p className="text-sm opacity-90">Modifier le profil</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {isCandidate 
                    ? `Nouvelle offre correspondante chez ${['TechStart', 'GreenCorp', 'FinanceFlow'][i - 1]}`
                    : `${['Marie Dubois', 'Alexandre Martin', 'Sarah Johnson'][i - 1]} a consulté votre offre`
                  }
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Il y a {i} heure{i > 1 ? 's' : ''}</span>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}