import { FireService } from './../../../services/fire.service';
import { Component, OnInit, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormControl, FormGroup, NgForm, NgModel, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/usuario.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  
  /*loginData = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  };*/


  loginForm= new FormGroup({
    uid: new FormControl(''),
    email:new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', [Validators.required]),
    nombre:new FormControl('', [Validators.required]),
    apellido:new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
    
  });


  constructor(private navCtrl: NavController, private router: Router) { }


  firebaseservice = inject(FireService);
  utilservice = inject(UtilsService)


  ngOnInit() {
  }


  async submit() {
    if (this.loginForm.valid) {

      const loading = await this.utilservice.loading();
      await loading.present();  

      this.firebaseservice.signUp(this.loginForm.value as User).then(async res =>{
        
       await this.firebaseservice.updateUser(this.loginForm.value.nombre)


       let uid = res.user.uid;
        this.loginForm.controls.uid.setValue(uid);

        this.setUserInfo(uid)


      }).catch(error => {
        console.log(error);

        this.utilservice.presentToast({
          message: error.message,
          duration: 2000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() =>  {
        loading.dismiss()
      })
    }
  }

  

  async setUserInfo(uid: string) {
    if (this.loginForm.valid) {

      const loading = await this.utilservice.loading();
      await loading.present();  

      let path = `users/${uid}`
      delete this.loginForm.value.password

      this.firebaseservice.setDocument(path, this.loginForm.value).then(async res =>{
        
        this.utilservice.saveInLocalStorage('user', this.loginForm.value)
        this.utilservice.routerLink('/login');
        this.loginForm.reset();


      }).catch(error => {
        console.log(error);

        this.utilservice.presentToast({
          message: error.message,
          duration: 2000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() =>  {
        loading.dismiss()
      })
    }
  }




  goBack() {
    this.navCtrl.back();
  }
}
