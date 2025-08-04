import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionLugarAtencion } from './detalle-atencion-lugar-atencion';

describe('DetalleAtencionLugarAtencion', () => {
  let component: DetalleAtencionLugarAtencion;
  let fixture: ComponentFixture<DetalleAtencionLugarAtencion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionLugarAtencion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionLugarAtencion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
