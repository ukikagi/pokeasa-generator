import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Party } from "./generateParty";

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

export const PartyTables = ({ parties }: { parties: Array<Party> }) => {
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
