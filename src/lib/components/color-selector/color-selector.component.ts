import { Component, OnInit, Input } from "@angular/core";
import { FilterItem, Filter, ColorFilter } from "../../model";
import { ColorPickerService } from "../color-picker";

@Component({
  selector: "color-selector",
  templateUrl: "./color-selector.component.html",
  styleUrls: ["./color-selector.component.scss"]
})
export class ColorSelectorComponent implements OnInit {
  @Input() public filter: Filter;

  private newText: string;
  private newColor: string;
  private selectedItem: FilterItem;

  constructor(private cpService: ColorPickerService) {
    this.newColor = ColorSelectorComponent.createRainbowColor();
  }

  public static createRainbowColor() {
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

    return "rgba(" +
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
    event.preventDefault();
    for (let item of this.filter.items) {
      item.enabled = item === clickedItem;
    }
  }

  deleteClicked(event) {
    event.stopPropagation();
    event.preventDefault();
    this.filter.deleteItem(this.selectedItem);
    this.selectedItem = null;
  }

  enableAll(event) {
    event.stopPropagation();
    event.preventDefault();
    for (let item of this.filter.items) {
      item.enabled = true;
    }
  }

  select(event, item) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedItem = item;
  }

  isSelected(item) {
    return this.selectedItem === item;
  }

  createClicked(event) {
    event.stopPropagation();
    event.preventDefault();
    (this.filter as ColorFilter).addColorItem(
      this.newText,
      true,
      this.newColor
    );
    this.newText = null;
    this.newColor = ColorSelectorComponent.createRainbowColor();
  }

  moveUp(event) {
    event.stopPropagation();
    event.preventDefault();
    let index = this.getSelectedIndex();
    this.filter.moveItem(index, index - 1);
  }

  moveDown(event) {
    event.stopPropagation();
    event.preventDefault();
    let index = this.getSelectedIndex();
    this.filter.moveItem(index, index + 1);
  }

  upDisabled() {
    return !this.selectedItem || this.selectedItem === this.filter.items[0];
  }

  downDisabled() {
    return !this.selectedItem || this.selectedItem === this.filter.items[this.filter.items.length - 1];
  }

  getSelectedIndex() {
    for (let index = 0; index < this.filter.items.length; index++) {
      if (this.filter.items[index] === this.selectedItem) {
        return index;
      }
    }
    return undefined;
  }
}
