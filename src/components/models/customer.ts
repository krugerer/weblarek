import { ICustomer } from "../../types";
import { TPayment } from "../../types";

export class CustomerModel {
  protected payment: TPayment = "";
  protected email: string = "";
  protected phone: string = "";
  protected address: string = "";

  constructor() {}

  setData(data: Partial<ICustomer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  getData(): ICustomer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clearData(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  validate(): {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
  } {
    const errors: {
      payment?: string;
      email?: string;
      phone?: string;
      address?: string;
    } = {};

    if (!this.payment) errors.payment = "Не выбран способ оплаты";
    if (!this.email) errors.email = "Не указан электронный адрес";
    if (!this.phone) errors.phone = "Не указан номер телефона";
    if (!this.address) errors.address = "Не указан адрес доставки";

    return errors;
  }
}
