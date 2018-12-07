import {Injectable} from '@angular/core';
import {ElectronService as MyElectronService} from './electron.service';

@Injectable({
    providedIn: 'root'
})
export class FileServiceService {

    constructor(private myElectronService: MyElectronService) {
    }

    // read file synchronous
    readFile(path: string) {
        // return synchronous filestream
        return this.myElectronService.fs.readFileSync(path, 'utf-8');
    }
}
