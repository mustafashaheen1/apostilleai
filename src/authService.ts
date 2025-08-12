import { supabase, User } from './supabase';
import bcrypt from 'bcryptjs';

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'apple';
}

export class AuthService {
  // Sign up with email and password
  static async signUp(userData: SignUpData): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        return { user: null, error: 'User with this email already exists' };
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Failed to create user account' };
      }

      // Create user record in our users table
      const { data: user, error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          full_name: userData.fullName,
          email: userData.email,
          password_hash: passwordHash,
          provider: 'email'
        })
        .select()
        .single();

      if (dbError) {
        // Clean up auth user if database insert fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { user: null, error: 'Failed to create user profile' };
      }

      return { user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: 'An unexpected error occurred during sign up' };
    }
  }

  // Login with email and password
  static async login(loginData: LoginData): Promise<{ user: User | null; error: string | null }> {
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Login failed' };
      }

      // Get user profile from our users table
      const { data: user, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (dbError || !user) {
        return { user: null, error: 'Failed to load user profile' };
      }

      return { user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'An unexpected error occurred during login' };
    }
  }

  // Handle OAuth sign up/login
  static async handleOAuthUser(oauthUser: OAuthUser): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', oauthUser.email)
        .single();

      if (existingUser) {
        // Update existing user with OAuth info if needed
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            provider_id: oauthUser.id,
            picture: oauthUser.picture,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) {
          return { user: null, error: 'Failed to update user profile' };
        }

        return { user: updatedUser, error: null };
      }

      // Create new user
      const { data: user, error: dbError } = await supabase
        .from('users')
        .insert({
          full_name: oauthUser.name,
          email: oauthUser.email,
          provider: oauthUser.provider,
          provider_id: oauthUser.id,
          picture: oauthUser.picture
        })
        .select()
        .single();

      if (dbError) {
        return { user: null, error: 'Failed to create user profile' };
      }

      return { user, error: null };
    } catch (error) {
      console.error('OAuth user handling error:', error);
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        return { user: null, error: null };
      }

      const { data: user, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (dbError) {
        return { user: null, error: 'Failed to load user profile' };
      }

      return { user, error: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error: 'Failed to get current user' };
    }
  }

  // Logout
  static async logout(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      console.error('Logout error:', error);
      return { error: 'Failed to logout' };
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<Pick<User, 'full_name' | 'picture'>>): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { user: null, error: 'Failed to update profile' };
      }

      return { user, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { user: null, error: 'Failed to update profile' };
    }
  }
}