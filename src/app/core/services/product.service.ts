import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { deleteDoc, doc, query, updateDoc, where } from 'firebase/firestore';
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
    await addDoc(productCollection, productWithUserId);
  }

  /**
   * Obtém os produtos do usuário autenticado.
   * @returns Observable com a lista de produtos do usuário.
   */
  getProducts() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado!');
    }

    // Filtra os produtos diretamente na consulta Firestore
    const productCollection = collection(this.firestore, 'products');
    const userProductsQuery = query(
      productCollection,
      where('userId', '==', currentUser.uid)
    );

    return collectionData(userProductsQuery, { idField: 'id' });
  }

  /**
   * Obtém um produto específico pelo ID.
   * @param productId ID do produto a ser obtido.
   * @return Promise com os dados do produto.
   */
  deleteProduct(productId: string): Promise<void> {
    const productCollection = collection(this.firestore, 'products');
    const productDocRef = doc(productCollection, productId);
    return deleteDoc(productDocRef);
  }

  updateProductStock(productId: string, newStock: number) {
    const productDoc = doc(this.firestore, `products/${productId}`);
    return updateDoc(productDoc, { stock: newStock });
  }
}
