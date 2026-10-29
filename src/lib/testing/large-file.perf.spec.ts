import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, NgZone } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { firstValueFrom } from "rxjs";
import { take } from "rxjs/operators";

import { FilteredViewComponent } from "../components/filtered-view/filtered-view.component";
import { ColorFilter } from "../model/color-filter";
import { FilterItem } from "../model/filter-item";
import { HideFilter } from "../model/hide-filter";
import { LogLineColorView } from "../model/log-line-view";
import { FileLoaderService } from "../services/file-loader.service";
import { LogAnalysisService } from "../services/log-analysis.service";
import { LogMergerService } from "../services/log-merger.service";
import { LogParserService } from "../services/log-parser.service";
import {
  LINE_COUNT,
  countLinesWithLevel,
  createLargeLogFile,
} from "./large-log.fixture";

// Budgets are "reasonable interactive use" with headroom for slower machines.
// Local ChromeHeadless timings were ~120ms load, ~80–140ms filter,
// ~140ms first paint, and ~7ms scroll.
const LOAD_BUDGET_MS = 15_000;
const FILTER_BUDGET_MS = 3_000;
const DISPLAY_BUDGET_MS = 10_000;
const SCROLL_BUDGET_MS = 200;
const MAX_VISIBLE_DOM_LINES = 5_000;
const ERROR_COLOR = "#ff0000";
const WARN_COLOR = "#ffa500";

function reportDuration(label: string, ms: number, budgetMs: number) {
  console.log(`[perf] ${label}: ${ms.toFixed(1)}ms (budget ${budgetMs}ms)`);
  expect(ms)
    .withContext(`${label} took ${ms.toFixed(1)}ms; budget is ${budgetMs}ms`)
    .toBeLessThan(budgetMs);
}

function createLogAnalysis(): LogAnalysisService {
  return new LogAnalysisService(
    new NgZone({ enableLongStackTrace: false }),
    new FileLoaderService(),
    new LogMergerService(),
    new LogParserService(),
  );
}

function visibleChunkIds(component: FilteredViewComponent): number[] {
  return component.chunks
    .filter((chunk) => chunk.visible)
    .map((chunk) => chunk.id);
}

function runViewUpdate(component: FilteredViewComponent) {
  (component as unknown as { updateView(): void }).updateView();
  (component as unknown as { cdr: ChangeDetectorRef }).cdr.markForCheck();
  (component as unknown as { cdr: ChangeDetectorRef }).cdr.detectChanges();
}

describe("large file performance", () => {
  const errorCount = countLinesWithLevel(LINE_COUNT, "ERROR");
  const warnCount = countLinesWithLevel(LINE_COUNT, "WARN");
  const infoCount = countLinesWithLevel(LINE_COUNT, "INFO");

  let logAnalysis: LogAnalysisService;
  let loadMs: number;
  let hideFilter: HideFilter;
  let colorFilter: ColorFilter;

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120_000;

    const fixtureStart = performance.now();
    const file = createLargeLogFile(LINE_COUNT);
    console.log(
      `[perf] fixture generation: ${(performance.now() - fixtureStart).toFixed(1)}ms`,
    );

    logAnalysis = createLogAnalysis();
    const loaded = firstValueFrom(logAnalysis.changed.pipe(take(1)));
    const start = performance.now();
    logAnalysis.addFiles([file]);
    await loaded;
    loadMs = performance.now() - start;

    hideFilter = new HideFilter("Hide");
    hideFilter.addItem(new FilterItem("INFO", true, hideFilter));
    logAnalysis.addFilter(hideFilter);

    colorFilter = new ColorFilter("Color");
    colorFilter.addColorItem("ERROR", true, ERROR_COLOR);
    colorFilter.addColorItem("WARN", true, WARN_COLOR);
    logAnalysis.addFilter(colorFilter);
  }, 120_000);

  it("loads a million-line file within budget", () => {
    expect(logAnalysis.lines.length)
      .withContext("parsed line count")
      .toBe(LINE_COUNT);
    reportDuration("load/parse", loadMs, LOAD_BUDGET_MS);
  });

  it("applies a hide filter within budget", () => {
    hideFilter.enabled = true;
    colorFilter.enabled = false;

    const start = performance.now();
    const views = logAnalysis.getFilteredLines();
    const elapsed = performance.now() - start;

    expect(views.length).toBe(LINE_COUNT);
    const visible = views.filter((view) => view.visible).length;
    expect(visible)
      .withContext("visible lines after hiding INFO")
      .toBe(errorCount + warnCount);
    expect(LINE_COUNT - visible)
      .withContext("hidden INFO lines")
      .toBe(infoCount);
    reportDuration("hide filter", elapsed, FILTER_BUDGET_MS);
  });

  it("applies color filters within budget", () => {
    hideFilter.enabled = false;
    colorFilter.enabled = true;

    const start = performance.now();
    const views = logAnalysis.getFilteredLines();
    const elapsed = performance.now() - start;

    expect(views.length).toBe(LINE_COUNT);
    const errorViews = views.filter((view) =>
      view.text.includes(" ERROR "),
    ) as LogLineColorView[];
    const warnViews = views.filter((view) =>
      view.text.includes(" WARN "),
    ) as LogLineColorView[];
    expect(errorViews.length).toBe(errorCount);
    expect(warnViews.length).toBe(warnCount);
    expect(errorViews.every((view) => view.color === ERROR_COLOR)).toBeTrue();
    expect(warnViews.every((view) => view.color === WARN_COLOR)).toBeTrue();
    reportDuration("color filter", elapsed, FILTER_BUDGET_MS);
  });

  it("displays and scrolls without rendering every line", () => {
    hideFilter.enabled = true;
    colorFilter.enabled = true;

    TestBed.configureTestingModule({
      declarations: [FilteredViewComponent],
      imports: [CommonModule],
      providers: [{ provide: LogAnalysisService, useValue: logAnalysis }],
    });
    const fixture: ComponentFixture<FilteredViewComponent> =
      TestBed.createComponent(FilteredViewComponent);
    const component = fixture.componentInstance;
    const host = fixture.nativeElement as HTMLElement;
    host.style.position = "relative";
    host.style.display = "block";
    host.style.height = "600px";
    host.style.width = "800px";
    host.style.overflow = "hidden";

    const start = performance.now();
    runViewUpdate(component);
    fixture.detectChanges();
    const elapsed = performance.now() - start;

    const container = host.querySelector(".scroll-container") as HTMLElement;
    expect(component.chunks.length)
      .withContext("chunk count")
      .toBe(LINE_COUNT / component.chunkSize);
    expect(container.children.length)
      .withContext("chunk spacer elements")
      .toBe(component.chunks.length);

    const rendered = container.querySelectorAll(".line").length;
    expect(rendered)
      .withContext("virtualized DOM line count after first paint")
      .toBeGreaterThan(0);
    expect(rendered)
      .withContext("virtualized DOM line count after first paint")
      .toBeLessThan(MAX_VISIBLE_DOM_LINES);
    expect(visibleChunkIds(component).length).toBeGreaterThan(0);

    const colored = Array.from(container.querySelectorAll(".line")).filter(
      (el) => !!(el as HTMLElement).style.backgroundColor,
    );
    expect(colored.length)
      .withContext("colored lines in the initial viewport")
      .toBeGreaterThan(0);
    reportDuration("first view update", elapsed, DISPLAY_BUDGET_MS);

    const topIds = visibleChunkIds(component);

    const startMid = performance.now();
    container.scrollTop = Math.floor(container.scrollHeight / 2);
    container.dispatchEvent(new Event("scroll"));
    fixture.detectChanges();
    const midMs = performance.now() - startMid;

    const midIds = visibleChunkIds(component);
    const renderedMid = container.querySelectorAll(".line").length;
    expect(midIds.length).toBeGreaterThan(0);
    expect(Math.max(...midIds)).toBeGreaterThan(Math.max(...topIds));
    expect(renderedMid)
      .withContext("virtualized DOM line count after scrolling to midpoint")
      .toBeGreaterThan(0);
    expect(renderedMid)
      .withContext("virtualized DOM line count after scrolling to midpoint")
      .toBeLessThan(MAX_VISIBLE_DOM_LINES);
    reportDuration("scroll to midpoint", midMs, SCROLL_BUDGET_MS);

    const startEnd = performance.now();
    container.scrollTop = container.scrollHeight - container.clientHeight;
    container.dispatchEvent(new Event("scroll"));
    fixture.detectChanges();
    const endMs = performance.now() - startEnd;

    const endIds = visibleChunkIds(component);
    const renderedEnd = container.querySelectorAll(".line").length;
    expect(endIds.length).toBeGreaterThan(0);
    expect(endIds).toContain(component.chunks[component.chunks.length - 1].id);
    expect(renderedEnd)
      .withContext("virtualized DOM line count after scrolling to end")
      .toBeGreaterThan(0);
    expect(renderedEnd)
      .withContext("virtualized DOM line count after scrolling to end")
      .toBeLessThan(MAX_VISIBLE_DOM_LINES);
    reportDuration("scroll to end", endMs, SCROLL_BUDGET_MS);

    fixture.destroy();
  });
});
