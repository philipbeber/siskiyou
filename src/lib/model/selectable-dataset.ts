import { SelectableItem } from "./selectable-item";
import { LogLine } from "./log-line";
import { Subject, Observable } from "rxjs";

export class SelectableDataSet {
  public headers: string[];
  private changedSubject: Subject<void> = new Subject();
  public changed: Observable<void> = this.changedSubject.asObservable();

  public constructor(public title: string, public items: SelectableItem[]) {
    for (let item of items) {
      item.changed.subscribe(() => {
        this.changedSubject.next;
      });
    }
  }

  public test(line: LogLine) {
    if (!this.enabled) {
      return true;
    }
    for (let item of this.items) {
      if (item.isSelected && item.test(line)) {
        return true;
      }
    }

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
}
