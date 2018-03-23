import {
  FilterItem,
  Filter,
  LogLine,
  LogLineView,
  LogLineColorView
} from "../../model";

export class ColorFilterItem extends FilterItem {
  private _color: string;

  public constructor(
    name: string,
    isEnabled: boolean,
    filter: Filter,
    color: string
  ) {
    super(name, isEnabled, filter);
    this._color = color;
  }

  public updateView(view: LogLineView, line: LogLine) {
    if (this.isEnabled && line.text.indexOf(this.name) >= 0) {
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
