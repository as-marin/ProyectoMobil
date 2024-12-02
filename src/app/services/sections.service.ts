import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SectionsService {
    constructor(private firestore: AngularFirestore) { }

    // Obtener las secciones disponibles en Firestore
    getSections(uid: string): Observable<any[]> {
        return this.firestore
            .collection(`users/${uid}/sections`)
            .snapshotChanges()
            .pipe(
                map((sections) =>
                    sections.map((section) => {
                        const data = section.payload.doc.data() as { nombre?: string };
                        //console.log('Datos de la sección:', data); // Depuración
                        return { ...data };
                    })
                )
            );
    }

    getStudentAttendance(studentEmail: string): Observable<any[]> {
        return this.firestore
            .collectionGroup('attendance', (ref) =>
                ref.where('user.email', '==', studentEmail)
            )
            .snapshotChanges()
            .pipe(
                map((actions) =>
                    actions.map((a) => {
                        const data = a.payload.doc.data() as Record<string, any>; // Asegúrate de que data sea un objeto
                        const id = a.payload.doc.id;
                        return { id, ...data };
                    })
                )
            );
    }

    getAllSections(): Observable<any[]> {
        return this.firestore
            .collection('sections')
            .snapshotChanges()
            .pipe(
                map((sections) =>
                    sections.map((section) => {
                        const data = section.payload.doc.data() as { nombre?: string };
                        //console.log('Datos de la sección:', data); // Depuración
                        return { ...data };
                    })
                )
            );
    }

    // Inscribir a un usuario en una sección
    async enrollInSection(uid: string, sectionId: string): Promise<void> {
        const userRef = this.firestore.collection(`users/${uid}/sections`);
        await userRef.doc(sectionId).set({ enrolled: true });
    }

    /*
    getAttendanceForDate(sectionID: string, dateString: string, email: string): Observable<any> {
  return this.firestore
    .collection('sections')
    .doc(sectionID)
    .collection('attendance')
    .doc(dateString)
    .valueChanges()
    .pipe(
      map(data => {
        // Verifica si hay datos para el usuario en esa fecha
        if (data && data[email]) {
          return { date: dateString, attendance: data[email] };
        } else {
          return null;  // Si no hay datos, devuelve null
        }
      }),
      catchError(error => {
        console.error(`Error en la consulta de asistencia para ${dateString}:`, error);
        throw new Error('Error al consultar la asistencia.');
      })
    );
}
    */
}
