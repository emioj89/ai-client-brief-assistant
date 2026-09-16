import { getSupabaseClient } from '../lib/supabase';
import type { Brief, CreateBriefFormData } from '../types/brief';

export const briefsService = {
  async getBriefs(): Promise<Brief[]> {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('briefs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Unable to load your briefs. Please try again.');
    }

    return (data as Brief[]) || [];
  },

  async getBriefById(id: string): Promise<Brief> {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('briefs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error('Unable to load this brief. Please try again.');
    }

    return data as Brief;
  },

  async deleteBrief(id: string): Promise<void> {
    const client = getSupabaseClient();

    const { error } = await client
      .from('briefs')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error('Unable to delete this brief. Please try again.');
    }
  },

  async analyzeBrief(formData: CreateBriefFormData): Promise<Brief> {
    const client = getSupabaseClient();

    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError || !sessionData.session) {
      throw new Error('Your session has expired. Please sign in again.');
    }

    const { data, error } = await client.functions.invoke('analyze-brief', {
      body: {
        project_title: formData.project_title.trim(),
        client_name: formData.client_name.trim() || null,
        raw_request: formData.raw_request.trim(),
      },
    });

    if (error) {
      const msg = error.message || 'Unable to analyze the brief right now. Please try again.';
      throw new Error(msg);
    }

    if (!data || !data.id) {
      throw new Error('Unable to analyze the brief right now. Please try again.');
    }

    return data as Brief;
  },
};

