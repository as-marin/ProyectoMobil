import { Component, OnDestroy, OnInit } from '@angular/core';
import { FireService } from '../../../services/fire.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from 'src/app/services/utils.service';


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
    private utilservice: UtilsService
  ) { }

  async ngOnInit() {
    this.user = this.utilservice.getFromLocalStorage('user');
    await this.fireService.setPersistence(); // Configura la persistencia de sesión.
    this.cargarUsuario(); // Carga los datos del usuario autenticado. */



    this.fetchLastAttendance(this.user.uid, this.user.email); // Asegúrate de pasar el UID correcto
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

  async fetchLastAttendance(uid: string, email: string) {
    let lastRecord = null;

    // Sincroniza datos locales con Firestore antes de buscar
    await this.syncOfflineData();

    // Obtiene todas las secciones
    const sectionsSnapshot = await this.firestore.collection('sections').get().toPromise();

    const promises = sectionsSnapshot.docs.map(async (section) => {
      const sectionId = section.id;
      const sectionData = section.data() as { name?: string };

      // Obtiene registros de asistencia para cada sección
      const attendanceSnapshot = await this.firestore.collection(`sections/${sectionId}/attendance`).get().toPromise();

      attendanceSnapshot.docs.forEach((record) => {
        const recordData = record.data();
        if (recordData[email]) {
          const studentData = recordData[email];

          const timestamp =
            typeof studentData.timestamp === 'string'
              ? new Date(studentData.timestamp)
              : studentData.timestamp.toDate();

          if (!lastRecord || lastRecord.timestamp < timestamp) {
            lastRecord = {
              sectionName: sectionData.name || 'Unknown Section',
              date: studentData.date,
              timestamp: timestamp,
            };
          }
        }
      });
    });

    // Espera a que todas las secciones sean procesadas
    await Promise.all(promises);

    // Actualiza `lastAttendance` con la última asistencia encontrada
    this.lastAttendance = lastRecord || null;
    console.log('Última asistencia encontrada:', this.lastAttendance);
  }



  async syncOfflineData() {
    const offlineData = JSON.parse(localStorage.getItem('offlineAttendance') || '[]');
    if (offlineData.length === 0) {
      console.log('No hay datos para sincronizar.');
      return;
    }

    for (const record of offlineData) {
      try {
        const { sectionId, classDate, attendanceData } = record;
        const attendancePath = `sections/${sectionId}/attendance`;

        await this.firestore.collection(attendancePath).doc(classDate).set(attendanceData, { merge: true });
        console.log(`Datos sincronizados para la sección ${sectionId}, fecha ${classDate}`);
      } catch (error) {
        console.error('Error al sincronizar datos:', error);
      }
    }

    localStorage.removeItem('offlineAttendance');
  }

  ngOnDestroy() {

  }
}