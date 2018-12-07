import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'toFixed'
})
export class ToFixedPipe implements PipeTransform {

    constructor() {
    }

    /**
     * Cuts t
     * @param value Number to be formatted
     */
    transform(value: number): string {
        const args = {minimumFractionDigits: 2, maximumFractionDigits: 2};
        const valueStr: string = '' + value;
        let dotIndex: number = valueStr.indexOf('.');
        let formattedValue = '';
        if (dotIndex >= 0) {
            dotIndex += 1;
            formattedValue = valueStr.substr(0, dotIndex + args.maximumFractionDigits);
            return parseFloat(formattedValue).toLocaleString('en-US', args);
        }

        return parseFloat(valueStr).toLocaleString('en-US', args);
    }
}
