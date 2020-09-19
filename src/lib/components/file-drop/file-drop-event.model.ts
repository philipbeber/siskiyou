import { DroppedFile } from "./dropped-file.model";

export class FileDropEvent {
  constructor(public files: DroppedFile[]) {}
}
