import { Component, OnInit, OnDestroy } from '@angular/core';
import { SectionsService } from 'src/app/services/sections.service';
@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.page.html',
  styleUrls: ['./inscripcion.page.scss'],
})
export class InscripcionPage implements OnInit, OnDestroy {

  constructor(private SectionsService: SectionsService) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    
  }
}
