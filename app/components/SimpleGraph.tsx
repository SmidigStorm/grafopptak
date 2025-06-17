'use client';

import { useState, useEffect } from 'react';

interface SimpleGraphProps {
  nodes: any[];
  relationships: any[];
  className?: string;
}

export default function SimpleGraph({ 
  nodes, 
  relationships, 
  className = '' 
}: SimpleGraphProps) {
  return (
    <div className={`w-full h-full p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Noder ({nodes.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {nodes.map((node, i) => (
            <div key={i} className="p-2 bg-blue-100 rounded text-sm">
              {node.name || `Node ${i}`}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Relasjoner ({relationships.length})</h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {relationships.map((rel, i) => (
            <div key={i} className="text-sm p-2 bg-gray-100 rounded">
              {rel.type || 'Relasjon'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}