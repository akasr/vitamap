// app/chat/components/GeneratedImageModal.tsx
'use client';

interface GeneratedImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  prompt: string;
}

export default function GeneratedImageModal({
  isOpen,
  onClose,
  imageUrl,
  prompt,
}: GeneratedImageModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Generated Image</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Prompt:</span> {prompt}
          </p>
          <img
            src={imageUrl}
            alt={`Generated image for: ${prompt}`}
            className="w-full h-auto rounded-lg border border-gray-200"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}