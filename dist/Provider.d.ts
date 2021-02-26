import React, { ReactElement, ReactNode } from "react";
import { Action, KeyDirection, RowStartMap, State } from "./types";
export declare function reducer(state: State, action: Action): State;
export declare const RovingTabIndexContext: React.Context<Readonly<{
    state: Readonly<{
        selectedId: string | null;
        allowFocusing: boolean;
        tabStops: readonly Readonly<{
            id: string;
            domElementRef: React.RefObject<Element>;
            disabled: boolean;
            rowIndex: number | null;
        }>[];
        direction: KeyDirection;
        rowStartMap: RowStartMap | null;
    }>;
    dispatch: React.Dispatch<Action>;
}>>;
/**
 * Creates a roving tabindex context.
 * @param {ReactNode} children The child content, which will
 * include the DOM elements to rove between using the tab key.
 * @param {KeyDirection} direction An optional direction value
 * that only applies when the roving tabindex is not being
 * used within a grid. This value specifies the arrow key behaviour.
 * When set to 'horizontal' then only the ArrowLeft and ArrowRight
 * keys move to the previous and next tab stop respectively.
 * When set to 'vertical' then only the ArrowUp and ArrowDown keys
 * move to the previous and next tab stop respectively. When set
 * to 'both' then both the ArrowLeft and ArrowUp keys can be used
 * to move to the previous tab stop, and both the ArrowRight
 * and ArrowDown keys can be used to move to the next tab stop.
 * If you do not pass an explicit value then the 'horizontal'
 * behaviour applies. You can change this direction value
 * at any time.
 */
export declare const Provider: ({ children, direction }: {
    children: ReactNode;
    direction?: "horizontal" | "vertical" | "both" | undefined;
}) => ReactElement;
