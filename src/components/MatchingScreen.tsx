import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SwipeCard } from './SwipeCard';
import { mockCandidates, mockJobOffers } from '../data/mockData';
import { Candidate, JobOffer } from '../types';

export function MatchingScreen() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedItem, setMatchedItem] = useState<Candidate | JobOffer | null>(null);

  const isCandidate = currentUser?.type === 'candidate';
  const items = isCandidate ? mockJobOffers : mockCandidates;

  const handleSwipeLeft = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    const currentItem = items[currentIndex];
    
    // Simulation d'un match (probabilité de 30%)
    const isMatch = Math.random() > 0.7;
    
    if (isMatch) {
      setMatchedItem(currentItem);
      setShowMatch(true);
      
      // Créer un nouveau match
      const newMatch = {
        id: `match-${Date.now()}`,
        candidateId: isCandidate ? currentUser!.id : currentItem.id,
        recruiterId: isCandidate ? (currentItem as JobOffer).company.id : currentUser!.id,
        jobOfferId: isCandidate ? currentItem.id : undefined,
        status: 'matched' as const,
        candidateLiked: true,
        recruiterLiked: true,
        createdAt: new Date(),
      };
      
      dispatch({ type: 'ADD_MATCH', payload: newMatch });
      
      setTimeout(() => {
        setShowMatch(false);
        setMatchedItem(null);
        if (currentIndex < items.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }, 2000);
    } else {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const resetStack = () => {
    setCurrentIndex(0);
  };

  if (currentIndex >= items.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Plus de profils !</h2>
          <p className="text-gray-600 mb-6">
            Vous avez vu tous les {isCandidate ? 'postes' : 'candidats'} disponibles.
            Revenez plus tard pour découvrir de nouveaux profils.
          </p>
          <button
            onClick={resetStack}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Découvrir</h1>
          <p className="text-sm text-gray-600">
            {currentIndex + 1} / {items.length}
          </p>
        </div>
        
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="relative w-full max-w-sm">
          {/* Background cards for stack effect */}
          {currentIndex + 1 < items.length && (
            <div className="absolute inset-0 transform translate-y-2 scale-95 opacity-50">
              <div className="bg-white rounded-2xl shadow-lg h-full border border-gray-100" />
            </div>
          )}
          {currentIndex + 2 < items.length && (
            <div className="absolute inset-0 transform translate-y-4 scale-90 opacity-25">
              <div className="bg-white rounded-2xl shadow-lg h-full border border-gray-100" />
            </div>
          )}
          
          {/* Current card */}
          <SwipeCard
            key={`${currentIndex}-${items[currentIndex].id}`}
            item={items[currentIndex]}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        </div>
      </div>

      {/* Match Animation */}
      {showMatch && matchedItem && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 transform animate-pulse">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">C'est un match !</h2>
            <p className="text-gray-600 mb-4">
              Vous pouvez maintenant échanger avec{' '}
              {'company' in matchedItem ? matchedItem.company.name : matchedItem.name}
            </p>
            <button
              onClick={() => {
                setShowMatch(false);
                dispatch({ type: 'SET_VIEW', payload: 'chat' });
              }}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all"
            >
              Commencer la conversation
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>
    </div>
  );
}