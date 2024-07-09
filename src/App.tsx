import { useState } from "react";

import { Container, CssBaseline, styled } from "@mui/material";

import { CanvasThreeD, Maindrawer } from "./components";
import { Notifications, MenuBtn } from "./UI";
import { GlobalStore } from "./store";

const StyledContainer = styled(Container)`
  position: relative;
  height: 100dvh;
`;

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const openMenuHandler = () => {
    setIsDrawerOpen(true);
  };

  const closeMenuHandler = () => {
    setIsDrawerOpen(false);
  };

  return (
    <GlobalStore>
      <CssBaseline />
      <StyledContainer disableGutters maxWidth={false}>
        <MenuBtn onClick={openMenuHandler} />
        <CanvasThreeD />
      </StyledContainer>
      <Maindrawer isOpen={isDrawerOpen} onClose={closeMenuHandler} />
      <Notifications />
    </GlobalStore>
  );
}

export default App;
