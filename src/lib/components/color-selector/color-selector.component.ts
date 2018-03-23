import { Component, OnInit, Input } from "@angular/core";
import { FilterItem, Filter } from "../../model";
import { ColorPickerService } from "../color-picker";
import { ColorFilterItem } from "./color-filter-item";

@Component({
  selector: "color-selector",
  templateUrl: "./color-selector.component.html",
  styleUrls: ["./color-selector.component.scss"]
})
export class ColorSelectorComponent implements OnInit {
  @Input() public filter: Filter;

  private newText: string;
  private newColor: string;

  constructor(private cpService: ColorPickerService) {
    this.setRandomColor();
  }

  private setRandomColor() {
    var r, g, b;
    var h = Math.random();
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch (i % 6) {
      case 0:
        r = 1;
        g = f;
        b = 0;
        break;
      case 1:
        r = q;
        g = 1;
        b = 0;
        break;
      case 2:
        r = 0;
        g = 1;
        b = f;
        break;
      case 3:
        r = 0;
        g = q;
        b = 1;
        break;
      case 4:
        r = f;
        g = 0;
        b = 1;
        break;
      case 5:
        r = 1;
        g = 0;
        b = q;
        break;
    }
    // rgba(255,137,0,0.47)
    this.newColor =
      "rgba(" +
      (~~(r * 255)).toFixed() +
      "," +
      (~~(g * 255)).toFixed() +
      "," +
      (~~(b * 255)).toFixed() +
      ",0.5)";
  }

  ngOnInit() {}

  checkClicked(event) {
    event.stopPropagation();
  }

  onlyClicked(event, clickedItem: FilterItem) {
    event.stopPropagation();
    for (let item of this.filter.items) {
      item.isEnabled = item === clickedItem;
    }
  }

  deleteClicked(event, clickedItem: FilterItem) {
    event.stopPropagation();
    this.filter.deleteItem(clickedItem);
  }

  selectAll(event) {
    event.stopPropagation();
    for (let item of this.filter.items) {
      item.isEnabled = true;
    }
  }

  selectNone(event) {
    event.stopPropagation();
    for (let item of this.filter.items) {
      item.isEnabled = false;
    }
  }

  createClicked(event) {
    event.stopPropagation();
    const newItem = new ColorFilterItem(
      this.newText,
      true,
      this.filter,
      this.newColor
    );
    this.filter.addItem(newItem);
    this.newText = null;
    this.setRandomColor();
  }
}
