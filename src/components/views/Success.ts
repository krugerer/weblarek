import { Component } from '../base/Component';
import { ISuccessData, ISuccessActions } from '../../types';
import { IEvents } from '../base/Events';

export class Success extends Component<ISuccessData> {
    protected totalElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected actions?: ISuccessActions;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.totalElement = container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.setText(this.totalElement, `Списано ${value} синапсов`);
    }
}