import { Component, OnDestroy, OnInit } from '@angular/core';
import { FireService } from '../../../services/fire.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController } from '@ionic/angular';
import { SectionsService } from 'src/app/services/sections.service';
import { Subscription } from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, OnDestroy {
  user: any;
  lastAttendance: any;
  sections: any[] = [];
  private sectionSubscription: Subscription;

  constructor(
    private fireService: FireService, 
    private firestore: AngularFirestore,
    private utilservice: UtilsService,
    private menuCtrl: MenuController,
    private sectionsService: SectionsService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    // Desactiva la barra lateral
    this.menuCtrl.enable(false);
  }
  async ngOnInit() {
    this.user = this.utilservice.getFromLocalStorage('user');
    await this.fireService.setPersistence(); // Configura la persistencia de sesión.
    this.cargarUsuario(); // Carga los datos del usuario autenticado.

    
    if (this.user?.uid) {
      this.fetchLastAttendance(this.user.uid,this.user.email); // Asegúrate de pasar el UID correcto


      this.sectionSubscription = 
      this.sectionsService.getSections(this.user.uid).subscribe(sections => {
        this.sections = sections;
        console.log('Secciones cargadas:', this.sections);
      });
    }
  }
  
  ngOnDestroy() {
      if(this.sectionSubscription){
        this.sectionSubscription.unsubscribe();
      }
  }

  navigateToInscripcion(userId: string) {
    console.log('Redirigiendo a inscripción con ID:', userId);
    this.router.navigate(['/inscripcion', userId]);
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
    this.firestore.collection('sections').snapshotChanges().subscribe(async (sections) => {
      const promises = [];
  
      sections.forEach((section) => {
        const sectionId = section.payload.doc.id;
        const sectionData = section.payload.doc.data();
  
        // Agrega una promesa para procesar cada sección
        promises.push(
          new Promise<void>((resolve) => {
            this.firestore
              .collection(`sections/${sectionId}/attendance`)
              .snapshotChanges()
              .subscribe((attendanceRecords) => {
                attendanceRecords.forEach((record) => {
                  const recordData = record.payload.doc.data();
                  if (recordData[email]) {
                    const studentData = recordData[email];
  
                    // Convierte el timestamp si es string
                    const timestamp =
                      typeof studentData.timestamp === 'string'
                        ? new Date(studentData.timestamp)
                        : studentData.timestamp.toDate();
  
                    if (!lastRecord || (lastRecord.timestamp < timestamp)) {
                      lastRecord = {
                        sectionName: sectionData ? sectionData['name'] || 'Unknown Section' : 'Unknown Section',
                        date: studentData['date'],
                        timestamp: timestamp, // Asegúrate de almacenar un objeto Date
                      };
                    }
                  }
                });
                resolve(); // Marca la sección como procesada
              });
          })
        );
      });
  
      // Espera a que se procesen todas las secciones
      await Promise.all(promises);
  
      // Una vez que todas las secciones han sido procesadas, actualiza `lastAttendance`
      this.lastAttendance = lastRecord || null;
      console.log('Última asistencia encontrada:', this.lastAttendance);
    });
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
  

  
}