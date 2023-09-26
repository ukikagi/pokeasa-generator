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
  Paper,
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
  const [numPokemon, setNumPokemon] = useState("6");
  const [parties, setParties] = useState<Array<Party>>(
    generateParty(partyName, {
      numPokemon: parseInt(numPokemon),
      useOnlyPrefix,
      allowLegendary: true,
      generationIds: new Set([1, 2, 3, 4, 5, 6]),
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
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useOnlyPrefix}
                  onChange={(e) => setUseOnlyPrefix(e.target.checked)}
                />
              }
              label="接頭辞のみを使う"
            />
            <TextField
              label="ポケモンの数"
              variant="outlined"
              value={numPokemon}
              onChange={(e) => setNumPokemon(e.target.value)}
              error={!isValidNumPokemon(numPokemon)}
              helperText={
                isValidNumPokemon(numPokemon)
                  ? ""
                  : "2以上12以下の整数を入力してください"
              }
            />
          </FormGroup>
          <Button
            variant="contained"
            onClick={() => {
              if (!isValidNumPokemon(numPokemon)) {
                return;
              }
              setParties(
                generateParty(partyName, {
                  numPokemon: parseInt(numPokemon),
                  useOnlyPrefix,
                  allowLegendary: true,
                  generationIds: new Set([1, 2, 3, 4, 5, 6]),
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
