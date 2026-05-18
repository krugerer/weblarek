import { Component } from '../base/Component';
import { IGalleryData } from '../../types';
import { IEvents } from '../base/Events';

export class Gallery extends Component<IGalleryData> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.catalogElement = container;
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }
}