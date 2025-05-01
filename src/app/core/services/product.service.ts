import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import {
  deleteDoc,
  doc,
  getDoc,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable, switchMap, take } from 'rxjs';
import { Product } from '../models/productDTO';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  constructor() {}

  /**
   * Registra uma auditoria de operações de produtos no Firestore.
   * @param productId ID do produto afetado pela operação.
   * @param operation Tipo de operação realizada (add, update, delete).
   * @param before Dados do produto antes da operação (opcional).
   * @param after Dados do produto após a operação (opcional).
   */
  private async logAudit(
    productId: string,
    operation: 'add' | 'update' | 'delete',
    before: any = null,
    after: any = null
  ): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado!');
    }

    const auditLog = {
      productId,
      operation,
      userId: currentUser.uid,
      timestamp: Timestamp.now(),
      before,
      after,
    };

    const auditCollection = collection(this.firestore, 'product_audit');
    await addDoc(auditCollection, auditLog);
  }

  /**
   * Adiciona um novo produto ao Firestore.
   * @param productData Dados do produto a serem adicionados.
   * @returns Promise que resolve quando o produto for adicionado.
   */
  async addProduct(productData: Product): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado!');
    }

    const productWithUserId = {
      ...productData,
      userId: currentUser.uid,
    };

    const productCollection = collection(this.firestore, 'products');
    const docRef = await addDoc(productCollection, productWithUserId);

    // Registrar auditoria
    await this.logAudit(docRef.id, 'add', null, productWithUserId);
  }

  /**
   * Obtém os produtos do usuário autenticado.
   * @returns Observable com a lista de produtos do usuário.
   */
  getProducts(): Observable<any[]> {
    return this.authService.currentUser$.pipe(
      take(1), // Aguarda o estado do usuário ser carregado
      switchMap((user) => {
        if (!user) {
          throw new Error('Usuário não autenticado!');
        }

        // Filtra os produtos diretamente na consulta Firestore
        const productCollection = collection(this.firestore, 'products');
        const userProductsQuery = query(
          productCollection,
          where('userId', '==', user.uid)
        );

        return collectionData(userProductsQuery, { idField: 'id' });
      })
    );
  }

  /**
   * Obtém um produto específico pelo ID.
   * @param productId ID do produto a ser obtido.
   * @return Promise com os dados do produto.
   */
  async deleteProduct(productId: string): Promise<void> {
    const productCollection = collection(this.firestore, 'products');
    const productDocRef = doc(productCollection, productId);

    await this.logAudit(productId, 'delete', productDocRef, null);

    return deleteDoc(productDocRef);
  }

  /**
   * Atualiza o estoque de um produto.
   * @param productId ID do produto a ser atualizado.
   * @param newStock Novo valor de estoque.
   * @return Promise que resolve quando o estoque for atualizado.
   */
  async updateProductStock(productId: string, newStock: number): Promise<void> {
    const productDoc = doc(this.firestore, `products/${productId}`);

    // Obter os dados do documento antes da atualização
    const productSnapshot = await getDoc(productDoc);
    if (!productSnapshot.exists()) {
      throw new Error('Produto não encontrado!');
    }

    const before = productSnapshot.data();
    const after = { ...before, stock: newStock };

    await updateDoc(productDoc, { stock: newStock });

    await this.logAudit(productId, 'update', before, after);
  }
}
