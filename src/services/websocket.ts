// Service WebSocket pour les messages en temps réel
class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;

  connect(userId: string) {
    const token = localStorage.getItem('authToken');
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}?token=${token}&userId=${userId}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connecté');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket fermé');
      this.attemptReconnect(userId);
    };

    this.ws.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'new_message':
        // Dispatch event pour nouveau message
        window.dispatchEvent(new CustomEvent('newMessage', { detail: data.payload }));
        break;
      case 'new_match':
        // Dispatch event pour nouveau match
        window.dispatchEvent(new CustomEvent('newMatch', { detail: data.payload }));
        break;
      case 'notification':
        // Dispatch event pour notification
        window.dispatchEvent(new CustomEvent('notification', { detail: data.payload }));
        break;
    }
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect(userId);
      }, this.reconnectInterval * this.reconnectAttempts);
    }
  }

  sendMessage(chatId: string, content: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'send_message',
        payload: { chatId, content }
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();