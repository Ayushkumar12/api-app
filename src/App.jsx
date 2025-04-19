import { useState } from "react";
import ApiKeyGenerator from "./comp/ApiKeyGenerator";
import Acessdata from "./comp/Acessdata";
import AddNews from "./comp/AddNews";

function App() {
  

  return (
    <div>
      <AddNews/>
      <Acessdata/>
      <ApiKeyGenerator/>
    </div>
  );
}

export default App;
