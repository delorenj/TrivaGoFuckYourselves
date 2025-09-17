# Complaint Submission System Architecture

## System Overview
A robust complaint submission system allowing users to submit detailed complaints with supporting file attachments.

## Core Requirements
- Text-based complaint submission via textarea
- Multi-file upload support (individual files or folders)
- Supported file types: md, txt, log, pdf, docx, xls, csv, jpg, png, mp3, wav
- Secure file handling and storage
- Progress tracking for large uploads
- File validation and sanitization

## Architecture Components

### 1. Frontend Layer

#### Component Structure
```typescript
// Main Components
ComplaintForm
├── ComplaintTextInput
├── FileUploadZone
│   ├── DragDropArea
│   ├── FileSelector
│   └── FolderSelector
├── FileList
│   └── FileItem (preview, remove, status)
├── SubmitButton
└── ProgressIndicator

// Supporting Components
FileValidator
FilePreview
ErrorBoundary
```

#### Technology Stack
- **React/Next.js** for component architecture
- **react-dropzone** for drag-and-drop functionality
- **File API** for client-side file handling
- **WebWorkers** for file processing (checksums, validation)

### 2. API Layer

#### RESTful Endpoints
```yaml
POST /api/complaints
  - Body: complaint text, metadata
  - Returns: complaint_id, upload_url

POST /api/complaints/{id}/attachments
  - Multipart form data
  - Chunked upload support
  - Returns: attachment_ids, status

GET /api/complaints/{id}
  - Returns: complaint details with attachments

DELETE /api/complaints/{id}/attachments/{attachment_id}
  - Soft delete attachment

GET /api/upload-progress/{upload_id}
  - WebSocket/SSE for real-time progress
```

#### GraphQL Alternative
```graphql
type Mutation {
  createComplaint(input: ComplaintInput!): Complaint!
  uploadAttachment(complaintId: ID!, file: Upload!): Attachment!
  removeAttachment(attachmentId: ID!): Boolean!
}

type Subscription {
  uploadProgress(uploadId: ID!): UploadStatus!
}
```

### 3. Backend Services

#### Microservices Architecture
```
┌──────────────────┐     ┌──────────────────┐
│   API Gateway    │────▶│ Complaint Service│
└──────────────────┘     └──────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌──────────────────┐     ┌──────────────────┐
│  Upload Service  │────▶│  Storage Service │
└──────────────────┘     └──────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌──────────────────┐     ┌──────────────────┐
│Validation Service│────▶│ Notification Svc │
└──────────────────┘     └──────────────────┘
```

#### Service Responsibilities
- **Complaint Service**: Core complaint logic, metadata management
- **Upload Service**: File upload handling, chunking, resumable uploads
- **Storage Service**: File storage abstraction (S3, Azure, GCS)
- **Validation Service**: File type validation, virus scanning, content moderation
- **Notification Service**: Email/webhook notifications on submission

### 4. Data Layer

#### Database Schema (PostgreSQL)
```sql
-- Complaints table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    complaint_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    category VARCHAR(100),
    priority VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attachments table
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    storage_path TEXT NOT NULL,
    checksum VARCHAR(64),
    scan_status VARCHAR(50) DEFAULT 'pending',
    metadata JSONB,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Upload sessions for resumable uploads
CREATE TABLE upload_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID REFERENCES complaints(id),
    file_identifier VARCHAR(255),
    total_chunks INTEGER,
    uploaded_chunks INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
```

### 5. File Storage Architecture

#### Storage Strategy
```
Primary Storage (Hot)
├── S3 / Azure Blob / GCS
│   ├── /complaints/{year}/{month}/{complaint_id}/
│   │   ├── {attachment_id}_original.{ext}
│   │   └── {attachment_id}_processed.{ext}
│   └── /temp/uploads/{session_id}/

Archive Storage (Cold)
└── Glacier / Archive Tier
    └── /archived/{year}/{complaint_id}.tar.gz
```

#### CDN Configuration
- CloudFlare/Cloudfront for static file delivery
- Signed URLs for secure access
- Cache headers for optimized delivery

### 6. Security Architecture

#### File Upload Security
```typescript
interface SecurityChecks {
  fileTypeValidation: {
    allowedExtensions: string[];
    mimeTypeVerification: boolean;
    magicNumberCheck: boolean;
  };

  sizeLimits: {
    maxFileSize: number; // 100MB per file
    maxTotalSize: number; // 500MB total
    maxFileCount: number; // 20 files
  };

  contentScanning: {
    antivirusEnabled: boolean;
    contentModeration: boolean;
    metadataStripping: boolean;
  };

  accessControl: {
    signedUrls: boolean;
    ipWhitelisting: boolean;
    rateLimiting: RateLimitConfig;
  };
}
```

### 7. Infrastructure Components

#### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: complaint-system
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: complaint-api:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
      - name: upload-worker
        image: upload-worker:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
```

#### Message Queue (RabbitMQ/SQS)
```
Queues:
├── file-upload-queue
├── file-validation-queue
├── virus-scan-queue
├── notification-queue
└── archive-queue
```

### 8. Frontend Implementation Details

#### React Component Example
```tsx
interface FileUploadProps {
  complaintId: string;
  onUploadComplete: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

const FileUploadComponent: React.FC<FileUploadProps> = ({
  complaintId,
  onUploadComplete,
  maxFiles = 20,
  maxSize = 104857600 // 100MB
}) => {
  const allowedTypes = [
    'text/markdown', 'text/plain', 'application/pdf',
    'application/vnd.ms-excel', 'text/csv',
    'image/jpeg', 'image/png',
    'audio/mpeg', 'audio/wav'
  ];

  // Implementation details...
};
```

### 9. Error Handling Strategy

#### Client-Side Errors
```typescript
enum UploadError {
  FILE_TOO_LARGE = 'File exceeds maximum size limit',
  INVALID_TYPE = 'File type not supported',
  NETWORK_ERROR = 'Network connection lost',
  QUOTA_EXCEEDED = 'Upload quota exceeded',
  CORRUPTED_FILE = 'File appears to be corrupted'
}
```

#### Server-Side Error Responses
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "File validation failed",
    "details": {
      "file": "document.pdf",
      "reason": "Virus detected",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 10. Performance Optimization

#### Upload Optimization
- **Chunked uploads** for files > 5MB
- **Parallel chunk upload** using Web Workers
- **Resumable uploads** with session tracking
- **Client-side compression** for text files
- **Progressive enhancement** for older browsers

#### Caching Strategy
- **Browser cache** for static assets
- **Redis cache** for upload sessions
- **CDN cache** for processed files
- **Database query cache** for complaint data

## Deployment Strategy

### Environment Configuration
```yaml
development:
  storage: local-filesystem
  max_file_size: 10MB
  virus_scan: disabled

staging:
  storage: s3-staging
  max_file_size: 50MB
  virus_scan: clamav

production:
  storage: s3-production
  max_file_size: 100MB
  virus_scan: commercial-scanner
  cdn: cloudflare
```

## Monitoring & Observability

### Key Metrics
- Upload success/failure rates
- Average upload time by file size
- Storage usage trends
- API response times
- Error rates by type

### Logging Strategy
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "service": "upload-service",
  "event": "file_uploaded",
  "complaint_id": "uuid",
  "file_id": "uuid",
  "size": 1048576,
  "duration_ms": 1250,
  "user_id": "uuid"
}
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API services
- Distributed file processing
- Queue-based async processing
- Auto-scaling based on queue depth

### Vertical Scaling
- Dedicated upload workers
- Memory-optimized instances for file processing
- GPU instances for ML-based content moderation

## Compliance & Legal

### Data Protection
- GDPR compliance for EU users
- CCPA compliance for California users
- Right to deletion implementation
- Data retention policies

### Audit Trail
- Complete upload history
- File access logs
- Modification tracking
- Compliance reporting

## Cost Optimization

### Storage Tiering
- Hot tier: Recent complaints (< 30 days)
- Warm tier: Active complaints (30-90 days)
- Cold tier: Archived complaints (> 90 days)

### Transfer Optimization
- Direct browser-to-S3 uploads
- CloudFront for global distribution
- Compression for text files
- Lazy loading for previews