
export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export class GoogleCalendarService {
  private gapi: any = null;
  private isSignedIn = false;

  async initializeGapi(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window object not available'));
        return;
      }

      // Load Google API script
      if (!(window as any).gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          (window as any).gapi.load('auth2:client', () => {
            this.gapi = (window as any).gapi;
            resolve();
          });
        };
        script.onerror = () => reject(new Error('Failed to load Google API'));
        document.head.appendChild(script);
      } else {
        this.gapi = (window as any).gapi;
        resolve();
      }
    });
  }

  async signIn(): Promise<boolean> {
    try {
      await this.initializeGapi();
      
      await this.gapi.client.init({
        apiKey: 'YOUR_GOOGLE_API_KEY', // Get from Google Cloud Console
        clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Get from Google Cloud Console
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
      });

      const authInstance = this.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      this.isSignedIn = user.isSignedIn();
      
      return this.isSignedIn;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  }

  async getEvents(calendarId = 'primary', maxResults = 10): Promise<CalendarEvent[]> {
    if (!this.isSignedIn || !this.gapi) {
      throw new Error('User not signed in');
    }

    try {
      const response = await this.gapi.client.calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  isUserSignedIn(): boolean {
    return this.isSignedIn;
  }

  async signOut(): Promise<void> {
    if (this.gapi && this.gapi.auth2) {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      this.isSignedIn = false;
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();
