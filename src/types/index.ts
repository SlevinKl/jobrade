export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  type: 'candidate' | 'recruiter';
  location: string;
  verified: boolean;
  createdAt: Date;
}

export interface Candidate extends User {
  type: 'candidate';
  profile: CandidateProfile;
}

export interface Recruiter extends User {
  type: 'recruiter';
  company: Company;
}

export interface CandidateProfile {
  title: string;
  bio: string;
  skills: string[];
  experience: number;
  jobType: JobType[];
  workMode: WorkMode[];
  salaryMin: number;
  salaryMax: number;
  languages: string[];
  education: string;
  portfolio?: string;
  linkedin?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  size: CompanySize;
  culture: string[];
  description: string;
  website?: string;
}

export interface JobOffer {
  id: string;
  companyId: string;
  company: Company;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  experience: number;
  jobType: JobType;
  workMode: WorkMode;
  location: string;
  salaryMin: number;
  salaryMax: number;
  benefits: string[];
  postedAt: Date;
  isActive: boolean;
}

export interface Match {
  id: string;
  candidateId: string;
  recruiterId: string;
  jobOfferId?: string;
  status: MatchStatus;
  candidateLiked: boolean;
  recruiterLiked: boolean;
  createdAt: Date;
  chatId?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  matchId: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  createdAt: Date;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type WorkMode = 'remote' | 'hybrid' | 'on-site';
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
export type MatchStatus = 'pending' | 'matched' | 'rejected';

export interface SwipeAction {
  direction: 'left' | 'right';
  userId: string;
  targetId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'view';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}