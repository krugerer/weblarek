import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Form<T extends object> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;
    protected inputs: NodeListOf<HTMLInputElement>;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorElement = container.querySelector('.form__errors') as HTMLElement;
        this.inputs = container.querySelectorAll('input');

        container.addEventListener('input', () => {
            this.checkValidation();
        });

        container.addEventListener('submit', (event) => {
            event.preventDefault();
            if (this.submitButton.disabled) return;
            this.events.emit('form:submit', this.getData());
        });
    }

    protected checkValidation(): void {
        let isValid = true;
        this.inputs.forEach(input => {
            if (!input.value.trim()) isValid = false;
        });
        this.setValid(isValid);
    }

    setData(data: Partial<T>): void {
        Object.keys(data).forEach(key => {
            const input = this.container.querySelector(`[name="${key}"]`) as HTMLInputElement;
            if (input) input.value = data[key as keyof T] as string;
        });
        this.checkValidation();
    }

    getData(): T {
        const data: Record<string, string> = {};
        this.inputs.forEach(input => {
            data[input.name] = input.value;
        });
        return data as T;
    }

    clearErrors(): void {
        this.setText(this.errorElement, '');
    }

    setValid(isValid: boolean): void {
        this.submitButton.disabled = !isValid;
    }

    showError(message: string): void {
        this.setText(this.errorElement, message);
    }

    render(): HTMLElement {
        return this.container;
    }
}