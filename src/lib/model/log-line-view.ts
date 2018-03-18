export class LogLineView {

  public constructor(
  public text: string,
  public visible: boolean) {}

  public combine(source: LogLineView) {
    if (source) {
      Object.assign(this, source);
    }
  }
}

export class LogLineColorView extends LogLineView {
  public color: string;
}