import { expect, test } from "vitest";
import { selectDistinct, tokenize } from "./algorithm";

test("Splits input into token sequences", () => {
  expect(
    tokenize("あいうえお", 3, new Set(["あいう", "うえお", "あ", "い"]))
  ).toEqual([["あ", "い", "うえお"]]);

  expect(tokenize("あいうえお", 2, new Set(["あいう", "うえお"]))).toEqual([]);

  expect(
    tokenize("あいうえお", 3, new Set(["あ", "い", "う", "え", "お"]))
  ).toEqual([]);

  expect(
    tokenize("あいうえお", 5, new Set(["あ", "い", "う", "え", "お"]))
  ).toEqual([["あ", "い", "う", "え", "お"]]);
});

test("selectDistinct", () => {
  function check_solvable(arrs: Array<Array<number>>) {
    expect(selectDistinct(arrs)).toSatisfy((res: Array<number>) => {
      return (
        res !== null &&
        res.length === arrs.length &&
        res.every((x, i) => arrs[i].includes(x))
      );
    });
  }

  function check_unsolvable(arrs: Array<Array<number>>) {
    expect(selectDistinct(arrs)).toBeNull();
  }

  check_solvable([[0]]);
  check_solvable([
    [0, 1],
    [0, 1],
  ]);
  check_solvable([
    [0, 1],
    [1, 2],
    [0, 2],
  ]);

  check_unsolvable([[0], [0]]);
  check_unsolvable([
    [0, 1],
    [0, 1],
    [0, 1],
  ]);
  check_unsolvable([
    [0, 1],
    [1, 2],
    [0, 2],
    [0, 1],
  ]);
});
