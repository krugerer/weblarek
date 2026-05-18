import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasketData } from '../../types';
import { IEvents } from '../base/Events';

export class Basket extends Component<IBasketData> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:checkout');
        });
    }

    set items(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
    }

    set total(value: number) {
        if (this.totalElement) {
            this.totalElement.textContent = `${value} синапсов`;
        }
    }

    set disabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}