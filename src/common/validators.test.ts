import { isEmoji } from "./validators";
import { describe, expect, it, test } from "vitest";

describe("should", () => {
  it("exported", () => {
    expect(isEmoji("👍")).toBe(true);

    const emojiList = [
      "👍",
      "👎",
      "😄",
      "😕",
      "❤️",
      "🤔",
      "🤣",
      "🌿",
      "🍋",
      "🕊",
    ];

    test.each(emojiList)("", (emoji) => {
      expect(isEmoji(emoji)).toBe(true);
    });

    const invalidEmojiList = ["1", "a", "#", "@", '"'];

    test.each(invalidEmojiList)("", (emoji) => {
      expect(isEmoji(emoji)).toBe(false);
    });
  });
});
