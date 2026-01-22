import { ProjectData } from '../types'

// ============================================
// LOCAL STORAGE KEYS
// ============================================

const INDEX_KEY = 'concept-map-projects-index'
const PROJECT_PREFIX = 'concept-map-project-'

// ============================================
// PROJECT INDEX ITEM
// ============================================

export interface ProjectIndexItem {
  id: string
  name: string
  topic: string
  updatedAt: string
}

// ============================================
// STORAGE SERVICE
// ============================================

export const storageService = {
  /**
   * Get list of all saved projects
   */
  getProjectsIndex(): ProjectIndexItem[] {
    try {
      const data = localStorage.getItem(INDEX_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load projects index:', error)
      return []
    }
  },

  /**
   * Save a project
   */
  saveProject(project: ProjectData): void {
    try {
      // Save full project data
      localStorage.setItem(
        `${PROJECT_PREFIX}${project.id}`,
        JSON.stringify(project)
      )

      // Update index
      const index = this.getProjectsIndex()
      const existing = index.findIndex((p) => p.id === project.id)
      const entry: ProjectIndexItem = {
        id: project.id,
        name: project.name,
        topic: project.topic,
        updatedAt: project.updatedAt,
      }

      if (existing >= 0) {
        index[existing] = entry
      } else {
        index.unshift(entry) // Add to beginning
      }

      localStorage.setItem(INDEX_KEY, JSON.stringify(index))
    } catch (error) {
      console.error('Failed to save project:', error)
      throw new Error('Failed to save project')
    }
  },

  /**
   * Load a project by ID
   */
  loadProject(id: string): ProjectData | null {
    try {
      const data = localStorage.getItem(`${PROJECT_PREFIX}${id}`)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to load project:', error)
      return null
    }
  },

  /**
   * Delete a project
   */
  deleteProject(id: string): void {
    try {
      // Remove project data
      localStorage.removeItem(`${PROJECT_PREFIX}${id}`)

      // Update index
      const index = this.getProjectsIndex().filter((p) => p.id !== id)
      localStorage.setItem(INDEX_KEY, JSON.stringify(index))
    } catch (error) {
      console.error('Failed to delete project:', error)
      throw new Error('Failed to delete project')
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  },
}
