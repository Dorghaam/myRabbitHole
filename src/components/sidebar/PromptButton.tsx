import { clsx } from 'clsx'
import { PromptConfig } from '../../types'

interface PromptButtonProps {
  config: PromptConfig
  onClick: () => void
  isFullWidth?: boolean
}

export function PromptButton({
  config,
  onClick,
  isFullWidth = false,
}: PromptButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-3 py-2.5 text-sm font-medium rounded-lg border transition-colors',
        'hover:border-primary-pink hover:text-primary-pink',
        'bg-white border-node-border text-text-primary',
        isFullWidth ? 'col-span-2' : ''
      )}
      title={config.description}
    >
      {config.label}
    </button>
  )
}

interface AddNewButtonProps {
  onClick: () => void
}

export function AddNewButton({ onClick }: AddNewButtonProps) {
  return (
    <button
      onClick={onClick}
      className="col-span-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors bg-primary-pink text-white hover:bg-primary-pink-hover"
    >
      + Add New
    </button>
  )
}
