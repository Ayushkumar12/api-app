import { useState } from "react";
import ApiKeyGenerator from "./comp/ApiKeyGenerator";
import Acessdata from "./comp/NewsApp";
import AddNews from "./comp/AddNews";

function App() {
  

  return (
    <div>
      <NewsApp/>
      <AddNews/>
      <Acessdata/>
      <ApiKeyGenerator/>
    </div>
  );
}

export default App;
