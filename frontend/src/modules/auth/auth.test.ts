import { describe, expect, test } from "@jest/globals";
import { verify } from "./auth";

describe("auth module", () => {
  test("verify", () => {
    expect(verify({ hasLogged: false, isTokenValid: false }, true)).toBe(true);
    expect(verify({ hasLogged: true, isTokenValid: false }, false)).toBe(false);
    expect(verify({ hasLogged: false, isTokenValid: true }, false)).toBe(false);
    expect(verify({ hasLogged: true, isTokenValid: true }, false)).toBe(true);
  });
});
