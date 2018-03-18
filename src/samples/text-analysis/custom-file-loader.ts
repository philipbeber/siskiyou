  import { Injectable } from "@angular/core";
  import {Observable, Subject} from "rxjs";
  
  import { InputFile } from "../../lib/model";
  import { FileLoaderService } from "../../lib/services/file-loader.service";

  @Injectable()
  export class CustomFileLoaderService extends FileLoaderService {

    public loadFiles(files: File[]): Observable<InputFile> {
      console.log("it worked!");
      return super.loadFiles(files);
    }
  }
