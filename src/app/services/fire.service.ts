import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,sendPasswordResetEmail, } from "firebase/auth";
import { User } from '../models/usuario.model';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { getFirestore,setDoc,doc, getDoc } from "@angular/fire/firestore";
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FireService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore)


  getUserData() {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          const userId = user.uid;
          return this.firestore.collection('users').doc(userId).valueChanges();
        } else {
          // Si no hay usuario autenticado, retorna null
          return new Observable<null>(observer => observer.next(null));
        }
      })
    );
  }


  logout() {
    return this.auth.signOut(); // Esto cierra la sesión del usuario en Firebase
  }
  


  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }



  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password,);
  }


  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email)
  }



  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(),path), data)
  }


  async getDocument(path: string) {
     return (await getDoc(doc(getFirestore(),path))).data();
  }
}
