import { Injectable } from "@angular/core";
import { Filter, ColorFilterItem, FilterItem } from "../model";

@Injectable()
export class SettingsStorageService {
  constructor() {}

  public createFilter(name: string) {
    const storageName = "Filter|" + name;
    const item = localStorage.getItem(storageName);
    let filter: Filter;
    if (item) {
      try {
        const serializedForm = JSON.parse(item) as SerializedFilter;
        filter = this.deserializeFilter(serializedForm);
      } catch (err) {
        console.error(
          "Error deserializing filter: " + err + ". String: " + item
        );
      }
    }
    if (!filter) {
      filter = new Filter(name, true);
    }

    filter.changed.subscribe(() => {
      localStorage.setItem(
        storageName,
        JSON.stringify(this.serializeFilter(filter))
      );
    });

    return filter;
  }

  private deserializeFilter(serializedFilter: SerializedFilter) {
    const filter = new Filter(serializedFilter.name, serializedFilter.enabled);
    filter.hideUnfiltered = serializedFilter.hideUnfiltered;
    for (let serializedItem of serializedFilter.items) {
      let item: FilterItem;
      if (serializedItem.type == "ColorFilterItem") {
        item = new ColorFilterItem(
          serializedItem.text,
          serializedItem.enabled,
          filter,
          serializedItem.color
        );
      } else {
        item = new FilterItem(
          serializedItem.text,
          serializedItem.enabled,
          filter
        );
      }
      filter.addItem(item);
    }
    return filter;
  }

  private serializeFilter(filter: Filter) {
    var serializedItems: SerializedFilterItem[] = [];
    for (let item of filter.items) {
      const type =
        item instanceof ColorFilterItem ? "ColorFilterItem" : "FilterItem";
      const color = item instanceof ColorFilterItem ? item.color : undefined;
      serializedItems.push({
        type: type,
        version: 1,
        text: item.text,
        enabled: item.enabled,
        color: color
      });
    }
    return {
      type: "Filter",
      version: 1,
      name: filter.name,
      enabled: filter.enabled,
      hideUnfiltered: filter.hideUnfiltered,
      items: serializedItems
    };
  }
}

class SerializedObject {
  public type: string;
  public version: number;
}

class SerializedFilter extends SerializedObject {
  public name: string;
  public enabled: boolean;
  public hideUnfiltered: boolean;
  public items: SerializedFilterItem[];
}

class SerializedFilterItem extends SerializedObject {
  public text: string;
  public enabled: boolean;
  public color: string;
}
