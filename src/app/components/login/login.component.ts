import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {SocialAuthService} from "angularx-social-login";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  //email: string | undefined;
  //password: string | undefined;

  constructor(private authService:SocialAuthService,
              private router:Router,
              private userService:UserService,
              private route:ActivatedRoute) {
  }

  ngOnInit(): void{
    // this.userService.authState$.subscribe(authState=>{
    //   if (authState){
    //     this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile');
    //   }else{
    //     this.router.navigateByUrl('/login');
    //   }
    // })
  }

  // login(form: NgForm) {
  //   const email = this.email;
  //   const password = this.password;

  //   if (form.invalid){
  //     return;
  //   }
  //   form.reset();
  //   this.userService.loginUser(email,password);
  // }

  // signInWithGoogle() {
  //   this.userService.googleLogin();
  // }

  emailValidation: boolean = true;
  isLoggedIn = true;
  signupUsers: any[] = [];
  signupObj: any = {
    userName: '',
    email: '',
    password: '',
  };
  loginObj: any = {
   
    email: '',
    password: '',
  };

  signUp() {
    this.signupUsers.push(this.signupObj);
    const beforeLength = this.signupUsers.length;

    this.signupUsers = this.signupUsers.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.userName === value.userName &&
            t.email === value.email &&
            t.password === value.password
        )
    );
    const afterLength = this.signupUsers.length;
    if (beforeLength === afterLength) {
      localStorage.setItem('signupUsers', JSON.stringify(this.signupUsers));
      this.signupObj = {
        userName: '',
        email: '',
        password: '',
      };
    } else {
      alert('already registered');
    }
  }


  
  login(event: any) {
    
    event.preventDefault();
    //this.signupUsers.push(this.loginObj);
    const isUserExist = this.signupUsers.find(
      (m) =>
        m.email == this.loginObj.email && m.password == this.loginObj.password
    );
    if (isUserExist != undefined) {
      alert('login successfully!!');
    //   const beforeLength = this.signupUsers.length;
    //   this.signupUsers = this.signupUsers.filter(
    //     (value, index, self) =>
    //       index ===
    //       self.findIndex(
    //         (t) =>
             
    //           t.email === value.email &&
    //           t.password === value.password
    //       )
    //   );
    //   const afterLength = this.signupUsers.length;
    //   if (beforeLength === afterLength) {
    //   localStorage.setItem('signupUsers', JSON.stringify(this.signupUsers));
    //   this.loginObj = {
        
    //     email: '',
    //     password: '',
    //   };
    // }
      this.router.navigate(['/home']);
    } else {
      alert('Wrong credentials');
    }
  }
  logout(){
    
  }


}
