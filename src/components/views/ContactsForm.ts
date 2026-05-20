import { Form } from "../common/Form";
import { ensureElement } from '../../utils/utils';
import { IContactsFormData } from "../../types";
import { IEvents } from "../base/Events";

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container, events);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
    );

    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts:change", { email: this.emailInput.value });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:change", { phone: this.phoneInput.value });
    });

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit("contacts:submit-form");
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}