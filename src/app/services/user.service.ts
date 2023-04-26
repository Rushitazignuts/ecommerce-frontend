import { Injectable } from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth = false;
  private SERVER_URL = environment.SERVER_URL;
  private user:any;
  authState$ = new BehaviorSubject<boolean>(this.auth);
  // @ts-ignore
  userData$ = new BehaviorSubject<SocialUser>(null);

  // @ts-ignore
  constructor(private authService:SocialAuthService,
              private httpClient:HttpClient) {
    authService.authState.subscribe((user:SocialUser)=>{
      if(user != null){
        this.auth = true;
        this.authState$.next(this.auth);
        this.userData$.next(user);
      }
    });

  }
  //Google Authentication
  googleLogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(r => console.log(r));
  }

  //Login User with Email and Password
  loginUser(email: string | undefined, password: string | undefined) {
    this.httpClient.post(`${this.SERVER_URL}/auth/login`,{email,password})
      .subscribe((data:ResponseModel|any)=>{
        this.auth = data.auth;
        this.authState$.next(this.auth);
        this.userData$.next(data);
      })
  }

  logout(){
    this.authService.signOut().then(r => console.log(r));
    this.auth = false;
    this.authState$.next(this.auth);
  }
}

export interface ResponseModel{
  token:string;
  auth:boolean;
  email:string;
  username:string;
  fname:string;
  lname:string;
  photoUrl:string;
  userId:number;
}
