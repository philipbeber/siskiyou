import { Injectable, NgZone } from "@angular/core";
import { Log } from "./log";
import { LogLine } from "./log-line";
import { FileLoader } from "./file-loader";
import { LogMerger } from "./log-merger";
import { MeetingInstance } from "./meeting-instance";

@Injectable()
export class LogAnalysisService {
  constructor(private ngZone: NgZone) {}

  public meetingInstances: MeetingInstance[] = [];
  public logs: Log[] = [];
  public lines: LogLine[] = [];
  public busy: boolean;

  private meetingMap: Map<string, MeetingInstance> = new Map<string, MeetingInstance>();

  public addFiles(files: File[]) {
    this.busy = true;
    console.log("adding files")
    this.ngZone.runOutsideAngular(() => {
      new FileLoader().addFiles(files).then((logs: Log[]) => {
        this.ngZone.run(() => {
          this.processNewLogs(logs);
          this.logs = this.logs.concat(logs);
          this.lines = new LogMerger().merge(this.logs);
          this.busy = false;
        });
      });
    });
  }

  private processNewLogs(logs: Log[]) {
    console.log("processing " + logs.length + " new log files")
    for (let log of logs) {
      for (let line of log.lines) {
        let meetingStart = line.text.match(/handleMeetingConnected meeting (\d+) instance (\d+) /);
        if (meetingStart) {
          let meetingId = meetingStart[1];
          let instanceId = meetingStart[2];
          this.addMeetingStart(line.timestamp, meetingId, instanceId);
        }
        let meetingEnd = line.text.match(/handleMeetingDisconnected meeting (\d+) instance (\d+) /);
        if (meetingEnd) {
          let meetingId = meetingEnd[1];
          let instanceId = meetingEnd[2];
          this.addMeetingEnd(line.timestamp, meetingId, instanceId);
        }
      }
    }

    this.meetingInstances = [];
    let item: IteratorResult<MeetingInstance>;
    let iterator = this.meetingMap.values();
    while(!(item = iterator.next()).done) {
      this.meetingInstances.push(item.value);
    }
    console.log("now at " + this.meetingInstances.length + " meeting instances")
    this.meetingInstances.sort((a, b) => {
      return a.startTime.getTime() - b.startTime.getTime();
    });
  }

  private addMeetingStart(timestamp: Date, meetingId: string, instanceId: string) {
    let instance = this.getMeetingInstance(timestamp, meetingId, instanceId);
    if (instance.startTime > timestamp) {
      instance.startTime = timestamp;
    }
  }

  private addMeetingEnd(timestamp: Date, meetingId: string, instanceId: string) {
    let instance = this.getMeetingInstance(timestamp, meetingId, instanceId);
    if (instance.endTime < timestamp) {
      instance.endTime = timestamp;
    }
  }

  private getMeetingInstance(timestamp: Date, meetingId: string, instanceId: string) {
    let instance: MeetingInstance;
    if (!this.meetingMap.has(instanceId)) {
      instance = new MeetingInstance(timestamp, timestamp, meetingId, instanceId);
      this.meetingMap.set(instanceId, instance);
    } else {
      instance = this.meetingMap.get(instanceId);
    }
    return instance;
  }
}
