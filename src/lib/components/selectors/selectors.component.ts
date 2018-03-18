import { Component, ElementRef, ViewChild } from "@angular/core";
import { LogAnalysisService } from "../../services/log-analysis.service";

@Component({
  selector: "selectors",
  templateUrl: "./selectors.component.html",
  styleUrls: ["./selectors.component.css"]
})
export class SelectorsComponent {

  constructor(public logAnalysis: LogAnalysisService) {
  }

}
