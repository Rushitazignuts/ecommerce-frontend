import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ProductModelServer} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;
  constructor(private http:HttpClient,
              private router:Router) { }

  //This is to fetch all products from the backend server
  getAllProducts(numberOfResults=10):Observable<ProductService>{
    return this.http.get<ProductService>(this.SERVER_URL + '/products/',{
      params:{limit:numberOfResults.toString()}
    });
  }

  //GET single product from server
  getSingleProduct(id:number):Observable<ProductModelServer>{
    return this.http.get<ProductModelServer>(this.SERVER_URL+'/products/'+id);
  }

  //GET products from one category
  getProductsFromCategory(catName:string):Observable<ProductModelServer[]>{
    return this.http.get<ProductModelServer[]>(this.SERVER_URL+'/products/category/'+catName);
}
}
