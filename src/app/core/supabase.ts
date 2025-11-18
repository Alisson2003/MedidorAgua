import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  get client() {
    return this.supabase;
  }

  /** LOGIN */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  /** REGISTRO SIMPLE (solo auth) */
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  /** REGISTRO CON ROL */
  async signUpWithRol(email: string, password: string, rol: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;

    const user = data.user;
    if (!user) throw new Error("No se pudo crear el usuario");

    // Insertar en tabla 'usuarios'
    const { error: insertError } = await this.supabase
      .from('usuarios')
      .insert([{ id: user.id, email, rol }]);

    if (insertError) throw insertError;

    return user;
  }


  /** LOGOUT */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  /** SESIÓN ACTUAL */
  async getCurrentSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  /** INSERTAR LECTURA */
  async insertarLectura(lectura: any) {
    const { data, error } = await this.supabase.from('lecturas').insert([lectura]);
    if (error) throw error;
    return data;
  }

  /** OBTENER LECTURAS */
  async obtenerLecturas(userId: string, esAdmin = false) {
    let query = this.supabase.from('lecturas').select('*');
    if (!esAdmin) query = query.eq('user_id', userId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  /** SUBIR FOTO */
  async subirFoto(nombre: string, archivo: Blob) {
    const { data, error } = await this.supabase.storage
      .from('lecturas')
      .upload(nombre, archivo, { contentType: 'image/jpeg' });
    if (error) throw error;

    const urlData = this.supabase.storage.from('lecturas').getPublicUrl(nombre);
    return urlData.data.publicUrl;
  }

  /** OBTENER ROL DEL USUARIO */
  async getRolUsuario(userId: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('rol')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data?.rol;
  }
}
