import React, { useRef } from 'react';
import { GraphCanvas, GraphCanvasRef } from '../src';
import { simpleEdges, simpleNodes } from './assets/demo';

export default {
  title: 'Demos/Controls',
  component: GraphCanvas
};

export const Center = () => {
  const ref = useRef<GraphCanvasRef | null>(null);

  return (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <pre style={{ zIndex: 9, position: 'absolute', top: 15, right: 15, background: 'rgba(0, 0, 0, .5)', padding: 20, color: 'white' }}>
        <button style={{ display: 'block', width: '100%' }} onClick={() => ref.current.centerGraph()}>Center</button>
      </pre>
      <GraphCanvas ref={ref} nodes={simpleNodes} edges={simpleEdges} />
    </div>
  );
};
