import { useState } from "react";
import "./App.css";
import { generateParty, Party } from "./generateParty";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { PartyTables } from "./PartyTables";
import Markdown from "react-markdown";

const README = `
# 朝ズバ系構築ジェネレーター

## これはなに？
- 👉 [けだまメモchウィキ > 用語集 > 朝ズバッ！](https://wikiwiki.jp/kedamamemo/%E7%94%A8%E8%AA%9E%E9%9B%86#ua07c323)
- ポケモン名の一部を繋げて語呂合わせをする、通称「朝ズバ系構築」を生成するツールです

## 使い方
- 語呂合わせにしたいフレーズを入力して「生成」を押すと、フレーズの分割と対応するポケモンの例が表示されます
- 接頭辞のみ：ポケモン名の一部を取るときに、頭の部分だけを使用します。
  - 例：フシギダネ → フシギ はOK、フシギダネ → ダネ はNG

## 既知の問題
- SVはPokémon HOME連携および碧の仮面で追加されたポケモン未対応です
- 入力によってはパーティ案の個数が膨大になりブラウザーが固まることがあります
  - 例：パーティー名 = "ぎぎぎぎぎぎぎぎぎぎぎぎ" など
`;

function isValidNumPokemon(s: string): boolean {
  const n = parseInt(s, 10);
  return 2 <= n && n <= 12;
}

function App() {
  const [partyName, setPartyName] = useState("みのもんたのあさずばっ");
  const [useOnlyPrefix, setUseOnlyPrefix] = useState(true);
  const [numPokemonStr, setNumPokemonStr] = useState("6");
  const [pokemonPool, setPokemonPool] = useState("pokemons_gen6");
  const [allowLegendary, setAllowLegendary] = useState(false);
  const [allowMythical, setAllowMythical] = useState(false);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const numPokemon = parseInt(numPokemonStr);

  const genParties = () =>
    generateParty(partyName, {
      numPokemon,
      useOnlyPrefix,
      allowLegendary,
      allowMythical,
      pokemonPool: pokemonPool as any,
      allowDuplicate,
    });
  const [parties, setParties] = useState<Array<Party>>(genParties());

  return (
    <Container className="App" sx={{ margin: 3 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <TextField
            label="パーティー名"
            variant="outlined"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
          />
          <FormGroup row sx={{ alignItems: "center", gap: 1 }}>
            {/* TODO: Make this non ad-hoc */}
            <Box>使用ポケモン</Box>
            <Select
              value={pokemonPool}
              onChange={(e: SelectChangeEvent) => {
                setPokemonPool(e.target.value);
              }}
              sx={{ m: 1, minWidth: 180 }}
            >
              <MenuItem value={"pokemons_gen6"}>XY/ORAS</MenuItem>
              <MenuItem value={"pokemons_gen7"}>SM/USUM</MenuItem>
              <MenuItem value={"pokemons_gen8"}>SwSh</MenuItem>
              <MenuItem value={"pokemons_gen9"}>SV (一部未対応)</MenuItem>
            </Select>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allowLegendary}
                  onChange={(e) => setAllowLegendary(e.target.checked)}
                />
              }
              label="伝説あり"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={allowMythical}
                  onChange={(e) => setAllowMythical(e.target.checked)}
                />
              }
              label="幻あり"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={useOnlyPrefix}
                  onChange={(e) => setUseOnlyPrefix(e.target.checked)}
                />
              }
              label="接頭辞のみ"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={allowDuplicate}
                  onChange={(e) => setAllowDuplicate(e.target.checked)}
                />
              }
              label="重複あり"
            />
            <TextField
              label="ポケモンの数"
              variant="outlined"
              value={numPokemonStr}
              onChange={(e) => setNumPokemonStr(e.target.value)}
              error={!isValidNumPokemon(numPokemonStr)}
              helperText={
                isValidNumPokemon(numPokemonStr)
                  ? ""
                  : "2以上12以下の整数を入力してください"
              }
            />
          </FormGroup>
          <Button
            variant="contained"
            onClick={() => {
              if (!isValidNumPokemon(numPokemonStr)) {
                return;
              }
              setParties(genParties());
            }}
          >
            生成
          </Button>
        </Stack>
        <PartyTables parties={parties} />
        <Markdown className="ReadMe">{README}</Markdown>
      </Stack>
    </Container>
  );
}

export default App;
