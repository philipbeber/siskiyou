import { LogLine } from "./log-line";
import { Subject, Observable } from "rxjs";
import { LogLineView } from "./log-line-view";
import { Filter } from "./filter";

export class FilterItem {
  public get cells() {
    return [this.text];
  }

  public constructor(
    name: string,
    isEnabled: boolean,
    protected filter: Filter
  ) {
    this._text = name;
    this._enabled = isEnabled;
  }

  public updateView(view: LogLineView, line: LogLine) {
    return false;
  }

  private _enabled: boolean;
  public get enabled() {
    return this._enabled;
  }
  public set enabled(value: boolean) {
    const oldValue = this._enabled;
    this._enabled = value;
    if (value != oldValue) {
      this.filter.notifyChanged();
    }
  }

  private _text: string;
  public get text() {
    return this._text;
  }
  public set text(value: string) {
    const oldValue = this._text;
    this._text = value;
    if (value != oldValue) {
      this.filter.notifyChanged();
    }
  }

  public delete() {
    this.filter.deleteItem(this);
  }
}
