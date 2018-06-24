import { Component, OnInit, Input } from "@angular/core";
import { FilterItem, Filter } from "../../model";

@Component({
  selector: "text-selector",
  templateUrl: "./text-selector.component.html",
  styleUrls: ["./text-selector.component.scss"]
})
export class TextSelectorComponent implements OnInit {
  @Input() public filter: Filter;

  private newText: string;

  constructor() {
  }

  ngOnInit() {}

  checkClicked(event) {
    event.stopPropagation();
  }

  onlyClicked(event, clickedItem: FilterItem) {
    event.stopPropagation();
    for (let item of this.filter.items) {
      item.enabled = item === clickedItem;
    }
  }

  deleteClicked(event, clickedItem: FilterItem) {
    event.stopPropagation();
    this.filter.deleteItem(clickedItem);
  }

  selectAll(event) {
    event.stopPropagation();
    for (let item of this.filter.items) {
      item.enabled = true;
    }
  }

  selectNone(event) {
    event.stopPropagation();
    for (let item of this.filter.items) {
      item.enabled = false;
    }
  }

  createClicked(event) {
    event.stopPropagation();
    const newItem = new FilterItem(
      this.newText,
      true,
      this.filter
    );
    this.filter.addItem(newItem);
    this.newText = null;
  }
}
