import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service'; 
import { FireService } from 'src/app/services/fire.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DatePipe } from '@angular/common';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; 



@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.page.html',
  styleUrls: ['./teacher.page.scss'],
})
export class TeacherPage implements OnInit {
  user: any;
  sections: any[] = [];
  selectedSection: any = null;
  attendanceDates: any[] = [];
  selectedDate: string = '';
  studentsForDate: any[] = [];

  constructor(
    private navCtrl: NavController,
    private utilservice: UtilsService,
    private fireService: FireService,
    private firestore: AngularFirestore,
    private datePipe: DatePipe
  ) {}

  async ngOnInit() {
    await this.fireService.setPersistence(); // Configura la persistencia de sesión.
    this.user = this.utilservice.getFromLocalStorage('user');
    this.firestore.collection('sections').snapshotChanges().subscribe((sections) => {
      this.sections = sections.map((section: any) => {
        const data = section.payload.doc.data();
        return { id: section.payload.doc.id, name: data.name };
      });
      console.log('Secciones cargadas:', this.sections); // Verifica que las secciones están llegando
    });
  }

  loadAttendanceDates(sectionId: string) {
    this.firestore.collection(`sections/${sectionId}/attendance`).snapshotChanges().subscribe((attendanceDates) => {
      this.attendanceDates = [];
  
      attendanceDates.forEach((attendance: any) => {
        const data = attendance.payload.doc.data();
        const attendanceDate = attendance.payload.doc.id;  // La fecha del documento (dd-MM-yyyy)
  
        let classTime: Date | null = null;
  
        // Verificamos los estudiantes y sus datos de inscripción
        for (const email in data) {
          if (data.hasOwnProperty(email)) {
            const studentData = data[email]; // Datos del estudiante con correo 'email'
            
            // Ahora buscamos el timestamp dentro de los datos del estudiante
            const timestamp = studentData.timestamp;
  
            if (timestamp && timestamp instanceof firebase.firestore.Timestamp) {
              // Convertimos el timestamp a un objeto Date
              const dateObj = timestamp.toDate();
  
              // Tomamos el primer timestamp encontrado (esto puede ser optimizado si necesitas tomar la hora más reciente)
              if (!classTime) {
                classTime = dateObj; // Asignamos el primer timestamp encontrado
              }
            }
          }
        }
  
        // Si encontramos un timestamp válido para la fecha, lo agregamos a la lista
        if (classTime) {
          this.attendanceDates.push({
            date: attendanceDate,        // La fecha principal del documento (dd-MM-yyyy)
            classTime: classTime,        // Fecha convertida desde el timestamp
          });
        } else {
          console.log(`Timestamp no encontrado para la fecha: ${attendanceDate}`);
        }
      });
  
      console.log('Fechas de asistencia con timestamp:', this.attendanceDates); // Verificamos que las fechas se estén cargando correctamente
    });
  }

  loadStudentsForDate(sectionId: string, date: string) {
    this.firestore.collection(`sections/${sectionId}/attendance`).doc(date).get().subscribe((attendance) => {
      if (attendance.exists) {
        const students = attendance.data();
        this.studentsForDate = Object.values(students);
        console.log('Estudiantes para la fecha:', this.studentsForDate); // Verifica que los estudiantes se carguen
      } else {
        this.studentsForDate = [];
        console.log('No hay estudiantes para esta fecha');
      }
    });
  }

  // Seleccionar una sección
  onSectionSelect(sectionId: string) {
    // Restablecer la fecha y los estudiantes de la sección anterior
    this.selectedDate = '';  // Limpiar la fecha seleccionada
    this.studentsForDate = []; // Limpiar los estudiantes
  
    // Establecer la nueva sección seleccionada
    this.selectedSection = sectionId;
  
    // Cargar las fechas de asistencia para la nueva sección seleccionada
    this.loadAttendanceDates(sectionId);
  }

  // Seleccionar una fecha
  onDateSelect(date: string) {
    // Establecer la nueva fecha seleccionada
    this.selectedDate = date;
  
    // Cargar los estudiantes que asistieron en la nueva fecha seleccionada
    this.loadStudentsForDate(this.selectedSection, date);
  }

  goBack() {
    this.navCtrl.back();
  }

  async logout() {
    await this.fireService.logout();
    this.utilservice.clearLocalStorage(); // Limpia los datos locales
    this.navCtrl.navigateRoot('/login'); // Redirige al login
  }

  viewUserDetails(user: any) {
    console.log('User details:', user);
  }
}
