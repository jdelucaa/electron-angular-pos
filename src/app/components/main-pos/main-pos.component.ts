import { Component, OnInit } from '@angular/core';

import { MainPosService } from './main-pos.service';
import { Product } from './product.model';

@Component({
    selector: 'app-main-pos',
    templateUrl: './main-pos.component.html',
    styleUrls: ['./main-pos.component.scss']
})
export class MainPosComponent implements OnInit {
    public static TPS_TAX_PERCENT = 5;
    public static TVQ_TAX_PERCENT = 10;
    public categories: string[] = [];
    public products: Product[] = [];
    public invoiceProducts: Product[] = [];
    public categoriesTitle = 'Categories';
    public productsTitle = 'Products';
    public invoiceTitle = 'Invoice';
    public invoiceSubTotal = 0.00;
    public tps = 0.00;
    public tvq = 0.00;
    public invoiceTotal = 0.00;

    constructor(private mainService: MainPosService) {
    }

    ngOnInit() {
        this.mainService.loadProducts();
        this.mainService.getCategories().subscribe(categories => this.categories = categories);
    }

    /**
     * Filter products by category
     * @param category category to be used as a filter
     */
    public getProductsByCategory(category: string): void {
        this.products = this.mainService.getProductsByCategory(category);
    }

    /**
     * Adds a product to the invoice
     * @param product - selected product
     */
    public addProduct(product: Product): void {
        this.invoiceProducts.push(product);
        this.invoiceSubTotal += product.price;

        this.tps = this.invoiceSubTotal * MainPosComponent.TPS_TAX_PERCENT / 100;
        this.tvq = this.invoiceSubTotal * MainPosComponent.TVQ_TAX_PERCENT / 100;
        this.invoiceTotal = this.invoiceSubTotal + this.tps + this.tvq;
    }

    /**
     * Clears invoice
     */
    public clearInvoiceProducts(): void {
        this.invoiceProducts = [];
        this.invoiceSubTotal = 0.00;
        this.invoiceTotal = 0.00;
        this.tps = 0.00;
        this.tvq = 0.00;
    }

    public goToParadocs(): void {
        this.mainService.openExternalUrl('http://paradocs.ca');
    }
}
