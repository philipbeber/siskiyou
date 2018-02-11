import { TestBed, inject } from '@angular/core/testing';

import { LogAnalysisService } from './log-analysis.service';

describe('LogAnalysisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogAnalysisService]
    });
  });

  it('should be created', inject([LogAnalysisService], (service: LogAnalysisService) => {
    expect(service).toBeTruthy();
  }));
});
