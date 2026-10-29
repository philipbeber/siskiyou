export const LINE_COUNT = 1_000_000;

export type LogLevel = "ERROR" | "WARN" | "INFO";

export function levelForLine(index: number): LogLevel {
  if (index % 100 === 0) {
    return "ERROR";
  }
  if (index % 10 === 0) {
    return "WARN";
  }
  return "INFO";
}

export function countLinesWithLevel(
  lineCount: number,
  level: LogLevel,
): number {
  const errorCount = Math.floor((lineCount - 1) / 100) + 1;
  const warnOrErrorCount = Math.floor((lineCount - 1) / 10) + 1;
  const warnCount = warnOrErrorCount - errorCount;
  const infoCount = lineCount - errorCount - warnCount;
  switch (level) {
    case "ERROR":
      return errorCount;
    case "WARN":
      return warnCount;
    case "INFO":
      return infoCount;
  }
}

export function createLargeLogFile(lineCount: number = LINE_COUNT): File {
  const lines = new Array<string>(lineCount);
  for (let i = 0; i < lineCount; i++) {
    lines[i] = `${i} ${levelForLine(i)} message for line ${i}`;
  }
  return new File([lines.join("\n") + "\n"], "large.log", {
    type: "text/plain",
  });
}
