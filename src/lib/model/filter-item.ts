import { LogLine } from "./log-line";
import { LogLineView } from "./log-line-view";
import { Filter } from "./filter";

export class FilterItem {
  public get cells() {
    return [this.text];
  }

  public constructor(
    name: string,
    enabled: boolean,
    protected filter: Filter,
    fields: any = {}
  ) {
    this._text = name;
    this._enabled = enabled;
    this._extra = fields;
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

  private _extra: any;
  public setField(name: string, value: string) {
    if (value != this._extra[name]) {
      this._extra[name] = value;
      this.filter.notifyChanged();
    }
  }
  public getField(name: string) {
    return this._extra[name];
  }
  public getAllFields() {
    return this._extra;
  }

  public delete() {
    this.filter.deleteItem(this);
  }
}
