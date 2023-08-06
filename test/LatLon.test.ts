import { LatLon } from '../src/code/LatLon';
import { describe, expect, it } from 'vitest';

describe('LatLon', () => {
  it('should create a LatLon object with valid latitude and longitude', () => {
    const latitude = 40.7128;
    const longitude = -74.0060;
    const latLon = new LatLon(latitude, longitude);
    
    expect(latLon.latitude).toBe(latitude);
    expect(latLon.longitude).toBe(longitude);
  });

  it('should throw an error if latitude is below -90', () => {
    const latitude = -100;
    const longitude = 0;
    expect(() => new LatLon(latitude, longitude)).toThrowError("Latitude must be between -90 and 90");
  });

  it('should throw an error if latitude is above 90', () => {
    const latitude = 100;
    const longitude = 0;
    expect(() => new LatLon(latitude, longitude)).toThrowError("Latitude must be between -90 and 90");
  });

  it('should throw an error if longitude is below -180', () => {
    const latitude = 0;
    const longitude = -190;
    expect(() => new LatLon(latitude, longitude)).toThrowError("Longitude must be between -180 and 180");
  });

  it('should throw an error if longitude is above 180', () => {
    const latitude = 0;
    const longitude = 190;
    expect(() => new LatLon(latitude, longitude)).toThrowError("Longitude must be between -180 and 180");
  });

  it('should throw an error if latitude and longitude are not numbers', () => {
    const latitude = 'a';
    const longitude = 'b';
    // @ts-ignore
    expect(() => new LatLon(latitude, longitude)).toThrowError("Latitude and longitude must be numbers");
  });

  it('should throw an error if a value is missing', () => {
    const latitude = 'a';
    // @ts-ignore
    expect(() => new LatLon(latitude, undefined)).toThrowError("Latitude and longitude must be provided");
  });
});