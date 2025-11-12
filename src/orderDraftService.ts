import { supabase } from './supabase';

export interface OrderDraftData {
  primaryContact: {
    name: string;
    company: string;
    address: string;
    city: string;
    stateProvince: string;
    zipCode: string;
    country: string;
    email: string;
    daytimeTel: string;
  };
  returnShipping: {
    sameAsPrimary: boolean;
    name: string;
    company: string;
    address: string;
    city: string;
    stateProvince: string;
    zipCode: string;
    country: string;
    email: string;
    daytimeTel: string;
  };
  documents: Array<{
    title: string;
    qty: number;
    country: string;
  }>;
  dateNeeded: string;
  entityRecord: {
    entityName: string;
    state: string;
    entityNumber: string;
    documents: Array<{
      title: string;
      dateFiled: string;
      qty: number;
    }>;
    apostille: string;
    destinationCountry: string;
  };
  translations: Array<{
    title: string;
    targetLanguage: string;
    destinationCountry: string;
  }>;
  translationApostille: {
    apostilleTranslation: string;
    translationDestination: string;
    apostilleOriginal: string;
    originalDestination: string;
  };
  specialServices: {
    scannedCopy: boolean;
    scannedEmails: string[];
    arabChamber: boolean;
  };
  specialInstructions: string;
}

export class OrderDraftService {
  static async saveDraft(formData: OrderDraftData): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data: existingDraft } = await supabase
        .from('order_drafts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingDraft) {
        const { error } = await supabase
          .from('order_drafts')
          .update({
            form_data: formData,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) {
          return { success: false, error: error.message };
        }
      } else {
        const { error } = await supabase
          .from('order_drafts')
          .insert({
            user_id: user.id,
            form_data: formData
          });

        if (error) {
          return { success: false, error: error.message };
        }
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Save draft error:', error);
      return { success: false, error: 'Failed to save draft' };
    }
  }

  static async getDraft(): Promise<{ draft: OrderDraftData | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { draft: null, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('order_drafts')
        .select('form_data')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        return { draft: null, error: error.message };
      }

      if (!data) {
        return { draft: null, error: null };
      }

      return { draft: data.form_data as OrderDraftData, error: null };
    } catch (error) {
      console.error('Get draft error:', error);
      return { draft: null, error: 'Failed to load draft' };
    }
  }

  static async deleteDraft(): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('order_drafts')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Delete draft error:', error);
      return { success: false, error: 'Failed to delete draft' };
    }
  }
}
