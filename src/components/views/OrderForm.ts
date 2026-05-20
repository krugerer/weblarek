import { Form } from "../common/Form";
import { ensureElement } from "../../utils/utils";
import { IOrderFormData, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class OrderForm extends Form<IOrderFormData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container, events);

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit("order:submit");
    });

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container,
    );

    this.cardButton.addEventListener("click", () => {
      this.events.emit("order:change", { payment: "card" });
    });
    this.cashButton.addEventListener("click", () => {
      this.events.emit("order:change", { payment: "cash" });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:change", { address: this.addressInput.value });
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment) {
    if (value === "card") {
      this.cardButton.classList.add("button_alt-active");
      this.cashButton.classList.remove("button_alt-active");
    } else if (value === "cash") {
      this.cashButton.classList.add("button_alt-active");
      this.cardButton.classList.remove("button_alt-active");
    } else {
      this.cardButton.classList.remove("button_alt-active");
      this.cashButton.classList.remove("button_alt-active");
    }
  }
}
