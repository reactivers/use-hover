export const isPointInRect = (
    point: { x: number; y: number },
    rect: { top: number; right: number; bottom: number; left: number },
    includeBorders = false
) => {
    const { x, y } = point;
    const { top, right, bottom, left } = rect;
    if (top === bottom || right === left) return false;
    if (includeBorders) return x >= left && x <= right && y >= top && y <= bottom;
    return x > left && x < right && y > top && y < bottom;
};

type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends (...a: infer X) => void
    ? X
    : never;
type GrowToSize<T, A extends Array<T>, N extends number> = {
    0: A;
    1: GrowToSize<T, Grow<T, A>, N>;
}[A['length'] extends N ? 0 : 1];

export type FixedArray<T, N extends number> = GrowToSize<T, [], N>;

export const isInRange = (
    range: FixedArray<number, 2>,
    num: number,
    includeFrom: boolean = true,
    includeTo: boolean = true
) => {
    const [from, to] = range;
    const checkFrom = includeFrom ? num >= from : num > from;
    const checkTo = includeTo ? num <= to : num < to;
    return checkFrom && checkTo;
};