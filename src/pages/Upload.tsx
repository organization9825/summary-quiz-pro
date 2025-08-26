import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuiz } from '@/contexts/QuizContext';
import { uploadPDF } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Upload as UploadIcon, FileText, Brain } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { setSummary, setIsLoading, isLoading } = useQuiz();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await uploadPDF(file);
      setSummary(response.summary);
      toast({
        title: "Success!",
        description: "PDF uploaded and summarized successfully.",
        variant: "default",
      });
      navigate('/summary');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload PDF",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative overflow-hidden rounded-3xl mb-8 shadow-elegant">
            <img 
              src={heroImage} 
              alt="PDF Summarizer & Quiz Generator" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-hero opacity-75"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  PDF Quiz Generator
                </h1>
                <p className="text-xl md:text-2xl opacity-90">
                  Transform your PDFs into interactive learning experiences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                Upload Your PDF
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Upload a PDF document to generate a summary and interactive quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-smooth cursor-pointer ${
                  isDragOver
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-border hover:border-primary/50 hover:bg-accent/20'
                } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <UploadIcon className="w-8 h-8 text-primary" />
                  </div>
                  
                  {file ? (
                    <div className="flex items-center space-x-2 text-primary">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-lg font-medium text-foreground mb-2">
                          Drop your PDF here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supported format: PDF (up to 10MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className="w-full h-12 text-lg"
                variant="hero"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Processing PDF...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>Generate Summary & Quiz</span>
                  </div>
                )}
              </Button>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Smart Summary</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI-powered document analysis
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Interactive Quiz</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Multiple choice questions
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <UploadIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Easy Upload</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag & drop or click to upload
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;