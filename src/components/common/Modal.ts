import { Component } from "../base/Component";
import { ensureElement } from '../../utils/utils';
import { IEvents } from "../base/Events";
 
export class Modal extends Component<{}> {
    protected modalContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.modalContainer = ensureElement<HTMLElement>('.modal__content', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

        this.closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (event) => {
            if (event.target === container) this.close();
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.modalContainer.innerHTML = '';
    }

    setContent(content: HTMLElement): void {
        this.modalContainer.innerHTML = '';
        this.modalContainer.appendChild(content);
    }
}