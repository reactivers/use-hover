'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

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

var isPointInRect = function (point, rect, includeBorders) {
    if (includeBorders === void 0) { includeBorders = false; }
    var x = point.x, y = point.y;
    var top = rect.top, right = rect.right, bottom = rect.bottom, left = rect.left;
    if (top === bottom || right === left)
        return false;
    if (includeBorders)
        return x >= left && x <= right && y >= top && y <= bottom;
    return x > left && x < right && y > top && y < bottom;
};
var isInRange = function (range, num, includeFrom, includeTo) {
    if (includeFrom === void 0) { includeFrom = true; }
    if (includeTo === void 0) { includeTo = true; }
    var from = range[0], to = range[1];
    var checkFrom = includeFrom ? num >= from : num > from;
    var checkTo = includeTo ? num <= to : num < to;
    return checkFrom && checkTo;
};

var zeroOffset = { top: 0, right: 0, bottom: 0, left: 0 };
var useHover = function (_a) {
    var ref = _a.ref, _b = _a.active, active = _b === void 0 ? true : _b, _c = _a.axis, axis = _c === void 0 ? { vertical: true, horizontal: true } : _c, _d = _a.offsets, _offsets = _d === void 0 ? {} : _d, _e = _a.updateOnTouchEnd, updateOnTouchEnd = _e === void 0 ? true : _e, _f = _a.includeBorders, includeBorders = _f === void 0 ? true : _f;
    var _g = react.useState(false), isHover = _g[0], setIsHover = _g[1];
    var checkInVertically = axis.vertical, checkInHorizontally = axis.horizontal;
    var offsets = __assign(__assign({}, zeroOffset), _offsets);
    var top = offsets.top, right = offsets.right, bottom = offsets.bottom, left = offsets.left;
    var isMouseOver = react.useCallback(function (e) {
        if (!ref.current)
            return;
        var event = e.touches ? e.touches[0] : e;
        var clientX = event.clientX, clientY = event.clientY;
        var point = { x: clientX, y: clientY };
        var boundingRect = ref.current.getBoundingClientRect().toJSON();
        boundingRect.top += top;
        boundingRect.right += right;
        boundingRect.bottom += bottom;
        boundingRect.left += left;
        var checkBoth = checkInVertically && checkInHorizontally;
        var _isHover = checkBoth
            ? isPointInRect(point, boundingRect, includeBorders) :
            checkInVertically ?
                isInRange([boundingRect.top, boundingRect.bottom], clientY, includeBorders, includeBorders)
                : isInRange([boundingRect.left, boundingRect.right], clientX, includeBorders, includeBorders);
        setIsHover(_isHover);
    }, [ref.current, isHover, includeBorders, checkInVertically, checkInHorizontally, top, right, bottom, left]);
    var onTouchEnd = react.useCallback(function () {
        setIsHover(false);
    }, []);
    react.useEffect(function () {
        if (updateOnTouchEnd)
            document.addEventListener('touchend', onTouchEnd, { passive: true });
        return function () {
            document.removeEventListener('touchend', onTouchEnd);
        };
    }, [updateOnTouchEnd, onTouchEnd]);
    react.useEffect(function () {
        if (active) {
            document.addEventListener('mousemove', isMouseOver, { passive: true });
            document.addEventListener('touchmove', isMouseOver, { passive: true });
        }
        else {
            setIsHover(false);
        }
        return function () {
            document.removeEventListener('mousemove', isMouseOver);
            document.removeEventListener('touchmove', isMouseOver);
        };
    }, [isMouseOver, active]);
    return { isHover: isHover };
};

exports.useHover = useHover;
