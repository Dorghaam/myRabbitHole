import { ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Header } from './components/header/Header'
import { Canvas } from './components/canvas/Canvas'
import { PromptSidebar } from './components/sidebar/PromptSidebar'
import { TopicInput } from './components/topic-input/TopicInput'
import { ResponseModal } from './components/modals/ResponseModal'
import { ColorPickerModal } from './components/modals/ColorPickerModal'
import { ApiKeyModal } from './components/modals/ApiKeyModal'
import { LoadModal } from './components/modals/LoadModal'
import { ChatModal } from './components/modals/ChatModal'
import { ExtractSelectionModal } from './components/modals/ExtractSelectionModal'
import { WikipediaSelectionModal } from './components/modals/WikipediaSelectionModal'
import { Toast } from './components/common/Toast'
import { useConceptMapStore } from './store/conceptMapStore'

function App() {
  const { nodes, isSidebarOpen } = useConceptMapStore()
  const showTopicInput = nodes.length === 0

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col bg-canvas-bg">
        <Header />

        <div className="flex-1 relative overflow-hidden">
          {showTopicInput ? (
            <TopicInput />
          ) : (
            <Canvas />
          )}

          {isSidebarOpen && (
            <div className="absolute top-0 right-0 h-full z-10">
              <PromptSidebar />
            </div>
          )}
        </div>

        {/* Modals */}
        <ResponseModal />
        <ColorPickerModal />
        <ApiKeyModal />
        <LoadModal />
        <ChatModal />
        <ExtractSelectionModal />
        <WikipediaSelectionModal />
        <Toast />
      </div>
    </ReactFlowProvider>
  )
}

export default App
