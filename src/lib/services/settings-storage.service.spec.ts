import { TestBed, inject } from "@angular/core/testing";

import { SettingsStorageService } from "./settings-storage.service";
import { Filter, FilterItem } from "../model";

describe("SettingsStorageService", () => {
  function expectFiltersToBeTheSame(filter1: Filter, filter2: Filter) {
    expect(filter1).toBeDefined();
    expect(filter2).toBeDefined();
    expect(filter1 !== filter2).toBeTruthy();
    expect(filter1.name).toBe(filter2.name);
    expect(filter1.enabled).toBe(filter2.enabled);
    expect(filter1.hideUnfiltered).toBe(filter2.hideUnfiltered);
    expect(filter1.items).toBeDefined();
    expect(filter2.items).toBeDefined();
    expect(filter1.items.length).toBe(filter2.items.length);
    for (let i = 0; i < filter1.items.length; i++) {
      let item1 = filter1.items[i];
      let item2 = filter2.items[i];
      expect(item1.enabled).toBe(item2.enabled);
      expect(item1.text).toBe(item2.text);
      expect(item1.getField("color")).toBe(item2.getField("color"));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsStorageService]
    });
    localStorage.clear();
  });

  it("should restore an empty filter", inject(
    [SettingsStorageService],
    (service: SettingsStorageService) => {
      expect(service).toBeTruthy();
      const filter1 = service.restoreFilter(new Filter("Test1"));
      const filter2 = new Filter("Test1");
      expectFiltersToBeTheSame(filter1, filter2);
    }
  ));

  it("should save changes to the filter", inject(
    [SettingsStorageService],
    (service: SettingsStorageService) => {
      const filter2 = service.restoreFilter(new Filter("Test2"));
      filter2.enabled = false;
      filter2.hideUnfiltered = true;
      filter2.addItem(new FilterItem("asdf", true, filter2));
      filter2.addItem(new FilterItem("ghjk", false, filter2));
      const filter1 = service.restoreFilter(new Filter("Test2"));
      expectFiltersToBeTheSame(filter1, filter2);
    }
  ));

  it("should save color items", inject(
    [SettingsStorageService],
    (service: SettingsStorageService) => {
      const filter2 = service.restoreFilter(new Filter("Test2"));
      filter2.enabled = false;
      filter2.hideUnfiltered = false;
      filter2.addItem(new FilterItem("asdf", true, filter2));
      filter2.addItem(new FilterItem("ghjk", false, filter2));
      filter2.addItem(new FilterItem("color1", false, filter2, { color: "color_a" }));
      const colorItem = new FilterItem("color2", true, filter2, { color: "color_b" });
      filter2.addItem(colorItem);
      colorItem.setField("color", "color_c");
      const filter1 = service.restoreFilter(new Filter("Test2"));
      expectFiltersToBeTheSame(filter1, filter2);
    }
  ));
});
