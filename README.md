# Siskiyou

[![Build Status](https://travis-ci.org/philipbeber/siskiyou.svg?branch=master)](https://travis-ci.org/philipbeber/siskiyou)

An extensible log viewer.

Live demo: `https://philipbeber.github.io/siskiyou/`.

## Extensibility points

### FileLoaderService

Accepts a list of File objects and outputs a list of InputFile objects as they are loaded. The default implementation will recurse through zip files and output one InputFile for each leaf file.

### InputFile

Turns a file object into lines of text. The default implementation opens File or JSZipObject objects and assumes they are plain text. It normalizes newlines, accepting '\n', \n\r' or \r\n'.

### LogParserService

Accepts an InputFile object and outputs zero or one Log objects. A Log object is mostly just a list of LogLine objects. The default implementation simply creates one LogLine for each line of text.

### LogMergerService

Merges lines from multiple Log objects into a single list of lines. The default implementation simply appends the log files. A custom implementation might do something like merge logs from different servers and interleave the lines based on their timestamps.

## Development

### Setup

Install [node](https://nodejs.org/en/download/) / [@angular/cli](https://cli.angular.io/).
Run `npm install`

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod --aot false` flags for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

