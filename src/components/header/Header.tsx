import { useState } from 'react'
import {
  Plus,
  Save,
  FolderOpen,
  Download,
} from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { Button } from '../common/Button'

export function Header() {
  const {
    projectName,
    setProjectName,
    newProject,
    saveProject,
    openLoadModal,
    exportJSON,
    nodes,
  } = useConceptMapStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(projectName)

  const handleNameClick = () => {
    setEditValue(projectName)
    setIsEditing(true)
  }

  const handleNameBlur = () => {
    setIsEditing(false)
    if (editValue.trim()) {
      setProjectName(editValue.trim())
    }
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditValue(projectName)
    }
  }

  const hasContent = nodes.length > 0

  return (
    <header className="h-14 bg-white border-b border-divider flex items-center justify-between px-4">
      {/* Left side - Logo and name */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <span className="text-xl tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
          <span className="font-bold text-gray-500">my</span>
          <span className="font-black text-gray-900">Rabbit</span>
          <span className="font-black text-pink-500">Hole</span>
        </span>

        {/* Divider */}
        <div className="w-px h-6 bg-divider hidden sm:block" />

        {/* Project name */}
        {hasContent && (
          <div className="hidden sm:block">
            {isEditing ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                autoFocus
                className="px-2 py-1 border border-primary-pink rounded text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-pink/20"
              />
            ) : (
              <button
                onClick={handleNameClick}
                className="px-2 py-1 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded transition-colors"
              >
                {projectName}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={newProject}
          title="New Project"
        >
          <Plus size={16} className="mr-1" />
          <span className="hidden sm:inline">New</span>
        </Button>

        {hasContent && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={saveProject}
              title="Save Project"
            >
              <Save size={16} className="mr-1" />
              <span className="hidden sm:inline">Save</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={exportJSON}
              title="Export JSON"
            >
              <Download size={16} className="mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={openLoadModal}
          title="Load Project"
        >
          <FolderOpen size={16} className="mr-1" />
          <span className="hidden sm:inline">Load</span>
        </Button>
      </div>
    </header>
  )
}
