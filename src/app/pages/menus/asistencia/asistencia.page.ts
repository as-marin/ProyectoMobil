import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  user: any; // Usuario actual
  seccionesAsistencia: any[] = []; // Lista de secciones con asistencias
  selectedSection: any = null; // Sección seleccionada para ver detalles

  constructor(
    private firestore: AngularFirestore,
    private utilsService: UtilsService
  ) {}

  async ngOnInit() {
    this.user = this.utilsService.getFromLocalStorage('user'); // Carga el usuario desde localStorage
    if (this.user) {
      await this.calcularAsistencias(); // Cálculo de asistencias
    } else {
      console.error('Usuario no encontrado en localStorage');
    }
  }

  async calcularAsistencias() {
    try {
      const userEmail = this.user.email; // Correo del usuario actual

      // Obtiene todas las secciones
      const sectionsSnapshot = await this.firestore.collection('sections').get().toPromise();

      // Procesa cada sección para calcular las asistencias
      const secciones = await Promise.all(
        sectionsSnapshot.docs.map(async (doc) => {
          const sectionData = doc.data() as { name: string; sectionID: string };
          const sectionId = doc.id;

          // Obtiene el total de clases registradas en la sección
          const attendanceSnapshot = await this.firestore
            .collection(`sections/${sectionId}/attendance`)
            .get()
            .toPromise();

          // Excluir el documento `init` al calcular clases totales y asistidas
          const validRecords = attendanceSnapshot.docs.filter((record) => record.id !== 'init');

          // Verifica si el usuario está presente en alguna clase
          const userInSection = validRecords.some((record) =>
            record.data()[userEmail]
          );

          if (userInSection) {
            const clasesTotales = validRecords.length;

            // Filtra las clases donde el correo del usuario está presente
            const clasesAsistidas = validRecords.filter((record) =>
              record.data()[userEmail]
            ).length;

            // Calcula el porcentaje de asistencia
            const porcentajeAsistencia =
              clasesTotales > 0 ? (clasesAsistidas / clasesTotales) * 100 : 0;

            return {
              id: sectionId,
              nombre: sectionData.name, // Nombre de la sección
              clasesTotales,
              clasesAsistidas,
              porcentajeAsistencia,
            };
          }

          return null; // Ignora las secciones donde el usuario no está registrado
        })
      );

      // Filtra las secciones nulas y asigna las válidas
      this.seccionesAsistencia = secciones.filter((seccion) => seccion !== null);
      console.log('Secciones filtradas con asistencias calculadas:', this.seccionesAsistencia);
    } catch (error) {
      console.error('Error al calcular asistencias:', error);
    }
  }

  // Cambiar la sección seleccionada
  onSectionSelect(sectionId: string) {
    this.selectedSection = this.seccionesAsistencia.find(
      (section) => section.id === sectionId
    );
  }
}
