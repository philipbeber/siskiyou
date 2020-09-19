import { InputFile } from "./input-file";

export class LogLine {
  public text: string;

  public constructor(public file: InputFile, public index: number) {}
}
