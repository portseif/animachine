import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BETON from './core/Beton';
import './rocks/dom-picker';
import './rocks/config';
import './rocks/contact-layer';
import './rocks/create-bundle-file';
import './rocks/file-save';
import './rocks/generate-selector';
import './rocks/hack-open-first-possible-project';
import './rocks/selector-editor-dialog';
import './rocks/preview-animation-synchronizer';
import './rocks/preview-registry';
import './rocks/project-manager';
import './rocks/timeline-pusher';
import './rocks/timeline-tab';
import './rocks/toolbar';
import './rocks/tracker';
import './rocks/transform-tool';
import './rocks/welcome-dialog';
import './rocks/workspace';

export function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // Show welcome dialog
      BETON.get('welcome-dialog').show();
      
      // Open first possible project
      BETON.get('hack-open-first-possible-project')();
      
      setIsInitialized(true);
    }
  }, [isInitialized]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        {/* The workspace rock will render its content here */}
        <div id="workspace-root" />
      </div>
    </DndProvider>
  );
}
