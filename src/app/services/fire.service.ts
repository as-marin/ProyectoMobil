import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { User } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  auth =  inject(AngularFireAuth);



  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password); 
  }

}
