import { Component, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {OrderService} from "../../services/order.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {CartModelServer} from "../../models/cart.model";

@Component({
  selector: 'app-chackout',
  templateUrl: './chackout.component.html',
  styleUrls: ['./chackout.component.scss']
})
export class ChackoutComponent implements OnInit {

  cartTotal:number|any;
  cartData:CartModelServer|any;

  constructor(private cartServices:CartService,
              private orderService:OrderService,
              private router:Router,
              private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.cartServices.cartDataObs$.subscribe(data=>this.cartData = data);
    this.cartServices.cartTotal$.subscribe(total=>this.cartTotal = total);
  }

  onCheckout() {
    this.spinner.show().then(p=>{
      this.cartServices.CheckoutFromCart(2);
    })
  }
}
