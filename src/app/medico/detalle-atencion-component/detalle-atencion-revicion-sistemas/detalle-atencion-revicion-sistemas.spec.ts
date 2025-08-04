import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionRevicionSistemas } from './detalle-atencion-revicion-sistemas';

describe('DetalleAtencionRevicionSistemas', () => {
  let component: DetalleAtencionRevicionSistemas;
  let fixture: ComponentFixture<DetalleAtencionRevicionSistemas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionRevicionSistemas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionRevicionSistemas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
