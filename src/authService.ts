import { supabase, User } from './supabase';
import bcrypt from 'bcryptjs';

export interface SignUpData {
  fullName: string;
  company: string;
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
  static async signUp(userData: SignUpData): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          !import.meta.env.VITE_SUPABASE_ANON_KEY ||
          import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
          import.meta.env.VITE_SUPABASE_ANON_KEY?.includes('placeholder')) {
        return { user: null, error: 'Supabase is not configured. Please set up your Supabase environment variables.' };
      }

      // Create user in Supabase Auth first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
      });

      if (authError) {
        // Handle specific Supabase Auth errors
        if (authError.message.includes('User already registered')) {
          return { user: null, error: 'An account with this email already exists. Please login instead.' };
        }
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Failed to create user account' };
      }

      // Hash the password before storing
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      // Automatically sign in the user after successful signup
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
      });

      if (signInError) {
        console.error('Auto sign-in error after signup:', signInError);
        // Don't return error here, user was created successfully
      }

      // Store user information in our database
      const { data: user, error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          full_name: userData.fullName,
          company: userData.company,
          email: userData.email.toLowerCase().trim(),
          password_hash: passwordHash,
          provider: 'email'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        // If it's a duplicate key error, the user already exists in our database
        if (dbError.message.includes('duplicate key') || dbError.code === '23505') {
          return { user: null, error: 'An account with this email already exists. Please login instead.' };
        }
        return { user: null, error: 'Failed to create user profile. Please try again.' };
      }

      return { user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: 'An unexpected error occurred during sign up' };
    }
  }

  static async login(loginData: LoginData): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          !import.meta.env.VITE_SUPABASE_ANON_KEY ||
          import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
          import.meta.env.VITE_SUPABASE_ANON_KEY?.includes('placeholder')) {
        return { user: null, error: 'Supabase is not configured. Please set up your Supabase environment variables.' };
      }

      // Now sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email.toLowerCase().trim(),
        password: loginData.password,
      });

      if (authError) {
        // Handle specific Supabase Auth errors
        if (authError.message.includes('Invalid login credentials') || authError.message.includes('Invalid')) {
          return { user: null, error: 'Invalid email or password. Please check your credentials and try again.' };
        }
        if (authError.message.includes('Email not confirmed')) {
          return { user: null, error: 'Please check your email and confirm your account before logging in.' };
        }
        if (authError.message.includes('Failed to fetch') || authError.message.includes('fetch')) {
          return { user: null, error: 'Unable to connect to authentication service. Please check your internet connection and try again.' };
        }
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Login failed. Please try again.' };
      }

      // Get user data from our database
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (dbError) {
        console.error('Database query error:', dbError);
        return { user: null, error: 'Failed to load user profile. Please try again.' };
      }

      if (!dbUser) {
        // User exists in Auth but not in our database - this shouldn't happen
        console.error('User exists in Auth but not in database:', authData.user.id);
        return { user: null, error: 'Account configuration error. Please contact support.' };
      }

      // Return the user data from our database
      return { user: dbUser, error: null };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error && error.message.includes('fetch')) {
        return { user: null, error: 'Unable to connect to authentication service. Please check your internet connection and try again.' };
      }
      return { user: null, error: 'An unexpected error occurred during login. Please try again.' };
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
        .maybeSingle();

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
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || 
          !import.meta.env.VITE_SUPABASE_ANON_KEY ||
          import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
          import.meta.env.VITE_SUPABASE_ANON_KEY?.includes('placeholder')) {
        return { user: null, error: null };
      }

      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        return { user: null, error: null };
      }

      const { data: user, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

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