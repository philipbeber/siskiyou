import { Filter } from "./filter";
import { FilterItem } from "./filter-item";
import { LogLineView } from "./log-line-view";
import { LogLine } from "./log-line";
import { InputFile } from "./input-file";

export class FileFilter extends Filter {

  constructor(name: string) {
    super(name);
    this.readOnly = true;
  }

  public updateViewForItem(item: FilterItem, view: LogLineView, line: LogLine) {
    if (!item.enabled && line.file.path == item.text) {
      view.visible = false;
    }
    return false;
  }

  public addFileItem(file: InputFile) {
    let newItem = new FilterItem(file.path, true, this);
    this.addItem(newItem);
  }

  public get type() {
    return "file";
  }
}
