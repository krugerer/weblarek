import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:changed');
  }

  deleteProduct(productId: string): void {
    const index = this.items.findIndex((item) => item.id === productId);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.events.emit('basket:changed');
    }
  }

  clearBasket(): void {
    this.items = [];
    this.events.emit('basket:changed');
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
