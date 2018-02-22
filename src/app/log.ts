import { LogLine } from "./log-line";
import * as moment from 'moment';

export class Log {
  public lines: LogLine[] = [];
  public attendeeName: string;

  private currentLine: LogLine;
  private lastTimestamp: Date;

  public constructor(public path: string, private text: IterableIterator<string>) {
    let item : IteratorResult<string>;
    while (!(item = text.next()).done) {
      let textLine = item.value;
      if(!this.parseLine(textLine))
      {
        if (!this.currentLine) {
          console.log("Ignored line at beginning of file with invalid timestamp: " + textLine);
        } else {
          this.currentLine.text += '\n' + textLine;
        }
      }
    }
  }

  private parseLine(textLine: string) {
    const dateLength = 24;
    if (textLine.length < dateLength) {
      return null;
    }

    let datePart = textLine.slice(0, dateLength).replace(",", ".");
    let timestamp = moment(datePart);
    if (!timestamp.isValid) {
      return false;
    }

    this.currentLine = new LogLine(this, timestamp.toDate(), this.lines.length);
    this.lines.push(this.currentLine);

    textLine = textLine.slice(dateLength);
    const state = {text: textLine, continue: true};
    this.extract(state, "thread", /^\s*\[\s*(\d+\s*)\]\s*/);
    this.extract(state, "level", /^\[\s*(\S+\s*)\]\s*/);
    this.extract(state, "component", /^(\S+)\s*/);
    this.extract(state, "source", /^([^: ]+:\S+)\s*/);

    this.currentLine.text = state.text;
    return true;
  }

  private extract(state: { text: string, continue: boolean }, field: string, regex: RegExp) {
    if (!state.continue) {
      return;
    }

    const match = state.text.match(regex);
    if (!match) {
      state.continue = false;
      return;
    }

    state.text = state.text.slice(match[0].length);
    this.currentLine[field] = match[1];
  }
}
