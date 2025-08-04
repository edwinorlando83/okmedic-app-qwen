import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionMotivoConsulta } from './detalle-atencion-motivo-consulta';

describe('DetalleAtencionMotivoConsulta', () => {
  let component: DetalleAtencionMotivoConsulta;
  let fixture: ComponentFixture<DetalleAtencionMotivoConsulta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionMotivoConsulta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionMotivoConsulta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
