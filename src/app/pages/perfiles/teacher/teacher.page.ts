import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
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
  newSectionName: string = ''; // Para capturar el nombre de la nueva sección

  constructor(
    private navCtrl: NavController,
    private utilservice: UtilsService,
    private fireService: FireService,
    private firestore: AngularFirestore,
    private datePipe: DatePipe,
    private alertController: AlertController // Agregado para la confirmación
  ) {}

  async ngOnInit() {
    await this.fireService.setPersistence();
    this.user = this.utilservice.getFromLocalStorage('user');
    this.firestore.collection('sections').snapshotChanges().subscribe((sections) => {
      this.sections = sections.map((section: any) => {
        const data = section.payload.doc.data();
        return { id: section.payload.doc.id, name: data.name };
      });
      console.log('Secciones cargadas:', this.sections);
    });
  }

  loadAttendanceDates(sectionId: string) {
    this.firestore.collection(`sections/${sectionId}/attendance`).snapshotChanges().subscribe((attendanceDates) => {
      this.attendanceDates = [];

      attendanceDates.forEach((attendance: any) => {
        const data = attendance.payload.doc.data();
        const attendanceDate = attendance.payload.doc.id;

        let classTime: Date | null = null;

        for (const email in data) {
          if (data.hasOwnProperty(email)) {
            const studentData = data[email];
            const timestamp = studentData.timestamp;

            if (timestamp && timestamp instanceof firebase.firestore.Timestamp) {
              const dateObj = timestamp.toDate();
              if (!classTime) {
                classTime = dateObj;
              }
            }
          }
        }

        if (classTime) {
          this.attendanceDates.push({
            date: attendanceDate,
            classTime: classTime,
          });
        } else {
          console.log(`Timestamp no encontrado para la fecha: ${attendanceDate}`);
        }
      });

      console.log('Fechas de asistencia con timestamp:', this.attendanceDates);
    });
  }

  loadStudentsForDate(sectionId: string, date: string) {
    this.firestore.collection(`sections/${sectionId}/attendance`).doc(date).get().subscribe((attendance) => {
      if (attendance.exists) {
        const students = attendance.data();
        this.studentsForDate = Object.values(students);
        console.log('Estudiantes para la fecha:', this.studentsForDate);
      } else {
        this.studentsForDate = [];
        console.log('No hay estudiantes para esta fecha');
      }
    });
  }

  onSectionSelect(sectionId: string) {
    this.selectedDate = '';
    this.studentsForDate = [];
    this.selectedSection = sectionId;
    this.loadAttendanceDates(sectionId);
  }

  onDateSelect(date: string) {
    this.selectedDate = date;
    this.loadStudentsForDate(this.selectedSection, date);
  }

  async createSection(sectionName: string) {
    if (!sectionName) {
      console.error('El nombre de la sección no puede estar vacío.');
      return;
    }
  
    try {
      const sectionId = this.firestore.createId(); // Crear un ID único para la sección
      const sectionPath = `sections/${sectionId}`;
  
      // Crear la nueva sección con el campo `sectionID` igual al nombre de la sección
      const newSection = {
        id: sectionId,
        name: sectionName,
        professor: this.user.nombre, // Asignar el nombre del profesor actual
        sectionID: sectionName, // Campo sectionID igual al nombre de la sección
      };
  
      await this.firestore.doc(sectionPath).set(newSection); // Guardar el documento en Firestore
  
      // Crear la subcolección `attendance` vacía dentro de la sección
      const attendancePath = `${sectionPath}/attendance`;
  
      console.log(`Sección '${sectionName}' creada con éxito.`);
      this.newSectionName = ''; // Limpiar el campo después de crear la sección
    } catch (error) {
      console.error('Error al crear la sección:', error);
    }
  }
  

  async confirmCreateSection() {
    if (!this.newSectionName) {
      console.error('El nombre de la sección no puede estar vacío.');
      return;
    }
  
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Estás seguro de que deseas crear la sección "${this.newSectionName}"?`,
      cssClass: 'custom-alert', // Clase CSS personalizada
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Creación de sección cancelada');
          },
        },
        {
          text: 'Crear',
          cssClass: 'alert-button-confirm', // Clase CSS personalizada para el botón
          handler: () => {
            this.createSection(this.newSectionName);
          },
        },
      ],
    });
  
    await alert.present();
  }

  goBack() {
    this.navCtrl.back();
  }

  async logout() {
    await this.fireService.logout();
    this.utilservice.clearLocalStorage();
    this.navCtrl.navigateRoot('/login');
  }

  viewUserDetails(user: any) {
    console.log('User details:', user);
  }
}
