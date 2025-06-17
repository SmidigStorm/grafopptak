'use client';

import React from 'react';
import { NVL } from '@neo4j-nvl/react';

interface GraphVisualizationProps {
  nodes: any[];
  relationships: any[];
  className?: string;
}

export default function GraphVisualizationNVL({ 
  nodes, 
  relationships, 
  className = '' 
}: GraphVisualizationProps) {
  // NVL React component håndterer alt internt
  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: '500px' }}>
      <NVL
        nodes={nodes}
        rels={relationships}
        layout="force-directed"
        initialZoom={0.8}
        mouseInteraction={true}
        fitOnLoad={true}
        theme={{
          node: {
            size: 30,
            captionSize: 12,
          },
          relationship: {
            width: 2,
            captionSize: 10,
          }
        }}
      />
    </div>
  );
}