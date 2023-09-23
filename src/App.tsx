import React, { useState } from "react";
import "./App.css";
import { generateParty, Result } from "./generateParty";

interface ResultProp {
  results: Array<Result> | null;
}

const Results = ({ results }: ResultProp) => {
  if (results === null) {
    return null;
  }
  if (results.length === 0) {
    return <div>分割が存在しません</div>;
  }
  let ls = [];
  for (const result of results) {
    for (const idx in result) {
      const [split, examples] = result[idx];
      ls.push(
        <div key={idx}>
          {split} =&gt; {JSON.stringify(examples)}
        </div>
      );
    }
    ls.push(<hr />);
  }
  return <>{ls}</>;
};

function App() {
  const [partyName, setPartyName] = useState("");
  const [useOnlyPrefix, setUseOnlyPrefix] = useState(false);
  const [parties, setParties] = useState<Array<Result> | null>(null);
  const handleClick = () => {
    setParties(generateParty(partyName, useOnlyPrefix, 6));
  };

  return (
    <div className="App">
      <label>
        パーティー名:
        <input
          type="text"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
        />
      </label>
      <hr />
      <label>
        ポケモンの数:
        <input
          type="checkbox"
          checked={useOnlyPrefix}
          onChange={(e) => setUseOnlyPrefix(e.target.checked)}
        />
      </label>
      <label>
        接頭辞のみを使う:
        <input
          type="checkbox"
          checked={useOnlyPrefix}
          onChange={(e) => setUseOnlyPrefix(e.target.checked)}
        />
      </label>
      <hr />
      <button onClick={handleClick}>生成</button>
      <hr />
      <Results results={parties} />
    </div>
  );
}

export default App;
