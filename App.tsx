
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { LoaderIcon, DownloadIcon, SparklesIcon } from './components/Icons';
import { generateHuggingImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
    const [childImage, setChildImage] = useState<{ file: File; preview: string } | null>(null);
    const [adultImage, setAdultImage] = useState<{ file: File; preview: string } | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!childImage || !adultImage) {
            setError("Please upload both a child and an adult photo.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const childBase64 = await fileToBase64(childImage.file);
            const adultBase64 = await fileToBase64(adultImage.file);

            const resultBase64 = await generateHuggingImage(childBase64, childImage.file.type, adultBase64, adultImage.file.type);
            setGeneratedImage(`data:image/png;base64,${resultBase64}`);
        } catch (err) {
            console.error(err);
            setError("Failed to generate image. The model may be unavailable or the request was blocked. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [childImage, adultImage]);
    
    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'BackPro-result.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setChildImage(null);
        setAdultImage(null);
        setGeneratedImage(null);
        setError(null);
        setIsLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
                    BackPro
                </h1>
                <p className="text-gray-400 mt-2 text-lg">Embrace Your Younger Self</p>
            </header>

            <main className="w-full max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <ImageUploader
                        title="1. Upload Child Photo"
                        imageData={childImage}
                        onImageUpload={(file, preview) => setChildImage({ file, preview })}
                        onClear={() => setChildImage(null)}
                    />
                    <ImageUploader
                        title="2. Upload Adult Photo"
                        imageData={adultImage}
                        onImageUpload={(file, preview) => setAdultImage({ file, preview })}
                        onClear={() => setAdultImage(null)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <button
                        onClick={handleGenerate}
                        disabled={!childImage || !adultImage || isLoading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <LoaderIcon className="animate-spin h-5 w-5" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5" />
                                Generate Image
                            </>
                        )}
                    </button>
                    {(childImage || adultImage || generatedImage) && (
                         <button
                            onClick={handleReset}
                            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                        >
                            Start Over
                        </button>
                    )}
                </div>

                {error && (
                    <div className="text-center p-4 mb-8 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                <div className="w-full bg-gray-800/50 rounded-xl p-4 min-h-[300px] flex justify-center items-center backdrop-blur-sm border border-gray-700">
                    {isLoading ? (
                        <div className="text-center text-gray-400">
                             <LoaderIcon className="animate-spin h-10 w-10 mx-auto mb-4" />
                            <p className="text-lg">AI is creating your moment...</p>
                            <p className="text-sm">This can take a moment, please be patient.</p>
                        </div>
                    ) : generatedImage ? (
                        <div className="relative group">
                            <img src={generatedImage} alt="Generated result" className="rounded-lg max-w-full max-h-[70vh] shadow-2xl shadow-black/50" />
                            <button
                                onClick={handleDownload}
                                className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/75 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center gap-2"
                            >
                                <DownloadIcon className="h-5 w-5" />
                                Download
                            </button>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <p>Your generated image will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
             <footer className="text-center mt-12 text-gray-500 text-sm">
                <p>Powered by Gemini. Images are AI-generated and may not be perfect.</p>
            </footer>
        </div>
    );
};

export default App;
