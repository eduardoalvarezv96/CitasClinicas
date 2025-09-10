import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroCitaPage } from './registro-cita.page';

describe('RegistroCitaPage', () => {
  let component: RegistroCitaPage;
  let fixture: ComponentFixture<RegistroCitaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
