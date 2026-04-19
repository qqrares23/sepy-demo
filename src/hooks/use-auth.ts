import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (id: string, email: string, createdAt: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setUser({
        id,
        email,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        tier: data.tier,
        created_at: createdAt,
      });
    } else {
      // Fallback if profile trigger hasn't run yet
      setUser({ id, email, created_at: createdAt });
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email ?? '', session.user.created_at);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email ?? '', session.user.created_at);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateProfile = async (updates: { full_name?: string, avatar_url?: string }) => {
    if (!user) return { error: "No user" };
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (!error) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
    return { error };
  };

  const updateAccount = async (updates: { email?: string, password?: string }) => {
    const { error } = await supabase.auth.updateUser(updates);
    if (!error && updates.email) {
      setUser(prev => prev ? { ...prev, email: updates.email! } : null);
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut, updateProfile };
};
