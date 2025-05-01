import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore } from '@angular/fire/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { DocumentData, getDoc, setDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(!!user); // Estado de carregamento concluído
    });
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  /**
   * Realiza o login do usuário com email e senha.
   * @param email Email ou CPF do usuário.
   * @param password Senha do usuário.
   */
  async login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Registra um novo usuário com email e senha.
   * @param email Email ou CPF do usuário.
   * @param password Senha do usuário.
   * @returns Um objeto UserCredential que contém informações sobre o usuário autenticado.
   */
  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Envia um email para recuperação de senha.
   * @param email Email do usuário.
   * @returns Uma Promise que resolve quando o email é enviado com sucesso.
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
   * @returns Uma Promise que resolve quando o logout é concluído.
   */
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  /**
   * @returns O usuário atual autenticado.
   * Retorna null se não houver usuário autenticado.
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Salva os dados do usuário no Firestore.
   * @param email Email do usuário.
   */
  async saveUserData(email: string, phone: string, cpf: string): Promise<any> {
    const userId = this.getCurrentUser()?.uid;
    if (!userId) {
      return Promise.reject('Usuário não autenticado.');
    }

    const userRef = doc(this.firestore, `users/${userId}`);
    const userData = {
      email: email,
      phone: phone,
      cpf: cpf,
      profile: '1',
      status: '1',
      createdAt: new Date(),
    };

    return setDoc(userRef, userData)
      .then(() => {
        console.log('Dados do usuário salvos com sucesso no Firestore!');
      })
      .catch((error) => {
        console.error(
          'Erro ao salvar os dados do usuário no Firestore:',
          error
        );
        throw error;
      });
  }

  /**
   * Recupera os dados do usuário do Firestore.
   * @returns Os dados do usuário ou null se não encontrado.
   */
  async getUserData(): Promise<DocumentData | null> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      return Promise.reject('Usuário não autenticado.');
    }

    const userRef = doc(this.firestore, `users/${userId}`);
    return getDoc(userRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log('Documento do usuário encontrado:', docSnapshot);
          return docSnapshot.data();
        } else {
          console.warn('Documento do usuário não encontrado.');
          return null;
        }
      })
      .catch((error) => {
        console.error('Erro ao recuperar os dados do usuário:', error);
        throw error;
      });
  }
}
