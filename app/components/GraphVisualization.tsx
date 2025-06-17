'use client';

import { useEffect, useRef } from 'react';
import NVL, { Node, Relationship } from '@neo4j-nvl/base';
import InteractionHandlers from '@neo4j-nvl/interaction-handlers';

interface GraphVisualizationProps {
  nodes: Node[];
  relationships: Relationship[];
  className?: string;
}

export default function GraphVisualization({ 
  nodes, 
  relationships, 
  className = '' 
}: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nvlRef = useRef<NVL | null>(null);

  useEffect(() => {
    if (!containerRef.current || nvlRef.current) return;

    // Initialize NVL
    nvlRef.current = new NVL(containerRef.current, nodes, relationships, {
      layout: 'force-directed',
      nodeSize: 30,
      nodeColor: '#3b82f6',
      relationshipColor: '#94a3b8',
      nodeCaption: 'name',
      relationshipCaption: 'type',
    });

    // Add mouse interaction
    const mouseHandler = new InteractionHandlers.MouseInteractionHandler(nvlRef.current);
    mouseHandler.on('node:click', (event: any) => {
      console.log('Node clicked:', event.detail.node);
    });

    // Initial render
    nvlRef.current.render();

    return () => {
      if (nvlRef.current) {
        nvlRef.current.destroy();
        nvlRef.current = null;
      }
    };
  }, []);

  // Update graph when data changes
  useEffect(() => {
    if (nvlRef.current) {
      nvlRef.current.updateData(nodes, relationships);
      nvlRef.current.render();
    }
  }, [nodes, relationships]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '500px' }}
    />
  );
}