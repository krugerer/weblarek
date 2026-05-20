import { Card } from "../common/Card";
import { ensureElement } from "../../utils/utils";
import { ICardData } from "../../types";
import { categoryMap } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class CardPreview extends Card<ICardData> {
  protected descriptionElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    onAddToBasket?: (event: MouseEvent) => void,
  ) {
    super(container, events);
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.buttonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      if (onAddToBasket) {
        onAddToBasket(event);
      }
    });
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;

      Object.values(categoryMap).forEach((className) => {
        this.categoryElement.classList.remove(className);
      });

      const modifier = categoryMap[value as keyof typeof categoryMap];
      if (modifier) {
        this.categoryElement.classList.add(modifier);
      }
    }
  }

  set price(value: number | null) {
    super.price = value;
    this.buttonElement.disabled = value === null;
  }

  set image(value: { src: string; alt: string }) {
    this.setImage(this.imageElement, value.src, value.alt);
  }
}
