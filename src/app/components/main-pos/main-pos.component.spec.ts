import {MainPosComponent} from './main-pos.component';
import { of } from 'rxjs';
import { Product } from './product.model';

describe('MainPosComponent', () => {
    let component: MainPosComponent;
    let fakeMainPosService: any;

    const categories = ['category 1', 'category 2', 'category 3'];
    const products: Product[] = [
        {category: 'category 1', name: 'prod 1', price: 2.98},
        {category: 'category 1', name: 'prod 2', price: 3.98}
    ]

   beforeEach(() => {
       fakeMainPosService = jasmine.createSpyObj(fakeMainPosService, ['getCategories', 'loadProducts', 'getProductsByCategory']);
       fakeMainPosService.getCategories.and.returnValue(of(categories));
       fakeMainPosService.getProductsByCategory.and.returnValue(products);

       component = new MainPosComponent(fakeMainPosService);
   });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should set categories when initialized', () => {
        component.ngOnInit();
        expect(component.categories).toEqual(categories);
        expect(fakeMainPosService.getCategories).toHaveBeenCalled();
        expect(fakeMainPosService.loadProducts).toHaveBeenCalled();
    });

    it('should call loadProducts when initialized', () => {
        component.ngOnInit();
        expect(fakeMainPosService.loadProducts).toHaveBeenCalled();
    });

    it('should get products by category', () => {
        component.getProductsByCategory('category 1');

        expect(component.products).toEqual(products);
        expect(fakeMainPosService.getProductsByCategory).toHaveBeenCalled();
    });

    it('should add a product to invoice', () => {
        const product: Product = {category: 'category 1', name: 'prod 2', price: 5.50};

        component.addProduct(product);

        expect(component.invoiceProducts).toEqual([product]);
        expect(component.invoiceSubTotal).toEqual(5.50);
        expect(component.tps).toEqual(0.275);
        expect(component.tvq).toEqual(0.55);
        expect(component.invoiceTotal).toEqual(6.325);
    });
});