import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaList } from './materia-list';

describe('MateriaList', () => {
  let component: MateriaList;
  let fixture: ComponentFixture<MateriaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriaList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateriaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
