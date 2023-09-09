import { generateParty, splitInput } from "./generateParty";

it("Splits input into token sequences", () => {
  expect(
    splitInput("あいうえお", 3, new Set(["あいう", "うえお", "あ", "い"]))
  ).toEqual([["あ", "い", "うえお"]]);

  expect(splitInput("あいうえお", 2, new Set(["あいう", "うえお"]))).toEqual(
    []
  );

  expect(
    splitInput("あいうえお", 3, new Set(["あ", "い", "う", "え", "お"]))
  ).toEqual([]);

  expect(
    splitInput("あいうえお", 5, new Set(["あ", "い", "う", "え", "お"]))
  ).toEqual([["あ", "い", "う", "え", "お"]]);
});

it("Generates party end-to-end", () => {
  expect(generateParty("ミノモンタノアサズバッ", true, 6)).not.toEqual([]);
  expect(generateParty("チーズツキミバーガー", false, 6)).not.toEqual([]);
});
