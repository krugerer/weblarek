import { Component } from '../base/Component';
import { ICardActions } from '../../types';
import { IEvents } from '../base/Events';

export class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected _id: string = '';
    protected actions?: ICardActions;

    constructor(container: HTMLElement, protected events: IEvents, actions?: ICardActions) {
        super(container);
        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;
        this.actions = actions;

        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', (event) => {
                event.stopPropagation();
                this.events.emit('card:add-to-basket', { id: this._id });
            });
        }

        container.addEventListener('click', () => {
            this.events.emit('card:select', { id: this._id });
        });
    }

    set id(value: string) {
        this._id = value;
    }

    get id(): string {
        return this._id;
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this.priceElement, 'Бесценно');
            if (this.buttonElement) this.buttonElement.disabled = true;
        } else {
            this.setText(this.priceElement, `${value} синапсов`);
        }
    }
}