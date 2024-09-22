import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElegirPage } from './elegir.page';

describe('ElegirPage', () => {
  let component: ElegirPage;
  let fixture: ComponentFixture<ElegirPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ElegirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
