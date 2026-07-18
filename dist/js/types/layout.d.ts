/**
 * ----------------------------------------------------------------------------
 * @file Global Banking Empowerment layout.ts
 * @description Layout for Global Banking Empowerment.
 * @license MIT
 * ----------------------------------------------------------------------------
 */
/**
 * ----------------------------------------------------------------------------
 * Class Definition
 * ----------------------------------------------------------------------------
 */
declare class Layout {
    _element: HTMLElement;
    _holdTransitionTimer: ReturnType<typeof setTimeout> | undefined;
    constructor(element: HTMLElement);
    holdTransition(time?: number): void;
}
export default Layout;
