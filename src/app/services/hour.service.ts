import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HourService {
  private readonly STORED_TIME_KEY = 'storedTime';

  getStoredTime(): string {
    return localStorage.getItem(this.STORED_TIME_KEY) || '';
  }
  getTimeUpdates(): Observable<string> {
    return interval(1000).pipe(
      map(() => this.getStoredTime())
    );
  }
  constructor() { }
}

/* 
En caso de querer utilizar este servicio,
se debe importar en el componente que se desee utilizar.
De la siguiente forma:
scanner.page.ts (O en cualquier otra pagina que se desee utilizar)

import { HourService } from '../../services/hour.service';

export class ScannerPage implements OnInit {
  currentHour: string;
  
  constructor(
    private alertController: AlertController,
    private hourService: HourService
  ) { }

  ngOnInit() {
    // Existing code...
    
    // Get initial time
    this.currentHour = this.hourService.getCurrentHour();
    
    // Subscribe to time updates
      this.hourService.getHourUpdates().subscribe(hour => {
        this.currentHour = hour;
      });
    }
}
*/