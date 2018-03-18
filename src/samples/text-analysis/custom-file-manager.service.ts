import { Injectable, NgZone } from "@angular/core";
import { Subject, Observable, Subscription } from "rxjs";
import { LogAnalysisService } from "../../lib/services/log-analysis.service";

@Injectable()
export class CustomLogAnalysisService extends LogAnalysisService {

  public addFiles(files: File[]) {
    console.log("In CustomLogAnalysisService");
    return super.addFiles(files);
  }
}
