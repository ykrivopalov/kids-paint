import test from 'node:test';
import assert from 'node:assert/strict';
import { hexToRgba, hslToRgb, floodFill } from '../src/utils/floodFill.js';

test('hexToRgba converts hex colors correctly', () => {
    assert.deepEqual(hexToRgba('#FF0000'), [255, 0, 0, 255]);
    assert.deepEqual(hexToRgba('#00FF00'), [0, 255, 0, 255]);
    assert.deepEqual(hexToRgba('#0000FF'), [0, 0, 255, 255]);
    assert.deepEqual(hexToRgba('#FFFFFF'), [255, 255, 255, 255]);
    assert.deepEqual(hexToRgba('#000000'), [0, 0, 0, 255]);
    assert.deepEqual(hexToRgba('#f00'), [255, 0, 0, 255]);
    assert.deepEqual(hexToRgba('invalid'), [0, 0, 0, 255]);
    assert.deepEqual(hexToRgba(null), [0, 0, 0, 255]);
});

test('hslToRgb converts HSL colors to RGBA correctly', () => {
    // Red (0 deg)
    assert.deepEqual(hslToRgb(0, 1, 0.5), [255, 0, 0, 255]);
    // Green (120 deg)
    assert.deepEqual(hslToRgb(120, 1, 0.5), [0, 255, 0, 255]);
    // Blue (240 deg)
    assert.deepEqual(hslToRgb(240, 1, 0.5), [0, 0, 255, 255]);
    // Wraps degrees around 360
    assert.deepEqual(hslToRgb(360, 1, 0.5), [255, 0, 0, 255]);
    assert.deepEqual(hslToRgb(720, 1, 0.5), [255, 0, 0, 255]);
});

test('floodFill fills an enclosed rectangular region without leaking', () => {
    const W = 20;
    const H = 20;
    const data = new Uint8ClampedArray(W * H * 4);
    data.fill(255); // initialize white canvas

    // Draw a black boundary box from (5,5) to (15,15)
    for (let x = 5; x <= 15; x++) {
        // top and bottom walls
        const topIdx = (5 * W + x) * 4;
        const bottomIdx = (15 * W + x) * 4;
        data[topIdx] = 0; data[topIdx + 1] = 0; data[topIdx + 2] = 0;
        data[bottomIdx] = 0; data[bottomIdx + 1] = 0; data[bottomIdx + 2] = 0;
    }
    for (let y = 5; y <= 15; y++) {
        // left and right walls
        const leftIdx = (y * W + 5) * 4;
        const rightIdx = (y * W + 15) * 4;
        data[leftIdx] = 0; data[leftIdx + 1] = 0; data[leftIdx + 2] = 0;
        data[rightIdx] = 0; data[rightIdx + 1] = 0; data[rightIdx + 2] = 0;
    }

    // Fill inside the box at (10, 10) with Blue [0, 0, 255, 255]
    const result = floodFill({
        data,
        width: W,
        height: H,
        startX: 10,
        startY: 10,
        fillColor: [0, 0, 255, 255]
    });

    assert.equal(result, true);

    // Verify inside is Blue
    const insideIdx = (10 * W + 10) * 4;
    assert.equal(data[insideIdx], 0);
    assert.equal(data[insideIdx + 1], 0);
    assert.equal(data[insideIdx + 2], 255);

    // Verify walls are still Black
    const wallIdx = (5 * W + 5) * 4;
    assert.equal(data[wallIdx], 0);
    assert.equal(data[wallIdx + 1], 0);
    assert.equal(data[wallIdx + 2], 0);

    // Verify outside is still White
    const outsideIdx = (2 * W + 2) * 4;
    assert.equal(data[outsideIdx], 255);
    assert.equal(data[outsideIdx + 1], 255);
    assert.equal(data[outsideIdx + 2], 255);
});

test('floodFill respects template overlay outlines as boundaries', () => {
    const W = 20;
    const H = 20;
    const data = new Uint8ClampedArray(W * H * 4);
    data.fill(255); // White canvas

    const templateData = new Uint8ClampedArray(W * H * 4);
    templateData.fill(0); // Transparent overlay

    // Draw a template outline dividing canvas into left and right at x = 10
    for (let y = 0; y < H; y++) {
        const idx = (y * W + 10) * 4;
        templateData[idx] = 0;
        templateData[idx + 1] = 0;
        templateData[idx + 2] = 0;
        templateData[idx + 3] = 255; // Solid black template stroke
    }

    // Fill the left side at (5, 5) with Green
    const result = floodFill({
        data,
        width: W,
        height: H,
        startX: 5,
        startY: 5,
        fillColor: [0, 255, 0, 255],
        templateData
    });

    assert.equal(result, true);

    // Left side should be Green
    const leftIdx = (5 * W + 5) * 4;
    assert.equal(data[leftIdx], 0);
    assert.equal(data[leftIdx + 1], 255);
    assert.equal(data[leftIdx + 2], 0);

    // Right side should remain White because template line blocked it
    const rightIdx = (5 * W + 15) * 4;
    assert.equal(data[rightIdx], 255);
    assert.equal(data[rightIdx + 1], 255);
    assert.equal(data[rightIdx + 2], 255);
});

test('floodFill returns false when clicking on template boundary stroke', () => {
    const W = 10;
    const H = 10;
    const data = new Uint8ClampedArray(W * H * 4);
    data.fill(255);

    const templateData = new Uint8ClampedArray(W * H * 4);
    const strokeIdx = (5 * W + 5) * 4;
    templateData[strokeIdx + 3] = 255; // Template line at (5, 5)

    const result = floodFill({
        data,
        width: W,
        height: H,
        startX: 5,
        startY: 5,
        fillColor: [255, 0, 0, 255],
        templateData
    });

    assert.equal(result, false);
});

test('floodFill returns false when clicking an area already matching fill color', () => {
    const W = 10;
    const H = 10;
    const data = new Uint8ClampedArray(W * H * 4);
    data.fill(255); // Canvas is white

    // Attempting to fill with white should early return false
    const result = floodFill({
        data,
        width: W,
        height: H,
        startX: 5,
        startY: 5,
        fillColor: [255, 255, 255, 255]
    });

    assert.equal(result, false);
});

test('floodFill handles out of bounds coordinates gracefully', () => {
    const W = 10;
    const H = 10;
    const data = new Uint8ClampedArray(W * H * 4);
    data.fill(255);

    assert.equal(floodFill({ data, width: W, height: H, startX: -1, startY: 5, fillColor: [255, 0, 0, 255] }), false);
    assert.equal(floodFill({ data, width: W, height: H, startX: 10, startY: 5, fillColor: [255, 0, 0, 255] }), false);
    assert.equal(floodFill({ data, width: W, height: H, startX: 5, startY: -1, fillColor: [255, 0, 0, 255] }), false);
    assert.equal(floodFill({ data, width: W, height: H, startX: 5, startY: 10, fillColor: [255, 0, 0, 255] }), false);
});
