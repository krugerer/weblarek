import { Card } from '../common/Card';
import { ensureElement } from '../../utils/utils';
import { ICardData } from '../../types';
import { categoryMap } from '../../utils/constants';
import { IEvents } from '../base/Events';

export class CardPreview extends Card<ICardData> {
    protected descriptionElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents, onAddToBasket?: (event: MouseEvent) => void) {
        super(container, events);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        if (this.buttonElement && onAddToBasket) {
            this.buttonElement.addEventListener('click', (event) => {
                event.stopPropagation();
                onAddToBasket(event);
            });
        }
    }

    updateButton(text: string, onClick: (event: MouseEvent) => void): void {

        const newButton = this.buttonElement.cloneNode(true) as HTMLButtonElement;
        newButton.textContent = text;

        const oldButton = this.buttonElement;
        oldButton.parentNode?.replaceChild(newButton, oldButton);
        
        newButton.addEventListener('click', (event) => {
            event.stopPropagation();
            onClick(event);
        });
        
        this.buttonElement = newButton;
    }

    set description(value: string) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = value;
        }
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

    set price(value: number | null) {
        super.price = value;
        if (this.buttonElement) {
            this.buttonElement.disabled = value === null;
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.titleElement.textContent || '');
    }
}