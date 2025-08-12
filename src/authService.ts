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
      // First check if user already exists in our database
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .maybeSingle();

      if (existingUser) {
        return { user: null, error: 'An account with this email already exists. Please login instead.' };
      }

      // Hash the password before storing
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      // Create user in Supabase Auth first
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

      // Store user information in our database
      const { data: user, error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          full_name: userData.fullName,
          company: userData.company,
          email: userData.email,
          password_hash: passwordHash,
          provider: 'email'
        })
        .select()
        .single();

      if (dbError) {
        // If database insert fails, clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { user: null, error: 'Failed to create user account. Please try again.' };
      }

      return { user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: 'An unexpected error occurred during sign up' };
    }
  }

  static async login(loginData: LoginData): Promise<{ user: User | null; error: string | null }> {
    try {
      // First check if user exists in our database
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', loginData.email)
        .eq('provider', 'email')
        .maybeSingle();

      if (dbError || !dbUser) {
        return { user: null, error: 'No account found with this email address. Please sign up first.' };
      }

      // Verify password against stored hash
      if (!dbUser.password_hash) {
        return { user: null, error: 'Invalid account configuration. Please contact support.' };
      }

      const passwordMatch = await bcrypt.compare(loginData.password, dbUser.password_hash);
      if (!passwordMatch) {
        return { user: null, error: 'Invalid password. Please check your credentials and try again.' };
      }

      // Now sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (authError) {
        return { user: null, error: 'Login failed. Please try again.' };
      }

      // Return the user data from our database
      return { user: dbUser, error: null };
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