import { useConceptMapStore } from '../../store/conceptMapStore'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { clsx } from 'clsx'

export function Toast() {
  const { toasts, removeToast } = useConceptMapStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-[400px]',
            'animate-in slide-in-from-right fade-in duration-300',
            {
              'bg-green-50 border border-green-200': toast.type === 'success',
              'bg-red-50 border border-red-200': toast.type === 'error',
              'bg-blue-50 border border-blue-200': toast.type === 'info',
            }
          )}
        >
          {/* Icon */}
          {toast.type === 'success' && (
            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          )}
          {toast.type === 'info' && (
            <Info className="text-blue-500 flex-shrink-0" size={20} />
          )}

          {/* Message */}
          <p
            className={clsx('text-sm flex-1', {
              'text-green-800': toast.type === 'success',
              'text-red-800': toast.type === 'error',
              'text-blue-800': toast.type === 'info',
            })}
          >
            {toast.message}
          </p>

          {/* Close button */}
          <button
            onClick={() => removeToast(toast.id)}
            className={clsx('p-1 rounded hover:bg-black/5 flex-shrink-0', {
              'text-green-600': toast.type === 'success',
              'text-red-600': toast.type === 'error',
              'text-blue-600': toast.type === 'info',
            })}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
