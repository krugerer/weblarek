import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  protected items: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(products: IProduct[]): void {
    this.items = products;
    this.events.emit('catalog:changed', { items: this.items });
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setProductId(id: string): void {
    const product = this.getProductById(id);
    this.selectedProduct = product || null;
    this.events.emit('catalog:selected', { product: this.selectedProduct });
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
