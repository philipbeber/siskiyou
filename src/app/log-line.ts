import { Log } from './log';

export class LogLine {
  public text: string;
  public thread: string;
  public level: string;
  public component: string;
  public source: string;
  
  public constructor(public log: Log, public timestamp: Date, public index: number) {}
}
