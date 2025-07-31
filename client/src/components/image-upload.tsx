import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          <CloudUpload className="inline text-primary mr-2" size={20} />
          Upload Image
        </h2>
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary/50 hover:bg-primary/5'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <CloudUpload className="text-gray-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isDragActive ? "Drop your image here" : "Drop your image here"}
              </p>
              <p className="text-xs text-gray-500 mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
