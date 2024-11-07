import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HourService {

  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }
  getTimeUpdates(): Observable<string> {
    return interval(1000).pipe(
      map(() => this.getCurrentTime())
    );
  }
  constructor() { }
}

/* 
En caso de querer utilizar este servicio,
se debe importar en el componente que se desee utilizar.
De la siguiente forma:
scanner.page.ts (O en cualquier otra pagina que se desee utilizar)

import { TimeService } from '../../services/time.service';

export class ScannerPage implements OnInit {
  currentTime: string;
  
  constructor(
    private alertController: AlertController,
    private timeService: TimeService
  ) { }

  ngOnInit() {
    // Existing code...
    
    // Get initial time
    this.currentTime = this.timeService.getCurrentTime();
    
    // Subscribe to time updates
    this.timeService.getTimeUpdates().subscribe(time => {
      this.currentTime = time;
    });
  }
}
*/