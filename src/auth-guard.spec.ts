import { AuthGuard } from "./auth-guard.service";

describe("AuthGuardGuard", () => {
  it("should be defined", () => {
    expect(new AuthGuard()).toBeDefined();
  });
});
