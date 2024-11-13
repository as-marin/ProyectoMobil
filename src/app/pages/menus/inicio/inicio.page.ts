import { Component, OnInit } from '@angular/core';
import { FireService } from '../../../services/fire.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from 'src/app/services/utils.service';

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
    private utilservice: UtilsService
  ) {}

  async ngOnInit() {
    this.user = this.utilservice.getFromLocalStorage('user');
    await this.fireService.setPersistence(); // Configura la persistencia de sesión.
    this.cargarUsuario(); // Carga los datos del usuario autenticado.

    
    if (this.user?.uid) {
      this.fetchLastAttendance(this.user.uid,this.user.email); // Asegúrate de pasar el UID correcto
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
  
      if (!this.lastAttendance) {
        
        this.lastAttendance = null;
      }
    });
  }
  

  
}