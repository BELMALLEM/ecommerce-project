import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.api.url;

  constructor(private httpClient: HttpClient) { }

  
  getProduct(productId: number): Observable<Product> {
    //building the url based on the productId
    const searchUrl = `${this.baseUrl}/products/${productId}`;

    return this.httpClient.get<Product>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {

    //building the url based on the categoyId
    const searchUrl = `${this.baseUrl}/products/search/category?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductListPaginate(pageNumber: number, 
                        pageSize: number, 
                        categoryId: number): Observable<GetResponseProducts> {

    //building the url based on the categoyId, page number and size
    const searchUrl = `${this.baseUrl}/products/search/category?id=${categoryId}` +
                    `&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {

    //building the url based on the keyword
    const searchUrl = `${this.baseUrl}/products/search/contains?name=${keyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(pageNumber: number, 
                 pageSize: number, 
                 keyword: string): Observable<GetResponseProducts> {

    //building the url based on the keyword, page number and size
    const searchUrl = `${this.baseUrl}/products/search/contains?name=${keyword}` +
                    `&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const searchUrl = `${this.baseUrl}/product-category`;

    return this.httpClient.get<GetResponseProductCategory>(searchUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
