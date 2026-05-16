import { Card } from '../common/Card';
import { ICardData } from '../../types';
import { categoryMap } from '../../utils/constants';
import { IEvents } from '../base/Events';

export class CardCatalog extends Card<ICardData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.categoryElement = container.querySelector('.card__category') as HTMLElement;
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    }

    set category(value: string) {
        this.setText(this.categoryElement, value);
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.titleElement.textContent || '');
    }
}