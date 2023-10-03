import fs from "fs";

function main() {
  const lines = fs.readFileSync("./pokemons.tsv", "utf8");

  const output = {
    pokemons_gen6: [],
    pokemons_gen7: [],
    pokemons_gen8: [],
    pokemons_gen9: [],
  };

  function consumeLine(line) {
    const [id, name, gen6, gen7, gen8, gen9, legendary, mythical] =
      line.split("\t");
    const pokemon = {
      id: parseInt(id),
      is_mythical: mythical === "TRUE",
      is_legendary: legendary === "TRUE",
      name_ja: name,
    };
    if (gen6 === "TRUE") {
      output.pokemons_gen6.push(pokemon);
    }
    if (gen7 === "TRUE") {
      output.pokemons_gen7.push(pokemon);
    }
    if (gen8 === "TRUE") {
      output.pokemons_gen8.push(pokemon);
    }
    if (gen9 === "TRUE") {
      output.pokemons_gen9.push(pokemon);
    }
  }

  lines.split("\n").slice(1).forEach(consumeLine);

  console.log(JSON.stringify(output, null, 2));
}

main();
