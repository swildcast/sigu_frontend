import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaList } from './programa-list';

describe('ProgramaList', () => {
  let component: ProgramaList;
  let fixture: ComponentFixture<ProgramaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramaList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
