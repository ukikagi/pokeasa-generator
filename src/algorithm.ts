export function tokenize(
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

class bipmatch {
  readonly size: number;
  edges: Array<Array<number>>;

  constructor(size: number) {
    this.size = size;
    this.edges = Array.from({ length: size }, () => []);
  }

  addEdge(u: number, v: number): void {
    this.edges[u].push(v);
    this.edges[v].push(u);
  }

  dfs(u: number, visited: Array<boolean>, match: Array<number>): boolean {
    if (visited[u]) {
      return false;
    }
    visited[u] = true;
    for (const v of this.edges[u]) {
      const w = match[v];
      if (w < 0 || this.dfs(w, visited, match)) {
        match[u] = v;
        match[v] = u;
        return true;
      }
    }
    return false;
  }

  count_match(): [number, Array<number>] {
    let count = 0;
    const match = Array.from({ length: this.size }, () => -1);
    for (let u = 0; u < this.size; u++) {
      if (match[u] < 0) {
        const visited = Array.from({ length: this.size }, () => false);
        if (this.dfs(u, visited, match)) {
          count++;
        }
      }
    }
    return [count, match];
  }
}

export function selectDistinct(
  n: number,
  m: number,
  arrs: Array<Array<number>>
): Array<number> | null {
  const bip = new bipmatch(n + m);
  for (let i = 0; i < n; i++) {
    for (const j of arrs[i]) {
      bip.addEdge(i, n + j);
    }
  }
  const [count, match] = bip.count_match();
  if (count < n) {
    return null;
  } else {
    return match.slice(0, n).map((x) => x - n);
  }
}
