import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionExamenFisco } from './detalle-atencion-examen-fisco';

describe('DetalleAtencionExamenFisco', () => {
  let component: DetalleAtencionExamenFisco;
  let fixture: ComponentFixture<DetalleAtencionExamenFisco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionExamenFisco]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionExamenFisco);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
