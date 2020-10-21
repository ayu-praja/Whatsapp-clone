import React, { Fragment } from "react";

import NavContainer from "./src/navigation";
import Loader from "./src/components/loader"
import { StoreProvider } from "./src/context/store";
import { StatusBar } from "react-native";



const App= () => {
  return (
    <StoreProvider>
    
      <NavContainer />
      <Loader />
    </StoreProvider>
  );
};

export default App;