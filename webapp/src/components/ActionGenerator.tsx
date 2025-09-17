import { useState, useRef, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, File, AlertCircle, Loader2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

const ALLOWED_EXTENSIONS = ['md', 'txt', 'log', 'pdf', 'docx', 'xls', 'csv', 'jpg', 'png', 'mp3', 'wav'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_FILES = 20;

const ActionGenerator = () => {
  const [userInput, setUserInput] = useState('');
  const [letterOutput, setLetterOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return `File type .${extension} is not allowed`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 100MB limit`;
    }

    return null;
  };

  const getTotalSize = useCallback(() => {
    return uploadedFiles.reduce((sum, uf) => sum + uf.size, 0);
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
          name: file.name,
          size: file.size
        });
        newTotal += file.size;
      }
    });

    if (acceptedFiles.length > remainingSlots) {
      newErrors.push(`Only ${remainingSlots} more files can be added (max ${MAX_FILES})`);
    }

    setFileErrors(newErrors);
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
  }, [uploadedFiles.length, getTotalSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
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

  const handleGenerate = async () => {
    if (!userInput) {
      setError('Please describe your issue in the text box above.');
      return;
    }

    setIsLoading(true);
    setError('');
    setLetterOutput('');

    const systemPrompt = `You are a consumer rights advocate. Your task is to write a formal, firm, and professional complaint letter to Trivago's customer support. The user will provide a brief summary of their negative experience. You must incorporate their experience into the letter and strengthen their argument by referencing the established findings against Trivago.

Key points to include:
1.  Acknowledge the user's specific complaint (booking errors, refund denial, etc.).
2.  Reference the fact that Trivago has a documented history of misleading consumers, as determined by regulatory bodies.
3.  Specifically mention the landmark case by the Australian Competition and Consumer Commission (ACCC), where Trivago was fined $44.7 million for deceptive practices, such as prioritizing advertisers over the cheapest deals.
4.  State that the user's experience appears to be part of a broader pattern of behavior rather than an isolated incident.
5.  Clearly state the desired resolution (e.g., a full refund).
6.  Maintain a professional tone, avoiding emotional or aggressive language.
7.  The letter should be addressed to "Trivago Customer Support" and signed off as "A Concerned Consumer".`;

    const userQuery = `My issue is: ${userInput}`;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
    
    if (!apiKey) {
        setError("API Key not found. Please create a .env file and add VITE_GEMINI_API_KEY=YOUR_KEY");
        setIsLoading(false);
        return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`API request failed with status ${response.status}: ${errorBody.error.message}`);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            setLetterOutput(candidate.content.parts[0].text);
        } else {
             setError('Sorry, the model returned an empty response. This might be due to safety settings blocking the request or response. Please try rephrasing your issue.');
        }

    } catch (err: any) {
        console.error('Error calling Gemini API:', err);
        setError(`An error occurred: ${err.message}. Please check the console and try again later.`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <section className="mb-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-dark text-center text-3xl">Take Action: Generate a Complaint Letter</CardTitle>
          <CardDescription className="text-center max-w-2xl mx-auto">
            Feeling wronged? Briefly describe your issue below. Our AI assistant, powered by Google's Gemini, will draft a formal complaint letter for you, citing the evidence and legal precedents outlined in this report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Complaint Text Area */}
            <div>
              <label className="block text-sm font-medium mb-2">Describe your issue:</label>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="For example: 'I booked a room for July 10th, but Trivago changed it to July 11th and refused to refund me, costing me $300.'"
                className="mb-4"
                rows={4}
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">Upload supporting evidence (optional):</label>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                {isDragActive ? (
                  <p className="text-blue-600">Drop files here...</p>
                ) : (
                  <>
                    <p className="text-gray-600 mb-1">Drag & drop files here, or click to select</p>
                    <p className="text-xs text-gray-500">
                      Supported: {ALLOWED_EXTENSIONS.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Max 100MB per file, 500MB total, 20 files max
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
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="text-sm"
                >
                  Select Files
                </Button>

                <input
                  ref={folderInputRef}
                  type="file"
                  // @ts-ignore
                  webkitdirectory=""
                  multiple
                  onChange={handleFolderSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  variant="outline"
                  className="text-sm"
                >
                  Select Folder
                </Button>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">
                    Uploaded Files ({uploadedFiles.length}/{MAX_FILES})
                  </h3>
                  <span className="text-sm text-gray-500">
                    Total: {formatFileSize(getTotalSize())} / {formatFileSize(MAX_TOTAL_SIZE)}
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                  {uploadedFiles.map(({ id, name, size }) => (
                    <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <File className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate">{name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Errors */}
            {fileErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    {fileErrors.map((error, idx) => (
                      <p key={idx} className="text-sm text-red-700">{error}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                '✨ Generate Complaint Letter'
              )}
            </Button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {letterOutput && (
              <div className="mt-6 p-4 border rounded-lg bg-slate-50 whitespace-pre-wrap text-sm text-slate-700">
                {letterOutput}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ActionGenerator;
