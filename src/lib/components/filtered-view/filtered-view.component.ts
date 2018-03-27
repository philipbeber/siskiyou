import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { Subscription } from 'rxjs';
import * as moment from "moment";
import { LogLineColorView } from '../../model';
import { Observable } from 'rxjs';

// Turns log files into HTML. Because browsers don't cope well with a DOM that contains tens of 1000s of lines of text
// (even if in a single pre element) the lines are grouped into chunks, and DOM is only generated for chunks that are
// visible or close to being scrolled into view. Within a chunk lines are grouped into sections where each section is
// the same color. One 'pre' element is used for each section.
@Component({
  selector: 'filtered-view',
  templateUrl: './filtered-view.component.html',
  styleUrls: ['./filtered-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilteredViewComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private chunks: Array<Chunk> = [];
  // Line height in pixels. Needs to match the value for font-size*line-height in the scss file.
  private lineHeight: number = 15;

  // Size in lines of each chunk of the view. Only visible chunks will have DOM generated for them.
  @Input() public chunkSize: number = 500;
  // Chunks that get within this number of lines of the visible area will also have DOM generated.
  @Input() public chunkHysteresis: number = 500;

  @ViewChild('container') container: ElementRef;
  @ViewChild('filteredDisplay') filteredDisplay: ElementRef;

  constructor(private logAnalysis: LogAnalysisService) {
    this.subscription = logAnalysis.changed.debounceTime(400).subscribe(() => {
      this.updateView();
    });
   }

  ngOnInit() {
    Observable.fromEvent(this.container.nativeElement, 'scroll').throttleTime(200).subscribe(() => {
      this.updateScroll();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  updateView() {
    console.log("Starting updateView");
    let m = moment();
    this.chunks = [];
    const el = this.filteredDisplay.nativeElement;
    while (el.hasChildNodes()) {
      el.removeChild(el.firstChild);
    }
    const lineObjs = this.logAnalysis.getFilteredLines();
    console.log("Got " + lineObjs.length + " filtered lines");
    if (!lineObjs.length) {
      return;
    }

    let frag = document.createDocumentFragment(); 
    let lines: string[] = [];
    let lineCount = 0;
    let currentColor: string = null;
    let currentChunk = new Chunk(frag);
    let yPosition = 0;

    for (let line of lineObjs) {
      if (lineCount >= this.chunkSize) {
        currentChunk.addColorSection(lines, currentColor);
        lines = [];
        currentChunk.lineCount = lineCount;
        currentChunk.yPosition = yPosition;
        yPosition += currentChunk.height;
        this.chunks.push(currentChunk);
        currentChunk = new Chunk(frag);
        lineCount = 0;
      }
      lineCount += this.countLines(line.text);
      const coloredLine = line as LogLineColorView;
      if (coloredLine.color != currentColor) {
        currentChunk.addColorSection(lines, currentColor);
        lines = [];
        currentColor = coloredLine.color;
      }
      lines.push(line.text);
    }
    currentChunk.addColorSection(lines, currentColor);
    currentChunk.lineCount = lineCount;
    this.chunks.push(currentChunk);

    el.appendChild(frag);
    console.log("updateView end: " + moment().diff(m, "seconds", true));
    this.updateScroll();
  }

  private updateScroll() {
    for(let chunk of this.chunks) {
      chunk.checkVisibility(this.chunkHysteresis, this.lineHeight);
    }
  }

  // Returns the number of lines in the text. Counts the number of '\n' characters
  // and returns that plus one.
  private countLines(text: string) {
    let count = 0;
    for (let index = 0; index != -1; count++, index = text.indexOf('\n', index + 1));
    return count;
  }
}

class Chunk {
  private _height: number;
  private _visible = false;
  private _lineCount: number;
  private element: HTMLDivElement;
  private sections: Array<ColorSection> = [];

  public yPosition: number;

  constructor(frag: DocumentFragment) {
    this.element = document.createElement("div");
    frag.appendChild(this.element);
  }

  public addColorSection(lines: Array<string>, color: string) {
    this.sections.push(new ColorSection(lines, color));
  }

  public get lineCount() { return this._lineCount; }
  public set lineCount(value: number) {
    this._lineCount = value;
    this._height = value * 15;
    this.element.style.height = this._height + "px";
  }

  public get height() { return this._height; }

  public get visible() { return this._visible; }
  public set visible(value: boolean) {
    if (value != this._visible) {
      this._visible = value;
      if (value) {
        for(let section of this.sections) {
          const el = document.createElement("pre");
          el.textContent = section.text;
          if (section.color) {
            el.style.backgroundColor = section.color;
          }
          this.element.appendChild(el);
        }
      } else {
        while(this.element.hasChildNodes()) {
          this.element.removeChild(this.element.lastChild);
        }
      }
    }
  }

  public checkVisibility(hysteresis: number, lineHeight: number) {
    var rect = this.element.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
    this.visible = elemTop < (window.innerHeight + (lineHeight * hysteresis)) && elemBottom >= (-lineHeight * hysteresis);
  }
}

class ColorSection {
  public text: string;
  constructor(lines: string[], public color: string) {
    this.text = lines.join("\n");
  }
}