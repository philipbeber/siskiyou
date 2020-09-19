import { LogLine } from "./log-line";
import { Subject, Observable } from "rxjs";
import { LogLineView } from "./log-line-view";
import { FilterItem } from "./filter-item";

export class Filter {
  private changedSubject: Subject<void> = new Subject();
  public changed: Observable<void> = this.changedSubject.asObservable();
  public headers: Array<string> = [""];
  private _items: FilterItem[] = [];
  public readOnly: boolean;

  public constructor(public name: string) {
    this._enabled = true;
  }

  public get items(): ReadonlyArray<FilterItem> {
    return this._items;
  }

  public get type() {
    return "base";
  }

  public updateView(view: LogLineView, line: LogLine) {
    if (!this.enabled) {
      return;
    }

    var matchedOne = false;
    for (let item of this._items) {
      matchedOne = this.updateViewForItem(item, view, line) || matchedOne;
      if (!view.visible) {
        return;
      }
    }

    if (!matchedOne && this.hideUnfiltered) {
      view.visible = false;
    }
  }

  public updateViewForItem(item: FilterItem, view: LogLineView, line: LogLine) {
    return false;
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
    const index = this._items.findIndex(x => x === item);
    if (index >= 0) {
      this._items.splice(index, 1);
      this.notifyChanged();
    }
  }

  public addItem(item: FilterItem) {
    this._items.push(item);
    this.notifyChanged();
  }

  public moveItem(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || fromIndex >= this._items.length || toIndex < 0 || toIndex >= this._items.length)
    {
      return;
    }

    let movedItems = this._items.splice(fromIndex, 1);
    this._items.splice(toIndex, 0, movedItems[0]);
    this.notifyChanged();
  }
}
