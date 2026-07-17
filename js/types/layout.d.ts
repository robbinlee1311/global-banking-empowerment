/**
 * ----------------------------------------------------------------------------
 * @file Global Banking Employment layout.ts
 * @description Layout for Global Banking Employment.
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
