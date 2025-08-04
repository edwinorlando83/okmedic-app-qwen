import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionHistorial } from './detalle-atencion-historial';

describe('DetalleAtencionHistorial', () => {
  let component: DetalleAtencionHistorial;
  let fixture: ComponentFixture<DetalleAtencionHistorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionHistorial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionHistorial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
