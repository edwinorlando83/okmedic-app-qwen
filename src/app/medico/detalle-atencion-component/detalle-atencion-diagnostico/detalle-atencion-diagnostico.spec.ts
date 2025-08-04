import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionDiagnostico } from './detalle-atencion-diagnostico';

describe('DetalleAtencionDiagnostico', () => {
  let component: DetalleAtencionDiagnostico;
  let fixture: ComponentFixture<DetalleAtencionDiagnostico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionDiagnostico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionDiagnostico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
