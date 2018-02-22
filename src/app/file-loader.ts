import { Log } from "./log";

import * as JSZip from "jszip";

export class FileLoader {
  public filesToLoad = 0;
  public filesLoaded = 0;
  public logs: Log[] = [];

  public async addFiles(files: File[]): Promise<Log[]> {
    const promises = [];
    for (let file of files) {
      promises.push(this.addFile(file));
    }
    await Promise.all(promises);
    return this.logs;
  }

  private async addFile(file: File | JSZip.JSZipObject) {
    console.log(file.name);
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".zip")) {
      let blob: Blob;
      if (file instanceof File) {
        blob = file;
      } else {
        blob = await file.async("blob");
      }
      await this.addZip(blob);
    } else if (
      fileName.endsWith(".log") &&
      !fileName.startsWith("Fuze-Cef") &&
      !fileName.startsWith("Fuze-Browser")
    ) {
      let text: string;
      if (file instanceof File) {
        text = await this.getTextFromFile(file);
      } else {
        text = await file.async("text");
      }
      this.logs.push(new Log(file.name, this.readFile(text)));
    }
  }

  private async addZip(file: Blob): Promise<void> {
    this.filesToLoad++;
    const zip = await JSZip.loadAsync(file);
    const promises = [];
    const moreFilesToLoad = [];
    zip.forEach((relativePath, zipEntry) => {
      promises.push(this.addFile(zipEntry));
    });
    await Promise.all(promises);
    this.filesLoaded++;
  }

  private async getTextFromFile(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.readAsText(file);
    });
  }

  private readFile(text: string) {
    return iterator();
    function* iterator() {
      let curPos = 0;
      while (curPos < text.length) {
        let startPos = curPos;
        let endPos : number;
        while (curPos < text.length) {
          if (text[curPos] == '\r') {
            endPos = curPos;
            if ((curPos + 1) < text.length && text[curPos + 1] == '\n') {
              curPos = curPos + 2;
            } else {
              curPos = curPos + 1;
            }
            break;
          }
          if (text[curPos] == '\n') {
            endPos = curPos;
            if ((curPos + 1) < text.length && text[curPos + 1] == '\r') {
              curPos = curPos + 2;
            } else {
              curPos = curPos + 1;
            }
            break;
          }
          curPos++;
        }
        const slice = text.slice(startPos, endPos);
        yield slice;
      }
    }
  }
}
