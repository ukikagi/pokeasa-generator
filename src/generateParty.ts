import pokemon from "./pokemon.json";

function range(n: number): Array<number> {
  return Array.from({ length: n }, (_, k) => k);
}

export function shouldExclude(slice: string): boolean {
  // TODO: Implement this
  return false;
}

export function createVocab(
  pokeNames: Array<string>,
  minLength: number,
  onlyPrefix: boolean
): Record<string, Array<string>> {
  const vocab: Record<string, Array<string>> = {};
  for (const pokeName of pokeNames) {
    const maxLeft = onlyPrefix ? 0 : pokeName.length;
    for (let i = 0; i <= maxLeft; i++) {
      for (let j = i + minLength; j <= pokeName.length; j++) {
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
  return vocab;
}

export function splitInput(
  input: string,
  numToken: number,
  vocab: Set<string>
): Array<string> | null {
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
    return null;
  }

  // Reconstruct a split
  // TODO: Make it return multiple splits
  let result: Array<string> = [];
  let r = length;
  for (let j = numToken - 1; j >= 0; j--) {
    for (let l = r - 1; l >= 0; l--) {
      if (possible[l][j]) {
        result.unshift(input.slice(l, r));
        r = l;
        break;
      }
    }
  }
  return result;
}

export function generateParty(
  input: string,
  minTokenLength: number,
  useOnlyPrefix: boolean,
  maxExamples: number,
  numPokemon: number
): Array<[string, Array<string>]> | null {
  const vocab = createVocab(pokemon, minTokenLength, useOnlyPrefix);
  const split = splitInput(input, numPokemon, new Set(Object.keys(vocab)));
  if (split === null) {
    return null;
  }
  return split.map((x) => [x, vocab[x].slice(0, maxExamples)]);
}
