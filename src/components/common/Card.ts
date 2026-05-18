import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents, onClick?: (event: MouseEvent) => void) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);

        if (onClick) {
            container.addEventListener('click', onClick);
        }
    }

    set title(value: string) {
        if (this.titleElement) {
            this.titleElement.textContent = value;
        }
    }

    set price(value: number | null) {
        if (value === null) {
            if (this.priceElement) {
                this.priceElement.textContent = 'Бесценно';
            }
        } else {
            if (this.priceElement) {
                this.priceElement.textContent = `${value} синапсов`;
            }
        }
    }
}