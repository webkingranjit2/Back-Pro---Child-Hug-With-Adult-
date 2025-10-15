
import React, { useRef } from 'react';
import { UploadCloudIcon, XCircleIcon } from './Icons';

interface ImageUploaderProps {
    title: string;
    imageData: { file: File; preview: string } | null;
    onImageUpload: (file: File, previewUrl: string) => void;
    onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, imageData, onImageUpload, onClear }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file, URL.createObjectURL(file));
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageUpload(file, URL.createObjectURL(file));
        }
    };
    
    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };


    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold text-gray-300 mb-2">{title}</h2>
            <div className="aspect-w-4 aspect-h-3">
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
                {!imageData ? (
                    <label
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => inputRef.current?.click()}
                        className="flex flex-col justify-center items-center w-full h-full rounded-lg border-2 border-dashed border-gray-600 hover:border-indigo-500 bg-gray-800/50 cursor-pointer transition-colors duration-300"
                    >
                        <UploadCloudIcon className="h-10 w-10 text-gray-500 mb-2" />
                        <span className="text-gray-400">Click or drag & drop</span>
                        <span className="text-xs text-gray-500">PNG, JPG, WEBP</span>
                    </label>
                ) : (
                    <div className="relative w-full h-full group">
                        <img
                            src={imageData.preview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                        />
                         <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 text-white p-1.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                            aria-label="Clear image"
                        >
                            <XCircleIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
