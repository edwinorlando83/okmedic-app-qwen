import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionAntecedentes } from './detalle-atencion-antecedentes';

describe('DetalleAtencionAntecedentes', () => {
  let component: DetalleAtencionAntecedentes;
  let fixture: ComponentFixture<DetalleAtencionAntecedentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionAntecedentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionAntecedentes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
