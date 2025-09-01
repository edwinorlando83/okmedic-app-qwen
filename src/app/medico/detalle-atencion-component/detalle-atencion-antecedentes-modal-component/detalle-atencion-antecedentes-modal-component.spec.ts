import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionAntecedentesModalComponent } from './detalle-atencion-antecedentes-modal-component';

describe('DetalleAtencionAntecedentesModalComponent', () => {
  let component: DetalleAtencionAntecedentesModalComponent;
  let fixture: ComponentFixture<DetalleAtencionAntecedentesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionAntecedentesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionAntecedentesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
