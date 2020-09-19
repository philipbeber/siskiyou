import { TestBed, inject, fakeAsync } from "@angular/core/testing";

import { LogAnalysisService } from "./log-analysis.service";
import { FileLoaderService } from "./file-loader.service";
import { InputFile, Log } from "../model";
import { LogMergerService } from "./log-merger.service";
import { LogParserService } from "./log-parser.service";
import { Observable, Subject, ReplaySubject } from "rxjs/Rx";

describe("LogAnalysisService", () => {
  let fileLoaderServiceSpy: jasmine.SpyObj<FileLoaderService>;
  let logMergerServiceSpy: jasmine.SpyObj<LogMergerService>;
  let logParserServiceSpy: jasmine.SpyObj<LogParserService>;
  let inputFile1: jasmine.SpyObj<InputFile>;
  let jFile1: jasmine.SpyObj<File>;
  let log1: jasmine.SpyObj<Log>;

  beforeEach(() => {
    const flSpy = jasmine.createSpyObj("FileLoaderService", ["loadFiles"]);
    const lmSpy = jasmine.createSpyObj("LogMergerService", ["merge"]);
    const lpSpy = jasmine.createSpyObj("LogParserService", ["parseFile"]);
    TestBed.configureTestingModule({
      providers: [
        LogAnalysisService,
        {
          provide: FileLoaderService,
          useValue: flSpy
        },
        {
          provide: LogMergerService,
          useValue: lmSpy
        },
        {
          provide: LogParserService,
          useValue: lpSpy
        }
      ]
    });
    fileLoaderServiceSpy = TestBed.get(FileLoaderService);
    logMergerServiceSpy = TestBed.get(LogMergerService);
    logParserServiceSpy = TestBed.get(LogParserService);
    inputFile1 = jasmine.createSpyObj("InputFile", ["getLines"]);
    jFile1 = jasmine.createSpyObj("File", ["name"]);
    log1 = jasmine.createSpyObj("Log", ["lines"]);
  });

  it(
    "should be created",
    inject([LogAnalysisService], (service: LogAnalysisService) => {
      expect(service).toBeTruthy();
    })
  );

  it(
    "should get log from log parser",
    inject(
      [LogAnalysisService],
      fakeAsync((service: LogAnalysisService) => {
        expect(service).toBeTruthy();
        const subject = new ReplaySubject<InputFile>();
        subject.next(inputFile1);
        subject.complete();
        const obs = subject.asObservable();
        fileLoaderServiceSpy.loadFiles.and.returnValue(obs);

        const lpSubject = new ReplaySubject<Log>();
        lpSubject.next(log1);
        lpSubject.complete();
        logParserServiceSpy.parseFile.and.returnValue(lpSubject.asObservable());

        service.addFiles([jFile1]);
        expect(service.logs.length).toBe(1);
      })
    )
  );
});
