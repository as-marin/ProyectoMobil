import { Component, OnDestroy, OnInit } from '@angular/core';
import { FireService } from '../../../services/fire.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from 'src/app/services/utils.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, OnDestroy {
  user: any;
  lastAttendance: any;
  sections: any[] = [];

  constructor(
    private fireService: FireService,
    private firestore: AngularFirestore,
    private utilservice: UtilsService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    this.user = this.utilservice.getFromLocalStorage('user');
    await this.fireService.setPersistence(); // Configura la persistencia de sesión.
    this.cargarUsuario(); // Carga los datos del usuario autenticado. */



    await this.getLastAttendance(this.user.uid, this.user.email); // Asegúrate de pasar el UID correcto
  }

  async getLastAttendance(uid: string, email: string) {
    try {
      const lastAttendance = await this.userService.fetchLastAttendance(uid, email);
      this.lastAttendance = lastAttendance; // Asigna el valor a lastAttendance
      console.log('Última asistencia:', lastAttendance);
    } catch (error) {
      console.error('Error al obtener la última asistencia:', error);
    }
  }
  syncOffline() {
    this.userService.syncOfflineData().then(() => {
      console.log('Datos offline sincronizados');
    }).catch((error) => {
      console.error('Error al sincronizar datos offline:', error);
    });
  }


  cargarUsuario() {
    this.fireService.getUserData().subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        console.log('No se encontró usuario');
      }
    });
  }



  ngOnDestroy() {

  }
}