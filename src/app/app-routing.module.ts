import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ProductComponent} from "./components/product/product.component";
import {CartComponent} from "./components/cart/cart.component";
import {ChackoutComponent} from "./components/chackout/chackout.component";
import {ThankyouComponent} from "./components/thankyou/thankyou.component";
import {LoginComponent} from "./components/login/login.component";
import {ProfileGuard} from "./guard/profile.guard";
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'homme',component:HomeComponent},
  {path:'product/:id',component:ProductComponent},
  {path:'product',component:ProductComponent},
  {path:'cart',component:CartComponent},
  {path:'checkout',component:ChackoutComponent},
  {path:'thankyou',component:ThankyouComponent},
  {path:'login',component:LoginComponent},
  {path:'profile',component:ProfileComponent,canActivate:[ProfileGuard]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
