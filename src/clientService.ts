import { supabase } from './supabase';

export interface Client {
  id: string;
  user_id: string;
  full_name: string;
  company?: string;
  website?: string;
  office_email?: string;
  office_phone?: string;
  mobile_phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  full_name: string;
  company?: string;
  website?: string;
  office_email?: string;
  office_phone?: string;
  mobile_phone?: string;
  address?: string;
}

export class ClientService {
  static async createClient(clientData: CreateClientData): Promise<{ client: Client | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { client: null, error: 'User not authenticated' };
      }

      const { data: client, error } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          ...clientData
        })
        .select()
        .single();

      if (error) {
        return { client: null, error: error.message };
      }

      return { client, error: null };
    } catch (error) {
      console.error('Create client error:', error);
      return { client: null, error: 'Failed to create client' };
    }
  }

  static async getClients(): Promise<{ clients: Client[]; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { clients: [], error: 'User not authenticated' };
      }

      const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        return { clients: [], error: error.message };
      }

      return { clients: clients || [], error: null };
    } catch (error) {
      console.error('Get clients error:', error);
      return { clients: [], error: 'Failed to fetch clients' };
    }
  }

  static async updateClient(clientId: string, updates: Partial<CreateClientData>): Promise<{ client: Client | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { client: null, error: 'User not authenticated' };
      }

      const { data: client, error } = await supabase
        .from('clients')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return { client: null, error: error.message };
      }

      return { client, error: null };
    } catch (error) {
      console.error('Update client error:', error);
      return { client: null, error: 'Failed to update client' };
    }
  }

  static async deleteClient(clientId: string): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        .eq('user_id', user.id);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Delete client error:', error);
      return { error: 'Failed to delete client' };
    }
  }
}