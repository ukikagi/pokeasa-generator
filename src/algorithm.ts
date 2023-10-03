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

class Bipmatch {
  readonly size: number;
  readonly edges: Array<Array<number>>;

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

class IdMapper<T> {
  #from_id: Array<T>;
  #to_id: Map<T, number>;

  constructor() {
    this.#from_id = [];
    this.#to_id = new Map<T, number>();
  }

  id(x: T): number {
    if (!this.#to_id.has(x)) {
      this.#to_id.set(x, this.#from_id.length);
      this.#from_id.push(x);
    }
    return this.#to_id.get(x)!;
  }

  get(id: number): T {
    return this.#from_id[id];
  }

  size(): number {
    return this.#from_id.length;
  }
}

export function selectDistinct<T>(arrs: Array<Array<T>>): Array<T> | null {
  const mapper = new IdMapper<T>();
  for (const arr of arrs) {
    for (const x of arr) {
      mapper.id(x);
    }
  }

  const n = arrs.length;
  const m = mapper.size();

  const bip = new Bipmatch(n + m);
  for (let i = 0; i < n; i++) {
    for (const x of arrs[i]) {
      bip.addEdge(i, n + mapper.id(x));
    }
  }
  const [count, match] = bip.count_match();
  if (count < n) {
    return null;
  } else {
    return match.slice(0, n).map((i) => mapper.get(i - n));
  }
}
