  import { Injectable } from "@angular/core";
  import {Observable, Subject} from "rxjs";
  import * as JSZip from "jszip";

  import { Log } from "../model/log";
  import { InputFile } from "../model/input-file";

  @Injectable()
  export class FileLoaderService {

    public loadFiles(files: File[]): Observable<InputFile> {
      const subject = new Subject<InputFile>();
      setTimeout(() => {
        new FileLoaderHelper(files, subject);
      }, 0);
      return subject.asObservable();
    }
  }

  class FileLoaderHelper {

    constructor(private files: File[], private subject: Subject<InputFile>) {
      this.loadFiles();
    }

    private async loadFiles() {
      const promises = [];
      for (let file of this.files) {
        await this.loadFile(file);
      }
      this.subject.complete();
    }

    private async loadFile(file: File | JSZip.JSZipObject) {
      console.log(file.name);
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".zip")) {
        let blob: Blob;
        if (file instanceof File) {
          blob = file;
        } else {
          blob = await file.async("blob");
        }
        await this.loadZip(blob);
      } else {
        this.subject.next(new InputFile(file.name, file));
      }
    }

    private async loadZip(file: Blob): Promise<void> {
      const zip = await JSZip.loadAsync(file);
      const moreFilesToLoad = [];
      zip.forEach((relativePath, zipEntry) => {
        moreFilesToLoad.push(zipEntry);
      });
      for (let file of moreFilesToLoad) {
        await this.loadFile(file);
      }
    }
  }
