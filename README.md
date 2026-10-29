# Siskiyou

[![Build Status](https://github.com/philipbeber/siskiyou/actions/workflows/pages.yml/badge.svg)](https://github.com/philipbeber/siskiyou/actions/workflows/pages.yml)

An extensible log viewer inspired by [TextAnalysisTool.NET](https://textanalysistool.github.io/). Like that tool Siskiyou is designed to excel at viewing, searching, and navigating large files quickly and efficiently. On top of that it contains extensibility points so you can customize it to parse arbitrary formats and extract useful information. 

Live demo: <https://philipbeber.github.io/siskiyou/demo>.

## Extensibility points

The following are implemented as Angular services which makes it easy for you to write your own implementations and inject them into Siskiyou.

### FileLoaderService

Unpacks the input files into distinct `InputFile` objects. The default implementation will produce one `InputFile` for each text file. It will also recurse through zip files and output one `InputFile` for each leaf file. A custom implementation might, for example, ignore certain files based on their file name.

### InputFile

Provides an interface to read the content of a file, turning it into lines of text. The default implementation opens `File` or `JSZipObject` objects and assumes they are plain text. It normalizes newlines, accepting '\n', \n\r' or \r\n'. If you wanted to add support for different character encodings this would be the place to do it.

### LogParserService

Turns lines of text into log messages. Accepts an `InputFile` object and outputs zero or more `Log` objects (usually one). A `Log` object is mostly just a list of `LogLine` objects. The default implementation simply creates one `LogLine` for each line of text. A custom log parser might handle the case where log messages span multiple lines and logic is needed to combine them together. This would also be the place to extract custom information from the text and attach it to the LogLine object (e.g. timestamp, severity, etc).

### LogMergerService

Merges lines from multiple Log objects into a single list of lines. The default implementation simply appends the log files. A custom implementation might do something like merge logs from different servers and interleave the lines based on their timestamps.

## Development

### Setup

Install [Node.js](https://nodejs.org/en/download/) version 22.22.3 or newer.
Run `npm install`

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running performance tests

These are separate from the unit tests and generate a million-line log in memory, so they are slow and use a lot of RAM.

- `npm run test:perf` — headless Chrome, single run. Asserts that load/parse, hide filters, color filters, first display, and scrolling stay within time budgets, and that the view stays virtualized.
- `npm run test:perf:open` — starts the real demo app and opens it with a generated 1,000,000-line log already loaded (ERROR/WARN coloring applied). Scroll, hide lines, and add filters there to check that it feels smooth.

`test:perf` looks for Google Chrome, Chromium, Microsoft Edge, or Playwright’s Chrome for Testing. Override the binary with `CHROME_BIN` if needed. You can also load the large demo from a normal `npm start` session with the empty-state button or by opening `/?largeFile`.

### Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

