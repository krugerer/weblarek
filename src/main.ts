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
    events.emit("card:add-to-basket", { id: product.id });
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
  card.image = CDN_URL + product.image;
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
    cardPreview.title = product.title;
    cardPreview.price = product.price;
    cardPreview.category = product.category;
    cardPreview.image = CDN_URL + product.image;
    cardPreview.description = product.description || "";

    const isInBasket = basket.hasProduct(product.id);

    if (isInBasket) {
      cardPreview.updateButton("Удалить из корзины", () => {
        basket.deleteProduct(product.id);
        modal.close();
      });
    } else {
      cardPreview.updateButton("В корзину", () => {
        basket.addProduct(product);
        modal.close();
      });
    }

    modal.setContent(cardPreview.render());
    modal.open();
  }
});

events.on("card:add-to-basket", (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  if (product) {
    basket.addProduct(product);
    modal.close();
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
  updateBasketView();
  modal.setContent(basketView.render());
  modal.open();
});

events.on("basket:checkout", () => {
  const customerData = customer.getData();
  if (customerData.address) orderForm.address = customerData.address;
  if (customerData.payment) orderForm.payment = customerData.payment;

  const isValid = !!(customerData.payment && customerData.address);
  orderForm.valid = isValid;
  orderForm.showError(
    isValid
      ? ""
      : !customerData.payment
        ? "Выберите способ оплаты"
        : "Введите адрес доставки",
  );

  modal.setContent(orderForm.render());
  modal.open();
});

events.on(
  "order:change",
  (data: { payment?: "card" | "cash"; address?: string }) => {
    customer.setData(data);

    const customerData = customer.getData();
    const isValid = !!(customerData.payment && customerData.address);

    orderForm.valid = isValid;

    if (!isValid) {
      if (!customerData.payment) {
        orderForm.showError("Выберите способ оплаты");
      } else if (!customerData.address) {
        orderForm.showError("Введите адрес доставки");
      }
    } else {
      orderForm.showError("");
    }
  },
);

events.on("order:submit", () => {
  const customerData = customer.getData();
  if (customerData.email) contactsForm.email = customerData.email;
  if (customerData.phone) contactsForm.phone = customerData.phone;

  const isValid = !!(customerData.email && customerData.phone);
  contactsForm.valid = isValid;

  modal.setContent(contactsForm.render());
});

events.on("contacts:change", (data: { email: string; phone: string }) => {
  customer.setData({ email: data.email, phone: data.phone });

  const customerData = customer.getData();
  const isValid = !!(customerData.email && customerData.phone);

  contactsForm.valid = isValid;
  contactsForm.showError(
    isValid ? "" : !customerData.email ? "Введите email" : "Введите телефон",
  );
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
