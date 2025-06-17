'use client';

import { useEffect, useRef } from 'react';
import NVL from '@neo4j-nvl/base';

interface GraphVisualizationProps {
  nodes: any[];
  relationships: any[];
  className?: string;
}

export default function GraphVisualizationSimple({ 
  nodes, 
  relationships, 
  className = '' 
}: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nvlRef = useRef<NVL | null>(null);

  useEffect(() => {
    if (!containerRef.current || nvlRef.current) return;

    // Initialize NVL with minimal config
    nvlRef.current = new NVL(containerRef.current, nodes, relationships, {
      layout: 'force-directed',
      initialZoom: 0.8,
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
    if (nvlRef.current && nodes.length > 0) {
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