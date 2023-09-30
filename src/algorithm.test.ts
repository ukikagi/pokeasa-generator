import { expect, test } from 'vitest'
import { splitInput } from "./algorithm";

test("Splits input into token sequences", () => {
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
