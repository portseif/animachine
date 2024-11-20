import React from 'react';
import { Spaceman } from 'spaceman';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAfflatus } from 'afflatus';
import matterkitTheme from './matterkitTheme';
import LaunchButton from './LaunchButton';
import state from './state';
import { ThemeContext } from './ThemeContext';

const App = () => {
  const workspace = useAfflatus();

  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeContext.Provider value={matterkitTheme}>
        {state.collapsed ? <LaunchButton /> : <Spaceman store={workspace} />}
      </ThemeContext.Provider>
    </DndProvider>
  );
};

export default App;
