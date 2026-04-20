import { IProduct } from "../../types";

export class Catalog {
  protected items: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  constructor() {}

  setItems(products: IProduct[]): void {
    this.items = products;
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
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
