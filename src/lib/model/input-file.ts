import * as JSZip from "jszip";

export class InputFile {
  public constructor(
    public path: string,
    private file: File | JSZip.JSZipObject
  ) {}

  public async getLines() {
    let text: string;
    if (this.file instanceof File) {
      text = await this.getTextFromFile(this.file);
    } else {
      text = await this.file.async("text");
    }
    return this.readFile(text);
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
        let endPos: number;
        while (curPos < text.length) {
          if (text[curPos] == "\r") {
            endPos = curPos;
            if (curPos + 1 < text.length && text[curPos + 1] == "\n") {
              curPos = curPos + 2;
            } else {
              curPos = curPos + 1;
            }
            break;
          }
          if (text[curPos] == "\n") {
            endPos = curPos;
            if (curPos + 1 < text.length && text[curPos + 1] == "\r") {
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
