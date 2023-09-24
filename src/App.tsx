import React, { useState } from "react";
import "./App.css";
import { generateParty, Party } from "./generateParty";
import {
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

const PartyCard = ({ party }: { party: Party }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {party.map(([span, examples], idx) => (
            <TableRow key={idx}>
              <TableCell>{span}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  {examples.map((example, idx) => (
                    <Chip key={idx} label={example} />
                  ))}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PartyTable = ({ parties }: { parties: Array<Party> }) => {
  if (parties.length === 0) {
    return <div>分割が存在しません</div>;
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
    generateParty(partyName, useOnlyPrefix, parseInt(numPokemon))
  );

  return (
    <Container className="App" sx={{ margin: 3 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <TextField
            id="outlined-basic"
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
              id="outlined-basic"
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
                generateParty(
                  partyName,
                  useOnlyPrefix,
                  parseInt(numPokemon, 10)
                )
              );
            }}
          >
            生成
          </Button>
        </Stack>
        <PartyTable parties={parties} />
      </Stack>
    </Container>
  );
}

export default App;
