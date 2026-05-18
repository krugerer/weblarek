import { Card } from '../common/Card';
import { ensureElement } from '../../utils/utils';
import { ICardData } from '../../types';
import { IEvents } from '../base/Events';

export class CardBasket extends Card<ICardData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents, onDelete?: (event: MouseEvent) => void) {
        super(container, events);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        if (this.deleteButton && onDelete) {
            this.deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                onDelete(event);
            });
        }
    }

    set index(value: number) {
        if (this.indexElement) {
            this.indexElement.textContent = value.toString();
        }
    }
}