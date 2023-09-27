import React, { useState } from "react";
import "./App.css";
import { generateParty, Party } from "./generateParty";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";

const Examples = ({ pokemons }: { pokemons: Array<string> }) => {
  const MAX_LENGTH = 5;
  if (pokemons.length > MAX_LENGTH) {
    return (
      <Stack direction="row" alignItems="flex-end" spacing={1}>
        {pokemons.slice(0, MAX_LENGTH).map((pokemon, idx) => (
          <Chip key={idx} label={pokemon} />
        ))}
        <Box>など</Box>
      </Stack>
    );
  } else {
    return (
      <Stack direction="row" alignItems="flex-end" spacing={1}>
        {pokemons.map((pokemon, idx) => (
          <Chip key={idx} label={pokemon} />
        ))}
      </Stack>
    );
  }
};

const PartyCard = ({ party }: { party: Party }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableBody>
        {party.map(([span, examples], idx) => (
          <TableRow key={idx}>
            <TableCell>{span}</TableCell>
            <TableCell>
              <Examples pokemons={examples} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const PartiesTable = ({ parties }: { parties: Array<Party> }) => {
  if (parties.length === 0) {
    return <Box>分割が存在しません</Box>;
  } else {
    return (
      <Stack spacing={2}>
        {parties.map((party, idx) => (
          <PartyCard key={idx} party={party} />
        ))}
      </Stack>
    );
  }
};

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

  const numPokemon = parseInt(numPokemonStr);
  const [parties, setParties] = useState<Array<Party>>(
    generateParty(partyName, {
      numPokemon,
      useOnlyPrefix,
      allowLegendary,
      allowMythical,
      pokemonPool: pokemonPool as any,
    })
  );

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
            <Box>使用ポケモン</Box>
            <Select
              value={pokemonPool}
              label="使用ポケモン"
              onChange={(e: SelectChangeEvent) => {
                setPokemonPool(e.target.value);
              }}
            >
              <MenuItem value={"pokemons_gen6"}>XY/ORAS</MenuItem>
              <MenuItem value={"pokemons_gen7"}>SM/USUM</MenuItem>
              <MenuItem value={"pokemons_gen8"}>SwSh</MenuItem>
              <MenuItem value={"pokemons_gen9"}>SV</MenuItem>
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
              setParties(
                generateParty(partyName, {
                  numPokemon,
                  useOnlyPrefix,
                  allowLegendary,
                  allowMythical,
                  pokemonPool: pokemonPool as any,
                })
              );
            }}
          >
            生成
          </Button>
        </Stack>
        <PartiesTable parties={parties} />
      </Stack>
    </Container>
  );
}

export default App;
