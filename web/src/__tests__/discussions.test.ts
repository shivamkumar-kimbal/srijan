import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "@/lib/store";

function reset() {
  useUIStore.setState({ discussions: {} });
}

describe("useUIStore · discussions", () => {
  beforeEach(reset);

  it("starts with no messages for an opportunity", () => {
    expect(useUIStore.getState().discussions[1]).toBeUndefined();
  });

  it("addMessage appends a message with a generated id and timestamp", () => {
    useUIStore.getState().addMessage(1, { author: "Asha", initials: "AS", text: "Scope?" });
    const msgs = useUIStore.getState().discussions[1];
    expect(msgs).toHaveLength(1);
    expect(msgs[0]).toMatchObject({ author: "Asha", initials: "AS", text: "Scope?" });
    expect(msgs[0].id).toBeTruthy();
    expect(Number.isNaN(Date.parse(msgs[0].at))).toBe(false);
  });

  it("keeps message order and isolates threads per opportunity", () => {
    useUIStore.getState().addMessage(1, { author: "A", initials: "A", text: "first" });
    useUIStore.getState().addMessage(1, { author: "B", initials: "B", text: "second" });
    useUIStore.getState().addMessage(2, { author: "C", initials: "C", text: "other" });

    expect(useUIStore.getState().discussions[1].map((m) => m.text)).toEqual([
      "first",
      "second",
    ]);
    expect(useUIStore.getState().discussions[2]).toHaveLength(1);
  });

  it("gives each message a distinct id", () => {
    useUIStore.getState().addMessage(5, { author: "A", initials: "A", text: "q1" });
    useUIStore.getState().addMessage(5, { author: "A", initials: "A", text: "q2" });
    const [a, b] = useUIStore.getState().discussions[5];
    expect(a.id).not.toBe(b.id);
  });
});
