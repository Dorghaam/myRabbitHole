import { useState, useEffect } from 'react'
import { Trash2, FolderOpen } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { storageService, ProjectIndexItem } from '../../services/storageService'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'

export function LoadModal() {
  const { isLoadModalOpen, closeLoadModal, loadProject, addToast } =
    useConceptMapStore()

  const [projects, setProjects] = useState<ProjectIndexItem[]>([])

  useEffect(() => {
    if (isLoadModalOpen) {
      setProjects(storageService.getProjectsIndex())
    }
  }, [isLoadModalOpen])

  const handleLoad = (projectId: string) => {
    loadProject(projectId)
  }

  const handleDelete = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this project?')) {
      storageService.deleteProject(projectId)
      setProjects(storageService.getProjectsIndex())
      addToast('Project deleted', 'info')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Modal
      isOpen={isLoadModalOpen}
      onClose={closeLoadModal}
      title="Load Project"
      size="md"
    >
      <div className="p-6">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto text-text-muted mb-4" size={48} />
            <p className="text-text-secondary">No saved projects yet</p>
            <p className="text-sm text-text-muted mt-1">
              Create a concept map and save it to see it here
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleLoad(project.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text-primary truncate">
                    {project.name}
                  </h3>
                  <p className="text-sm text-text-muted truncate">
                    {project.topic}
                  </p>
                  <p className="text-xs text-text-light mt-1">
                    {formatDate(project.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(project.id, e)}
                  className="p-2 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete project"
                >
                  <Trash2 size={18} />
                </button>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-divider">
          <Button variant="secondary" className="w-full" onClick={closeLoadModal}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
