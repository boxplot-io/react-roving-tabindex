'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var warning = require('warning');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var warning__default = /*#__PURE__*/_interopDefaultLegacy(warning);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

(function (EventKey) {
    EventKey["ArrowLeft"] = "ArrowLeft";
    EventKey["ArrowRight"] = "ArrowRight";
    EventKey["ArrowUp"] = "ArrowUp";
    EventKey["ArrowDown"] = "ArrowDown";
    EventKey["Home"] = "Home";
    EventKey["End"] = "End";
})(exports.EventKey || (exports.EventKey = {}));
(function (Navigation) {
    Navigation["PREVIOUS"] = "PREVIOUS";
    Navigation["NEXT"] = "NEXT";
    Navigation["VERY_FIRST"] = "VERY_FIRST";
    Navigation["VERY_LAST"] = "VERY_LAST";
    Navigation["PREVIOUS_ROW"] = "PREVIOUS_ROW";
    Navigation["NEXT_ROW"] = "NEXT_ROW";
    Navigation["FIRST_IN_ROW"] = "FIRST_IN_ROW";
    Navigation["LAST_IN_ROW"] = "LAST_IN_ROW";
})(exports.Navigation || (exports.Navigation = {}));
(function (ActionType) {
    ActionType["REGISTER_TAB_STOP"] = "REGISTER_TAB_STOP";
    ActionType["UNREGISTER_TAB_STOP"] = "UNREGISTER_TAB_STOP";
    ActionType["KEY_DOWN"] = "KEY_DOWN";
    ActionType["CLICKED"] = "CLICKED";
    ActionType["TAB_STOP_UPDATED"] = "TAB_STOP_UPDATED";
    ActionType["DIRECTION_UPDATED"] = "DIRECTION_UPDATED";
})(exports.ActionType || (exports.ActionType = {}));

var DOCUMENT_POSITION_FOLLOWING = 4;
// Note: The `allowFocusing` state property is required
// to delay focusing of the selected tab stop
// DOM element until the user has started interacting
// with the roving tabindex's controls. If this delay
// did not occur, the selected control would be focused
// as soon as it was mounted, which is unlikely to be
// the desired behaviour for the page.
//
// Note: The rowStartMap is only created if row-related
// navigation occurs (e.g., move to row start or end), so
// non-grid usage of this library does not pay the price
// (minimal as it is) of constructing this map. The map
// gets cleared if registering, unregistering, or updating.
function reducer(state, action) {
    switch (action.type) {
        case exports.ActionType.REGISTER_TAB_STOP: {
            var newTabStop = action.payload;
            if (!newTabStop.domElementRef.current) {
                return state;
            }
            // Iterate backwards through state.tabStops since it is
            // most likely that the tab stop will need to be inserted
            // at the end of that array.
            var indexToInsertAt = -1;
            for (var i = state.tabStops.length - 1; i >= 0; --i) {
                var loopTabStop = state.tabStops[i];
                if (loopTabStop.id === newTabStop.id) {
                    warning__default['default'](false, "'" + newTabStop.id + "' tab stop already registered");
                    return state;
                }
                // The compareDocumentPosition condition is true
                // if newTabStop follows loopTabStop:
                if (indexToInsertAt === -1 &&
                    loopTabStop.domElementRef.current &&
                    !!(loopTabStop.domElementRef.current.compareDocumentPosition(newTabStop.domElementRef.current) & DOCUMENT_POSITION_FOLLOWING)) {
                    indexToInsertAt = i + 1;
                    break;
                }
            }
            // The indexToInsertAt is -1 when newTabStop should be inserted
            // at the start of tabStops (the compareDocumentPosition condition
            // always returns false in that case).
            if (indexToInsertAt === -1) {
                indexToInsertAt = 0;
            }
            var newTabStops = state.tabStops.slice();
            newTabStops.splice(indexToInsertAt, 0, newTabStop);
            return __assign(__assign({}, state), { selectedId: getUpdatedSelectedId(newTabStops, state.selectedId), tabStops: newTabStops, rowStartMap: null });
        }
        case exports.ActionType.UNREGISTER_TAB_STOP: {
            var id_1 = action.payload.id;
            var newTabStops = state.tabStops.filter(function (tabStop) { return tabStop.id !== id_1; });
            if (newTabStops.length === state.tabStops.length) {
                warning__default['default'](false, "'" + id_1 + "' tab stop already unregistered");
                return state;
            }
            return __assign(__assign({}, state), { selectedId: getUpdatedSelectedId(newTabStops, state.selectedId), tabStops: newTabStops, rowStartMap: null });
        }
        case exports.ActionType.TAB_STOP_UPDATED: {
            var _a = action.payload, id_2 = _a.id, rowIndex = _a.rowIndex, disabled = _a.disabled;
            var index = state.tabStops.findIndex(function (tabStop) { return tabStop.id === id_2; });
            if (index === -1) {
                warning__default['default'](false, "'" + id_2 + "' tab stop not registered");
                return state;
            }
            var tabStop = state.tabStops[index];
            if (tabStop.disabled === disabled && tabStop.rowIndex === rowIndex) {
                // Nothing to do so short-circuit.
                return state;
            }
            var newTabStop = __assign(__assign({}, tabStop), { rowIndex: rowIndex, disabled: disabled });
            var newTabStops = state.tabStops.slice();
            newTabStops.splice(index, 1, newTabStop);
            return __assign(__assign({}, state), { selectedId: getUpdatedSelectedId(newTabStops, state.selectedId), tabStops: newTabStops, rowStartMap: null });
        }
        case exports.ActionType.KEY_DOWN: {
            var _b = action.payload, id_3 = _b.id, key = _b.key, ctrlKey = _b.ctrlKey;
            var index = state.tabStops.findIndex(function (tabStop) { return tabStop.id === id_3; });
            if (index === -1) {
                warning__default['default'](false, "'" + id_3 + "' tab stop not registered");
                return state;
            }
            var currentTabStop = state.tabStops[index];
            if (currentTabStop.disabled) {
                return state;
            }
            var isGrid = currentTabStop.rowIndex !== null;
            var navigation = getNavigationValue(key, ctrlKey, isGrid, state.direction);
            if (!navigation) {
                return state;
            }
            switch (navigation) {
                case exports.Navigation.NEXT:
                    {
                        for (var i = index + 1; i < state.tabStops.length; ++i) {
                            var tabStop = state.tabStops[i];
                            if (isGrid && tabStop.rowIndex !== currentTabStop.rowIndex) {
                                break;
                            }
                            if (!tabStop.disabled) {
                                return selectTabStop(state, tabStop);
                            }
                        }
                    }
                    break;
                case exports.Navigation.PREVIOUS:
                    {
                        for (var i = index - 1; i >= 0; --i) {
                            var tabStop = state.tabStops[i];
                            if (isGrid && tabStop.rowIndex !== currentTabStop.rowIndex) {
                                break;
                            }
                            if (!tabStop.disabled) {
                                return selectTabStop(state, tabStop);
                            }
                        }
                    }
                    break;
                case exports.Navigation.VERY_FIRST:
                    {
                        for (var i = 0; i < state.tabStops.length; ++i) {
                            var tabStop = state.tabStops[i];
                            if (!tabStop.disabled) {
                                return selectTabStop(state, tabStop);
                            }
                        }
                    }
                    break;
                case exports.Navigation.VERY_LAST:
                    {
                        for (var i = state.tabStops.length - 1; i >= 0; --i) {
                            var tabStop = state.tabStops[i];
                            if (!tabStop.disabled) {
                                return selectTabStop(state, tabStop);
                            }
                        }
                    }
                    break;
                case exports.Navigation.PREVIOUS_ROW:
                    {
                        if (currentTabStop.rowIndex === null ||
                            currentTabStop.rowIndex === 0) {
                            return state;
                        }
                        var rowStartMap = state.rowStartMap || createRowStartMap(state);
                        var rowStartIndex = rowStartMap.get(currentTabStop.rowIndex);
                        if (rowStartIndex === undefined) {
                            return state;
                        }
                        var columnOffset = index - rowStartIndex;
                        for (var i = currentTabStop.rowIndex - 1; i >= 0; --i) {
                            var rowStartIndex_1 = rowStartMap.get(i);
                            if (rowStartIndex_1 === undefined) {
                                return state;
                            }
                            var rowTabStop = state.tabStops[rowStartIndex_1 + columnOffset];
                            if (!rowTabStop.disabled) {
                                return selectTabStop(state, rowTabStop, rowStartMap);
                            }
                        }
                        return __assign(__assign({}, state), { allowFocusing: true, rowStartMap: rowStartMap });
                    }
                case exports.Navigation.NEXT_ROW:
                    {
                        var maxRowIndex = state.tabStops[state.tabStops.length - 1].rowIndex;
                        if (currentTabStop.rowIndex === null ||
                            maxRowIndex === null ||
                            currentTabStop.rowIndex === maxRowIndex) {
                            return state;
                        }
                        var rowStartMap = state.rowStartMap || createRowStartMap(state);
                        var rowStartIndex = rowStartMap.get(currentTabStop.rowIndex);
                        if (rowStartIndex === undefined) {
                            return state;
                        }
                        var columnOffset = index - rowStartIndex;
                        for (var i = currentTabStop.rowIndex + 1; i <= maxRowIndex; ++i) {
                            var rowStartIndex_2 = rowStartMap.get(i);
                            if (rowStartIndex_2 === undefined) {
                                return state;
                            }
                            var rowTabStop = state.tabStops[rowStartIndex_2 + columnOffset];
                            if (!rowTabStop.disabled) {
                                return selectTabStop(state, rowTabStop, rowStartMap);
                            }
                        }
                        return __assign(__assign({}, state), { allowFocusing: true, rowStartMap: rowStartMap });
                    }
                case exports.Navigation.FIRST_IN_ROW:
                    {
                        if (currentTabStop.rowIndex === null) {
                            return state;
                        }
                        var rowStartMap = state.rowStartMap || createRowStartMap(state);
                        var rowStartIndex = rowStartMap.get(currentTabStop.rowIndex);
                        if (rowStartIndex === undefined) {
                            return state;
                        }
                        for (var i = rowStartIndex; i < state.tabStops.length; ++i) {
                            var tabStop = state.tabStops[i];
                            if (tabStop.rowIndex !== currentTabStop.rowIndex) {
                                break;
                            }
                            else if (!tabStop.disabled) {
                                return selectTabStop(state, state.tabStops[i], rowStartMap);
                            }
                        }
                    }
                    break;
                case exports.Navigation.LAST_IN_ROW:
                    {
                        if (currentTabStop.rowIndex === null) {
                            return state;
                        }
                        var rowStartMap = state.rowStartMap || createRowStartMap(state);
                        var rowEndIndex = rowStartMap.has(currentTabStop.rowIndex + 1)
                            ? (rowStartMap.get(currentTabStop.rowIndex + 1) || 0) - 1
                            : state.tabStops.length - 1;
                        for (var i = rowEndIndex; i >= 0; --i) {
                            var tabStop = state.tabStops[i];
                            if (tabStop.rowIndex !== currentTabStop.rowIndex) {
                                break;
                            }
                            else if (!tabStop.disabled) {
                                return selectTabStop(state, state.tabStops[i], rowStartMap);
                            }
                        }
                    }
                    break;
            }
            return state;
        }
        case exports.ActionType.CLICKED: {
            var id_4 = action.payload.id;
            var index = state.tabStops.findIndex(function (tabStop) { return tabStop.id === id_4; });
            if (index === -1) {
                warning__default['default'](false, "'" + id_4 + "' tab stop not registered");
                return state;
            }
            var currentTabStop = state.tabStops[index];
            return currentTabStop.disabled
                ? state
                : selectTabStop(state, currentTabStop);
        }
        case exports.ActionType.DIRECTION_UPDATED: {
            var direction = action.payload.direction;
            return direction === state.direction ? state : __assign(__assign({}, state), { direction: direction });
        }
        default:
            return state;
    }
}
// Determine the updated value for selectedId:
function getUpdatedSelectedId(tabStops, currentSelectedId) {
    if (currentSelectedId === null) {
        // There is not currently selected tab stop, so find
        // the first tab stop that is not disabled and return
        // its id, otherwise return null.
        var index_1 = tabStops.findIndex(function (tabStop) { return !tabStop.disabled; });
        return index_1 === -1 ? null : tabStops[index_1].id;
    }
    var index = tabStops.findIndex(function (tabStop) { return tabStop.id === currentSelectedId; });
    if (index !== -1 && !tabStops[index].disabled) {
        // The current selected id is still valid, so return it.
        return currentSelectedId;
    }
    // Finds the first tab stop that is not disabled and return
    // its id, otherwise return null.
    index = tabStops.findIndex(function (tabStop) { return !tabStop.disabled; });
    return index === -1 ? null : tabStops[index].id;
}
// Translates the user key down event info into a navigation instruction.
function getNavigationValue(key, ctrlKey, isGrid, direction) {
    switch (key) {
        case exports.EventKey.ArrowLeft:
            return isGrid || direction === "horizontal" || direction === "both"
                ? exports.Navigation.PREVIOUS
                : null;
        case exports.EventKey.ArrowRight:
            return isGrid || direction === "horizontal" || direction === "both"
                ? exports.Navigation.NEXT
                : null;
        case exports.EventKey.ArrowUp:
            if (isGrid) {
                return exports.Navigation.PREVIOUS_ROW;
            }
            else {
                return direction === "vertical" || direction === "both"
                    ? exports.Navigation.PREVIOUS
                    : null;
            }
        case exports.EventKey.ArrowDown:
            if (isGrid) {
                return exports.Navigation.NEXT_ROW;
            }
            else {
                return direction === "vertical" || direction === "both"
                    ? exports.Navigation.NEXT
                    : null;
            }
        case exports.EventKey.Home:
            return !isGrid || ctrlKey
                ? exports.Navigation.VERY_FIRST
                : exports.Navigation.FIRST_IN_ROW;
        case exports.EventKey.End:
            return !isGrid || ctrlKey ? exports.Navigation.VERY_LAST : exports.Navigation.LAST_IN_ROW;
        default:
            return null;
    }
}
// Creates the new state for a tab stop when it becomes the selected one.
function selectTabStop(state, tabStop, rowStartMap) {
    return __assign(__assign({}, state), { allowFocusing: true, selectedId: tabStop.id, rowStartMap: rowStartMap || state.rowStartMap });
}
// Creates the row start index lookup map
// for the currently registered tab stops.
function createRowStartMap(state) {
    var map = new Map();
    for (var i = 0; i < state.tabStops.length; ++i) {
        var rowIndex = state.tabStops[i].rowIndex;
        if (rowIndex !== null && !map.has(rowIndex)) {
            map.set(rowIndex, i);
        }
    }
    return map;
}
var INITIAL_STATE = {
    selectedId: null,
    allowFocusing: false,
    tabStops: [],
    direction: "horizontal",
    rowStartMap: null
};
var RovingTabIndexContext = React.createContext({
    state: INITIAL_STATE,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispatch: function () { }
});
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
var Provider = function (_a) {
    var children = _a.children, _b = _a.direction, direction = _b === void 0 ? "horizontal" : _b;
    var _c = React.useReducer(reducer, __assign(__assign({}, INITIAL_STATE), { direction: direction })), state = _c[0], dispatch = _c[1];
    // Update the direction whenever it changes:
    React.useEffect(function () {
        dispatch({ type: exports.ActionType.DIRECTION_UPDATED, payload: { direction: direction } });
    }, [direction]);
    // Create a cached object to use as the context value:
    var context = React.useMemo(function () { return ({ state: state, dispatch: dispatch }); }, [state]);
    return (React__default['default'].createElement(RovingTabIndexContext.Provider, { value: context }, children));
};

var counter = 0;
function uniqueId() {
    return "rti_" + ++counter;
}

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
function useRovingTabIndex(domElementRef, disabled, rowIndex) {
    if (rowIndex === void 0) { rowIndex = null; }
    // Create a stable ID for the lifetime of the component:
    var idRef = React.useRef(null);
    function getId() {
        if (!idRef.current) {
            idRef.current = uniqueId();
        }
        return idRef.current;
    }
    var isMounted = React.useRef(false);
    var context = React.useContext(RovingTabIndexContext);
    // Register the tab stop on mount and unregister it on unmount:
    React.useEffect(function () {
        var id = getId();
        context.dispatch({
            type: exports.ActionType.REGISTER_TAB_STOP,
            payload: {
                id: id,
                domElementRef: domElementRef,
                rowIndex: rowIndex,
                disabled: disabled
            }
        });
        return function () {
            context.dispatch({
                type: exports.ActionType.UNREGISTER_TAB_STOP,
                payload: { id: id }
            });
        };
    }, []);
    // Update the tab stop data if rowIndex or disabled change.
    // The isMounted flag is used to prevent this effect running
    // on mount, which is benign but redundant (as the
    // REGISTER_TAB_STOP action would have just been dispatched).
    React.useEffect(function () {
        if (isMounted.current) {
            context.dispatch({
                type: exports.ActionType.TAB_STOP_UPDATED,
                payload: {
                    id: getId(),
                    rowIndex: rowIndex,
                    disabled: disabled
                }
            });
        }
        else {
            isMounted.current = true;
        }
    }, [rowIndex, disabled]);
    // Create a stable callback function for handling key down events:
    var handleKeyDown = React.useCallback(function (event) {
        var key = exports.EventKey[event.key];
        if (!key) {
            return;
        }
        context.dispatch({
            type: exports.ActionType.KEY_DOWN,
            payload: { id: getId(), key: key, ctrlKey: event.ctrlKey }
        });
        event.preventDefault();
    }, []);
    // Create a stable callback function for handling click events:
    var handleClick = React.useCallback(function () {
        context.dispatch({ type: exports.ActionType.CLICKED, payload: { id: getId() } });
    }, []);
    // Determine if the current tab stop is the currently active one:
    var selected = getId() === context.state.selectedId;
    var tabIndex = selected ? 0 : -1;
    var focused = selected && context.state.allowFocusing;
    return [tabIndex, focused, handleKeyDown, handleClick, idRef.current];
}

/**
 * Focuses on the given DOM element as required.
 * @param {boolean | null | undefined} focused Whether or not
 * the specified DOM element should have focus() invoked on it.
 * @param {RefObject<SVGElement | HTMLElement>} ref The DOM
 * element to control the focus of.
 */
function useFocusEffect(focused, ref) {
    // useLayoutEffect is not required as a focus outline is normally
    // the browser's default rendering or a custom box shadow. Both
    // do not affect layout or appearance beyond this outline so
    // will not cause a jank-like change in appearance when added.
    React.useEffect(function () {
        if (focused && ref.current) {
            ref.current.focus();
        }
    }, [focused]);
}

exports.RovingTabIndexContext = RovingTabIndexContext;
exports.RovingTabIndexProvider = Provider;
exports.useFocusEffect = useFocusEffect;
exports.useRovingTabIndex = useRovingTabIndex;
//# sourceMappingURL=index.js.map
