# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


### Данные

#### Интерфейс Product
Описывает товар из каталога: идентификатор, название, изображение, категорию, цену(не обязательно), подробное описание

interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

#### Интерфейс Customer
Содержит платёжный метод покупателя, адрес, электронную почту, номер телефона

interface ICustomer {
  payment: 'card' | 'cash' | '';
  email: string;
  phone: string;
  address: string;
}

#### Интерфейс CardData
Содержит данные для карточки

interface ICardData {
    id: string;
    title: string;
    price: number | null;
    image?: string;
    category?: string;
    description?: string;
    index?: number;
}

#### Интерфейс CardActions
Содержит действия карточки

interface ICardActions {
    onClick?: (event: MouseEvent) => void;
    onAddToBasket?: (event: MouseEvent) => void;
}

#### Интерфейс OrderFormData
Данные формы заказа

interface IOrderFormData {
    payment: 'card' | 'cash';
    address: string;
}

#### Интерфейс ContactsFormData
Данные формы контактов

interface IContactsFormData {
    email: string;
    phone: string;
}

#### Интерфейс SuccessActions
Действия для успешного окна

interface ISuccessActions {
    onClick: () => void;
}

### Модели данных
Содержатся классы для работы с данными

#### Класс Catalog

Содержит логику хранения и управления товарами в каталоге

Конструктор не принимает на вход параметры.
  
`constructor()`

Поля класса:
`items: IProduct[] = []` - Хранит массив всех товаров, доступных в каталоге. Инициализируется пустым массивом.
`selectedProductId: string | null = null` - Хранит идентификатор выбранной карточки товара. 

Методы класса:  
`setItems(products: IProduct[]): void` - Сохраняет массив товаров, полученные из параметра products, в поле items.

`getItems(): IProduct[]` - Возвращает массив всех товаров из поля items.

`getProductById(id: string): IProduct | undefined` - Возвращает товар по указонному идентификатору или undefined если товар не найден.

`setProductId(id: string): void` - Сохраняет идентификатор товара в поле selectedProductId.

`getSelectedProduct(): IProduct | null` - Возвращает карточку товара, найденного по его идентификатору, соответствующему полю `selectedProductId`, или null, если товар не найден.

#### Класс Basket

Содержит логику хранения и управления товарами в корзине покупателя

Конструктор:
`constructor()` - Создаёт экземпляр корзины. Инициализирует поле `items` пустым массивом

Поля класса:
`items: IProduct[] = []` - Хранит массив позиций в корзине

Методы класса:

`getItems(): IProduct[]` - Возвращает массив всех товаров в корзине

`addProduct(product: IProduct): void` - Добавляет товар, полученный в параметре, в массив корзины товаров.

`deleteProduct(productId: string): void` - Удаляет первый попавшийся товар, полученный через параметр `productId`, содержащий идентификатор товара, из массива `items`. Если товаров несколько, удаляется только один.

`clearBasket(): void` - Полностью очищает массив `items`, удаляя, тем самым, все элементы из корзины.

`getSummProduct(): number` - Получает суммарную стоимость всех товаров в корзине путём сложения всех `price` в массиве `items`. Если у элемента массива `price = null`, его стоимость не учитывается.

`getCountProduct(): number` - Получает общее количество всех товаров в корзине, путём подсчёта количества элементов в массиве `items`.

`hasProduct(productId: string): boolean` - Проверяет наличие товара в массиве `items` по идентификатору, передающегося в параметром `productId`.

#### Класс CustomerModel

Создаёт данные покупателя, которые тот должен указать при оформлении заказа.

Конструктор класса не принимает параметров.

Поля класса:

`payment: 'card' | 'cash' | '' ` - Вид оплаты. Изначально пустая строка.

`email: string` - Электронный адрес пользователя. Изначально пустая строка.

`phone: string` - Номер телефона. Изначально пустая строка.

`address: string` - Адрес пользователя. Изначально пустая строка.

Методы класса: 

`setData(data: Partial<ICustomer>)` - Сохраняет данные покупателя. Принимает объект с любыми полями. Переданные поля обновляются, остальные остаются без изменений.

`getData(): ICustomer` - Возвращает объект со всеми данными пользователя.

`clearData(): void` - Очищает данные в объекте.

`validate(): { payment?: string; email?: string; phone?: string; address?: string }` - Провеярет данные. Если есть ошибки в виде объекта, где ключи - поле, значение - текст ошибки. Если поле заполнено, оно валидно и не попадает в результат. Если все поля валидны, возвращает пустой объект.

### Слой коммуникации

#### Класс AppApi

Данный класс отвечает за взаимодействие с сервером.

Конструктор:
`constructor(api: IApi)` - Принимает объект, который соответствует интерфейсу `IApi`, который представляет методы `get` и `post`.

Поля класса:

`api: IApi` - Хранит экземпляр API для выполнения запросов.

Методы класса:

`getProducts(): Promise<IProductsResponse>` - Выполняет GET-запрос на эндпоинт /product/ и возвращает объект, полученный от сервера, в котором находится массив товаров.

`postOrder(order: IOrder): Promise<IOrderResult>` - Выполняет POST-запрос на эндпоинт /order/ и передаёт в него данные, полученные в параметрах метода, а возвращает объект, подтверждающий покупку на определенную сумму.

### Слой представления

#### Класс Modal

Отвечает за открытие и закрытие модального окна. Не имеет дочерних классов.

Конструктор:  
`constructor(container: HTMLElement)` - принимает DOM-элемент модального окна.

Поля класса:  

`protected modalContainer: HTMLElement` - Контейнер с контентом модального окна
`protected closeButton: HTMLButtonElement` - Кнопка закрытия

Методы класса: 

`open: void` - Открывает модальное окно
`close: void` - Закрывает модальное окно
`setContent (content: HTMLElement): void` - Устанавливает содержимое модального окна
`render(data: T): HTMLElement` - Наследуется от Component

#### Класс Card<T>

Базовый класс для всех карточек товара. Является дженериком, где `T` — тип данных, которые принимает карточка.

Конструктор класса:

`constructor(container: HTMLElement, actions?: ICardActions)` - принимает DOM-элемент карточки и опциональный объект с колбэками для действий (клик по карточке, клик по кнопке).

Поля класса:

`protected title: HTMLElement` - Элемент для названия товара
`protected price: HTMLElement` - Элемент для цены товара
`protected button: HTMLButtonElement` - Кнопка на карточке (может отсутствовать)
`protected _id: string` - ID товара
`protected actions: ICardActions` - Объект с колбэками для обработки событий (клик по карточке или кнопке)

Методы класса:
`set id(value: string): void` - Сеттер для ID товара
`get id(): string` - Геттер для ID товара
`set title(value: string): void` - Устанавливает название товара
`set price(value: number \| null): void` - Устанавливает цену (если `null` — показывает «Бесценно»)
`render(data?: Partial<T>): HTMLElement` - Отрисовывает карточку

#### Класс CardCatalog

Наследуется от `Card<ICardData>`. Отображает карточку товара в каталоге.

Поля класса:
`protected category: HTMLElement` - Элемент для категории товара
`protected image: HTMLImageElement` - Элемент для изображения

Методы:  
`set category(value: string): void` - Устанавливает категорию и применяет соответствующий класс для стилизации
`set image(value: string): void` - Устанавливает изображение

#### Класс CardPreview

Наследуется от `Card<ICardData>`. Отображает подробную информацию о товаре.

Поля класса:

`protected description: HTMLElement` - Элемент для описания товара
`protected category: HTMLElement` - Элемент для категории
`protected image: HTMLImageElement` - Элемент для изображения

Методы класса: 

`set description(value: string): void` - Устанавливает описание товара
`set category(value: string): void` - Устанавливает категорию
`set image(value: string): void` - Устанавливает изображение

#### Класс CardBasket

Наследуется от `Card<ICardData>`. Отображает товар в корзине с индексом и кнопкой удаления.

Поля класса:  
`protected index: HTMLElement` - Элемент для отображения порядкового номера
`protected deleteButton: HTMLButtonElement` - Кнопка удаления товара из корзины

Методы класса:  

`set index(value: number): void` - Устанавливает порядковый номер товара

#### Класс Form<T>

Базовый класс для работы с формами. Является дженериком, где `T` — тип данных формы.

Конструктор класса:  
`constructor(container: HTMLFormElement)` - принимает DOM-элемент формы.

Поля класса: 

`protected submitButton: HTMLButtonElement` - Кнопка отправки формы
`protected errorElement: HTMLElement` - Элемент для отображения ошибок валидации
`protected inputs: NodeListOf<HTMLInputElement>` - Список всех полей ввода

Методы класса:

`setData(data: Partial<T>): void` - Заполняет поля формы переданными данными
`getData(): T` - Возвращает объект с данными из формы
`clearErrors(): void` - Очищает сообщения об ошибках
`setValid(isValid: boolean): void` - Блокирует/разблокирует кнопку отправки
`showError(field: keyof T, message: string): void` -Показывает ошибку для конкретного поля
`render(data?: Partial<T>): HTMLElement` - Отрисовывает форму

#### Класс OrderForm

Наследуется от `Form<IOrderFormData>`. Отвечает за форму выбора способа оплаты и ввода адреса.

Поля класса:  

`protected cardButton: HTMLButtonElement` - Кнопка выбора оплаты картой
`protected cashButton: HTMLButtonElement` - Кнопка выбора оплаты наличными
`protected addressInput: HTMLInputElement` - Поле ввода адреса

Методы класса: 

`set payment(value: 'card' | 'cash'): void` - Устанавливает выбранный способ оплаты (визуально выделяет кнопку)
`get payment(): 'card' | 'cash' | null` - Возвращает выбранный способ оплаты
`set address(value: string): void` - Устанавливает адрес

#### Класс ContactsForm

Наследуется от `Form<IContactsFormData>`. Отвечает за форму ввода email и телефона.

Поля класса:

`protected emailInput: HTMLInputElement` - Поле ввода email
`protected phoneInput: HTMLInputElement` - Поле ввода телефона

Методы класса:  

`set email(value: string): void` - Устанавливает email
`set phone(value: string): void` - Устанавливает телефон

#### Класс Basket

Отвечает за отображение корзины с товарами.

Конструктор класса:  
`constructor(container: HTMLElement)` - принимает DOM-элемент корзины.

Поля класса:

`protected list: HTMLElement` - Элемент-список (ul) для карточек товаров
`protected total: HTMLElement` - Элемент для отображения общей суммы
`protected button: HTMLButtonElement` - Кнопка оформления заказа

Методы класса:

`set items(items: HTMLElement[]): void` - Устанавливает список карточек товаров
`set total(value: number): void` - Устанавливает общую сумму
`set disabled(value: boolean): void` - Блокирует/разблокирует кнопку оформления

#### Класс Header

Отвечает за отображение шапки сайта и счётчика корзины.

Конструктор класса:

`constructor(container: HTMLElement)` - принимает DOM-элемент шапки.

Поля класса: 

`protected basketButton: HTMLButtonElement` - Кнопка корзины
`protected counterElement: HTMLElement` - Элемент для отображения счётчика

Методы класса:

`set counter(value: number): void` - Устанавливает значение счётчика корзины

#### Класс Gallery

Отвечает за отображение галереи карточек товаров.

Конструктор класса:  
`constructor(container: HTMLElement)` - принимает DOM-элемент галереи.

Поля класса:  

`protected catalogElement: HTMLElement` - Элемент-контейнер для карточек

Методы класса:  

`set catalog(items: HTMLElement[]): void` - Устанавливает массив карточек в галерею

#### Класс Success

Отвечает за отображение модального окна об успешном оформлении заказа.

Конструктор класса: 

`constructor(container: HTMLElement, actions?: ISuccessActions)` - принимает DOM-элемент и опциональный объект с колбэком на закрытие.

Поля класса:

`protected total: HTMLElement` - Элемент для отображения списанной суммы
`protected closeButton: HTMLButtonElement` - Кнопка закрытия

Методы класса:

`set total(value: number): void` - Устанавливает списанную сумму