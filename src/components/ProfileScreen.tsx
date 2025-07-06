import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Mail, 
  Phone, 
  Globe,
  Linkedin,
  Github,
  Edit3,
  Plus,
  X,
  Save,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ProfileScreen() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(currentUser);

  if (!currentUser) return null;

  const isCandidate = currentUser.type === 'candidate';
  const profile = isCandidate && 'profile' in currentUser ? currentUser.profile : null;

  const handleSave = () => {
    if (editedProfile) {
      dispatch({ type: 'SET_USER', payload: editedProfile });
    }
    setIsEditing(false);
  };

  const addSkill = (skill: string) => {
    if (!editedProfile || !('profile' in editedProfile) || !skill.trim()) return;
    
    const updatedProfile = {
      ...editedProfile,
      profile: {
        ...editedProfile.profile,
        skills: [...editedProfile.profile.skills, skill.trim()]
      }
    };
    setEditedProfile(updatedProfile);
  };

  const removeSkill = (skillToRemove: string) => {
    if (!editedProfile || !('profile' in editedProfile)) return;
    
    const updatedProfile = {
      ...editedProfile,
      profile: {
        ...editedProfile.profile,
        skills: editedProfile.profile.skills.filter(skill => skill !== skillToRemove)
      }
    };
    setEditedProfile(updatedProfile);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditing ? 'Sauvegarder' : 'Modifier'}
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {isEditing && (
            <button className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative -mt-16 md:-mt-12">
              <div className="relative">
                <img
                  src={currentUser.avatar || `https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop`}
                  alt={currentUser.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
                {currentUser.verified && (
                  <div className="absolute -top-1 -right-1 p-1 bg-green-500 rounded-full">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedProfile?.name || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? { ...prev, name: e.target.value } : prev)}
                    className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                  />
                  {isCandidate && 'profile' in editedProfile! && (
                    <input
                      type="text"
                      value={editedProfile.profile.title || ''}
                      onChange={(e) => setEditedProfile(prev => 
                        prev && 'profile' in prev 
                          ? { ...prev, profile: { ...prev.profile, title: e.target.value } }
                          : prev
                      )}
                      className="text-lg text-gray-600 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-full"
                    />
                  )}
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
                  {isCandidate && profile && (
                    <p className="text-lg text-gray-600">{profile.title}</p>
                  )}
                </>
              )}
              
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.location || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? { ...prev, location: e.target.value } : prev)}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <span>{currentUser.location}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {isCandidate && profile && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">À propos</h2>
          {isEditing ? (
            <textarea
              value={editedProfile && 'profile' in editedProfile ? editedProfile.profile.bio : ''}
              onChange={(e) => setEditedProfile(prev => 
                prev && 'profile' in prev 
                  ? { ...prev, profile: { ...prev.profile, bio: e.target.value } }
                  : prev
              )}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Parlez-nous de vous..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          )}
        </div>
      )}

      {/* Skills Section */}
      {isCandidate && profile && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Compétences</h2>
            {isEditing && (
              <button
                onClick={() => {
                  const skill = prompt('Ajouter une compétence:');
                  if (skill) addSkill(skill);
                }}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className={`px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2 ${
                  isEditing ? 'hover:bg-red-100 hover:text-red-700' : ''
                }`}
              >
                {skill}
                {isEditing && (
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-red-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience & Preferences */}
      {isCandidate && profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Expérience</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Années d'expérience
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProfile && 'profile' in editedProfile ? editedProfile.profile.experience : 0}
                    onChange={(e) => setEditedProfile(prev => 
                      prev && 'profile' in prev 
                        ? { ...prev, profile: { ...prev.profile, experience: parseInt(e.target.value) } }
                        : prev
                    )}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-2xl font-bold text-blue-600">{profile.experience} ans</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile && 'profile' in editedProfile ? editedProfile.profile.education : ''}
                    onChange={(e) => setEditedProfile(prev => 
                      prev && 'profile' in prev 
                        ? { ...prev, profile: { ...prev.profile, education: e.target.value } }
                        : prev
                    )}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{profile.education}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Préférences</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire souhaité
                </label>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <input
                        type="number"
                        value={editedProfile && 'profile' in editedProfile ? editedProfile.profile.salaryMin : 0}
                        onChange={(e) => setEditedProfile(prev => 
                          prev && 'profile' in prev 
                            ? { ...prev, profile: { ...prev.profile, salaryMin: parseInt(e.target.value) } }
                            : prev
                        )}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Min"
                      />
                      <span className="self-center">-</span>
                      <input
                        type="number"
                        value={editedProfile && 'profile' in editedProfile ? editedProfile.profile.salaryMax : 0}
                        onChange={(e) => setEditedProfile(prev => 
                          prev && 'profile' in prev 
                            ? { ...prev, profile: { ...prev.profile, salaryMax: parseInt(e.target.value) } }
                            : prev
                        )}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Max"
                      />
                    </>
                  ) : (
                    <p className="text-gray-700">
                      {profile.salaryMin.toLocaleString()} - {profile.salaryMax.toLocaleString()}€
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode de travail
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.workMode.map((mode) => (
                    <span
                      key={mode}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {mode}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">{currentUser.email}</span>
          </div>
          
          {isCandidate && profile?.portfolio && (
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <a 
                href={profile.portfolio} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Portfolio
              </a>
            </div>
          )}
          
          {isCandidate && profile?.linkedin && (
            <div className="flex items-center gap-3">
              <Linkedin className="w-5 h-5 text-gray-400" />
              <a 
                href={`https://${profile.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}