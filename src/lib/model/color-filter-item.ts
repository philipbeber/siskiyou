import { FilterItem } from "./filter-item";
import { Filter } from "./filter";
import { LogLineView, LogLineColorView } from "./log-line-view";
import { LogLine } from "./log-line";

export class ColorFilterItem extends FilterItem {
  private _color: string;

  public constructor(
    name: string,
    enabled: boolean,
    filter: Filter,
    color: string
  ) {
    super(name, enabled, filter);
    this._color = color;
  }

  public updateView(view: LogLineView, line: LogLine) {
    if (this.enabled && line.text.indexOf(this.text) >= 0) {
      (view as LogLineColorView).color = this.color;
      return true;
    }
    return false;
  }

  public get color() {
    return this._color;
  }
  public set color(value: string) {
    const oldValue = this._color;
    this._color = value;
    if (value != oldValue) {
      this.filter.notifyChanged();
    }
  }
}
