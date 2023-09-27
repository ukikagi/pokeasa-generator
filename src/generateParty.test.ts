import { generateParty } from "./generateParty";

it("Generates party end-to-end", () => {
  expect(
    generateParty("ミノモンタノアサズバッ", {
      useOnlyPrefix: true,
      numPokemon: 6,
      allowLegendary: true,
      allowMythical: true,
      pokemonPool: "pokemons_gen6",
    })
  ).not.toEqual([]);
  expect(
    generateParty("チーズツキミバーガー", {
      useOnlyPrefix: false,
      numPokemon: 6,
      allowLegendary: true,
      allowMythical: true,
      pokemonPool: "pokemons_gen6",
    })
  ).not.toEqual([]);
});
