import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy, Input, ViewChildren, QueryList } from '@angular/core';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { Subscription } from 'rxjs';
import * as momentNs from 'moment';
const moment = momentNs;
import { LogLineColorView, LogLine, LogLineView } from '../../model';
import { Observable } from 'rxjs';

// Turns log files into HTML. Because browsers don't cope well with a DOM that contains tens of 1000s of lines of text
// (even if in a single pre element) the lines are grouped into chunks, and DOM is only generated for chunks that are
// visible or close to being scrolled into view. Within a chunk lines are grouped into sections where each section is
// the same color. One 'pre' element is used for each section.
@Component({
  selector: 'filtered-view',
  templateUrl: './filtered-view.component.html',
  styleUrls: ['./filtered-view.component.scss']
})
export class FilteredViewComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private chunks: Array<Chunk> = [];
  // Line height in pixels. Needs to match the value for font-size*line-height in the scss file.
  private lineHeight: number = 15;
  private lines: LogLine[];
  private nextChunkId = 0;
  private selectedLine: ChunkLine;
  private lastScrollTime: number;
  private nextScrollTimer;

  // Size in lines of each chunk of the view. Only visible chunks will have DOM generated for them.
  @Input() public chunkSize: number = 500;
  // Chunks that get within this number of lines of the visible area will also have DOM generated.
  @Input() public chunkHysteresis: number = 100;

  @ViewChild('container') container: ElementRef;

  constructor(private logAnalysis: LogAnalysisService) {
    console.log("FilteredViewComponent constructor");
    this.subscription = logAnalysis.changed.debounceTime(200).subscribe(() => {
      this.updateView();
    });
   }

  ngOnInit() {
    Observable.fromEvent(this.container.nativeElement, 'scroll').subscribe(() => {
      if (!this.nextScrollTimer) {
        const now = Date.now();
        if (this.lastScrollTime && (now - this.lastScrollTime) < 200) {
          this.nextScrollTimer = setTimeout(() => {
            this.nextScrollTimer = null;
            this.updateScroll();
            this.lastScrollTime = Date.now();
          }, (now - this.lastScrollTime));
        }
        this.updateScroll();
        this.lastScrollTime = Date.now();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  chunkTrackByFn(index, item) {
    return item.id;
  }

  lineTrackByFn(index, item) {
    return index;
  }

  private lineClick(line: ChunkLine) {
    if (line === this.selectedLine) {
      return;
    }

    if (this.selectedLine) {
      this.selectedLine.selected = false;
    }

    this.selectedLine = line;
    this.selectedLine.selected = true;
  }

  private updateView() {
    const oldSelectedYPos: number = this.selectedLine && this.selectedLine.yPosition;

    if (this.lines !== this.logAnalysis.lines) {
      this.lines = this.logAnalysis.lines;
      this.rebuildView();
    }

    console.log("Starting updateView");
    let m = moment();
    const lineObjs = this.logAnalysis.getFilteredLines();
    console.log("Got " + lineObjs.length + " filtered lines");
    if (lineObjs.length != this.lines.length) {
      console.error("Filtered count = " + lineObjs.length + ". View count = " + this.lines.length + ". Aborting.");
      return;
    }
    if (!lineObjs.length) {
      return;
    }

    let yPosition = 0;
    let filterIndex = 0;
    for (let chunk of this.chunks) {
      let height = 0;
      let anyVisible = false;
      for (let line of chunk.lines) {
        line.view = lineObjs[filterIndex++];
        line.yPosition = yPosition + height;
        if (line.view.visible) {
          height += this.lineHeight * line.lineCount;
          anyVisible = true;
        }
      }
      chunk.height = height;
      chunk.yPosition = yPosition;
      chunk.anyLinesVisible = anyVisible;
      yPosition += height;
    }

    console.log("updateView end: " + moment().diff(m, "seconds", true));

    const scrollOffset = this.selectedLine && (this.selectedLine.yPosition - oldSelectedYPos);
    if (this.selectedLine) {
      console.log("selected yo was " + oldSelectedYPos + ", is now " + this.selectedLine.yPosition);
      console.log("scrollOffset = " + scrollOffset);
    }
    this.updateScroll(scrollOffset);
  }

  private rebuildView() {
    this.chunks = [];
    let lineNumber = 1;
    for(let lineCount = this.lines.length; lineCount > 0; ) {
      const linesToAllocate = Math.min(lineCount, this.chunkSize);
      this.chunks.push(new Chunk(this.nextChunkId++, linesToAllocate, lineNumber));
      lineNumber += linesToAllocate;
      lineCount -= linesToAllocate;
    } 
  }

  private updateScroll(scrollOffset: number = undefined) {
    let scrollTop = 0;
    let height = 1000;
    if (this.container.nativeElement) {
      scrollTop = this.container.nativeElement.scrollTop;
      const rect = this.container.nativeElement.getBoundingClientRect();
      if (rect.height) {
        height = rect.height;
      }
    }

    scrollTop -= this.lineHeight * this.chunkHysteresis;
    height += this.lineHeight * this.chunkHysteresis * 2;

    for(let chunk of this.chunks) {
      chunk.checkVisibility(scrollTop, height);
    };

    if (this.container.nativeElement && scrollOffset) {
      const newScroll = this.container.nativeElement.scrollTop + scrollOffset;
      this.setScrollTop(newScroll);
    }
  }

  private setScrollTop(newScroll: number, attempts: number = 0) {
    if (this.container.nativeElement.scrollHeight < newScroll && attempts < 5) {
      requestAnimationFrame(() => {
        console.log("scrollHeight=" + this.container.nativeElement.scrollHeight);
        this.setScrollTop(newScroll, attempts + 1);
      });
      return;
    }

    console.log("Updating scroll from " + this.container.nativeElement.scrollTop + " to " + newScroll);
    this.container.nativeElement.scrollTop = newScroll;
  }
}

class Chunk {
  public height: number;
  public anyLinesVisible: boolean;
  public lines: Array<ChunkLine> = [];
  public yPosition: number;

  private _visible = false;

  constructor(public id: number, linesToAllocate: number, startingLineNumber: number) {
    for (let i = 0; i < linesToAllocate; ++i) {
      this.lines.push(new ChunkLine(startingLineNumber++));
    }
  }

  public get visible() { return this._visible; }

  public checkVisibility(scrollTop: number, height: number) {
    if (!this.anyLinesVisible) {
      this._visible = false;
      return;
    }

    this._visible = this.yPosition <= (scrollTop + height) && (this.yPosition + this.height) >= scrollTop;
  }
}

class ChunkLine {
  public lineCount: number;
  public selected: boolean;
  public yPosition: number;
  private _view: LogLineView
  
  constructor(public lineNumber: number) {
  }

  public get view() { return this._view; }
  public set view(value) {
    this.lineCount = this.countLines(value.text);
    this._view = value;
  }

  // Returns the number of lines in the text. Counts the number of '\n' characters
  // and returns that plus one.
  private countLines(text: string) {
    let count = 0;
    for (let index = 0; index != -1; count++, index = text.indexOf('\n', index + 1));
    return count;
  }
}