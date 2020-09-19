import { Filter } from "./filter";
import { FilterItem } from "./filter-item";
import { LogLineView } from "./log-line-view";
import { LogLine } from "./log-line";

export class HideFilter extends Filter {
  public updateViewForItem(item: FilterItem, view: LogLineView, line: LogLine) {
    if (item.enabled && line.text.toUpperCase().indexOf(item.text.toUpperCase()) >= 0) {
      view.visible = false;
    }
    return false;
  }

  public get type() {
    return "hide";
  }
}
