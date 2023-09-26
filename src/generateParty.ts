import pokemon_json from "./pokemon.json";
import { splitInput } from "./algorithm";
import { toKatakana } from "wanakana";

interface Config {
  numPokemon: number;
  useOnlyPrefix: boolean;
  allowLegendary: boolean;
  generationIds: Set<number>;
}

interface Pokemon {
  id: number;
  is_mythical: boolean;
  is_legendary: boolean;
  generation_id: number;
  pokemon_v2_pokemonspeciesnames: Array<{ name: string }>;
}

export type Party = Array<[string, Array<string>]>;

export function shouldExclude(slice: string): boolean {
  return false;
}

export function createVocab(
  pokemons: Array<Pokemon>,
  config: Config
): Map<string, Array<string>> {
  const vocab: Map<string, Array<string>> = new Map();

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
    if (!config.generationIds.has(pokemon.generation_id)) {
      continue;
    }
    if (
      !config.allowLegendary &&
      (pokemon.is_legendary || pokemon.is_mythical)
    ) {
      continue;
    }

    const pokeName = pokemon.pokemon_v2_pokemonspeciesnames[0].name;

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
  const vocab = createVocab(pokemon_json.data.pokemon, config);
  const splits = splitInput(input, config.numPokemon, new Set(vocab.keys()));
  return splits.map((split) => split.map((x) => [x, vocab.get(x) ?? []]));
}
