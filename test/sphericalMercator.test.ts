import { describe, expect, it } from 'vitest';
import { LatLon } from '../src/code/LatLon';
import { Point } from '../src/code/Point';
import { SphericalMercatorProjection } from '../src/code/projection/SphericalMercator';

describe('latlonToWorldCoordinates function', () => {
  it('should correctly project latitude and longitude', () => {
    const testCases = [
      {
        input: { latitude: 51.0, longitude: 5.0 },
        expected: { x: 6621293.72274016, y: 556597.4539663673 },
      },
      {
        input: { latitude: 54.16588, longitude: -4.48101 },
        expected: { x: 7201634.784411987, y: -498823.7514395664 },
      },
      {
        input: { latitude: -9.066, longitude: -78.58 },
        expected: { x: -1013460.4118, y: -8747485.5865 },
      },
    ];

    testCases.forEach((testCase, index) => {
      const { input, expected } = testCase;
      const projection = new SphericalMercatorProjection();
  
      it(`should correctly convert latitude and longitude to world coordinates (Test case ${index + 1})`, () => {
        const latLon = new LatLon(input.latitude, input.longitude);
        const result = projection.project(latLon);
  
        expect(result).toBeInstanceOf(Point);
        expect(result).not.toBeNull();
        expect(result?.x).toBeCloseTo(expected.x, 6); // Use toBeCloseTo for floating-point comparisons
        expect(result?.y).toBeCloseTo(expected.y, 6); // Use toBeCloseTo for floating-point comparisons
      });
    });
  });

  it('should correctly unproject points', () => {
    const testCases = [
      {
        input: { x: 6621293.72274016, y: 556597.4539663673 },
        expected: { latitude: 51.0, longitude: 5.0 },
      },
      {
        input: { x: 7201634.784411987, y: -498823.7514395664 },
        expected: { latitude: 54.16588, longitude: -4.48101 },
      },
      {
        input: { x: -1013460.4118, y: -8747485.5865 },
        expected: { latitude: -9.066, longitude: -78.58 },
      },
    ];

    testCases.forEach((testCase, index) => {
      const { input, expected } = testCase;
      const projection = new SphericalMercatorProjection();
  
      it(`should correctly convert point to latitude and longitude (Test case ${index + 1})`, () => {
        const point = new Point(input.x, input.y);
        const result = projection.unproject(point);
  
        expect(result).toBeInstanceOf(Point);
        expect(result).not.toBeNull();
        expect(result?.latitude).toBeCloseTo(expected.latitude, 6); // Use toBeCloseTo for floating-point comparisons
        expect(result?.longitude).toBeCloseTo(expected.latitude, 6); // Use toBeCloseTo for floating-point comparisons
      });
    });
  });
});