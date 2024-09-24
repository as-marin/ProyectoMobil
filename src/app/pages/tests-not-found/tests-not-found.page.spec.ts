import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestsNotFoundPage } from './tests-not-found.page';

describe('TestsNotFoundPage', () => {
  let component: TestsNotFoundPage;
  let fixture: ComponentFixture<TestsNotFoundPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsNotFoundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
