import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatFileSize } from '@/services/documentService';

interface DocumentUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File;
  label: string;
}

export default function DocumentUploader({ onFileSelect, selectedFile, label }: DocumentUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1
  });

  return (
    <Card className="border-2 border-dashed transition-colors hover:border-primary">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center space-y-4 cursor-pointer transition-all ${
            isDragActive ? 'opacity-70' : ''
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            {selectedFile ? (
              <FileText className="w-8 h-8 text-primary" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">{label}</p>
            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-sm text-primary font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {isDragActive ? '释放文件以上传' : '点击或拖拽 .doc/.docx 文件到此处'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
