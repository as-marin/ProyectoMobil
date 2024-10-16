import { FireService } from './../../../services/fire.service';
import { Component, OnInit, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormControl, FormGroup, NgForm, NgModel, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/usuario.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm= new FormGroup({
    email:new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', [Validators.required])
  });
  constructor(private navCtrl: NavController, private router: Router, /*private fires:FireService*/) {}  

  firebaseservice = inject(FireService);

  ngOnInit() {}


  submit() {
    if (this.loginForm.valid) {
      this.firebaseservice.signIn(this.loginForm.value as User).then( res =>{
        
        console.log(res)
      })
    }
  }
   
   /*async onSubmit(){
    try {
      const {email,password} = this.loginForm.value;
      await this.fires.signIn(email!,password!);
    } catch (error) {
      
    }

  }*/


  goBack() {
    this.navCtrl.back();
  }
    
}
