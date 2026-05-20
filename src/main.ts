import "./scss/styles.scss";
import { Catalog } from "./components/models/catalog";
import { Basket } from "./components/models/basket";
import { CustomerModel } from "./components/models/customer";
import { API_URL, CDN_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { AppApi } from "./components/models/appapi";
import { EventEmitter } from "./components/base/Events";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { Modal } from "./components/common/Modal";
import { Basket as BasketView } from "./components/views/Basket";
import { CardCatalog } from "./components/views/CardCatalog";
import { CardPreview } from "./components/views/CardPreview";
import { CardBasket } from "./components/views/CardBasket";
import { OrderForm } from "./components/views/OrderForm";
import { ContactsForm } from "./components/views/ContactsForm";
import { Success } from "./components/views/Success";
import { IProduct } from "./types";

const events = new EventEmitter();
const api = new Api(API_URL);
const appApi = new AppApi(api);

const catalog = new Catalog(events);
const basket = new Basket(events);
const customer = new CustomerModel(events);

appApi
  .getProducts()
  .then((data) => {
    catalog.setItems(data.items);
  })
  .catch((error) => {
    console.error("Ошибка при загрузке товаров:", error);
  });

const headerElement = ensureElement<HTMLElement>(".header");
const galleryElement = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>("#modal-container");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

const header = new Header(headerElement, events);
const gallery = new Gallery(galleryElement, events);
const modal = new Modal(modalContainer, events);

const cardPreviewElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
const cardPreview = new CardPreview(cardPreviewElement, events, () => {
  const product = catalog.getSelectedProduct();
  if (product) {
    if (basket.hasProduct(product.id)) {
      basket.deleteProduct(product.id);
    } else {
      basket.addProduct(product);
    }
    modal.close();
  }
});

const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
const basketView = new BasketView(basketElement, events);

const orderElement = cloneTemplate<HTMLFormElement>(orderTemplate);
const orderForm = new OrderForm(orderElement, events);

const contactsElement = cloneTemplate<HTMLFormElement>(contactsTemplate);
const contactsForm = new ContactsForm(contactsElement, events);

const successElement = cloneTemplate<HTMLElement>(successTemplate);
const successView = new Success(successElement, events);

function createCardCatalog(product: IProduct): HTMLElement {
  const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
  const card = new CardCatalog(cardElement, events, () => {
    events.emit("card:select", { id: product.id });
  });
  card.title = product.title;
  card.price = product.price;
  card.category = product.category;
  card.image = { src: CDN_URL + product.image, alt: product.title };
  return card.render();
}

events.on("catalog:changed", () => {
  const products = catalog.getItems();
  const cards = products.map((product) => createCardCatalog(product));
  gallery.catalog = cards;
});

events.on("card:select", (data: { id: string }) => {
  catalog.setProductId(data.id);
});

events.on("catalog:selected", () => {
  const product = catalog.getSelectedProduct();
  if (product) {
    const isInBasket = basket.hasProduct(product.id);
    cardPreview.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: {
        src: CDN_URL + product.image,
        alt: product.title
      },
      description: product.description || "",
      buttonText: isInBasket ? "Удалить из корзины" : "В корзину",
    });

    modal.setContent(cardPreview.render());
    modal.open();
  }
});

function updateBasketView(): void {
  const items = basket.getItems();
  const cards = items.map((product, index) => {
    const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
    const cardBasket = new CardBasket(cardElement, events, (event) => {
      event.stopPropagation();
      events.emit("basket:remove", { id: product.id });
    });
    cardBasket.title = product.title;
    cardBasket.price = product.price;
    cardBasket.index = index + 1;
    return cardBasket.render();
  });

  basketView.items = cards;
  basketView.total = basket.getSummProduct();
  basketView.disabled = basket.getCountProduct() === 0;
}

events.on("basket:changed", () => {
  header.counter = basket.getCountProduct();
  updateBasketView();
});

events.on("basket:open", () => {
  modal.setContent(basketView.render());
  modal.open();
});

events.on("basket:checkout", () => {
  const errors = customer.validate();
  orderForm.valid = !errors.payment && !errors.address;
  orderForm.showError(errors.payment || errors.address || "");
  modal.setContent(orderForm.render());
  modal.open();
});

events.on(
  "order:change",
  (data: { payment?: "card" | "cash"; address?: string }) => {
    customer.setData(data);
  },
);

events.on("customer:changed", () => {
  const customerData = customer.getData();
  const errors = customer.validate();

  orderForm.address = customerData.address || "";
  orderForm.payment = customerData.payment;
  orderForm.valid = !errors.payment && !errors.address;
  orderForm.showError(errors.payment || errors.address || "");

  contactsForm.email = customerData.email || "";
  contactsForm.phone = customerData.phone || "";
  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.showError(errors.email || errors.phone || "");
});

events.on("order:submit", () => {
  modal.setContent(contactsForm.render());
});

events.on("contacts:change", (data: { email?: string; phone?: string }) => {
  customer.setData({
    email: data.email !== undefined ? data.email : customer.getData().email,
    phone: data.phone !== undefined ? data.phone : customer.getData().phone,
  });
});

events.on("contacts:submit-form", async () => {
  const customerData = customer.getData();
  const order = {
    payment: customerData.payment,
    email: customerData.email,
    phone: customerData.phone,
    address: customerData.address,
    total: basket.getSummProduct(),
    items: basket.getItems().map((item) => item.id),
  };

  try {
    const result = await appApi.postOrder(order);

    successView.total = result.total;

    modal.setContent(successView.render());

    basket.clearBasket();
    customer.clearData();
  } catch (error) {
    console.error("Ошибка оформления заказа:", error);
  }
});

events.on("success:close", () => {
  modal.close();
});

events.on("basket:remove", (data: { id: string }) => {
  basket.deleteProduct(data.id);
});
