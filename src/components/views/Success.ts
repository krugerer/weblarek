import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { ISuccessData, ISuccessActions } from '../../types';
import { IEvents } from '../base/Events';

export class Success extends Component<ISuccessData> {
    protected totalElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected actions?: ISuccessActions;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.totalElement = ensureElement<HTMLElement>('.order-success__description', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        if (this.totalElement) {
            this.totalElement.textContent = `Списано ${value} синапсов`;
        }
    }
}