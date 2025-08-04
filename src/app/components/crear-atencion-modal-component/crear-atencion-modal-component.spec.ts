import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearAtencionModalComponent } from './crear-atencion-modal-component';

describe('CrearAtencionModalComponent', () => {
  let component: CrearAtencionModalComponent;
  let fixture: ComponentFixture<CrearAtencionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearAtencionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearAtencionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
