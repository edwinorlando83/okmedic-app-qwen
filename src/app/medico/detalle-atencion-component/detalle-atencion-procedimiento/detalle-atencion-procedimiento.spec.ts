import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionProcedimiento } from './detalle-atencion-procedimiento';

describe('DetalleAtencionProcedimiento', () => {
  let component: DetalleAtencionProcedimiento;
  let fixture: ComponentFixture<DetalleAtencionProcedimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionProcedimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionProcedimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
