import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IHeaderData } from '../../types';
import { IEvents } from '../base/Events';

export class Header extends Component<IHeaderData> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        if (this.counterElement) {
            this.counterElement.textContent = value.toString();
        }
    }
}