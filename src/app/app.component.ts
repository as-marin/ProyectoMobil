import { Component, OnInit } from '@angular/core';
import { FireService } from "../app/services/fire.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private fireService: FireService, private router: Router) {}

  ngOnInit() {
    this.fireService.auth.authState.subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.fireService.getUserRole(userId).subscribe((userData: any) => {
          const role = userData?.role;
          if (role === 'profesor') {
            this.router.navigate(['/teacher']);
          } else if (role === 'estudiante') {
            this.router.navigate(['/inicio']);
          }
        });
      }
    });
  }
}
