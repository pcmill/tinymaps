import { describe, expect, it } from 'vitest';
import { Bounds } from '../src/code/Bounds';
import { LatLon } from '../src/code/LatLon';

describe('Bounds', () => {
  it('should create a Bounds object with valid top left and bottom right LatLon objects', () => {
    const topLeft = new LatLon(40.7128, -74.0060);
    const bottomRight = new LatLon(34.0522, -118.2437);
    const bounds = new Bounds(topLeft, bottomRight);

    expect(bounds.topLeft).toBe(topLeft);
    expect(bounds.bottomRight).toBe(bottomRight);
  });
});
