import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Product } from './product.model';
import { FileServiceService } from '../../providers/file-service.service';
import { ElectronService as MyElectronService } from '../../providers/electron.service';

@Injectable({
    providedIn: 'root'
})
export class MainPosService {
    private products: Product[] = [];

    constructor(private myElectronService: MyElectronService,
        private http: HttpClient,
        private fileService: FileServiceService) {
    }

    /**
     * Load categories
     */
    public getCategories(): Observable<string[]> {
        if (this.myElectronService.isElectron()) {
            const appPath: string = this.myElectronService.getAppPath();
            if (!!appPath) {
                const dataFilePath: string = appPath + '\\src\\assets\\categories.csv';
                const csvContent: string = this.fileService.readFile(dataFilePath);
                return of(MainPosService.parseCsvToCategories(csvContent));
            }
        } else {
            return this.getCategoriesCsv().pipe(
                mergeMap((file) => {
                    const reader: FileReader = new FileReader();
                    reader.readAsText(file);

                    return Observable.create(observer => {
                        reader.onload = ev => {
                            observer.next(MainPosService.parseCsvToCategories(reader.result));
                        }
                        reader.onerror = error => observer.error(error);
                    });
                })
            )
        }
    }

    /**
     * Filter products by category
     * @param category category to be used as a filter
     */
    public getProductsByCategory(category: string): Product[] {
        if (category) {
            const categ: string = category.trim().toLocaleLowerCase();
            return this.products.filter(prod => {
                return prod.category.trim().toLocaleLowerCase() === categ;
            });
        }
        return [];
    }

    /**
     * Loads products from data file.
     */
    public loadProducts(): void {
        if (this.myElectronService.isElectron()) {
            const appPath: string = this.myElectronService.getAppPath();
            if (!!appPath) {
                const dataFilePath: string = appPath + '\\src\\assets\\products.csv';
                const csvContent: string = this.fileService.readFile(dataFilePath);
                this.products = MainPosService.parseCsvToProducts(csvContent);
                this.notifyProductsLoaded();
            }
        } else {
            this.getProductsCsv().subscribe((file) => {
                const reader: FileReader = new FileReader();

                reader.onload = () => {
                    this.products = MainPosService.parseCsvToProducts(reader.result);
                };
                reader.readAsText(file);
            });
        }
    }

    /**
     * Opens an external url
     * @param url Url to be opened
     */
    public openExternalUrl(url: string) {
        if (this.myElectronService.isElectron()) {
            this.myElectronService.remote.shell.openExternal(url);
        }
    }

    private notifyProductsLoaded(): void {
        if (this.myElectronService.isElectron()) {
            const options = {
                body: 'Products were loaded successfully!'
            };
            new Notification('Notification from your fancy POS', options);
        }
    }

    private static parseCsvToProducts(csvContent): Product[] {
        const products: Product[] = [];

        if (csvContent) {
            const uglyLines = csvContent.split(/[\n\r]+/g);

            // removes all empty strings from array
            const csvLines = uglyLines.filter(entry => /\S/.test(entry));
            // removes csv header
            csvLines.splice(0, 1);

            const linesLength = csvLines.length;

            for (let i = 0; i < linesLength; i++) {
                const currentLine = csvLines[i].split(',');

                const product: Product = new Product();
                product.category = currentLine[0].replace(/"/g, '');
                product.name = currentLine[1].replace(/"/g, '');
                product.price = Number(currentLine[4].replace(/"/g, ''));

                products.push(product);
            }
        }
        return products;
    }

    private static parseCsvToCategories(csvContent): string[] {
        const categories: string[] = [];

        if (csvContent) {
            const uglyLines = csvContent.split(/[\n\r]+/g);

            // removes all empty strings from array
            const csvLines = uglyLines.filter(entry => /\S/.test(entry));

            const linesLength = csvLines.length;

            for (let i = 0; i < linesLength; i++) {
                const currentLine = csvLines[i];
                categories.push(currentLine.replace(/"/g, ''));
            }
        }
        return categories;
    }

    private getProductsCsv(): Observable<any> {
        return this.http.get('./assets/products.csv', { responseType: 'blob' }).pipe(
            map(response => (<any>response)));
    }

    private getCategoriesCsv(): Observable<any> {
        return this.http.get('./assets/categories.csv', { responseType: 'blob' }).pipe(
            map(response => (<any>response)));
    }
}
