import { Component } from '../base/Component';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Form<T extends object> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;
    protected inputs: HTMLInputElement[];

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', container);
        this.inputs = ensureAllElements<HTMLInputElement>('input', container);

        container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('form:submit');
        });
    }

    set valid(isValid: boolean) {
        this.submitButton.disabled = !isValid;
    }

    showError(message: string): void {
        if (this.errorElement) {
            this.errorElement.textContent = message;
        }
    }
}