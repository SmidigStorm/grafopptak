'use client';

import { NVL } from '@neo4j-nvl/react';

interface GraphVisualizationProps {
  nodes: any[];
  relationships: any[];
  className?: string;
}

export default function GraphVisualizationReact({ 
  nodes, 
  relationships, 
  className = '' 
}: GraphVisualizationProps) {
  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: '500px' }}>
      <NVL
        nodes={nodes}
        rels={relationships}
        layout="force-directed"
        initialZoom={0.8}
        mouseInteraction={true}
      />
    </div>
  );
}