import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { deleteDoc, doc, query, Timestamp, where } from 'firebase/firestore';
import { Observable, switchMap, take } from 'rxjs';
import { Client } from '../models/clientDTO';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  constructor() {}

  /**
   * Registra uma auditoria de operações de clientes no Firestore.
   * @param clientId ID do cliente afetado pela operação.
   * @param operation Tipo de operação realizada (add, update, delete).
   * @param before Dados do cliente antes da operação (opcional).
   * @param after Dados do cliente após a operação (opcional).
   */
  private async logAudit(
    clientId: string,
    operation: 'add' | 'update' | 'delete',
    before: any = null,
    after: any = null
  ): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado!');
    }

    const auditLog = {
      clientId,
      operation,
      userId: currentUser.uid,
      timestamp: Timestamp.now(),
      before,
      after,
    };

    const auditCollection = collection(this.firestore, 'client_audit');
    await addDoc(auditCollection, auditLog);
  }

  /**
   * Adiciona um novo cliente ao Firestore.
   * @param clientData Dados do cliente a serem adicionados.
   * @returns Promise que resolve quando o cliente for adicionado.
   */
  async addClient(clientData: Client): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado!');
    }

    const clientWithUserId = {
      ...clientData,
      userId: currentUser.uid,
    };

    const clientCollection = collection(this.firestore, 'clients');
    const docRef = await addDoc(clientCollection, clientWithUserId);

    // Registrar auditoria
    await this.logAudit(docRef.id, 'add', null, clientWithUserId);
  }

  /**
   * Obtém os clientes do usuário autenticado.
   * @returns Observable com a lista de clientes do usuário.
   */
  getClients(): Observable<any[]> {
    return this.authService.currentUser$.pipe(
      take(1), // Aguarda o estado do usuário ser carregado
      switchMap((user) => {
        if (!user) {
          throw new Error('Usuário não autenticado!');
        }

        // Filtra os clientes diretamente na consulta Firestore
        const clientCollection = collection(this.firestore, 'clients');
        const userClientsQuery = query(
          clientCollection,
          where('userId', '==', user.uid)
        );

        return collectionData(userClientsQuery, { idField: 'id' });
      })
    );
  }

  /**
   * Obtém um cliente específico pelo ID.
   * @param clientId ID do cliente a ser obtido.
   * @return Promise com os dados do cliente.
   */
  async deleteClient(clientId: string): Promise<void> {
    const clientCollection = collection(this.firestore, 'clients');
    const clientDocRef = doc(clientCollection, clientId);

    await this.logAudit(clientId, 'delete', clientDocRef, null);

    return deleteDoc(clientDocRef);
  }
}
