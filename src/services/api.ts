// Service API pour connecter au backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // User Profile
  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Candidates
  async getCandidates(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/candidates?${params}`);
  }

  async getCandidateById(id: string) {
    return this.request(`/candidates/${id}`);
  }

  // Job Offers
  async getJobOffers(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/jobs?${params}`);
  }

  async getJobOfferById(id: string) {
    return this.request(`/jobs/${id}`);
  }

  async createJobOffer(jobData: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  // Matching & Swipes
  async swipe(targetId: string, direction: 'left' | 'right', targetType: 'candidate' | 'job') {
    return this.request('/swipes', {
      method: 'POST',
      body: JSON.stringify({ targetId, direction, targetType }),
    });
  }

  async getMatches() {
    return this.request('/matches');
  }

  // Chat & Messages
  async getChats() {
    return this.request('/chats');
  }

  async getChatMessages(chatId: string) {
    return this.request(`/chats/${chatId}/messages`);
  }

  async sendMessage(chatId: string, content: string) {
    return this.request(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }
}

export const apiService = new ApiService();