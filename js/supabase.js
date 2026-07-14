/**
 * Supabase SDK Real Implementation
 * Connects to the Blip Supabase Backend
 */

const SUPABASE_URL = 'https://xnlajkgurdhhsgtodess.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubGFqa2d1cmRoaHNndG9kZXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NTI5MTIsImV4cCI6MjA5OTQyODkxMn0.JkQxHQXpg9KVLI8qfm8V12lvlkLwigmM8X523S3Ss8I';

let supabaseClient = null;

if (typeof window !== 'undefined' && window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error("Supabase client library not loaded. Ensure the CDN script is included in the HTML.");
}

export const supabaseAuth = {
  async signIn(email, password) {
    if (!supabaseClient) return { error: { message: 'Supabase client not initialized' } };
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error, user: data?.user };
  },

  async signUp(fullName, email, password) {
    if (!supabaseClient) return { error: { message: 'Supabase client not initialized' } };
    
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    return { error, user: data?.user };
  },

  async resetPassword(email) {
    if (!supabaseClient) return { error: { message: 'Supabase client not initialized' } };
    
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password.html',
    });
    
    return { error, message: 'Password reset email sent' };
  },

  async updatePassword(newPassword) {
    if (!supabaseClient) return { error: { message: 'Supabase client not initialized' } };
    
    const { data, error } = await supabaseClient.auth.updateUser({
      password: newPassword
    });
    
    return { error, user: data?.user };
  },

  async verifyOtp(email, token, type = 'signup') {
    if (!supabaseClient) return { error: { message: 'Supabase client not initialized' } };
    
    const { data, error } = await supabaseClient.auth.verifyOtp({
      email,
      token,
      type
    });
    
    return { error, session: data?.session };
  },

  async resendOtp(email, type = 'signup') {
    if (!supabaseClient) return { error: { message: 'Supabase client not initialized' } };
    
    const { data, error } = await supabaseClient.auth.resend({
      type,
      email,
      options: {
        emailRedirectTo: window.location.origin + '/login.html'
      }
    });
    
    return { error, message: 'Code resent' };
  },

  async signInWithGoogle() {
    if (!supabaseClient) return { error: { message: 'Supabase client not initialized' } };
    
    // We can show our custom loader page before redirecting, or just use Supabase's redirect.
    // For a seamless flow, we let Supabase handle the OAuth redirect directly.
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/google-auth.html'
      }
    });
    
    return { error };
  }
};
