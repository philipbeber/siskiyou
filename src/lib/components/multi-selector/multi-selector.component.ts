import { Component, OnInit, Input } from "@angular/core";
import { SelectableItem, SelectableDataSet } from "../../model";

@Component({
  selector: "multi-selector",
  templateUrl: "./multi-selector.component.html",
  styleUrls: ["./multi-selector.component.css"]
})
export class MultiSelectorComponent implements OnInit {
  @Input() public data: SelectableDataSet;

  constructor() {}

  ngOnInit() {}

  checkClicked(event) {
    event.stopPropagation();
  }

  onlyClicked(clickedItem: SelectableItem) {
    event.stopPropagation();
    event.preventDefault();
    for (let item of this.data.items) {
      item.isSelected = item === clickedItem;
    }
  }

  selectAll() {
    event.stopPropagation();
    event.preventDefault();
    for (let item of this.data.items) {
      item.isSelected = true;
    }
  }
}
