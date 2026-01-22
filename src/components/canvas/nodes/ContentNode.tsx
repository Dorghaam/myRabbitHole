import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { ContentNodeData } from '../../../types'
import { getNodeColors } from '../../../config/colors'
import { useConceptMapStore } from '../../../store/conceptMapStore'
import { NodeActionIcons } from './NodeActionIcons'

type ContentNodeProps = NodeProps & {
  data: ContentNodeData
}

export const ContentNode = memo(function ContentNode({
  data,
  selected,
}: ContentNodeProps) {
  const { selectNode } = useConceptMapStore()
  const colors = getNodeColors(data.color)

  const handleClick = () => {
    selectNode(data.id)
  }

  return (
    <div
      onClick={handleClick}
      className="relative"
      style={{ width: '280px' }}
    >
      {/* Main node container */}
      <div
        className="rounded-2xl shadow-md transition-all cursor-pointer overflow-hidden"
        style={{
          backgroundColor: colors.bg,
          border: selected
            ? `2px solid ${colors.accent}`
            : `2px solid ${colors.border}`,
        }}
      >
        {/* Pink corner handles - decorative */}
        <div
          className="absolute top-0 left-0 w-2.5 h-2.5 rounded-tl-xl z-10"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="absolute top-0 right-0 w-2.5 h-2.5 rounded-tr-xl z-10"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="absolute bottom-0 left-0 w-2.5 h-2.5 rounded-bl-xl z-10"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-br-xl z-10"
          style={{ backgroundColor: colors.accent }}
        />

        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: colors.accent }}
        />

        {/* Content */}
        <div className="pl-4 pr-3 py-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.accent }}
            >
              {data.title}
            </h3>
            <NodeActionIcons nodeId={data.id} showRegenerate />
          </div>

          {/* Content text */}
          <div className="max-h-[300px] overflow-y-auto pr-2">
            <p className="text-sm text-text-secondary leading-relaxed">
              {data.content}
            </p>
          </div>
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
      />
    </div>
  )
})
