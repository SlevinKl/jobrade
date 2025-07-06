import React, { useState } from 'react';
import { Mail, Lock, Users, Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockCandidates, mockRecruiters } from '../data/mockData';

export function LoginScreen() {
  const { dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'candidate' | 'recruiter'>('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation de connexion avec données mock
    if (isLogin) {
      const user = userType === 'candidate' 
        ? mockCandidates[0] 
        : mockRecruiters[0];
      
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
    } else {
      // Simulation d'inscription
      const newUser = userType === 'candidate' 
        ? { ...mockCandidates[0], email: formData.email, name: formData.name }
        : { ...mockRecruiters[0], email: formData.email, name: formData.name };
      
      dispatch({ type: 'SET_USER', payload: newUser });
      dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JobSwipe</h1>
          <p className="text-gray-600">Le matching emploi nouvelle génération</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Toggle Login/Register */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* User Type Selection */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setUserType('candidate')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                userType === 'candidate'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Candidat</div>
            </button>
            <button
              onClick={() => setUserType('recruiter')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                userType === 'recruiter'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Briefcase className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Recruteur</div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required={!isLogin}
                />
                <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            )}

            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
                userType === 'candidate'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
              }`}
            >
              {isLogin ? 'Se connecter' : 'S\'inscrire'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Demo Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-3">Démo rapide :</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  dispatch({ type: 'SET_USER', payload: mockCandidates[0] });
                  dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
                }}
                className="flex-1 py-2 px-3 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Candidat
              </button>
              <button
                onClick={() => {
                  dispatch({ type: 'SET_USER', payload: mockRecruiters[0] });
                  dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
                }}
                className="flex-1 py-2 px-3 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Recruteur
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}