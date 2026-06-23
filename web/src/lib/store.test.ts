import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "@/lib/store";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({ filter: "all", available: true, profileEdits: {} });
  });

  it("has sensible defaults", () => {
    const s = useUIStore.getState();
    expect(s.filter).toBe("all");
    expect(s.available).toBe(true);
  });

  it("setFilter updates the active filter", () => {
    useUIStore.getState().setFilter("automation");
    expect(useUIStore.getState().filter).toBe("automation");
  });

  it("toggleAvailable flips availability", () => {
    useUIStore.getState().toggleAvailable();
    expect(useUIStore.getState().available).toBe(false);
    useUIStore.getState().toggleAvailable();
    expect(useUIStore.getState().available).toBe(true);
  });

  it("setProfileEdits merges partial profile edits", () => {
    useUIStore.getState().setProfileEdits({ name: "Asha K" });
    expect(useUIStore.getState().profileEdits.name).toBe("Asha K");
    useUIStore.getState().setProfileEdits({ title: "Staff Engineer" });
    expect(useUIStore.getState().profileEdits).toEqual({
      name: "Asha K",
      title: "Staff Engineer",
    });
  });
});
