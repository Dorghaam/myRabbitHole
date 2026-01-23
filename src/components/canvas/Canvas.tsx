import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type NodeTypes,
} from '@xyflow/react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { TopicNode, ContentNode, TermNode, WikipediaNode } from './nodes'

// Define custom node types
const nodeTypes: NodeTypes = {
  topic: TopicNode,
  content: ContentNode,
  term: TermNode,
  wikipedia: WikipediaNode,
}

export function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    selectNode,
    selectedNodeId,
  } = useConceptMapStore()

  // Handle clicking on canvas background (deselect)
  const handlePaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  // Default edge options
  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'bezier',
      style: {
        stroke: '#9CA3AF',
        strokeWidth: 2,
      },
    }),
    []
  )

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        panOnDrag
        panOnScroll={false}
        zoomOnScroll
        zoomOnPinch
        selectNodesOnDrag={false}
        proOptions={{ hideAttribution: true }}
      >
        {/* Dot grid background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#E2E8F0"
        />

        {/* Controls (zoom in/out, fit view) */}
        <Controls
          showInteractive={false}
          className="!bg-white !border !border-node-border !rounded-lg !shadow-sm"
        />

        {/* Mini map */}
        <MiniMap
          nodeColor={(node) => {
            if (node.id === selectedNodeId) return '#EC4899'
            return '#E2E8F0'
          }}
          maskColor="rgba(248, 250, 252, 0.8)"
          className="!bg-white !border !border-node-border !rounded-lg"
        />
      </ReactFlow>
    </div>
  )
}
