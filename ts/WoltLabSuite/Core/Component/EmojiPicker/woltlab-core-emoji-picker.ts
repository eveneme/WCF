/**
 * The `<woltlab-core-emoji-picker>` element creates an emoji picker.
 *
 * @author Olaf Braun
 * @copyright 2001-2024 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since 6.2
 */

import "emoji-picker-element";
import { PickerConstructorOptions } from "emoji-picker-element/shared";
import { Picker, Database } from "emoji-picker-element";
import { getLocalizationData, getDataSource } from "WoltLabSuite/Core/Component/EmojiPicker/Localization";

export const DATABASE_FOR_AUTO_COMPLETE = new Database({
  dataSource: getDataSource("en"),
  locale: "en",
});

export class WoltlabCoreEmojiPicker extends Picker {
  constructor(props: PickerConstructorOptions | null | undefined) {
    const locale = (props && props.locale) || document.documentElement.lang;

    super({
      locale: locale,
      ...(props || {}),
      dataSource: getDataSource(locale),
      i18n: getLocalizationData(locale),
    });
  }

  static get observedAttributes(): string[] {
    return [];
  }

  focus() {
    this.shadowRoot!.querySelector<HTMLInputElement>(".search")!.focus();
  }
}

customElements.define("woltlab-core-emoji-picker", WoltlabCoreEmojiPicker);