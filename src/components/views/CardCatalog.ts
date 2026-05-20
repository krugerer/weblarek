import { Card } from '../common/Card';
import { ensureElement } from '../../utils/utils';
import { ICardData } from '../../types';
import { categoryMap } from '../../utils/constants';
import { IEvents } from '../base/Events';

export class CardCatalog extends Card<ICardData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents, onClick?: (event: MouseEvent) => void) {
        super(container, events);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        if (onClick) {
            container.addEventListener('click', onClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }

    set image(value: { src: string; alt: string }) {
        this.setImage(this.imageElement, value.src, value.alt);
    }
}