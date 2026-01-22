import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { TermNodeData } from '../../../types'
import { getNodeColors } from '../../../config/colors'
import { useConceptMapStore } from '../../../store/conceptMapStore'
import { NodeActionIcons } from './NodeActionIcons'

type TermNodeProps = NodeProps & {
  data: TermNodeData
}

export const TermNode = memo(function TermNode({
  data,
  selected,
}: TermNodeProps) {
  const { selectNode } = useConceptMapStore()
  const colors = getNodeColors(data.color)

  const handleClick = () => {
    selectNode(data.id)
  }

  return (
    <div
      onClick={handleClick}
      className="relative"
      style={{ minWidth: '120px', maxWidth: '180px' }}
    >
      {/* Main node container */}
      <div
        className="rounded-xl shadow-md transition-all cursor-pointer overflow-hidden"
        style={{
          backgroundColor: colors.bg,
          border: selected
            ? `2px solid ${colors.accent}`
            : `2px solid ${colors.border}`,
        }}
      >
        {/* Content */}
        <div className="px-3 py-3">
          {/* Badge and actions row */}
          <div className="flex items-start justify-between mb-1">
            <span
              className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded"
              style={{
                backgroundColor: colors.accent,
                color: 'white',
              }}
            >
              TERM
            </span>
            <NodeActionIcons nodeId={data.id} />
          </div>

          {/* Term label */}
          <h4 className="text-sm font-semibold text-text-primary mt-2 truncate">
            {data.term}
          </h4>

          {/* Definition on hover - shown as subtitle */}
          {data.definition && (
            <p className="text-xs text-text-muted mt-1 line-clamp-2">
              {data.definition}
            </p>
          )}
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
