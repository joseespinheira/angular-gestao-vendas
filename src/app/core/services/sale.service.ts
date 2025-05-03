import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  query,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, switchMap, take } from 'rxjs';
import { Sale } from '../models/saleDTO';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  constructor() {}

  /**
   * Registra uma auditoria de operações de vendas no Firestore.
   * @param saleId ID do venda afetado pela operação.
   * @param operation Tipo de operação realizada (add, update, delete).
   * @param before Dados do venda antes da operação (opcional).
   * @param after Dados do venda após a operação (opcional).
   */
  private async logAudit(
    saleId: string,
    operation: 'add' | 'update' | 'delete',
    before: any = null,
    after: any = null
  ): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado!');
    }

    const auditLog = {
      saleId,
      operation,
      userId: currentUser.uid,
      timestamp: Timestamp.now(),
      before,
      after,
    };

    const auditCollection = collection(this.firestore, 'sale_audit');
    await addDoc(auditCollection, auditLog);
  }

  /**
   * Adiciona um novo venda ao Firestore.
   * @param saleData Dados do venda a serem adicionados.
   * @returns Promise que resolve quando o venda for adicionado.
   */
  async addSale(saleData: Sale): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado!');
    }

    const saleWithUserId = {
      ...saleData,
      userId: currentUser.uid,
    };

    const saleCollection = collection(this.firestore, 'sales');
    const docRef = await addDoc(saleCollection, saleWithUserId);

    // Atualizar o estoque dos produtos
    for (const product of saleData.products) {
      const productDocRef = doc(this.firestore, `products/${product.id}`);
      const productSnapshot = await getDoc(productDocRef);

      if (productSnapshot.exists()) {
        const currentStock = productSnapshot.data()['stock'] || 0;
        const newStock = currentStock - product.stock;

        if (newStock < 0) {
          throw new Error(
            `Estoque insuficiente para o produto ${product.name}.`
          );
        }

        await updateDoc(productDocRef, { stock: newStock });
      }
    }

    // Registrar auditoria
    await this.logAudit(docRef.id, 'add', null, saleWithUserId);
  }

  /**
   * Obtém os vendas do usuário autenticado.
   * @returns Observable com a lista de vendas do usuário.
   */
  getSales(): Observable<any[]> {
    return this.authService.currentUser$.pipe(
      take(1), // Aguarda o estado do usuário ser carregado
      switchMap((user) => {
        if (!user) {
          throw new Error('Usuário não autenticado!');
        }

        // Filtra os vendas diretamente na consulta Firestore
        const saleCollection = collection(this.firestore, 'sales');
        const userSalesQuery = query(
          saleCollection,
          where('userId', '==', user.uid)
        );

        return collectionData(userSalesQuery, { idField: 'id' });
      })
    );
  }

  /**
   * Obtém um venda específico pelo ID.
   * @param saleId ID do venda a ser obtido.
   * @return Promise com os dados do venda.
   */
  async deleteSale(saleId: string): Promise<void> {
    const saleCollection = collection(this.firestore, 'sales');
    const saleDocRef = doc(saleCollection, saleId);

    await this.logAudit(saleId, 'delete', saleDocRef, null);

    return deleteDoc(saleDocRef);
  }
}
