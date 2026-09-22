import { describe, it, expect } from "vitest";
import { sanitizeCmsField, cleanExcerpt, cleanBio, detectLanguage } from "../lib/seoUtils.js";

describe("sanitizeCmsField", () => {
  it("strips trailing slug leaks", () => {
    expect(sanitizeCmsField("My Great Article Slug: my-great-article")).toBe(
      "My Great Article",
    );
  });
});

describe("cleanExcerpt", () => {
  it("repairs the truncated Compare leak seen on the live homepage", () => {
    expect(
      cleanExcerpt(
        "mpare the real cost of three ways to receive USD payments in Nepal",
      ),
    ).toBe("Compare the real cost of three ways to receive USD payments in Nepal");
  });

  it("leaves a complete sentence alone", () => {
    expect(cleanExcerpt("Compare the real cost.")).toBe("Compare the real cost.");
  });
});

describe("cleanBio", () => {
  it("strips an international phone number from a public bio", () => {
    expect(cleanBio("Akash From Doha qatar +97433779585")).toBe(
      "Akash From Doha qatar",
    );
  });
});

describe("detectLanguage", () => {
  it("flags Devanagari as Nepali", () => {
    expect(detectLanguage("एपेक्स नेपाल")).toBe("ne");
  });

  it("defaults to English", () => {
    expect(detectLanguage("Apex Nepal")).toBe("en");
  });
});
