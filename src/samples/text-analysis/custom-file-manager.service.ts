import { Injectable, NgZone } from "@angular/core";
import { Subject, Observable, Subscription } from "rxjs";
import { LogAnalysisService } from "siskiyou";

@Injectable()
export class CustomLogAnalysisService extends LogAnalysisService {
  public addFiles(files: File[]) {
    console.log("In CustomLogAnalysisService");
    return super.addFiles(files);
  }
}
