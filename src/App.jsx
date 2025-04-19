import { useState } from "react";
import ApiKeyGenerator from "./comp/ApiKeyGenerator";

function App() {
  

  return (
    <div>
      <button onClick={fetchProtectedData}>Get Protected Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ApiKeyGenerator/>
    </div>
  );
}

export default App;
