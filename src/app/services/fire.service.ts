import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private fauth:AngularFireAuth) { }

 async login(email:string,
        password:string) {
          const user=await this.fauth.signInWithEmailAndPassword(email,password);
          return user;
        }

async register(nombre:string,
  apellido:string,
  email:string,
  password:string) {
    const user=await this.fauth.createUserWithEmailAndPassword(email,password);
    return user;
  }

}
