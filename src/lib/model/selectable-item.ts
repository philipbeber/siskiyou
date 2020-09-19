import { LogLine } from "./log-line";
import { Subject, Observable } from "rxjs";
import { LogLineView } from "./log-line-view";

export class SelectableItem {
  public cells: string[];
  private changedSubject: Subject<void> = new Subject();
  public changed: Observable<void> = this.changedSubject.asObservable();

  public constructor(public name: string, isSelected: boolean) {
    this.cells = name.split("/");
    this._isSelected = isSelected;
  }

  public test(line: LogLine): LogLineView {
    return null;
  }

  private _isSelected: boolean;
  public get isSelected() {
    return this._isSelected;
  }
  public set isSelected(value: boolean) {
    const oldValue = this._isSelected;
    this._isSelected = value;
    if (value != oldValue) {
      this.changedSubject.next();
    }
  }
}
