/**
 * --------------------------------------------
 * @file Global Banking Employment direct-chat.ts
 * @description Direct chat for Global Banking Employment.
 * @license MIT
 * --------------------------------------------
 */
import { BaseComponent } from './base-component';
/**
 * Class Definition
 * ====================================================
 */
declare class DirectChat extends BaseComponent {
    static get NAME(): string;
    static getInstance(element: Element | null | undefined): DirectChat | null;
    static getOrCreateInstance(element: HTMLElement): DirectChat;
    toggle(): void;
}
export default DirectChat;
