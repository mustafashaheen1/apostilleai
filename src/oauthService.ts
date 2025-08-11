
export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'apple';
}

export class OAuthService {
  
  static async handleGoogleCallback(code: string): Promise<OAuthUser | null> {
    try {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
      const redirectUri = `${window.location.origin}/auth/google/callback`;

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId || '',
          client_secret: clientSecret || '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenData.access_token) {
        throw new Error('Failed to get access token');
      }

      // Get user information
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        provider: 'google'
      };
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      return null;
    }
  }

  static async handleAppleCallback(code: string, idToken?: string): Promise<OAuthUser | null> {
    try {
      const clientId = process.env.REACT_APP_APPLE_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_APPLE_CLIENT_SECRET;
      const redirectUri = `${window.location.origin}/auth/apple/callback`;

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId || '',
          client_secret: clientSecret || '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (idToken) {
        // Decode the ID token to get user information
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        
        return {
          id: payload.sub,
          email: payload.email,
          name: payload.name || payload.email,
          provider: 'apple'
        };
      }

      return null;
    } catch (error) {
      console.error('Apple OAuth callback error:', error);
      return null;
    }
  }

  static saveUserSession(user: OAuthUser) {
    localStorage.setItem('oauth_user', JSON.stringify(user));
    localStorage.setItem('auth_provider', user.provider);
  }

  static getUserSession(): OAuthUser | null {
    const userStr = localStorage.getItem('oauth_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  static clearUserSession() {
    localStorage.removeItem('oauth_user');
    localStorage.removeItem('auth_provider');
  }
}
