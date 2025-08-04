import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionTratamiento } from './detalle-atencion-tratamiento';

describe('DetalleAtencionTratamiento', () => {
  let component: DetalleAtencionTratamiento;
  let fixture: ComponentFixture<DetalleAtencionTratamiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionTratamiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionTratamiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
