import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAtencionConsentimiento } from './detalle-atencion-consentimiento';

describe('DetalleAtencionConsentimiento', () => {
  let component: DetalleAtencionConsentimiento;
  let fixture: ComponentFixture<DetalleAtencionConsentimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleAtencionConsentimiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAtencionConsentimiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
