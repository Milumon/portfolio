'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Copy, Trash2, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { validateFile, GitHubFile } from '@/lib/services/github-api';
import Image from 'next/image';

interface ImageManagerProps {
  onImageSelect?: (url: string) => void;
  selectedImageUrl?: string;
}

export function ImageManager({ onImageSelect, selectedImageUrl }: ImageManagerProps) {
  const [images, setImages] = useState<GitHubFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/github/images');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      setError('Failed to load images');
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload via API
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/github/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }


      clearInterval(progressInterval);
      setUploadProgress(100);

      setSuccess(`Image "${file.name}" uploaded successfully!`);
      await loadImages(); // Reload images list

      // Auto-select the uploaded image if callback provided
      if (onImageSelect) {
        const pagesUrl = `https://milumon.github.io/portfolio/public/images/projects/${file.name}`;
        onImageSelect(pagesUrl);
      }

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteImage = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      const response = await fetch(`/api/github/images?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      setSuccess(`Image "${fileName}" deleted successfully!`);
      await loadImages();

      // Clear selection if deleted image was selected
      if (selectedImageUrl && selectedImageUrl.includes(fileName) && onImageSelect) {
        onImageSelect('');
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (_err) {
      setError('Failed to delete image');
      console.error('Delete error:', _err);
    }
  };

  const handleCopyUrl = async (fileName: string) => {
    const pagesUrl = `https://milumon.github.io/portfolio/public/images/projects/${fileName}`;
    try {
      await navigator.clipboard.writeText(pagesUrl);
      setSuccess('GitHub Pages URL copied to clipboard!');
      setTimeout(() => setSuccess(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = pagesUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setSuccess('GitHub Pages URL copied to clipboard!');
      setTimeout(() => setSuccess(null), 2000);
    }
  };


  return (
    <div className="space-y-4" data-image-manager>
      {/* Compact Upload Section */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Images
          </h3>
          <span className="text-xs text-slate-400">{images.length} uploaded</span>
        </div>

        <div className="space-y-3">
          {/* Drag & Drop Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer ${
              uploading
                ? 'border-primary/50 bg-primary/10'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <div className="text-center">
              <Upload className={`w-8 h-8 mx-auto mb-2 ${uploading ? 'text-primary' : 'text-white/60'}`} />
              <p className="text-white font-medium mb-1">
                {uploading ? 'Uploading...' : 'Drop image here or click to browse'}
              </p>
              <p className="text-slate-400 text-sm">
                PNG, JPG, WebP up to 5MB
              </p>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ display: 'none' }}
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          <AlertCircle className="w-4 h-4" />
          {error}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setError(null)}
            className="ml-auto h-4 w-4 p-0 text-red-300 hover:text-red-100"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Images Gallery */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Images
          </h3>
          <span className="text-xs text-slate-400">{images.length} total</span>
        </div>
        <div>
          {loading ? (
            <div className="text-center py-4 text-slate-400 text-sm">Loading...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-4 text-slate-400 text-sm">
              No images yet
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((image) => {
                const imagePagesUrl = `https://milumon.github.io/portfolio/public/images/projects/${image.name}`;
                const isImageSelected = selectedImageUrl === imagePagesUrl;

                return (
                  <div
                    key={image.name}
                    className={`relative border-2 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                      isImageSelected
                        ? 'border-primary shadow-lg shadow-primary/20'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => onImageSelect?.(imagePagesUrl)}
                  >
                    {/* Image */}
                    <div className="aspect-square bg-black/20 flex items-center justify-center">
                      <Image
                        src={imagePagesUrl}
                        alt={image.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                        priority={true}
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5LjkgMTlDNC42IDE4IDMgMTYuMSAzIDE2VjRDMyAyLjkgMy45IDIgNSAySDRDMi45IDIgMiAzLjkgMiA1VjE5QzIgMjAuMSAyLjkgMjEgNSAyMUM3LjEgMjEgOCAyMC4xIDggMTlWMUM4IDAuMSAxMC4xIDAgMTIgMFoiIGZpbGw9IiM2MzY2ZjEiLz4KPC9zdmc+';
                        }}
                      />
                    </div>

                    {/* Selection indicator */}
                    {isImageSelected && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(image.name);
                          }}
                          className="bg-white/20 hover:bg-white/30 text-white h-8 w-8 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.name);
                          }}
                          className="bg-red-500/80 hover:bg-red-600 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Image name */}
                    <div className="p-2 bg-white/5">
                      <p className="text-white text-xs font-medium truncate" title={image.name}>
                        {image.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}