import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionsComponent } from './sanctions.component';
import { FormsModule } from '@angular/forms';

describe('SanctionsComponent', () => {
  let component: SanctionsComponent;
  let fixture: ComponentFixture<SanctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SanctionsComponent,    FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
