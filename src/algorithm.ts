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
      possible[i][j] = Array.from({ length: i }, (_, k) => k).some(
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
