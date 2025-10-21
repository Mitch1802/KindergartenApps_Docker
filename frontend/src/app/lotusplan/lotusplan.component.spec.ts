import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotusplanComponent } from './lotusplan.component';

describe('LotusplanComponent', () => {
  let component: LotusplanComponent;
  let fixture: ComponentFixture<LotusplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotusplanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotusplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
