import pokemon_json from "./pokemon.json";
import { splitInput } from "./algorithm";
import { toKatakana } from "wanakana";

interface Config {
  numPokemon: number;
  useOnlyPrefix: boolean;
  allowLegendary: boolean;
  allowMythical: boolean;
  pokemonPool:
    | "pokemons_gen6"
    | "pokemons_gen7"
    | "pokemons_gen8"
    | "pokemons_gen9";
}

interface Pokemon {
  id: number;
  is_mythical: boolean;
  is_legendary: boolean;
  name_ja: string;
}

export type Party = Array<[string, Array<string>]>;

export function shouldExclude(_slice: string): boolean {
  return false;
}

export function createVocab(
  pokemons: Array<Pokemon>,
  config: Config
): Map<string, Array<string>> {
  const vocab = new Map<string, Array<string>>();

  function addPokemon(slice: string, pokeName: string) {
    if (shouldExclude(slice)) {
      return;
    }
    // TODO: Make this cleaner...
    if (!vocab.has(slice)) {
      vocab.set(slice, []);
    }
    if (!vocab.get(slice)?.includes(pokeName)) {
      vocab.get(slice)?.push(pokeName);
    }
  }

  for (const pokemon of pokemons) {
    if (
      (!config.allowLegendary && pokemon.is_legendary) ||
      (!config.allowMythical && pokemon.is_mythical)
    ) {
      continue;
    }

    const pokeName = pokemon.name_ja;

    for (let j = 1; j <= pokeName.length; j++) {
      addPokemon(pokeName.slice(0, j), pokeName);
    }
    if (config.useOnlyPrefix) {
      continue;
    }
    for (let i = 1; i <= pokeName.length; i++) {
      for (let j = i + 2; j <= pokeName.length; j++) {
        addPokemon(pokeName.slice(i, j), pokeName);
      }
    }
  }

  return vocab;
}

export function generateParty(input: string, config: Config): Array<Party> {
  input = toKatakana(input);
  const vocab = createVocab(pokemon_json[config.pokemonPool] ?? [], config);
  const splits = splitInput(input, config.numPokemon, new Set(vocab.keys()));
  return splits.map((split) => split.map((x) => [x, vocab.get(x) ?? []]));
}
