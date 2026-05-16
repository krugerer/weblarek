import { Component } from '../base/Component';
import { IBasketData } from '../../types';
import { IEvents } from '../base/Events';

export class Basket extends Component<IBasketData> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listElement = container.querySelector('.basket__list') as HTMLElement;
        this.totalElement = container.querySelector('.basket__price') as HTMLElement;
        this.buttonElement = container.querySelector('.basket__button') as HTMLButtonElement;

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:submit');
        });
    }

    set items(items: HTMLElement[]) {
        this.listElement.innerHTML = '';
        items.forEach(item => this.listElement.appendChild(item));
    }

    set total(value: number) {
        this.setText(this.totalElement, `${value} синапсов`);
        this.buttonElement.disabled = value === 0;
    }

    set disabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}