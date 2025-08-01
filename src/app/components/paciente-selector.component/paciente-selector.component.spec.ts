import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteSelectorComponent } from './paciente-selector.component';

describe('PacienteSelectorComponent', () => {
  let component: PacienteSelectorComponent;
  let fixture: ComponentFixture<PacienteSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
