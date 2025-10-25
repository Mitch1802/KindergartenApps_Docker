import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LerngeschichteComponent } from './lerngeschichte.component';

describe('LerngeschichteComponent', () => {
  let component: LerngeschichteComponent;
  let fixture: ComponentFixture<LerngeschichteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LerngeschichteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LerngeschichteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
