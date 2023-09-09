import pokemon from "./pokemon.json";
import { toKatakana } from "wanakana";

export type Result = Array<[string, Array<string>]>;

function range(n: number): Array<number> {
  return Array.from({ length: n }, (_, k) => k);
}

export function shouldExclude(slice: string): boolean {
  return Boolean(slice.match(/^[ァィゥェォャュョ]/));
}

export function createVocab(
  pokeNames: Array<string>,
  onlyPrefix: boolean
): Record<string, Array<string>> {
  const vocab: Record<string, Array<string>> = {};
  for (const pokeName of pokeNames) {
    const maxLeft = onlyPrefix ? 0 : pokeName.length;
    for (let i = 0; i <= maxLeft; i++) {
      for (let j = i + 1; j <= pokeName.length; j++) {
        const slice = pokeName.slice(i, j);
        if (shouldExclude(slice)) {
          continue;
        }
        if (!(slice in vocab)) {
          vocab[slice] = [];
        }
        vocab[slice].push(pokeName);
      }
    }
  }
  for (const slice in vocab) {
    if (slice.length === 1 && vocab[slice].length > 5) {
      vocab[slice] = [slice + "のつくポケモン"];
    }
  }
  return vocab;
}

export function splitInput(
  input: string,
  numToken: number,
  vocab: Set<string>
): Array<Array<string>> {
  const length = input.length;

  // posible[i][j]: can construct input[:i] using j elems in vocab
  const possible: Array<Array<boolean>> = Array.from(
    { length: length + 1 },
    () => Array.from({ length: numToken + 1 }, () => false)
  );
  possible[0][0] = true;
  for (let j = 1; j <= numToken; j++) {
    for (let i = 0; i <= input.length; i++) {
      possible[i][j] = range(i).some(
        (k) => possible[k][j - 1] && vocab.has(input.slice(k, i))
      );
    }
  }

  if (!possible[length][numToken]) {
    return [];
  }

  // Reconstruct splits
  function reconstruct(r: number, k: number): Array<Array<string>> {
    if (r === 0 && k === 0) {
      return [[]];
    }
    const results = [];
    for (let l = r - 1; l >= 0; l--) {
      if (possible[l][k - 1] && vocab.has(input.slice(l, r))) {
        const splits = reconstruct(l, k - 1);
        for (const split of splits) {
          split.push(input.slice(l, r));
        }
        results.push(...splits);
      }
    }
    return results;
  }

  return reconstruct(length, numToken);
}

export function generateParty(
  input: string,
  useOnlyPrefix: boolean,
  numPokemon: number
): Array<Result> {
  input = toKatakana(input);
  const vocab = createVocab(pokemon, useOnlyPrefix);
  const splits = splitInput(input, numPokemon, new Set(Object.keys(vocab)));
  return splits.map((split) => split.map((x) => [x, vocab[x]]));
}
