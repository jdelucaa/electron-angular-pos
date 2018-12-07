import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Observable, of } from 'rxjs';
import { Product } from './product.model';
import { FileServiceService } from '../../providers/file-service.service';

import { ElectronService as MyElectronService } from '../../providers/electron.service';

@Injectable({
    providedIn: 'root'
})
export class MainPosService {
    private products: Product[] = [];

    constructor(private electronService: ElectronService,
        private myElectronService: MyElectronService,
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
        }
        return of([]);
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
     * Opens a dialog to select products file and load products from file.
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
        }
    }

    private notifyProductsLoaded(): void {
        if (this.electronService.isElectronApp) {
            const options = {
                body: 'Products were loaded successfully!'
            };
            new Notification('Notification from your fancy POS', options);
        }
    }

    private static parseCsvToProducts(csvContent: string): Product[] {
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

    private static parseCsvToCategories(csvContent: string): string[] {
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
}
