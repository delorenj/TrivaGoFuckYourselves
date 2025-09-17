interface ComplaintSubmission {
  text: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

interface AttachmentUpload {
  complaintId: string;
  file: File;
  onProgress?: (progress: number) => void;
}

interface UploadSession {
  sessionId: string;
  uploadUrl: string;
  expiresAt: Date;
}

interface ComplaintResponse {
  id: string;
  status: 'pending' | 'processing' | 'resolved';
  createdAt: Date;
  attachments: AttachmentInfo[];
}

interface AttachmentInfo {
  id: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: Date;
  scanStatus: 'pending' | 'clean' | 'threat_detected';
}

export class ComplaintAPI {
  private baseUrl: string;
  private chunkSize = 5 * 1024 * 1024; // 5MB chunks

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Submit a complaint with optional file attachments
   */
  async submitComplaint(
    complaint: ComplaintSubmission,
    files: File[] = []
  ): Promise<ComplaintResponse> {
    // Step 1: Create complaint record
    const complaintResponse = await this.createComplaint(complaint);

    // Step 2: Upload files if provided
    if (files.length > 0) {
      await this.uploadAttachments(complaintResponse.id, files);
    }

    // Step 3: Return updated complaint with attachments
    return this.getComplaint(complaintResponse.id);
  }

  /**
   * Create a new complaint record
   */
  private async createComplaint(complaint: ComplaintSubmission): Promise<ComplaintResponse> {
    const response = await fetch(`${this.baseUrl}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaint),
    });

    if (!response.ok) {
      throw new Error(`Failed to create complaint: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Upload attachments for a complaint
   */
  private async uploadAttachments(
    complaintId: string,
    files: File[]
  ): Promise<AttachmentInfo[]> {
    const uploadPromises = files.map(file => this.uploadFile(complaintId, file));
    return Promise.all(uploadPromises);
  }

  /**
   * Upload a single file with chunking support for large files
   */
  private async uploadFile(
    complaintId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<AttachmentInfo> {
    if (file.size <= this.chunkSize) {
      // Small file - single upload
      return this.uploadSmallFile(complaintId, file, onProgress);
    } else {
      // Large file - chunked upload
      return this.uploadLargeFile(complaintId, file, onProgress);
    }
  }

  /**
   * Upload a small file in a single request
   */
  private async uploadSmallFile(
    complaintId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<AttachmentInfo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('complaintId', complaintId);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', `${this.baseUrl}/complaints/${complaintId}/attachments`);
      xhr.send(formData);
    });
  }

  /**
   * Upload a large file using chunked upload
   */
  private async uploadLargeFile(
    complaintId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<AttachmentInfo> {
    // Initialize upload session
    const session = await this.createUploadSession(complaintId, file);

    const totalChunks = Math.ceil(file.size / this.chunkSize);
    let uploadedChunks = 0;

    // Upload chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.chunkSize;
      const end = Math.min(start + this.chunkSize, file.size);
      const chunk = file.slice(start, end);

      await this.uploadChunk(session.sessionId, chunk, i, totalChunks);

      uploadedChunks++;
      if (onProgress) {
        onProgress((uploadedChunks / totalChunks) * 100);
      }
    }

    // Finalize upload
    return this.finalizeUpload(session.sessionId);
  }

  /**
   * Create an upload session for chunked uploads
   */
  private async createUploadSession(
    complaintId: string,
    file: File
  ): Promise<UploadSession> {
    const response = await fetch(`${this.baseUrl}/upload-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        complaintId,
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
        totalChunks: Math.ceil(file.size / this.chunkSize),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create upload session');
    }

    return response.json();
  }

  /**
   * Upload a single chunk
   */
  private async uploadChunk(
    sessionId: string,
    chunk: Blob,
    chunkIndex: number,
    totalChunks: number
  ): Promise<void> {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());

    const response = await fetch(`${this.baseUrl}/upload-sessions/${sessionId}/chunks`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload chunk ${chunkIndex + 1}/${totalChunks}`);
    }
  }

  /**
   * Finalize a chunked upload session
   */
  private async finalizeUpload(sessionId: string): Promise<AttachmentInfo> {
    const response = await fetch(`${this.baseUrl}/upload-sessions/${sessionId}/finalize`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to finalize upload');
    }

    return response.json();
  }

  /**
   * Get complaint details
   */
  async getComplaint(complaintId: string): Promise<ComplaintResponse> {
    const response = await fetch(`${this.baseUrl}/complaints/${complaintId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch complaint');
    }

    return response.json();
  }

  /**
   * Delete an attachment
   */
  async deleteAttachment(complaintId: string, attachmentId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/complaints/${complaintId}/attachments/${attachmentId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete attachment');
    }
  }

  /**
   * Get upload progress for a session (using SSE)
   */
  subscribeToUploadProgress(
    sessionId: string,
    onProgress: (progress: number) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): EventSource {
    const eventSource = new EventSource(
      `${this.baseUrl}/upload-sessions/${sessionId}/progress`
    );

    eventSource.addEventListener('progress', (e) => {
      const data = JSON.parse(e.data);
      onProgress(data.progress);
    });

    eventSource.addEventListener('complete', () => {
      onComplete();
      eventSource.close();
    });

    eventSource.addEventListener('error', (e) => {
      onError(new Error('Upload progress stream error'));
      eventSource.close();
    });

    return eventSource;
  }

  /**
   * Validate files before upload
   */
  validateFiles(files: File[]): {
    valid: File[];
    invalid: Array<{ file: File; reason: string }>;
  } {
    const ALLOWED_EXTENSIONS = ['md', 'txt', 'log', 'pdf', 'docx', 'xls', 'csv', 'jpg', 'png', 'mp3', 'wav'];
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB

    const valid: File[] = [];
    const invalid: Array<{ file: File; reason: string }> = [];
    let totalSize = 0;

    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
        invalid.push({ file, reason: 'Invalid file type' });
      } else if (file.size > MAX_FILE_SIZE) {
        invalid.push({ file, reason: 'File too large (max 100MB)' });
      } else if (totalSize + file.size > MAX_TOTAL_SIZE) {
        invalid.push({ file, reason: 'Total size exceeds 500MB' });
      } else {
        valid.push(file);
        totalSize += file.size;
      }
    }

    return { valid, invalid };
  }

  /**
   * Resume an interrupted upload session
   */
  async resumeUpload(
    sessionId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<AttachmentInfo> {
    // Get session status
    const response = await fetch(`${this.baseUrl}/upload-sessions/${sessionId}`);

    if (!response.ok) {
      throw new Error('Failed to get upload session status');
    }

    const session = await response.json();
    const { uploadedChunks, totalChunks } = session;

    // Resume from last uploaded chunk
    for (let i = uploadedChunks; i < totalChunks; i++) {
      const start = i * this.chunkSize;
      const end = Math.min(start + this.chunkSize, file.size);
      const chunk = file.slice(start, end);

      await this.uploadChunk(sessionId, chunk, i, totalChunks);

      if (onProgress) {
        onProgress(((i + 1) / totalChunks) * 100);
      }
    }

    return this.finalizeUpload(sessionId);
  }
}

// Export singleton instance
export const complaintAPI = new ComplaintAPI();

// Export types
export type {
  ComplaintSubmission,
  AttachmentUpload,
  UploadSession,
  ComplaintResponse,
  AttachmentInfo
};