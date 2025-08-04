import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionEvolucion } from './detalle-atencion-evolucion';

describe('DetalleAtencionEvolucion', () => {
  let component: DetalleAtencionEvolucion;
  let fixture: ComponentFixture<DetalleAtencionEvolucion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionEvolucion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionEvolucion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
