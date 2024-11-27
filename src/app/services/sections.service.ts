import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  constructor(private firestore: AngularFirestore) {}

  // Obtener las secciones disponibles en Firestore
  getSections(uid: string): Observable<any[]> {
    return this.firestore.collection(`users/${uid}/sections`).snapshotChanges().pipe(
      map(sections => sections.map(section => {
        const data = section.payload.doc.data() as { materia?: string };
        console.log('Datos de la sección:', data); // Depuración
        return { id: section.payload.doc.id, name: data?.materia || 'Nombre no definido' };
      }))
    );
  }

}
