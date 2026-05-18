import { Card } from '../common/Card';
import { ensureElement } from '../../utils/utils';
import { ICardData } from '../../types';
import { categoryMap } from '../../utils/constants';
import { IEvents } from '../base/Events';

export class CardCatalog extends Card<ICardData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents, onClick?: (event: MouseEvent) => void) {
        super(container, events, onClick);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
        }
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.titleElement.textContent || '');
    }
}