import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaListComponent } from './programa-list';

describe('ProgramaListComponent', () => {
  let component: ProgramaListComponent;
  let fixture: ComponentFixture<ProgramaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
