import { RefObject } from "react";
import { HookResponse } from "./types";
/**
 * Includes the given DOM element in the current roving tabindex.
 * @param {RefObject<Element>} domElementRef The DOM element to include.
 * This must be the same DOM element for the lifetime of the containing
 * component.
 * @param {boolean} disabled Whether or not the DOM element is currently
 * enabled. This value can be updated as appropriate throughout the lifetime
 * of the containing component.
 * @param {number?} rowIndex An optional integer value that must be
 * populated if the roving tabindex is being used in a grid. In that case,
 * set it to the zero-based index of the row that the given DOM element
 * is currently part of. You can update this row index as appropriate
 * throughout the lifetime of the containing component, for example if
 * the shape of the grid can change dynamically.
 * @returns A tuple of values to be applied by the containing
 * component for the roving tabindex to work correctly.
 * First tuple value: The tabIndex value to apply to the tab stop
 * element.
 * Second tuple value: Whether or not focus() should be invoked on the
 * tab stop element.
 * Third tuple value: The onKeyDown callback to apply to the tab
 * stop element. If the key press is relevant to the hook then
 * event.preventDefault() will be invoked on the event.
 * Fourth tuple value: The onClick callback to apply to the tab
 * stop element.
 */
export declare function useRovingTabIndex(domElementRef: RefObject<Element>, disabled: boolean, rowIndex?: number | null): HookResponse;
