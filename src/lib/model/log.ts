import { LogLine } from "./log-line";

export class Log {
  public lines: LogLine[] = [];

  public constructor(public path: string) {}
}
