import { TestBed, inject } from "@angular/core/testing";

import { SettingsStorageService } from "./settings-storage.service";
import { Filter, ColorFilterItem, FilterItem } from "../model";

describe("SettingsStorageService", () => {
  function expectFiltersToBeTheSame(filter1: Filter, filter2: Filter) {
    expect(filter1).toBeDefined("filter1");
    expect(filter2).toBeDefined("filter2");
    expect(filter1 !== filter2).toBeTruthy("object equality");
    expect(filter1.name).toBe(filter2.name, "name");
    expect(filter1.enabled).toBe(filter2.enabled, "enabled");
    expect(filter1.hideUnfiltered).toBe(
      filter2.hideUnfiltered,
      "hideUnfiltered"
    );
    expect(filter1.items).toBeDefined("filter1.items");
    expect(filter2.items).toBeDefined("filter2.items");
    console.log(filter1.items.length);
    expect(filter1.items.length).toBe(filter2.items.length, "items.length");
    for (let i = 0; i < filter1.items.length; i++) {
      let item1 = filter1.items[i];
      let item2 = filter2.items[i];
      expect(item1.enabled).toBe(item2.enabled, "item.enabled");
      expect(item1.text).toBe(item2.text, "item.text");
      expect(item1 instanceof ColorFilterItem).toBe(
        item2 instanceof ColorFilterItem,
        "instanceof ColorFilterItem"
      );
      console.log(item1 instanceof ColorFilterItem);
      expect((item1 as ColorFilterItem).color).toBe(
        (item2 as ColorFilterItem).color,
        "color"
      );
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsStorageService]
    });
    localStorage.clear();
  });

  it(
    "should create an empty filter",
    inject([SettingsStorageService], (service: SettingsStorageService) => {
      expect(service).toBeTruthy();
      const filter1 = service.createFilter("Test1");
      const filter2 = new Filter("Test1", true);
      expectFiltersToBeTheSame(filter1, filter2);
    })
  );

  it(
    "should save changes to the filter",
    inject([SettingsStorageService], (service: SettingsStorageService) => {
      const filter2 = service.createFilter("Test2");
      filter2.enabled = false;
      filter2.hideUnfiltered = true;
      filter2.addItem(new FilterItem("asdf", true, filter2));
      filter2.addItem(new FilterItem("ghjk", false, filter2));
      const filter1 = service.createFilter("Test2");
      expectFiltersToBeTheSame(filter1, filter2);
    })
  );

  it(
    "should save color items",
    inject([SettingsStorageService], (service: SettingsStorageService) => {
      const filter2 = service.createFilter("Test2");
      filter2.enabled = false;
      filter2.hideUnfiltered = false;
      filter2.addItem(new FilterItem("asdf", true, filter2));
      filter2.addItem(new FilterItem("ghjk", false, filter2));
      filter2.addItem(new ColorFilterItem("color1", false, filter2, "color_a"));
      const colorItem = new ColorFilterItem("color2", true, filter2, "color_b");
      filter2.addItem(colorItem);
      colorItem.color = "color_c";
      const filter1 = service.createFilter("Test2");
      expectFiltersToBeTheSame(filter1, filter2);
    })
  );
});
