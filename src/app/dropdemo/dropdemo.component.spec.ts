import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DropdemoComponent } from "./dropdemo.component";

describe("DropdemoComponent", () => {
  let component: DropdemoComponent;
  let fixture: ComponentFixture<DropdemoComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [DropdemoComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
