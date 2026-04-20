import "./scss/styles.scss";
import { Catalog } from "./components/models/catalog";
import { Basket } from "./components/models/basket";
import { CustomerModel } from "./components/models/customer";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { AppApi } from "./components/models/appapi";

import { apiProducts } from "./utils/data";

const catalog = new Catalog();
const catalogModel = new Catalog();
const basket = new Basket();
const customer = new CustomerModel();

const api = new Api(API_URL);

const appApi = new AppApi(api);

appApi
  .getProducts()
  .then((data) => {
    console.log("Ответ сервера (товары):", data);
    console.log("Всего товаров на сервере:", data.total);
    console.log("Массив товаров:", data.items);

    catalogModel.setItems(data.items);

    console.log("Каталог после сохранения:", catalogModel.getItems());
    console.log(
      "Количество товаров в каталоге:",
      catalogModel.getItems().length,
    );

    if (data.items.length > 0) {
      const firstId = data.items[0].id;
      console.log(
        `Поиск товара с id "${firstId}":`,
        catalogModel.getProductById(firstId),
      );
    }
  })
  .catch((error) => {
    console.error("Ошибка при загрузке товаров:", error);
  });

catalog.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", catalog.getItems());

console.log(
  'Товар с id "1":',
  catalog.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"),
);
console.log('Товар с id "412" (не существует):', catalog.getProductById("412"));

catalog.setProductId("b06cde61-912f-4663-9751-09956c0eed67");
console.log("Получение выбранного товара по ID:", catalog.getSelectedProduct());

catalog.setProductId("412");
console.log(
  "Выбранный товар с несуществующим ID:",
  catalog.getSelectedProduct(),
);

const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];

basket.addProduct(product1);
basket.addProduct(product2);
basket.addProduct(product1);

console.log("Корзина после добавления товаров:", basket.getItems());
console.log(
  "Количество товаров в корзине (getCountProduct):",
  basket.getCountProduct(),
);
console.log(
  "Общая стоимость товаров (getSummProduct):",
  basket.getSummProduct(),
);

console.log(
  'Есть ли товар с id "b06cde61-912f-4663-9751-09956c0eed67"?',
  basket.hasProduct("b06cde61-912f-4663-9751-09956c0eed67"),
);
console.log('Есть ли товар с id "412"?', basket.hasProduct("412"));

basket.deleteProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
console.log(
  'Корзина после удаления одного товара с id "c101ab44-ed99-4a54-990d-47aa2bb4e7d9":',
  basket.getItems(),
);
console.log("Количество после удаления:", basket.getCountProduct());

basket.clearBasket();
console.log("Корзина после очистки (clearBasket):", basket.getItems());
console.log("Количество после очистки:", basket.getCountProduct());

console.log("Начальные данные покупателя (getData):", customer.getData());

customer.setData({ email: "test@example.com", phone: "+77771114466" });
console.log("После сохранения email и phone:", customer.getData());

customer.setData({ payment: "card", address: "г. Москва, ул. Тестовая, д.1" });
console.log("После сохранения payment и address:", customer.getData());

console.log("Валидация (все поля заполнены):", customer.validate());

customer.clearData();
console.log("После очистки (clearData):", customer.getData());

console.log(
  "Валидация после очистки (должны быть ошибки):",
  customer.validate(),
);
