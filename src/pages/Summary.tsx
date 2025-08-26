import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuiz } from '@/contexts/QuizContext';
import { generateQuiz } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BookOpen, ArrowLeft, BrainCircuit } from 'lucide-react';

const Summary: React.FC = () => {
  const { summary, setQuizData, isLoading, setIsLoading } = useQuiz();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await generateQuiz();
      setQuizData({ questions: response.questions, summary });
      toast({
        title: "Quiz generated!",
        description: "Your quiz is ready. Let's test your knowledge!",
        variant: "default",
      });
      navigate('/quiz');
    } catch (error) {
      toast({
        title: "Quiz generation failed",
        description: error instanceof Error ? error.message : "Failed to generate quiz",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!summary) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Document Summary
            </h1>
            <p className="text-xl text-muted-foreground">
              Here's what we extracted from your PDF
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Summary</CardTitle>
                  <CardDescription>
                    AI-generated summary of your document
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <div className="bg-accent/30 rounded-xl p-6 border border-border/50">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {summary}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Generation Card */}
          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BrainCircuit className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Ready for a Quiz?</CardTitle>
              <CardDescription className="text-lg">
                Test your understanding with an interactive quiz based on this summary
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                onClick={handleGenerateQuiz}
                disabled={isLoading}
                size="lg"
                variant="hero"
                className="h-14 px-8 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Generating Quiz...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <BrainCircuit className="w-5 h-5" />
                    <span>Generate Interactive Quiz</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Features Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-accent/20 border border-border/50">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Comprehensive</h3>
              <p className="text-sm text-muted-foreground">
                Covers all key points from your document
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-accent/20 border border-border/50">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <BrainCircuit className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Adaptive</h3>
              <p className="text-sm text-muted-foreground">
                Questions tailored to document content
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-accent/20 border border-border/50">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-semibold mb-2">Interactive</h3>
              <p className="text-sm text-muted-foreground">
                Engaging multiple-choice format
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;