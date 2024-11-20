import React from 'react';
import { Spaceman } from 'spaceman';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAfflatus } from 'afflatus';
import LaunchButton from './LaunchButton';
import state from './state';
import ThemeProvider from './ThemeProvider';

const App = () => {
  const workspace = useAfflatus();

  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider>
        {state.collapsed ? <LaunchButton /> : <Spaceman store={workspace} />}
      </ThemeProvider>
    </DndProvider>
  );
};

export default App;
