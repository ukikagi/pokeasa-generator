import React, { useState } from "react";
import "./App.css";
import { generateParty } from "./generateParty";

interface ResultProp {
  result: Array<[string, Array<string>]> | null;
}

const Result = ({ result }: ResultProp) => {
  if (result === null) {
    return <div>生成できませんでした</div>;
  }
  let ls = [];
  for (const idx in result) {
    const [split, examples] = result[idx];
    ls.push(
      <div key={idx}>
        {split} =&gt; {JSON.stringify(examples)}{" "}
      </div>
    );
  }
  return <>{ls}</>;
};

function App() {
  const [partyName, setPartyName] = useState("");
  const [useOnlyPrefix, setUseOnlyPrefix] = useState(false);
  const [result, setResult] = useState<Array<[string, Array<string>]> | null>([]);
  const handleClick = () => {
    setResult(generateParty(partyName, 1, useOnlyPrefix, 3, 6));
  };

  return (
    <div className="App">
      <label>
        パーティー名:{" "}
        <input
          type="text"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
        />
      </label>
      <hr />
      <label>
        接頭辞のみを使う:{" "}
        <input
          type="checkbox"
          checked={useOnlyPrefix}
          onChange={(e) => setUseOnlyPrefix(e.target.checked)}
        />
      </label>
      <hr />
      <button onClick={handleClick}>生成</button>
      <hr />
      <Result result={result} />
    </div>
  );
}

export default App;
