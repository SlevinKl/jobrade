import React from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Briefcase,
  Users,
  Heart,
  X,
  Eye,
  MessageCircle
} from 'lucide-react';
import { useSwipe } from '../hooks/useSwipe';
import { Candidate, JobOffer } from '../types';

interface SwipeCardProps {
  item: Candidate | JobOffer;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onDetails?: () => void;
}

export function SwipeCard({ item, onSwipeLeft, onSwipeRight, onDetails }: SwipeCardProps) {
  const { handlers, getTransform, getOpacity, dragPosition } = useSwipe({
    onSwipeLeft,
    onSwipeRight,
    threshold: 120,
  });

  const isJobOffer = 'company' in item;
  const candidate = item as Candidate;
  const jobOffer = item as JobOffer;

  const getSwipeDirection = () => {
    if (Math.abs(dragPosition.x) < 50) return null;
    return dragPosition.x > 0 ? 'right' : 'left';
  };

  const swipeDirection = getSwipeDirection();

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Swipe Indicators */}
      {swipeDirection && (
        <>
          {swipeDirection === 'right' && (
            <div className="absolute top-8 right-8 z-20 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg transform rotate-12 shadow-lg">
              <Heart className="w-6 h-6" />
            </div>
          )}
          {swipeDirection === 'left' && (
            <div className="absolute top-8 right-8 z-20 bg-red-500 text-white p-3 rounded-full font-bold text-lg transform -rotate-12 shadow-lg">
              <X className="w-6 h-6" />
            </div>
          )}
        </>
      )}

      <div
        {...handlers}
        style={{
          transform: getTransform(),
          opacity: getOpacity(),
        }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden cursor-grab active:cursor-grabbing transition-shadow hover:shadow-2xl"
      >
        {/* Header Image */}
        <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
          {isJobOffer ? (
            <div className="absolute inset-0 flex items-center justify-center">
              {jobOffer.company.logo ? (
                <img 
                  src={jobOffer.company.logo} 
                  alt={jobOffer.company.name}
                  className="w-24 h-24 rounded-full object-cover bg-white p-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-gray-600" />
                </div>
              )}
            </div>
          ) : (
            <img 
              src={candidate.avatar || ''} 
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Overlay info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              {isJobOffer ? jobOffer.title : candidate.name}
            </h2>
            <p className="text-white/90">
              {isJobOffer ? jobOffer.company.name : candidate.profile.title}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Location & Experience */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{isJobOffer ? jobOffer.location : candidate.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {isJobOffer 
                  ? `${jobOffer.experience}+ ans exp.` 
                  : `${candidate.profile.experience} ans exp.`
                }
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {isJobOffer ? jobOffer.description : candidate.profile.bio}
          </p>

          {/* Skills */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              {isJobOffer ? 'Compétences requises' : 'Compétences'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {(isJobOffer ? jobOffer.skills : candidate.profile.skills).slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
              {(isJobOffer ? jobOffer.skills : candidate.profile.skills).length > 4 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{(isJobOffer ? jobOffer.skills : candidate.profile.skills).length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              {isJobOffer 
                ? `${jobOffer.salaryMin.toLocaleString()} - ${jobOffer.salaryMax.toLocaleString()}€`
                : `${candidate.profile.salaryMin.toLocaleString()} - ${candidate.profile.salaryMax.toLocaleString()}€`
              }
            </span>
          </div>

          {/* Work Mode & Type */}
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              {isJobOffer ? jobOffer.workMode : candidate.profile.workMode.join(', ')}
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
              {isJobOffer ? jobOffer.jobType : candidate.profile.jobType.join(', ')}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetails?.();
              }}
              className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwipeLeft();
              }}
              className="p-4 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwipeRight();
              }}
              className="p-4 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
            >
              <Heart className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDetails?.();
              }}
              className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}