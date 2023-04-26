// import { Injectable } from '@angular/core';
// import {HttpClient} from "@angular/common/http";
// import {ProductService} from "./product.service";
// import {environment} from "../../environments/environment";
// import {CartModelPublic, CartModelServer} from "../models/cart.model";
// import {BehaviorSubject} from "rxjs";
// import {OrderService} from "./order.service";
// import {NavigationExtras, Router} from "@angular/router";
// import {ProductModelServer} from "../models/product.model";
// import {ToastrModule, ToastrService} from "ngx-toastr";
// import {NgxSpinnerService} from "ngx-spinner";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private serverURL = environment.SERVER_URL;
//
//   //Data variable to store the cart info. on the client's local storage
//   private cartDataClient:CartModelPublic={
//     total : 0,
//     prodData:[{
//       incart:0,
//       id:0
//     }]
//   };
//
//   //Data variable to store cart info. on the server
//   private cartDataServer:CartModelServer = {
//     total : 0,
//     data:[{numInCart:0, product:undefined}]
//   };
//
//   // Observables for the components to subscribe
//   cartTotal$ = new BehaviorSubject<number>(0);
//   cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);
//
//   constructor(private http:HttpClient,
//               private productService:ProductService,
//               private orderService:OrderService,
//               private router:Router,
//               private toast:ToastrService,
//               private spinner:NgxSpinnerService) {
//     this.cartTotal$.next(this.cartDataServer.total);
//     this.cartData$.next(this.cartDataServer);
//
//     //Get the info. from localstorage if any.
//     // @ts-ignore
//     let info:CartModelPublic = localStorage.getItem('cart');
//     //Check if the info var. is null or has same data in it
//     if(info !== null && info !== undefined && info.prodData[0].incart !== 0){
//       // Local Storage is not empty and has some info.
//       this.cartDataClient = info;
//
//       //Loop through each and put it in the cartDataServer object
//       this.cartDataClient.prodData.forEach(p =>{
//         this.productService.getSingleProduct(p.id).subscribe((actualProductInfo:ProductModelServer) =>{
//           if (this.cartDataServer.data[0].numInCart === 0){
//             this.cartDataServer.data[0].numInCart = p.incart;
//             this.cartDataServer.data[0].product = actualProductInfo;
//             this.CalculateTotal();
//             this.cartDataClient.total = this.cartDataServer.total;
//             localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//
//           }else{
//
//             //CartDataServer already has same entry in it
//             this.cartDataServer.data.push({
//               numInCart:p.incart,
//               product:actualProductInfo
//             })
//             this.CalculateTotal();
//             this.cartDataClient.total = this.cartDataServer.total;
//             console.log('cartDataServer -> ',this.cartDataServer)
//             console.log('cartDataClient -> ',this.cartDataClient)
//             localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//           }
//           this.cartData$.next({...this.cartDataServer});
//         });
//       });
//     }
//   }
//
//   //Add Product to Cart
//   AddProductToCart(id:number,quantity?:number){
//     this.productService.getSingleProduct(id).subscribe(prod=>{
//       console.log(prod)
//       // 1 ->  If cart Empty
//       if (this.cartDataServer.data[0].product === undefined){
//         this.cartDataServer.data[0].product = prod;
//         this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
//         this.CalculateTotal();
//         this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
//         this.cartDataClient.total = this.cartDataServer.total;
//         this.cartDataClient.prodData[0].id = prod.id;
//         localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//         this.cartData$.next({...this.cartDataServer});
//
//         this.toast.success(`${prod.name} added to the cart`,'Product Added',{
//           timeOut:1500,
//           progressBar:true,
//           progressAnimation:'increasing',
//           positionClass:'toast-top-right'
//         });
//       }
//       // 2 -> if has same items
//       else {
//         let index = this.cartDataServer.data.findIndex(p => p.product?.id === prod.id); // -1 or Positive value
//
//         // a .if that item is already in the  cart => index is positive value
//         if (index !== -1){
//           if (quantity !== undefined && quantity <= prod.quantity){
//             this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
//           }else{
//             this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart+1 : prod.quantity;
//           }
//
//           this.CalculateTotal();
//           this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
//           this.cartDataClient.total = this.cartDataServer.total;
//           localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//           // this.cartData$.next({...this.cartDataServer});
//           this.toast.info(`${prod.name} quantity updated in the cart`,'Product Updated',{
//             timeOut:1500,
//             progressBar:true,
//             progressAnimation:'increasing',
//             positionClass:'toast-top-right'
//           });
//         }//end if
//         // b . if that item is not in the cart
//         else{
//           this.cartDataServer.data.push({
//             numInCart:1,
//             product:prod
//           });
//           this.cartDataClient.prodData.push({
//             incart:1,
//             id:prod.id
//           });
//           localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//           this.toast.success(`${prod.name} added to the cart`,'Product Added',{
//             timeOut:1500,
//             progressBar:true,
//             progressAnimation:'increasing',
//             positionClass:'toast-top-right'
//           });
//           this.CalculateTotal();
//           this.cartDataClient.total = this.cartDataServer.total;
//           localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//           this.cartData$.next({...this.cartDataServer});
//         }//end else
//       }
//
//     })
//
//
//     // 3 -> If the cart is already in cart
//
//     // 4 -> If that is not in the cart
//   }
//   UpdateCartItems (index:number,increase:boolean){
//     let data = this.cartDataServer.data[index];
//     if(increase){
//       // @ts-ignore
//       data.numInCart < data.product.quantity ? data.numInCart++ :data.product.quantity;
//       this.cartDataClient.prodData[index].incart = data.numInCart;
//       this.CalculateTotal();
//       this.cartDataClient.total = this.cartDataServer.total;
//       localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//       this.cartData$.next({...this.cartDataServer});
//     }else{
//       data.numInCart--;
//       if (data.numInCart < 1){
//         this.DeleteProductFromCart(index)
//         this.cartData$.next({...this.cartDataServer});
//       }else{
//         this.cartData$.next({...this.cartDataServer});
//         this.cartDataClient.prodData[index].incart = data.numInCart;
//         this.CalculateTotal();
//         this.cartDataClient.total = this.cartDataServer.total;
//         localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//         this.cartData$.next({...this.cartDataServer});
//       }
//     }
//   }
//
//   DeleteProductFromCart(index:number){
//     if (window.confirm('Are you sure you want to remove the product?')){
//       this.cartDataServer.data.splice(index,1);
//       this.cartDataClient.prodData.splice(index,1);
//       this.CalculateTotal();
//       this.cartDataClient.total = this.cartDataServer.total;
//       // this.cartData$.next({...this.cartDataServer});
//
//       if (this.cartDataClient.total === 0){
//         this.cartDataClient = {total:0,prodData:[{incart:0,id:0}]}
//         localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//       }else{
//         localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//       }
//
//       if (this.cartDataServer.total === 0){
//         this.cartDataServer ={ total:0,data:[{numInCart:0,product:undefined}]};
//         this.cartData$.next({...this.cartDataServer});
//       }else{
//         this.cartData$.next({...this.cartDataServer});
//       }
//     }
//     else{
//       //If the user clicks the cancel button
//       return;
//     }
//   }
//
//   private CalculateTotal(){
//     let Total = 0;
//     this.cartDataServer.data.forEach(p =>{
//       const {numInCart} = p;
//       // @ts-ignore
//       const {price} = p.product;
//
//       Total += numInCart * price;
//     });
//     this.cartDataServer.total = Total;
//     this.cartTotal$.next(this.cartDataServer.total);
//   }
//
//   CalculateSubTotal(index:number):number{
//     let subTotal = 0;
//     const p = this.cartDataServer.data[index];
//     // @ts-ignore
//     subTotal=p.product?.price*p.numInCart;
//     return subTotal;
//   }
//
//   CheckoutFromCart(userId:number){
//     // @ts-ignore
//     this.http.post(`${this.serverURL}/orders/payment`,null).subscribe((res:{success:boolean})=>{
//       if (res.success){
//         this.ResetServerData();
//         this.http.post(`${this.serverURL}/orders/new`,{
//           userId:userId,
//           products:this.cartDataClient.prodData
//         }).subscribe((data:orderResponse|any)=>{
//           this.orderService.getSingleOrder(data.order_id).then(prods=>{
//             if (data.success){
//               const navigationExtras:NavigationExtras={
//                 state:{
//                   message:data.message,
//                   products:prods,
//                   orderId:data.order_id,
//                   total:this.cartDataClient.total
//                 }
//               };
//               this.spinner.hide().then();
//               this.router.navigate(['/thankyou'],navigationExtras).then(p=>{
//                 this.cartDataClient = {total:0,prodData:[{incart:0,id:0}]};
//                 this.cartTotal$.next(0);
//                 localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
//               });
//             }
//           });
//         });
//       }else{
//         this.spinner.hide().then();
//         this.router.navigateByUrl('/checkout').then();
//         this.toast.error(`Sorry, failed to book the order`,'Order Status',{
//           timeOut:1500,
//           progressBar:true,
//           progressAnimation:'increasing',
//           positionClass:'toast-top-right'
//         });
//       }
//     });
//   }
//
//   private ResetServerData(){
//     this.cartDataServer ={
//       total:0,data:[{numInCart:0,product:undefined}]
//     };
//     this.cartData$.next({...this.cartDataServer});
//   }
//
// }
//
// interface orderResponse{
//   order_id:number,
//   success:boolean,
//   message:string,
//   products:[{id:string,numInCart:string}]
// }

import {Injectable} from '@angular/core';
import {ProductService} from "./product.service";
import {BehaviorSubject} from "rxjs";
import {CartModelPublic, CartModelServer} from "../models/cart.model";
import {ProductModelServer} from "../models/product.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {NavigationExtras, Router} from "@angular/router";
import {OrderService} from "./order.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})


export class CartService {

  ServerURL = environment.SERVER_URL;

  private cartDataClient: CartModelPublic = {prodData: [{incart: 0, id: 0}], total: 0};  // This will be sent to the backend Server as post data
  // Cart Data variable to store the cart information on the server
  private cartDataServer: CartModelServer = {
    data: [{
      product: undefined,
      numInCart: 0
    }],
    total: 0
  };

  cartTotal$ = new BehaviorSubject<Number>(0);
  // Data variable to store the cart information on the client's local storage

  cartDataObs$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);
  cartData$: any;


  constructor(private productService: ProductService,
              private orderService: OrderService,
              private httpClient: HttpClient,
              private router: Router,
              private spinner: NgxSpinnerService,
              private toast: ToastrService) {

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartDataObs$.next(this.cartDataServer);

    // @ts-ignore
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      // assign the value to our data variable which corresponds to the LocalStorage data format
      this.cartDataClient = info;
      // Loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProdInfo: ProductModelServer) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProdInfo;
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actualProdInfo
            });
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartDataObs$.next({...this.cartDataServer});
        });
      });
    }
  }

  CalculateSubTotal(index: number) {
    let subTotal = 0;

    let p = this.cartDataServer.data[index];
    // @ts-ignore
    subTotal = p.product.price * p.numInCart;

    return subTotal;
  }

  AddProductToCart(id: Number, quantity?: number) {

    // @ts-ignore
    this.productService.getSingleProduct(id).subscribe(prod => {
      // If the cart is empty
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({...this.cartDataServer});
        this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }  // END of IF
      // Cart is not empty
      else {
        // @ts-ignore
        let index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id);

        // 1. If chosen product is already in cart array
        if (index !== -1) {

          if (quantity !== undefined && quantity <= prod.quantity) {
            // @ts-ignore
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          } else {
            // @ts-ignore
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }


          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          this.toast.info(`${prod.name} quantity updated in the cart.`, "Product Updated", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }
        // 2. If chosen product is not in cart array
        else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1
          });
          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id
          });
          this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({...this.cartDataServer});
      }  // END of ELSE


    });
  }

  UpdateCartData(index: string | number, increase: Boolean) {
    // @ts-ignore
    let data = this.cartDataServer.data[index];
    if (increase) {
      // @ts-ignore
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      // @ts-ignore
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      this.cartDataObs$.next({...this.cartDataServer});
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {
      // @ts-ignore
      data.numInCart--;

      // @ts-ignore
      if (data.numInCart < 1) {
        if (typeof index === "number") {
          this.DeleteProductFromCart(index);
        }
        this.cartDataObs$.next({...this.cartDataServer});
      } else {
        // @ts-ignore
        this.cartDataObs$.next({...this.cartDataServer});
        // @ts-ignore
        this.cartDataClient.prodData[index].incart = data.numInCart;
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

    }

  }

  DeleteProductFromCart(index: number) {
    /*    console.log(this.cartDataClient.prodData[index].prodId);
        console.log(this.cartDataServer.data[index].product.id);*/

    if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          data: [{
            product: undefined,
            numInCart: 0
          }],
          total: 0
        };
        this.cartDataObs$.next({...this.cartDataServer});
      } else {
        this.cartDataObs$.next({...this.cartDataServer});
      }
    }
    // If the user doesn't want to delete the product, hits the CANCEL button
    else {
      return;
    }


  }

  CheckoutFromCart(userId: Number) {

    // @ts-ignore
    this.httpClient.post(`${this.ServerURL}/orders/payment`, null).subscribe((res: { success: Boolean }) => {
      console.clear();

      if (res.success) {


        this.resetServerData();

        this.httpClient.post(`${this.ServerURL}/orders/`, {
          userId: userId,
          products: this.cartDataClient.prodData
        }).subscribe((data: OrderConfirmationResponse|any) => {

          // @ts-ignore
          this.orderService.getSingleOrder(data.order_id).then(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.total
                }
              };
              this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
              });
            }
          });

        })
      } else {
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error(`Sorry, failed to book the order`, "Order Status", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
    })
  }


  private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      // @ts-ignore
      const {price} = p.product;
      // @ts-ignore
      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  private resetServerData() {
    this.cartDataServer = {
      data: [{
        product: undefined,
        numInCart: 0
      }],
      total: 0
    };
    this.cartDataObs$.next({...this.cartDataServer});
  }

}

interface OrderConfirmationResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: string,
    numInCart: string
  }]
}



