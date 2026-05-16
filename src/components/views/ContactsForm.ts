import { Form } from "../common/Form";
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
    this.emailInput = container.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;
    this.phoneInput = container.querySelector(
      'input[name="phone"]',
    ) as HTMLInputElement;

    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts:change", this.getFormData());
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:change", this.getFormData());
    });

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this.submitButton.disabled) return;
      this.events.emit("contacts:submit", this.getFormData()); // ← должно быть
    });
  }

  getFormData(): IContactsFormData {
    return {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    };
  }

  set email(value: string) {
    this.emailInput.value = value;
    this.checkValidation();
  }

  set phone(value: string) {
    this.phoneInput.value = value;
    this.checkValidation();
  }

  protected checkValidation(): void {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailInput.value);
    const phoneValid = this.phoneInput.value.trim().length > 0;
    this.setValid(emailValid && phoneValid);
  }
}
