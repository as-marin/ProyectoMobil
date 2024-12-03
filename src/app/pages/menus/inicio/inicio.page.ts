import { Component, OnDestroy, OnInit } from '@angular/core';
import { FireService } from '../../../services/fire.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, OnDestroy {
  user: any;
  lastAttendance: any = null;
  sections: any[] = [];
  loading: boolean = true;

  constructor(
    private fireService: FireService,
    private utilservice: UtilsService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.loading = true;

    // Configurar persistencia
    await this.fireService.setPersistence();

    try {
      // Cargar datos del usuario y última asistencia
      await this.cargarDatos();
    } catch (error) {
      console.error('Error al cargar datos en ngOnInit:', error);
    } finally {
      this.loading = false;
    }
  }

  async ionViewWillEnter() {
    // Actualiza los datos al volver a la página
    this.loading = true;

    try {
      await this.cargarDatos();
    } catch (error) {
      console.error('Error al cargar datos en ionViewWillEnter:', error);
    } finally {
      this.loading = false;
    }
  }

  // Cargar datos del usuario y última asistencia
  async cargarDatos() {
    try {
      // Buscar usuario en Firebase
      this.user = await this.getUserFromFirestore();
      if (!this.user) throw new Error('Usuario no encontrado en Firestore.');

      // Guardar el usuario en localStorage para respaldo
      this.utilservice.saveInLocalStorage('user', this.user);

      // Intentar cargar la última asistencia desde Firebase
      await this.getLastAttendance(this.user.uid, this.user.email);
    } catch (error) {
      console.error('Error al cargar datos desde Firebase:', error);

      // Si Firebase falla, intenta cargar desde localStorage
      this.user = this.utilservice.getFromLocalStorage('user');
      this.lastAttendance = this.utilservice.getFromLocalStorage('lastAttendance');

      if (!this.user || !this.lastAttendance) {
        console.error('No se pudieron cargar datos desde Firebase ni desde localStorage.');
      }
    }
  }

  // Obtiene el usuario desde Firestore
  async getUserFromFirestore() {
    const user = this.utilservice.getFromLocalStorage('user');
    if (user) return user;

    return new Promise((resolve, reject) => {
      this.fireService.getUserData().subscribe(
        (data) => resolve(data),
        (error) => reject(error)
      );
    });
  }

  // Cargar asistencia desde Firebase
  async getLastAttendance(uid: string, email: string) {
    try {
      const lastAttendance = await this.userService.fetchLastAttendance(uid, email);
      this.lastAttendance = lastAttendance;

      // Guardar en localStorage para respaldo
      this.utilservice.saveInLocalStorage('lastAttendance', lastAttendance);

      console.log('Última asistencia desde Firebase:', lastAttendance);
    } catch (error) {
      throw new Error('No se pudo obtener la asistencia del alumno desde Firebase.');
    }
  }

  ngOnDestroy() {}
}
