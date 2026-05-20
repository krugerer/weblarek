export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "card" | "cash" | "";
export type TValidation = Partial<Record<keyof ICustomer, string>>; 

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface ICustomer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends ICustomer {
  total: number;
  items: string[];
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface ICardData {
    id: string;
    title: string;
    price: number | null;
    image?: { src: string; alt: string };
    category?: string;
    description?: string;
    index?: number;
    buttonText?: string;
}

export interface IOrderFormData {
    payment: 'card' | 'cash';
    address: string;
}

export interface IContactsFormData {
    email: string;
    phone: string;
}

export interface IBasketData {
    items: HTMLElement[];
    total: number;
    disabled: boolean;
}

export interface IHeaderData {
    counter: number;
}

export interface IGalleryData {
    catalog: HTMLElement[];
}

export interface ISuccessData {
    total: number;
}

export interface IForm {
  valid: boolean;
}