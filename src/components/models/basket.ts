import { IProduct } from "../../types";

export class Basket {
  protected items: IProduct[] = [];

  constructor() {}

  getItems(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    this.items.push(product);
  }

  deleteProduct(productId: string): void {
    const index = this.items.findIndex((item) => item.id === productId);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  clearBasket(): void {
    this.items = [];
  }

  getSummProduct(): number {
    let summ: number = 0;
    for (const item of this.items) {
      if (item.price !== null) {
        summ += item.price;
      }
    }
    return summ;
  }

  getCountProduct(): number {
    return this.items.length;
  }

  hasProduct(productId: string): boolean {
    return this.items.some((item) => item.id === productId);
  }
}
