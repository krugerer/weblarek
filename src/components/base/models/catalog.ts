import { IProduct } from "../../../types"

export class Catalog {
    items: IProduct[] = [];
    selectedProductId: string | null = null;

    constructor(catalogArray: IProduct[] = []) {
        this.items = catalogArray;
    }

    setItems(products: IProduct[]): void {
        this.items = products;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id); 
    }

    setProductId(id: string): void {
        this.selectedProductId = id;
    }

    getSelectedProduct(): IProduct | null {
        if (this.selectedProductId === null) return null;
        return this.getProductById(this.selectedProductId) || null;
    }
}