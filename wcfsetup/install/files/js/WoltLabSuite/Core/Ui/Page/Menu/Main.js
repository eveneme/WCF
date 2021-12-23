/**
 * Provides the touch-friendly main menu.
 *
 * @author Alexander Ebert
 * @copyright 2001-2021 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module WoltLabSuite/Core/Ui/Page/Menu/Main
 */
define(["require", "exports", "tslib", "./Container", "../../../Language", "../../../Dom/Util"], function (require, exports, tslib_1, Container_1, Language, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PageMenuMain = void 0;
    Container_1 = (0, tslib_1.__importDefault)(Container_1);
    Language = (0, tslib_1.__importStar)(Language);
    Util_1 = (0, tslib_1.__importDefault)(Util_1);
    function normalizeMenuItem(menuItem) {
        const anchor = menuItem.querySelector(".boxMenuLink");
        const title = anchor.querySelector(".boxMenuLinkTitle").textContent;
        let counter = 0;
        const outstandingItems = anchor.querySelector(".boxMenuLinkOutstandingItems");
        if (outstandingItems) {
            counter = +outstandingItems.textContent.replace(/[^0-9]/, "");
        }
        const subMenu = menuItem.querySelector("ol");
        let children = [];
        if (subMenu instanceof HTMLOListElement) {
            children = Array.from(subMenu.children).map((subMenuItem) => {
                return normalizeMenuItem(subMenuItem);
            });
        }
        // `link.href` represents the computed link, not the raw value.
        const href = anchor.getAttribute("href");
        let link = undefined;
        if (href && href !== "#") {
            link = anchor.href;
        }
        const active = menuItem.classList.contains("active");
        return {
            active,
            children,
            counter,
            link,
            title,
        };
    }
    class PageMenuMain {
        constructor() {
            this.mainMenu = document.querySelector(".mainMenu");
            this.container = new Container_1.default(this, "left" /* Left */);
            this.callbackOpen = (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.container.toggle();
            };
        }
        enable() {
            this.mainMenu.setAttribute("aria-expanded", "false");
            this.mainMenu.setAttribute("role", "button");
            this.mainMenu.tabIndex = 0;
            this.mainMenu.addEventListener("click", this.callbackOpen);
            this.refreshUnreadIndicator();
        }
        disable() {
            this.container.close();
            this.mainMenu.removeAttribute("aria-expanded");
            this.mainMenu.removeAttribute("role");
            this.mainMenu.removeAttribute("tabindex");
            this.mainMenu.removeEventListener("click", this.callbackOpen);
        }
        getContent() {
            const container = document.createElement("div");
            container.classList.add("pageMenuMainContainer");
            container.append(...this.buildMainMenu());
            const footerMenu = this.buildFooterMenu();
            if (footerMenu) {
                container.append(footerMenu);
            }
            const fragment = document.createDocumentFragment();
            fragment.append(container);
            return fragment;
        }
        getMenuButton() {
            return this.mainMenu;
        }
        sleep() {
            /* Does nothing */
        }
        wakeup() {
            this.refreshUnreadIndicator();
        }
        buildMainMenu() {
            const boxMenu = this.mainMenu.querySelector(".boxMenu");
            const nav = this.buildMenu(boxMenu);
            nav.setAttribute("aria-label", window.PAGE_TITLE);
            nav.setAttribute("role", "navigation");
            return [nav];
        }
        buildFooterMenu() {
            const box = document.querySelector('.box[data-box-identifier="com.woltlab.wcf.FooterMenu"]');
            if (box === null) {
                return null;
            }
            const boxMenu = box.querySelector(".boxMenu");
            const nav = this.buildMenu(boxMenu);
            nav.classList.add("pageMenuMainNavigationFooter");
            const label = box.querySelector("nav").getAttribute("aria-label");
            nav.setAttribute("aria-label", label);
            return nav;
        }
        buildMenu(boxMenu) {
            const menuItems = Array.from(boxMenu.children).map((element) => {
                return normalizeMenuItem(element);
            });
            const nav = document.createElement("nav");
            nav.classList.add("pageMenuMainNavigation");
            nav.append(this.buildMenuItemList(menuItems));
            return nav;
        }
        buildMenuItemList(menuItems) {
            const list = document.createElement("ul");
            list.classList.add("pageMenuMainItemList");
            menuItems
                .filter((menuItem) => {
                // Remove links that have no target (`#`) and do not contain any children.
                if (!menuItem.link && menuItem.children.length === 0) {
                    return false;
                }
                return true;
            })
                .forEach((menuItem) => {
                list.append(this.buildMenuItem(menuItem));
            });
            return list;
        }
        buildMenuItem(menuItem) {
            const listItem = document.createElement("li");
            listItem.classList.add("pageMenuMainItem");
            if (menuItem.link) {
                const link = document.createElement("a");
                link.classList.add("pageMenuMainItemLink");
                link.href = menuItem.link;
                link.textContent = menuItem.title;
                if (menuItem.active) {
                    link.setAttribute("aria-current", "page");
                }
                listItem.append(link);
            }
            else {
                const label = document.createElement("span");
                label.textContent = menuItem.title;
                listItem.append(label);
            }
            if (menuItem.counter > 0) {
                const counter = document.createElement("span");
                counter.classList.add("pageMenuMainItemCounter", "badge", "badgeUpdate");
                counter.setAttribute("aria-label", "TODO");
                counter.textContent = menuItem.counter.toString();
                listItem.classList.add("pageMenuMainItemOutstandingItems");
                listItem.append(counter);
            }
            if (menuItem.children.length) {
                listItem.classList.add("pageMenuMainItemExpandable");
                const menuId = Util_1.default.getUniqueId();
                const button = document.createElement("a");
                button.classList.add("pageMenuMainItemToggle");
                button.tabIndex = 0;
                button.setAttribute("role", "button");
                button.setAttribute("aria-expanded", "false");
                button.setAttribute("aria-controls", menuId);
                button.setAttribute("aria-label", Language.get("TODO"));
                button.innerHTML = '<span class="icon icon24 fa-angle-down" aria-hidden="true"></span>';
                const list = this.buildMenuItemList(menuItem.children);
                list.id = menuId;
                list.hidden = true;
                button.addEventListener("click", (event) => {
                    event.preventDefault();
                    this.toggleList(button, list);
                });
                button.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        button.click();
                    }
                });
                list.addEventListener("keydown", (event) => {
                    if (event.key === "Escape") {
                        event.preventDefault();
                        event.stopPropagation();
                        this.toggleList(button, list);
                    }
                });
                listItem.append(button, list);
            }
            return listItem;
        }
        toggleList(button, list) {
            if (list.hidden) {
                button.setAttribute("aria-expanded", "true");
                list.hidden = false;
            }
            else {
                button.setAttribute("aria-expanded", "false");
                list.hidden = true;
                if (document.activeElement !== button) {
                    button.focus();
                }
            }
        }
        refreshUnreadIndicator() {
            const hasUnreadItems = this.mainMenu.querySelector(".boxMenuLinkOutstandingItems") !== null;
            if (hasUnreadItems) {
                this.mainMenu.classList.add("pageMenuMobileButtonHasContent");
            }
            else {
                this.mainMenu.classList.remove("pageMenuMobileButtonHasContent");
            }
        }
    }
    exports.PageMenuMain = PageMenuMain;
    exports.default = PageMenuMain;
});
