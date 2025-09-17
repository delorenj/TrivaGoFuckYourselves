import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface ComplaintFormProps {
  onSubmit?: (complaint: string, files: File[]) => Promise<void>;
}

const ALLOWED_EXTENSIONS = ['md', 'txt', 'log', 'pdf', 'docx', 'xls', 'csv', 'jpg', 'png', 'mp3', 'wav'];
const ALLOWED_MIME_TYPES = [
  'text/markdown',
  'text/plain',
  'text/x-log',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'image/jpeg',
  'image/png',
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav'
];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_FILES = 20;

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSubmit }) => {
  const [complaintText, setComplaintText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return `File type .${extension} is not allowed`;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type) && file.type !== '') {
      return `MIME type ${file.type} is not allowed`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 100MB limit`;
    }

    return null;
  };

  const getTotalSize = useCallback(() => {
    return uploadedFiles.reduce((sum, uf) => sum + uf.file.size, 0);
  }, [uploadedFiles]);

  const processFiles = useCallback((acceptedFiles: File[]) => {
    const newErrors: string[] = [];
    const validFiles: UploadedFile[] = [];
    const currentTotal = getTotalSize();

    let newTotal = currentTotal;
    const remainingSlots = MAX_FILES - uploadedFiles.length;

    acceptedFiles.slice(0, remainingSlots).forEach(file => {
      const error = validateFile(file);

      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else if (newTotal + file.size > MAX_TOTAL_SIZE) {
        newErrors.push(`${file.name}: Total size would exceed 500MB limit`);
      } else {
        validFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          progress: 0,
          status: 'pending'
        });
        newTotal += file.size;
      }
    });

    if (acceptedFiles.length > remainingSlots) {
      newErrors.push(`Only ${remainingSlots} more files can be added (max ${MAX_FILES})`);
    }

    setErrors(newErrors);
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
  }, [uploadedFiles.length, getTotalSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
    accept: ALLOWED_MIME_TYPES.reduce((acc, type) => ({
      ...acc,
      [type]: ALLOWED_EXTENSIONS.filter(ext => {
        // Map extensions to MIME types
        if (type.includes('image')) return ['jpg', 'png'].includes(ext);
        if (type.includes('audio')) return ['mp3', 'wav'].includes(ext);
        if (type.includes('pdf')) return ext === 'pdf';
        if (type.includes('csv')) return ext === 'csv';
        if (type.includes('excel') || type.includes('spreadsheet')) return ['xls', 'xlsx'].includes(ext);
        if (type.includes('word')) return ext === 'docx';
        if (type.includes('text')) return ['txt', 'md', 'log'].includes(ext);
        return false;
      }).map(ext => `.${ext}`)
    }), {}),
    maxSize: MAX_FILE_SIZE,
    multiple: true
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return extension && ALLOWED_EXTENSIONS.includes(extension);
      });
      processFiles(files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!complaintText.trim()) {
      setErrors(['Please enter your complaint text']);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const files = uploadedFiles.map(uf => uf.file);

      // Simulate upload progress
      for (let i = 0; i < uploadedFiles.length; i++) {
        setUploadedFiles(prev => prev.map((uf, idx) =>
          idx === i ? { ...uf, status: 'uploading', progress: 0 } : uf
        ));

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadedFiles(prev => prev.map((uf, idx) =>
            idx === i ? { ...uf, progress } : uf
          ));
        }

        setUploadedFiles(prev => prev.map((uf, idx) =>
          idx === i ? { ...uf, status: 'success', progress: 100 } : uf
        ));
      }

      if (onSubmit) {
        await onSubmit(complaintText, files);
      }

      // Reset form on success
      setComplaintText('');
      setUploadedFiles([]);
      alert('Complaint submitted successfully!');
    } catch (error) {
      setErrors(['Failed to submit complaint. Please try again.']);
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <label htmlFor="complaint" className="block text-sm font-medium text-gray-700">
          Describe your complaint
        </label>
        <textarea
          id="complaint"
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Please provide detailed information about your complaint..."
          required
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Upload supporting files (optional)
        </label>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-blue-600">Drop files here...</p>
          ) : (
            <>
              <p className="text-gray-600 mb-2">Drag & drop files here, or click to select</p>
              <p className="text-xs text-gray-500">
                Supported: {ALLOWED_EXTENSIONS.join(', ')} (Max 100MB per file, 500MB total)
              </p>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Select Files
          </button>

          <input
            ref={folderInputRef}
            type="file"
            // @ts-ignore - webkitdirectory is not in TypeScript types
            webkitdirectory=""
            multiple
            onChange={handleFolderSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Select Folder
          </button>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">
              Uploaded Files ({uploadedFiles.length}/{MAX_FILES})
            </h3>
            <span className="text-sm text-gray-500">
              Total: {formatFileSize(getTotalSize())} / {formatFileSize(MAX_TOTAL_SIZE)}
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
            {uploadedFiles.map(({ id, file, progress, status }) => (
              <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <File className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                </div>

                <div className="flex items-center gap-2">
                  {status === 'uploading' && (
                    <>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    </>
                  )}
                  {status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  {status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => removeFile(id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              {errors.map((error, idx) => (
                <p key={idx} className="text-sm text-red-700">{error}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !complaintText.trim()}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Complaint'
        )}
      </button>
    </form>
  );
};