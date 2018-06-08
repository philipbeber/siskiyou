import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import { InputFile } from "siskiyou";
import { FileLoaderService } from "siskiyou";

@Injectable()
export class CustomFileLoaderService extends FileLoaderService {
  public loadFiles(files: File[]): Observable<InputFile> {
    console.log("it worked!");
    return super.loadFiles(files);
  }
}
