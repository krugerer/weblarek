import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
 
export class Modal extends Component<{}> {
    protected modalContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.modalContainer = container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (event) => {
            if (event.target === container) this.close();
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.modalContainer.innerHTML = '';
        this.events.emit('modal:close');
    }

    setContent(content: HTMLElement): void {
        this.modalContainer.innerHTML = '';
        this.modalContainer.appendChild(content);
    }

    render(): HTMLElement {
        return this.container;
    }
}