import { SelectableItem } from "./selectable-item";
import { LogLine } from "./log-line";
import { Subject, Observable } from "rxjs";
import { LogLineView } from "./log-line-view";
import { FilterItem } from "./filter-item";

export class Filter {
  private changedSubject: Subject<void> = new Subject();
  public changed: Observable<void> = this.changedSubject.asObservable();
  public headers: Array<string> = [""];

  public constructor(
    public title: string,
    public items: FilterItem[],
    enabled: boolean
  ) {
    this._enabled = enabled;
  }

  public updateView(view: LogLineView, line: LogLine) {
    if (!this.enabled) {
      return;
    }

    var matchedOne = false;
    for (let item of this.items) {
      matchedOne = item.updateView(view, line) || matchedOne;
      if (!view.visible) {
        return;
      }
    }

    if (!matchedOne && this.hideUnfiltered) {
      view.visible = false;
    }
  }

  private _enabled: boolean;
  public get enabled() {
    return this._enabled;
  }
  public set enabled(value: boolean) {
    let oldValue = this._enabled;
    this._enabled = value;
    if (oldValue != value) {
      this.changedSubject.next();
    }
  }

  private _hideUnfiltered: boolean;
  public get hideUnfiltered() {
    return this._hideUnfiltered;
  }
  public set hideUnfiltered(value: boolean) {
    let oldValue = this._hideUnfiltered;
    this._hideUnfiltered = value;
    if (oldValue != value) {
      this.changedSubject.next();
    }
  }

  public notifyChanged() {
    this.changedSubject.next();
  }

  public deleteItem(item: FilterItem) {
    const index = this.items.findIndex(x => x === item);
    if (index >= 0) {
      this.items.splice(index, 1);
      this.notifyChanged();
    }
  }

  public addItem(item: FilterItem) {
    this.items.push(item);
    this.notifyChanged();
  }
}
