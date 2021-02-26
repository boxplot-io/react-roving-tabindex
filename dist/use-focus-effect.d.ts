import { RefObject } from "react";
/**
 * Focuses on the given DOM element as required.
 * @param {boolean | null | undefined} focused Whether or not
 * the specified DOM element should have focus() invoked on it.
 * @param {RefObject<SVGElement | HTMLElement>} ref The DOM
 * element to control the focus of.
 */
export declare function useFocusEffect(focused: boolean | null | undefined, ref: RefObject<SVGElement | HTMLElement>): void;
