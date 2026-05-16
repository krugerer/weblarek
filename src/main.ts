import "./scss/styles.scss";
import { Catalog } from "./components/models/catalog";
import { Basket } from "./components/models/basket";
import { CustomerModel } from "./components/models/customer";
import { API_URL, CDN_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { AppApi } from "./components/models/appapi";
import { EventEmitter } from "./components/base/Events";
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/common/Modal';
import { Basket as BasketView } from './components/views/Basket';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { IProduct } from "./types";


const events = new EventEmitter();
const api = new Api(API_URL);
const appApi = new AppApi(api);

const catalog = new Catalog(events);
const basket = new Basket(events);
const customer = new CustomerModel(events)


appApi
  .getProducts()
  .then((data) => {
    catalog.setItems(data.items);
  })
  .catch((error) => {
    console.error("Ошибка при загрузке товаров:", error);
  });

const headerElement = document.querySelector('.header') as HTMLElement;
const galleryElement = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

const header = new Header(headerElement, events);
const gallery = new Gallery(galleryElement, events);
const modal = new Modal(modalContainer, events);

function createCardCatalog(product: IProduct): HTMLElement {
    const cardElement = cardCatalogTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const card = new CardCatalog(cardElement, events);
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = CDN_URL + product.image;
    return card.render();
}

events.on('catalog:changed', () => {
    const products = catalog.getItems();
    const cards = products.map(product => createCardCatalog(product));
    gallery.catalog = cards;
});

events.on('card:select', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
        const cardElement = cardPreviewTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const cardPreview = new CardPreview(cardElement, events);
        cardPreview.id = product.id;
        cardPreview.title = product.title;
        cardPreview.price = product.price;
        cardPreview.category = product.category;
        cardPreview.image = CDN_URL + product.image;
        cardPreview.description = product.description || '';
        
        modal.setContent(cardPreview.render());
        modal.open();
    }
});

events.on('card:add-to-basket', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
        basket.addProduct(product);
    }
});

events.on('basket:changed', () => {
    header.counter = basket.getCountProduct();
});

let isBasketOpen: boolean = false;

events.on('basket:open', () => {
    const basketElement = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    const basketView = new BasketView(basketElement, events);
    isBasketOpen = true;
    
    const items = basket.getItems();
    const cards = items.map((product, index) => {
        const cardElement = cardBasketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const cardBasket = new CardBasket(cardElement, events);
        cardBasket.id = product.id;
        cardBasket.title = product.title;
        cardBasket.price = product.price;
        cardBasket.index = index + 1;
        return cardBasket.render();
    });
    
    basketView.items = cards;
    basketView.total = basket.getSummProduct();
    
    modal.setContent(basketView.render());
    modal.open();
});

events.on('order:submit', () => {
    const orderElement = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
    const orderForm = new OrderForm(orderElement, events);

    const customerData = customer.getData();
    if (customerData.address) orderForm.address = customerData.address;
    
    modal.setContent(orderForm.render());
    modal.open();
});

events.on('order:change', (data: { payment: 'card' | 'cash', address: string }) => {
    customer.setData({ payment: data.payment, address: data.address });
});

events.on('form:submit', () => {
    const contactsElement = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
    const contactsForm = new ContactsForm(contactsElement, events);

    const customerData = customer.getData();
    if (customerData.email) contactsForm.email = customerData.email;
    if (customerData.phone) contactsForm.phone = customerData.phone;
    
    modal.setContent(contactsForm.render());
});

events.on('contacts:change', (data: { email: string, phone: string }) => {
    customer.setData({ email: data.email, phone: data.phone });
});

events.on('contacts:submit', async () => {
    const customerData = customer.getData();
    const order = {
        payment: customerData.payment,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        total: basket.getSummProduct(),
        items: basket.getItems().map(item => item.id)
    };
    
    try {
        const result = await appApi.postOrder(order);
        
        const successElement = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        const successView = new Success(successElement, events);
        successView.total = result.total;
        
        modal.setContent(successView.render());
        
        basket.clearBasket();
        customer.clearData();
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
    }
});

events.on('success:close', () => {
    modal.close();
});

events.on('basket:remove', (data: { id: string }) => {
    basket.deleteProduct(data.id);
    
    if (isBasketOpen) {
      events.emit('basket:open');
    }
});