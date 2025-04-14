import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private afAuth = inject (AngularFireAuth);
  private auth = inject(Auth);
  constructor() {}

  /**
   * Realiza o login do usuário com email e senha.
   * @param email Email ou CPF do usuário.
   * @param password Senha do usuário.
   */
  login(email: string, password: string): Promise<any> {
    // return new Promise((resolve, reject) => {resolve(true); reject();});
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Registra um novo usuário com email e senha.
   * @param email Email ou CPF do usuário.
   * @param password Senha do usuário.
   */
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Envia um email para recuperação de senha.
   * @param email Email do usuário.
   */
  recoverPassword(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
      reject();
    });
    // return this.afAuth.sendPasswordResetEmail(email);
  }

  /**
   * Faz o logout do usuário.
   */
  logout() {
    return signOut(this.auth);
  }

  /**
   * @returns O usuário atual autenticado.
   * Retorna null se não houver usuário autenticado.
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
