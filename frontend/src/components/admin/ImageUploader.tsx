'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { axiosInstance } from '@/lib/api';
import toast from 'react-hot-toast';

interface UploadedImage {
  url: string;
  publicId: string;
  alt?: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 6 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await axiosInstance.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch {
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = maxImages - images.length;
    if (remaining <= 0) { toast.error(`Maximum ${maxImages} images allowed`); return; }

    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    const results = await Promise.all(toUpload.map(uploadFile));
    const successful = results.filter(Boolean) as UploadedImage[];

    if (successful.length > 0) {
      onChange([...images, ...successful]);
      toast.success(`${successful.length} image${successful.length > 1 ? 's' : ''} uploaded`);
    }
    setUploading(false);
  }, [images, maxImages, onChange]);

  const removeImage = async (index: number) => {
    const img = images[index];
    try {
      await axiosInstance.delete('/upload/image', { data: { publicId: img.publicId } });
    } catch {
      // Ignore delete errors — remove from UI anyway
    }
    onChange(images.filter((_, i) => i !== index));
  };

  const updateAlt = (index: number, alt: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], alt };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {images.length < maxImages && (
        <label
          className={`relative flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all
            ${dragOver ? 'border-sand bg-sand-50' : 'border-sand-200 hover:border-sand-400 hover:bg-sand-50/50'}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? (
            <Loader2 size={24} className="text-sand animate-spin" />
          ) : (
            <>
              <Upload size={24} className="text-sand-400 mb-2" />
              <p className="text-sm font-medium text-charcoal-muted">
                Drop images or <span className="text-sand">browse</span>
              </p>
              <p className="text-xs text-charcoal-muted/60 mt-1">
                JPG, PNG, WebP · max 5MB · {images.length}/{maxImages} used
              </p>
            </>
          )}
        </label>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div key={img.publicId || idx} className="group relative">
              <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-sand-50">
                <Image src={img.url} alt={img.alt || `Product image ${idx + 1}`} fill className="object-cover" sizes="150px" />
                {idx === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-charcoal/80 text-cream text-[10px] px-2 py-0.5 rounded-full font-medium">
                    Cover
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X size={11} />
              </button>
              <input
                type="text"
                placeholder="Alt text"
                value={img.alt || ''}
                onChange={(e) => updateAlt(idx, e.target.value)}
                className="mt-1 w-full text-xs border border-sand-100 rounded-lg px-2 py-1 text-charcoal-muted focus:outline-none focus:border-sand"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
