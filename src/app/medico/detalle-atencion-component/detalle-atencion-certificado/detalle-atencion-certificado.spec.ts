import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionCertificado } from './detalle-atencion-certificado';

describe('DetalleAtencionCertificado', () => {
  let component: DetalleAtencionCertificado;
  let fixture: ComponentFixture<DetalleAtencionCertificado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionCertificado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionCertificado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
