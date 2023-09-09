import { generateParty, splitInput } from "./generateParty";

it("Splits input into token sequences", () => {
  expect(
    splitInput("あいうえお", 3, new Set(["あいう", "うえお", "あ", "い"]))
  ).toEqual(["あ", "い", "うえお"]);

  expect(splitInput("あいうえお", 2, new Set(["あいう", "うえお"]))).toBeNull();

  expect(
    splitInput("あいうえお", 3, new Set(["あ", "い", "う", "え", "お"]))
  ).toBeNull();

  expect(
    splitInput("あいうえお", 5, new Set(["あ", "い", "う", "え", "お"]))
  ).toEqual(["あ", "い", "う", "え", "お"]);
});

it("Generates party end-to-end", () => {
  expect(generateParty("ミノモンタノアサズバッ", 1, true, 3, 6)).not.toBeNull();
  expect(generateParty("チーズツキミバーガー", 1, false, 3, 6)).not.toBeNull();
});
