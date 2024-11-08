import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service'; 
import { FireService } from 'src/app/services/fire.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
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
      this.attendanceDates = attendanceDates.map((date: any) => {
        const data = date.payload.doc.data();
        return { date: date.payload.doc.id, students: data };
      });
      console.log('Fechas de asistencia para la sección:', this.attendanceDates); // Verifica que las fechas se carguen correctamente
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
