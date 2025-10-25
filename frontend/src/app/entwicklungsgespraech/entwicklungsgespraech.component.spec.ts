import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntwicklungsgespraechComponent } from './entwicklungsgespraech.component';

describe('EntwicklungsgespraechComponent', () => {
  let component: EntwicklungsgespraechComponent;
  let fixture: ComponentFixture<EntwicklungsgespraechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntwicklungsgespraechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntwicklungsgespraechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
