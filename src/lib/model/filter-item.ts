import { LogLine } from "./log-line";
import { Subject, Observable } from "rxjs";
import { LogLineView } from "./log-line-view";
import { Filter } from "./filter";

export class FilterItem {

  public constructor(name: string, isEnabled: boolean, protected filter: Filter) {
    this._name = name;
    this._isEnabled = isEnabled;
  }

  public updateView(view: LogLineView, line: LogLine) {
  }

  private _isEnabled: boolean;
  public get isEnabled() { return this._isEnabled; }
  public set isEnabled(value: boolean) {
    const oldValue = this._isEnabled;
    this._isEnabled = value;
    if (value != oldValue) {
      this.filter.notifyChanged();
    }
  }

  private _name: string;
  public get name() { return this._name; }
  public set name(value: string) {
    const oldValue = this._name;
    this._name = value;
    if (value != oldValue) {
      this.filter.notifyChanged();
    }
  }

  public delete() {
    this.filter.deleteItem(this);
  }
}
