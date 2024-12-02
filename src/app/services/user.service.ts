import { Injectable } from '@angular/core';
import { getAuth, updateEmail, reauthenticateWithCredential, EmailAuthProvider, User, sendEmailVerification } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  async modifyUserEmail(newEmail: string, currentPassword: string): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        // Reautenticar al usuario
        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Actualizar el correo electrónico
        await updateEmail(user, newEmail);

        // Enviar correo de verificación al nuevo email
        await sendEmailVerification(user);
        
        console.log('Correo de verificación enviado al nuevo email.');
      } catch (error) {
        console.error('Error al actualizar el correo:', error);
        throw error;
      }
    } else {
      throw new Error('No hay un usuario autenticado');
    }
  }
}
