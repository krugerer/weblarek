import { Form } from '../common/Form';
import { IOrderFormData } from '../../types';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<IOrderFormData> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;
    protected _payment: 'card' | 'cash' | null = null;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this.cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
        this.cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;
        this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

        this.cardButton.addEventListener('click', () => this.setPayment('card'));
        this.cashButton.addEventListener('click', () => this.setPayment('cash'));

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:change', this.getFormData());
        });
    }

    set payment(value: 'card' | 'cash') {
        this._payment = value;
        this.checkValidation();
    }

    get payment(): 'card' | 'cash' | null {
        return this._payment;
    }

    set address(value: string) {
        this.addressInput.value = value;
        this.checkValidation();
    }

    getFormData(): IOrderFormData {
        return {
            payment: this._payment as 'card' | 'cash',
            address: this.addressInput.value
        };
    }

    protected checkValidation(): void {
        let isValid = !!this._payment && !!this.addressInput.value.trim();
        this.setValid(isValid);
    }

    private setPayment(value: 'card' | 'cash'): void {
        this._payment = value;
        this.events.emit('order:change', { payment: value, address: this.addressInput.value });
        
        if (value === 'card') {
            this.cardButton.classList.add('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
        } else {
            this.cashButton.classList.add('button_alt-active');
            this.cardButton.classList.remove('button_alt-active');
        }
        
        this.checkValidation();
    }
}