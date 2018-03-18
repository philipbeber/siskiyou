import { Component, OnInit, Input } from '@angular/core';
import { FilterItem, Filter } from '../../model';
import { ColorPickerService } from '../color-picker';
import { ColorFilterItem } from './color-filter-item';

@Component({
  selector: 'color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorComponent implements OnInit {

  @Input()
  public data: Filter;

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
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    // rgba(255,137,0,0.47)
    this.newColor = "rgba(" +(~ ~(r * 255)).toFixed() + "," + (~ ~(g * 255)).toFixed() + "," + (~ ~(b * 255)).toFixed() + ",0.5)";
  }

  ngOnInit() {
  }

  checkClicked(event) {
    event.stopPropagation();
  }

  onlyClicked(clickedItem: FilterItem) {
    for (let item of this.data.items) {
      item.isEnabled = item === clickedItem;
    }
  }

  deleteClicked(clickedItem: FilterItem) {
    this.data.deleteItem(clickedItem);
  }

  selectAll() {
    for (let item of this.data.items) {
      item.isEnabled = true;
    }
  }

  selectNone() {
    for (let item of this.data.items) {
      item.isEnabled = false;
    }
  }

  createClicked() {
    const newItem = new ColorFilterItem(this.newText, true, this.data, this.newColor);
    this.data.addItem(newItem);
    this.newText = null;
    this.setRandomColor();
  }
}
