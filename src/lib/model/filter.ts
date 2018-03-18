import { SelectableItem } from "./selectable-item";
import { LogLine } from "./log-line";
import { Subject, Observable } from "rxjs";
import { LogLineView } from "./log-line-view";
import { FilterItem } from "./filter-item";

export class Filter {

  private changedSubject: Subject<void> = new Subject();
  public changed: Observable<void> = this.changedSubject.asObservable();

  public constructor(public title: string, public items: FilterItem[], enabled: boolean) {
    this._enabled = enabled;
  }

  public updateView(view: LogLineView, line: LogLine) {
    if (!this.enabled) {
      return;
    }

    for (let item of this.items) {
      item.updateView(view, line);
      if (!view.visible) {
        return;
      }
    }
  }

  private _enabled: boolean;
  public get enabled() { return this._enabled; }
  public set enabled(value: boolean) {
    let oldValue = this._enabled;
    this._enabled = value;
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
