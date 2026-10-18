/**
 * Flood fill and color conversion utilities for Kids Paint.
 */

/**
 * Converts a hex color string (#RGB, #RRGGBB) to [r, g, b, 255].
 * @param {string} hex
 * @returns {[number, number, number, number]}
 */
export function hexToRgba(hex) {
    if (!hex || typeof hex !== 'string') return [0, 0, 0, 255];
    let c = hex.trim();
    if (c.startsWith('#')) c = c.slice(1);
    if (c.length === 3) {
        c = c.split('').map((ch) => ch + ch).join('');
    }
    if (c.length !== 6) return [0, 0, 0, 255];
    const num = parseInt(c, 16);
    if (Number.isNaN(num)) return [0, 0, 0, 255];
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

/**
 * Converts HSL values to [r, g, b, 255].
 * @param {number} h Hue in degrees (0-360)
 * @param {number} s Saturation (0-1)
 * @param {number} l Lightness (0-1)
 * @returns {[number, number, number, number]}
 */
export function hslToRgb(h, s = 1, l = 0.5) {
    const normH = (((h % 360) + 360) % 360) / 360;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            let vt = t;
            if (vt < 0) vt += 1;
            if (vt > 1) vt -= 1;
            if (vt < 1 / 6) return p + (q - p) * 6 * vt;
            if (vt < 1 / 2) return q;
            if (vt < 2 / 3) return p + (q - p) * (2 / 3 - vt) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, normH + 1 / 3);
        g = hue2rgb(p, q, normH);
        b = hue2rgb(p, q, normH - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255];
}

/**
 * Performs a 4-way stack-based flood fill on canvas pixel data.
 *
 * @param {Object} options
 * @param {Uint8ClampedArray} options.data The canvas ImageData array (RGBA).
 * @param {number} options.width Canvas width in pixels.
 * @param {number} options.height Canvas height in pixels.
 * @param {number} options.startX Click X coordinate.
 * @param {number} options.startY Click Y coordinate.
 * @param {[number, number, number, number?]} options.fillColor RGBA target fill color.
 * @param {Uint8ClampedArray|null} [options.templateData] Optional template overlay outline data.
 * @param {number} [options.tolerance] Color difference tolerance (default 70).
 * @returns {boolean} True if any pixels were filled, false otherwise.
 */
export function floodFill({
    data,
    width,
    height,
    startX,
    startY,
    fillColor,
    templateData = null,
    tolerance = 70
}) {
    if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
        return false;
    }

    const startPos = startY * width + startX;
    const startIdx = startPos * 4;

    // If template outline is clicked directly, don't fill from the boundary itself
    if (templateData && templateData[startIdx + 3] > 64) {
        return false;
    }

    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];
    const targetA = data[startIdx + 3];

    const [fillR, fillG, fillB, fillA = 255] = fillColor;

    // If target color is already identical or very close to fill color, do nothing
    const initialDiff =
        Math.abs(targetR - fillR) +
        Math.abs(targetG - fillG) +
        Math.abs(targetB - fillB) +
        Math.abs(targetA - fillA);
    if (initialDiff <= 10) {
        return false;
    }

    const totalPixels = width * height;
    const visited = new Uint8Array(totalPixels);
    const stack = new Int32Array(totalPixels);
    let stackPtr = 0;

    visited[startPos] = 1;
    stack[stackPtr++] = startPos;

    const matchesTarget = (idx) => {
        // If template outline is present at this pixel, it acts as a boundary
        if (templateData && templateData[idx + 3] > 64) {
            return false;
        }

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        const diff =
            Math.abs(r - targetR) +
            Math.abs(g - targetG) +
            Math.abs(b - targetB) +
            Math.abs(a - targetA);

        return diff <= tolerance;
    };

    let filledCount = 0;

    while (stackPtr > 0) {
        const pos = stack[--stackPtr];
        const x = pos % width;
        const y = (pos / width) | 0;
        const idx = pos * 4;

        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = fillA;
        filledCount++;

        // Up
        if (y > 0) {
            const up = pos - width;
            if (!visited[up] && matchesTarget(up * 4)) {
                visited[up] = 1;
                stack[stackPtr++] = up;
            }
        }
        // Down
        if (y < height - 1) {
            const down = pos + width;
            if (!visited[down] && matchesTarget(down * 4)) {
                visited[down] = 1;
                stack[stackPtr++] = down;
            }
        }
        // Left
        if (x > 0) {
            const left = pos - 1;
            if (!visited[left] && matchesTarget(left * 4)) {
                visited[left] = 1;
                stack[stackPtr++] = left;
            }
        }
        // Right
        if (x < width - 1) {
            const right = pos + 1;
            if (!visited[right] && matchesTarget(right * 4)) {
                visited[right] = 1;
                stack[stackPtr++] = right;
            }
        }
    }

    return filledCount > 0;
}
