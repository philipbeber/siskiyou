import { Log } from './log';

import * as JSZip from 'jszip';

export class FileLoader {

    public addFiles(files: File[]): Promise<Log[]> {
        return new Promise<Log[]>((resolve, reject) => {
            let fileCount = files.length;
            for(let file of files) {
                JSZip.loadAsync(file)
                .then(zip => {
                zip.forEach((relativePath, zipEntry) => {
                    console.log(zipEntry.name);
                    this.fileNames.push(zipEntry.name);
                    });
            });
        }
    })
}