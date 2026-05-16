import { Card } from '../common/Card';
import { ICardActions, ICardData } from '../../types';
import { categoryMap } from '../../utils/constants';
import { IEvents } from '../base/Events';

export class CardPreview extends Card<ICardData> {
    protected descriptionElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, protected events: IEvents, actions?: ICardActions) {
        super(container, events, actions);
        this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
        this.categoryElement = container.querySelector('.card__category') as HTMLElement;
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    }

    set description(value: string) {
        this.setText(this.descriptionElement, value);
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