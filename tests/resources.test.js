import { describe, it, expect } from "vitest";
import {
  resourceCategories,
  resourceHref,
  countResources,
  countByCategory,
  getCategory,
} from "../lib/resources.js";

describe("resource directory", () => {
  it("has six categories and a verifiable total", () => {
    expect(resourceCategories).toHaveLength(6);
    expect(countResources()).toBeGreaterThan(80);
    expect(countResources()).toBe(
      resourceCategories.reduce((sum, category) => sum + category.resources.length, 0),
    );
  });

  it("exposes a count for every category used on the homepage", () => {
    const counts = countByCategory();
    for (const id of ["payments", "ai-tools", "freelancing", "hosting", "business", "students"]) {
      expect(counts[id]).toBeGreaterThan(0);
    }
  });

  it("gives every resource a name, badge and why-Nepal line", () => {
    for (const category of resourceCategories) {
      for (const resource of category.resources) {
        expect(resource.name).toBeTruthy();
        expect(resource.badge).toBeTruthy();
        expect(resource.badge).not.toBe("ℹ");
        expect(resource.why).toBeTruthy();
      }
    }
  });

  it("does not leave money and hosting picks without a URL", () => {
    const payments = getCategory("payments");
    const hosting = getCategory("hosting");
    for (const resource of [...payments.resources, ...hosting.resources]) {
      expect(resourceHref(resource) || resource.env).toBeTruthy();
    }
  });

  it("prefers an affiliate env URL when one is set", () => {
    const previous = process.env.NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL;
    process.env.NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL = "https://example.com/hostinger";
    expect(
      resourceHref({
        env: "NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL",
        url: "https://www.hostinger.com",
      }),
    ).toBe("https://example.com/hostinger");
    if (previous === undefined) delete process.env.NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL;
    else process.env.NEXT_PUBLIC_AFFILIATE_HOSTINGER_URL = previous;
  });
});
