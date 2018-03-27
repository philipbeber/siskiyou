import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredViewComponent } from './filtered-view.component';

describe('FilteredViewComponent', () => {
  let component: FilteredViewComponent;
  let fixture: ComponentFixture<FilteredViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteredViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
