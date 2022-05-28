import { isEmoji, isGroupName, isUsername } from "./validators";
import { describe, expect, it, test } from "vitest";

describe("isUsername", () => {
  it("valid username", () => {
    const usernameList = [
      "Dup4",
      "Dup4_",
      "Dup4-",
      "Dup4.",
      "Dup4_#",
      "Dup4_$",
    ];

    test.each(usernameList)("%s", (username) => {
      expect(isUsername(username)).toBe(true);
    });
  });

  it("invalid username", () => {
    const usernameList = [
      "@@@",
      "D",
      "u",
      "DD",
      "Dup4Dup4Dup4Dup4Dup4Dup4a",
      "##",
    ];

    test.each(usernameList)("%s", (username) => {
      expect(isUsername(username)).toBe(false);
    });
  });
});

describe("isGroupName", () => {
  it("valid group name", () => {
    const groupNameList = ["D", ":", "@", "~", "-", ".", "#", "$", "/", "Dup4"];

    test.each(groupNameList)("%s", (groupName) => {
      expect(isGroupName(groupName)).toBe(true);
    });
  });

  it("invalid group name", () => {
    const groupNameList = [
      "%",
      "Dup4Dup4Dup4Dup4Dup4Dup4Dup4Dup4Dup4Dup4Dup4Dup4D",
    ];

    test.each(groupNameList)("%s", (groupName) => {
      expect(isGroupName(groupName)).toBe(false);
    });
  });
});

describe("isEmoji", () => {
  it("valid emoji", () => {
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
  });

  it("invalid emoji", () => {
    const invalidEmojiList = ["1", "a", "#", "@", '"'];

    test.each(invalidEmojiList)("", (emoji) => {
      expect(isEmoji(emoji)).toBe(false);
    });
  });
});
