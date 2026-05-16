import { Card } from '../common/Card';
import { ICardActions, ICardData } from '../../types';
import { IEvents } from '../base/Events';

export class CardBasket extends Card<ICardData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents, actions?: ICardActions) {
        super(container, events, actions);
        this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
        this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.events.emit('basket:remove', { id: this.id });
            });
        }
    }

    set index(value: number) {
        this.setText(this.indexElement, value.toString());
    }
}