/**
 * Copyright 2025 © BeeAI a Series of LF Projects, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssistantMessage } from "@/backend/message.js";

describe("Message.merge", () => {
  it("merges the other message's meta into meta", () => {
    const target = new AssistantMessage("a", { first: 1 });
    const other = new AssistantMessage("b", { second: 2, tempMessage: true });

    target.merge(other);

    expect(target.meta["first"]).toBe(1);
    expect(target.meta["second"]).toBe(2);
    expect(target.meta["tempMessage"]).toBe(true);
    expect(target.text).toBe("ab");
  });

  it("does not write meta onto the message itself", () => {
    const target = new AssistantMessage("a");

    target.merge(new AssistantMessage("b", { role: "user", content: "hijacked" }));

    expect(target.role).toBe("assistant");
    expect(target.text).toBe("ab");
    expect(Object.keys(target)).not.toContain("tempMessage");
  });

  it("keeps the meta of every chunk", () => {
    const merged = AssistantMessage.fromChunks([
      new AssistantMessage("x", { providerOne: true }, "id-1"),
      new AssistantMessage("y", { providerTwo: true }, "id-1"),
    ]);

    expect(merged.meta["providerOne"]).toBe(true);
    expect(merged.meta["providerTwo"]).toBe(true);
  });
});
