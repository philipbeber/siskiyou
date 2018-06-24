import { Filter } from "./filter";
import { FilterItem } from "./filter-item";
import { LogLineView, LogLineColorView } from "./log-line-view";
import { LogLine } from "./log-line";

export class ColorFilter extends Filter {

  public updateViewForItem(item: FilterItem, view: LogLineView, line: LogLine) {
    if (item.enabled && line.text.toUpperCase().indexOf(item.text.toUpperCase()) >= 0) {
      (view as LogLineColorView).color = item.getField("color");
      return true;
    }
    return false;
  }

  public addColorItem(text: string, enabled: boolean, color: string) {
    let newItem = new FilterItem(text, enabled, this, { color: color });
    this.addItem(newItem);
  }

  public get type() {
    return "color";
  }
}
