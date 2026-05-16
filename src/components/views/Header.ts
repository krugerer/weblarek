import { Component } from '../base/Component';
import { IHeaderData } from '../../types';
import { IEvents } from '../base/Events';

export class Header extends Component<IHeaderData> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
        this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this.counterElement, value.toString());
    }
}