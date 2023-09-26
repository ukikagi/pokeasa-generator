import { generateParty } from "./generateParty";

it("Generates party end-to-end", () => {
  expect(
    generateParty("ミノモンタノアサズバッ", {
      useOnlyPrefix: true,
      numPokemon: 6,
      allowLegendary: true,
      generationIds: new Set([1, 2, 3, 4, 5, 6]),
    })
  ).not.toEqual([]);
  expect(
    generateParty("チーズツキミバーガー", {
      useOnlyPrefix: false,
      numPokemon: 6,
      allowLegendary: true,
      generationIds: new Set([1, 2, 3, 4, 5, 6]),
    })
  ).not.toEqual([]);
});
