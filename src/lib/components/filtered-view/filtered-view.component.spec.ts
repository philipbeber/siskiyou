import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject, ReplaySubject, Observable } from "rxjs/Rx";

import { FilteredViewComponent } from './filtered-view.component';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { LogLineView, LogLine } from '../../model';

class FakeLogAnalysis {
  constructor() {
    this.changed = new Subject();
  }
  public changed: Subject<void>;
  public lines: LogLine[] = [];
  public filteredLines: Array<LogLineView> = createFilterLines();
  public getFilteredLines(): Array<LogLineView> {
    return this.filteredLines;
  }
}

function createFilterLines() {
  const lines: Array<LogLineView> = [];
  const someText = ["asdf", "qwer", "ieieieieieieieieie", "m,b,mbmnbmnbv", "uxuowoejfnvhdjsjks"];
  for (let i = 0; i < 200; i++) {
    const view = <LogLineView>{
      text: someText[i % someText.length] + " " + i,
      visible: true
    };
    lines.push(view);
  }
  return lines;
}

describe('FilteredViewComponent', () => {
  let component: FilteredViewComponent;
  let fixture: ComponentFixture<FilteredViewComponent>;
  let fakeLogAnalysis: any;
  let laChanged: Subject<void>;
  let de: DebugElement;
  let ne: HTMLDivElement;

  beforeEach(async(() => {
    const laSpy = new FakeLogAnalysis();
    TestBed.configureTestingModule({
      declarations: [ FilteredViewComponent ],
      providers: [ { provide: LogAnalysisService, useValue: laSpy }]
    })
    .compileComponents();
    fakeLogAnalysis = TestBed.get(LogAnalysisService);
  }));

  beforeEach(() => {
    console.log("createComponent");
    fixture = TestBed.createComponent(FilteredViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
    ne = de.nativeElement;
  });

  it('should create empty', () => {
    expect(component).toBeTruthy();
    const sc = de.query(By.css('.scroll-container'));
    expect(sc).toBeTruthy();
    expect(sc.query(By.css("div"))).toBeNull();
  });

  it('should respond to changed events', fakeAsync(() => {
    const sc = de.query(By.css('.scroll-container'));
    expect(sc).toBeDefined();
    const spy = spyOn(fakeLogAnalysis, "getFilteredLines").and.returnValue(createFilterLines());
    fakeLogAnalysis.changed.next();
    tick(200);
    expect(spy).toHaveBeenCalledTimes(1);
  }));
});
