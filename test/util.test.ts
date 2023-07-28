import { describe, expect, it } from "vitest";
import { isEmpty, isInvalidNumber } from "../src/helpers/util";

describe('isEmpty util function', () => {
    it('should return true for empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });
  
    it('should return false for non-empty values', () => {
      expect(isEmpty(42)).toBe(false);
      expect(isEmpty('Hello')).toBe(false);
    });
});

describe('isInvalidNumber util function', () => {
    it('should return false for valid numbers', () => {
      expect(isInvalidNumber(42)).toBe(false);
      expect(isInvalidNumber(-3.14)).toBe(false);
      expect(isInvalidNumber(0)).toBe(false);
    });

    it('should return true for invalid numbers', () => {
      expect(isInvalidNumber('42')).toBe(true);
      expect(isInvalidNumber(NaN)).toBe(true);
      expect(isInvalidNumber(null)).toBe(true);
      expect(isInvalidNumber(undefined)).toBe(true);
      expect(isInvalidNumber({})).toBe(true);
    });
});