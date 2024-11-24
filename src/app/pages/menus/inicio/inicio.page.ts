import { Component, OnInit } from '@angular/core';
import { FireService } from '../../../services/fire.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController } from '@ionic/angular';
<<<<<<< Updated upstream
=======
import { firstValueFrom } from "rxjs";
import { User } from '../../../models/usuario.model';
>>>>>>> Stashed changes

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  user: any;
  lastAttendance: any;

  constructor(
    private fireService: FireService, 
    private firestore: AngularFirestore,
    private utilservice: UtilsService,
    private menuCtrl: MenuController
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
      this.fetchLastAttendance(this.user.uid,this.user.email); // Pasar el UID correcto
    } 
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

  fetchLastAttendance(uid: string, email: string) {
    
    // Primero, obtenemos las secciones
    this.firestore.collection('sections').snapshotChanges().subscribe(sections => {
      let lastRecord = null;
  
      sections.forEach(section => {
        const sectionId = section.payload.doc.id;
        const sectionData = section.payload.doc.data();  // Obtiene los datos de la sección
        
  
        // Obtenemos todos los registros de asistencia de esta sección
        this.firestore.collection(`sections/${sectionId}/attendance`).snapshotChanges().subscribe(attendanceRecords => {
          attendanceRecords.forEach(record => {
            const recordData = record.payload.doc.data();  // Aquí ya no es necesario asegurar el tipo de recordData
            
  
            // Accedemos a los datos de asistencia usando el email del estudiante
            if (recordData[email]) {
              const studentData = recordData[email];  // Accede a los datos del estudiante por email
              
  
              // Si encontramos un registro, lo asignamos como último registro
              if (!lastRecord || (lastRecord.timestamp?.toDate() < studentData.timestamp?.toDate())) {
                lastRecord = {
                  sectionName: sectionData['name'],  // Nombre de la sección
                  date: studentData['date'],  // Fecha de la asistencia
                  timestamp: studentData['timestamp']  // Timestamp de la clase
                };
                
              }
            }
          });
  
          // Una vez procesados todos los registros de asistencia de esta sección
          if (lastRecord) {
            this.lastAttendance = lastRecord;
          }
        });
      });
  
<<<<<<< Updated upstream
      if (!this.lastAttendance) {
        
        this.lastAttendance = null;
=======
      // Espera a que se procesen todas las secciones
      await Promise.all(promises);
  
      // Una vez que todas las secciones han sido procesadas, actualiza `lastAttendance`
      this.lastAttendance = lastRecord || null;
      console.log('Última asistencia encontrada:', this.lastAttendance);
    });
  }

  async getAllSubjects(uid: String) {
    if (uid !== null && uid !== undefined) {
      const sections = await firstValueFrom(this.firestore.collection('sections').get());
      return sections.docs.map((section) => ({ id: section.id}));
    }
    throw new Error('UID de usuario no proporcionado.');
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
>>>>>>> Stashed changes
      }
    });
  }
  

  
}