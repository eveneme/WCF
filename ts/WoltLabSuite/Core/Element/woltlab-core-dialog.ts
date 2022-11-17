/**
 * The web component `<woltlab-core-dialog>` represents a
 * modal dialog with a unified event access for consistent
 * interactions. This is the low-level API of dialogs, you
 * should use the `dialogFactory()` to create them.
 *
 * @author Alexander Ebert
 * @copyright 2001-2022 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since 6.0
 */

import DomUtil from "../Dom/Util";
import { adoptPageOverlayContainer, releasePageOverlayContainer } from "../Helper/PageOverlay";
import * as Language from "../Language";
import { scrollDisable, scrollEnable } from "../Ui/Screen";

interface WoltlabCoreDialogEventMap {
  afterClose: CustomEvent;
  backdrop: CustomEvent;
  cancel: CustomEvent;
  close: CustomEvent;
  extra: CustomEvent;
  primary: CustomEvent;
  validate: CustomEvent;
}

const dialogContainer = document.createElement("div");

export type WoltlabCoreDialogControlOptions = {
  cancel: string | undefined;
  extra: string | undefined;
  isAlert: boolean;
  primary: string;
};

export class WoltlabCoreDialogElement extends HTMLElement {
  readonly #content: HTMLElement;
  readonly #dialog: HTMLDialogElement;
  #form?: HTMLFormElement;
  readonly #title: HTMLElement;

  constructor() {
    super();

    this.#content = document.createElement("div");
    this.#dialog = document.createElement("dialog");
    this.#title = document.createElement("div");
  }

  show(title: string): void {
    if (title.trim().length === 0) {
      throw new Error("Cannot open the modal dialog without a title.");
    }

    this.#title.textContent = title;

    if (this.#dialog.parentElement === null) {
      if (dialogContainer.parentElement === null) {
        document.getElementById("content")!.append(dialogContainer);
      }

      dialogContainer.append(this);
    }

    this.#dialog.showModal();

    adoptPageOverlayContainer(this.#dialog);
    scrollDisable();
  }

  close(): void {
    this.#dialog.close();

    const event = new CustomEvent("afterClose");
    this.dispatchEvent(event);

    releasePageOverlayContainer(this.#dialog);
    scrollEnable();
  }

  get dialog(): HTMLDialogElement {
    return this.#dialog;
  }

  get content(): HTMLElement {
    return this.#content;
  }

  get open(): boolean {
    return this.#dialog.open;
  }

  get incomplete(): boolean {
    return this.hasAttribute("incomplete");
  }

  set incomplete(incomplete: boolean) {
    if (incomplete) {
      this.setAttribute("incomplete", "");
    } else {
      this.removeAttribute("incomplete");
    }
  }

  attachControls(options: WoltlabCoreDialogControlOptions): void {
    if (this.#form !== undefined) {
      throw new Error("There is already a form control attached to this dialog.");
    }

    if (options.extra !== undefined && options.cancel === undefined) {
      options.cancel = "";
    }

    const formControl = document.createElement("woltlab-core-dialog-control");
    formControl.primary = options.primary;

    if (options.cancel !== undefined) {
      formControl.cancel = options.cancel;
    }

    if (options.extra !== undefined) {
      formControl.extra = options.extra;
    }

    this.#form = document.createElement("form");
    this.#form.method = "dialog";
    this.#form.classList.add("dialog__form");
    this.#content.insertAdjacentElement("beforebegin", this.#form);

    this.#form.append(this.#content, formControl);

    if (options.isAlert) {
      if (options.cancel === undefined) {
        this.#dialog.setAttribute("role", "alert");
      } else {
        this.#dialog.setAttribute("role", "alertdialog");
      }
    }

    this.#form.addEventListener("submit", (event) => {
      if (this.incomplete) {
        event.preventDefault();
        return;
      }

      const evt = new CustomEvent("validate", { cancelable: true });
      this.dispatchEvent(evt);

      if (evt.defaultPrevented) {
        event.preventDefault();
      }
    });

    this.#dialog.addEventListener("close", () => {
      if (this.#dialog.returnValue === "") {
        // Dialog was programmatically closed.
        return;
      }

      const evt = new CustomEvent("primary");
      this.dispatchEvent(evt);
    });

    formControl.addEventListener("cancel", () => {
      const event = new CustomEvent("cancel", { cancelable: true });
      this.dispatchEvent(event);

      if (!event.defaultPrevented) {
        this.close();
      }
    });

    if (options.extra !== undefined) {
      formControl.addEventListener("extra", () => {
        const event = new CustomEvent("extra");
        this.dispatchEvent(event);
      });
    }
  }

  connectedCallback(): void {
    if (this.#dialog.parentElement !== null) {
      return;
    }

    let closeButton: HTMLButtonElement | undefined;
    const dialogRole = this.#dialog.getAttribute("role");
    if (dialogRole !== "alert" && dialogRole !== "alertdialog") {
      closeButton = document.createElement("button");
      closeButton.innerHTML = '<fa-icon size="24" name="xmark"></fa-icon>';
      closeButton.classList.add("dialog__closeButton", "jsTooltip");
      closeButton.title = Language.get("wcf.dialog.button.close");
      closeButton.addEventListener("click", () => {
        this.close();
      });
    }

    const header = document.createElement("div");
    header.classList.add("dialog__header");
    this.#title.classList.add("dialog__title");
    header.append(this.#title);
    if (closeButton) {
      header.append(closeButton);
    }

    const doc = document.createElement("div");
    doc.classList.add("dialog__document");
    doc.setAttribute("role", "document");
    doc.append(header);

    this.#content.classList.add("dialog__content");
    if (this.#form) {
      doc.append(this.#form);
    } else {
      doc.append(this.#content);
    }

    this.#dialog.append(doc);
    this.#dialog.classList.add("dialog");
    this.#dialog.setAttribute("aria-labelledby", DomUtil.identify(this.#title));

    this.#dialog.addEventListener("cancel", (event) => {
      if (!this.#shouldClose()) {
        event.preventDefault();
        return;
      }
    });

    // Close the dialog by clicking on the backdrop.
    //
    // Using the `close` event is not an option because it will
    // also trigger when holding the mouse button inside the
    // dialog and then releasing it on the backdrop.
    this.#dialog.addEventListener("mousedown", (event) => {
      if (event.target === this.#dialog) {
        const event = new CustomEvent("backdrop", { cancelable: true });
        this.dispatchEvent(event);
        if (event.defaultPrevented) {
          return;
        }

        if (this.#shouldClose()) {
          this.close();
        }
      }
    });

    this.append(this.#dialog);
  }

  #shouldClose(): boolean {
    const event = new CustomEvent("close");
    this.dispatchEvent(event);

    return event.defaultPrevented === false;
  }

  public addEventListener<T extends keyof WoltlabCoreDialogEventMap>(
    type: T,
    listener: (this: WoltlabCoreDialogElement, ev: WoltlabCoreDialogEventMap[T]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  public addEventListener(
    type: string,
    listener: (this: WoltlabCoreDialogElement, ev: Event) => any,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(type, listener, options);
  }
}

window.customElements.define("woltlab-core-dialog", WoltlabCoreDialogElement);

export default WoltlabCoreDialogElement;