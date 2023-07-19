import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

function bellmanFord(vertices, edges, source, destination) {
  const distances = {};
  const predecessors = {};

  for (const vertex of vertices) {
    distances[vertex.id] = Infinity;
    predecessors[vertex.id] = null;
  }

  distances[source] = 0;

  for (let i = 0; i < vertices.length - 1; i++) {
    for (const { u, v, weight } of edges) {
      const distanceThroughU = distances[u] + weight;
      if (distanceThroughU < distances[v]) {
        distances[v] = distanceThroughU;
        predecessors[v] = u;
      }
    }
  }

  const shortestPath = [];
  let currentVertexId = destination;
  while (currentVertexId !== source) {
    const predecessorVertexId = predecessors[currentVertexId];
    const startVertex = vertices.find((vertex) => vertex.id === predecessorVertexId);
    const endVertex = vertices.find((vertex) => vertex.id === currentVertexId);
    shortestPath.push({ start: startVertex, end: endVertex });
    currentVertexId = predecessorVertexId;
  }
  shortestPath.reverse();

  return { distances, shortestPath };
}

function App() {
  const [vertices, setVertices] = useState([
    { id: 0, x: 50, y: 350 },
    { id: 1, x: 150, y: 250 },
    { id: 2, x: 250, y: 150 },
    { id: 3, x: 350, y: 250 },
    { id: 4, x: 450, y: 350 },
  ]);

  const [edges, setEdges] = useState([
    { u: 0, v: 1, weight: 1 },
    { u: 0, v: 2, weight: 2 },
    { u: 1, v: 2, weight: 3 },
    { u: 1, v: 3, weight: 4 },
    { u: 2, v: 3, weight: 5 },
    { u: 2, v: 4, weight: 6 },
    { u: 3, v: 4, weight: 7 },
  ]);

  const [distances, setDistances] = useState({});
  const [path, setPath] = useState([]);

  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);
  const draggedVertexRef = useRef(null);

  useEffect(() => {
    const sourceVertexId = 0;
    const destinationVertexId = 4;
    const { distances, shortestPath } = bellmanFord(vertices, edges, sourceVertexId, destinationVertexId);

    setDistances(distances);
    setPath(shortestPath);
  }, [vertices, edges]);

  const handleVertexMove = (vertexId, newX, newY) => {
    const updatedVertices = vertices.map((vertex) => {
      if (vertex.id === vertexId) {
        return { ...vertex, x: newX, y: newY };
      }
      return vertex;
    });
    setVertices(updatedVertices);

    const updatedEdges = edges.map((edge) => {
      if (edge.u === vertexId) {
        return { ...edge, weight: calculateDistance(updatedVertices[edge.u], updatedVertices[edge.v]) };
      }
      if (edge.v === vertexId) {
        return { ...edge, weight: calculateDistance(updatedVertices[edge.v], updatedVertices[edge.u]) };
      }
      return edge;
    });
    setEdges(updatedEdges);

    const sourceVertexId = 0;
    const destinationVertexId = 4;
    const { distances } = bellmanFord(updatedVertices, updatedEdges, sourceVertexId, destinationVertexId);
    setDistances(distances);
  };

  const calculateDistance = (startVertex, endVertex) => {
    return Math.sqrt((endVertex.x - startVertex.x) ** 2 + (endVertex.y - startVertex.y) ** 2);
  };

  const handleMouseDown = (e, vertexId) => {
    isDraggingRef.current = true;
    draggedVertexRef.current = vertexId;

    const svg = d3.select(svgRef.current);
    svg.on('mousemove', handleMouseMove);
    svg.on('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e, vertexId) => {
    if (isDraggingRef.current && draggedVertexRef.current !== null) {
      const newX = e.clientX - svgRef.current.getBoundingClientRect().left - 50;
      const newY = -(e.clientY - svgRef.current.getBoundingClientRect().top - 450);
      handleVertexMove(draggedVertexRef.current, newX, newY);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    draggedVertexRef.current = null;
  };
  
  

const vertexNames = {
  0: 'v0',
  1: 'v1',
  2: 'v2',
  3: 'v3',
  4: 'v4',
};
  
  
const graphWidth = 600; // Larghezza del grafico
const graphHeight = 600; // Altezza del grafico
const margin = 50; // Margine del grafico

const viewBoxWidth = graphWidth + margin * 2;
const viewBoxHeight = graphHeight + margin * 2;

  return (
    <div>
      <svg ref={svgRef} width="600" height="600">
        <g transform="translate(50,450)"width="1000" height="1000">
          <line x1="0" y1="0" x2="400" y2="0" stroke="black" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2="-400" stroke="black" strokeWidth="1" />
          <text x="-15" y="15">0</text>
          <text x="415" y="15">x</text>
          <text x="-15" y="-415">y</text>
          {edges.map((edge, i) => {
            const startVertex = vertices.find((vertex) => vertex.id === edge.u);
            const endVertex = vertices.find((vertex) => vertex.id === edge.v);
            return (
              <line
                key={i}
                x1={startVertex.x}
                y1={-startVertex.y}
                x2={endVertex.x}
                y2={-endVertex.y}
                stroke="black"
                strokeWidth={2}
              />
            );
          })}
          {vertices.map((vertex) => (
   <>
   <circle
     key={vertex.id}
     id={`vertex-${vertex.id}`}
     cx={vertex.x}
     cy={-vertex.y}
     r="5"
     fill="red"
     onMouseDown={(e) => handleMouseDown(e, vertex.id)}
   />
   <text
     x={vertex.x}
     y={-vertex.y - 15}
     textAnchor="middle"
   >
     {vertexNames[vertex.id]} {/* Utilizza l'oggetto di mapping per ottenere il nome automatico */}
   </text>
 </>
))}
          {path.map((segment, i) => {
            const startVertex = vertices.find((vertex) => vertex.id === segment.start.id);
            const endVertex = vertices.find((vertex) => vertex.id === segment.end.id);
            return (
              <line
                key={i}
                x1={startVertex.x}
                y1={-startVertex.y}
                x2={endVertex.x}
                y2={-endVertex.y}
                stroke="yellow"
                strokeWidth={2}
                strokeDasharray="5"
              />
            );
          })}
        </g>
      </svg>

      <div>
        <h2>Coordinate dei vertici</h2>
        <ul>
          {vertices.map((vertex) => (
            <li key={vertex.id}>
              Vertice {vertex.id}: ({vertex.x}, {vertex.y})
            </li>
          ))}
        </ul>
        <h2>Distanze tra i vertici</h2>
        <ul>
          {Object.entries(distances).map(([vertexId, distance]) => (
            <li key={vertexId}>
              Distanza tra vertice 0 e {vertexId}: {distance}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

