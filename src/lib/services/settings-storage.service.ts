import { Injectable } from "@angular/core";
import { Filter, FilterItem } from "../model";

@Injectable()
export class SettingsStorageService {
  serializerVersion = 2;
  constructor() {}

  public restoreFilter(filter: Filter) {
    const storageName = "Filter|" + filter.name;
    const item = localStorage.getItem(storageName);
    if (item) {
      try {
        const serializedForm = JSON.parse(item) as SerializedFilter;        
        this.deserializeFilter(filter, serializedForm);
      } catch (err) {
        console.error(
          "Error deserializing filter: " + err + ". String: " + item
        );
      }
    }

    filter.changed.subscribe(() => {
      localStorage.setItem(
        storageName,
        JSON.stringify(this.serializeFilter(filter))
      );
    });

    return filter;
  }

  private deserializeFilter(filter: Filter, serializedFilter: SerializedFilter) {
    if (serializedFilter.version != this.serializerVersion) {
      return;
    }
    filter.enabled = serializedFilter.enabled;
    filter.hideUnfiltered = serializedFilter.hideUnfiltered;
    for (let serializedItem of serializedFilter.items) {
      filter.addItem(new FilterItem(serializedItem.text, serializedItem.enabled, filter, serializedItem.fields));
    }
    return filter;
  }

  private serializeFilter(filter: Filter) {
    var serializedItems: SerializedFilterItem[] = [];
    for (let item of filter.items) {
      serializedItems.push({
        type: "FilterItem",
        version: this.serializerVersion,
        text: item.text,
        enabled: item.enabled,
        fields: item.getAllFields()
      });
    }
    return {
      type: "Filter",
      version: this.serializerVersion,
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
  public fields: any;
}
