import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionSignosVitales } from './detalle-atencion-signos-vitales';

describe('DetalleAtencionSignosVitales', () => {
  let component: DetalleAtencionSignosVitales;
  let fixture: ComponentFixture<DetalleAtencionSignosVitales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionSignosVitales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionSignosVitales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
