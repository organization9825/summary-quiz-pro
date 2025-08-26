import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useQuiz } from '@/contexts/QuizContext';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const Quiz: React.FC = () => {
  const { quizData, setUserAnswers } = useQuiz();
  const [currentAnswers, setCurrentAnswers] = useState<{ [key: number]: number }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  if (!quizData || !quizData.questions.length) {
    navigate('/');
    return null;
  }

  const { questions } = quizData;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setUserAnswers(currentAnswers);
    navigate('/score');
  };

  const currentQ = questions[currentQuestion];
  const canProceed = currentAnswers[currentQ.id] !== undefined;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allQuestionsAnswered = questions.every(q => currentAnswers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/summary')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Summary
          </Button>
          
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Quiz Time!
            </h1>
            <p className="text-xl text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress: {Math.round(progress)}%</span>
              <span>{questions.length - Object.keys(currentAnswers).length} questions remaining</span>
            </div>
          </div>
        </div>

        {/* Quiz Card */}
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="font-bold text-primary">{currentQuestion + 1}</span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">
                    {currentQ.question}
                  </CardTitle>
                  <CardDescription>
                    Select the best answer from the options below
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Answer Options */}
              <RadioGroup
                value={currentAnswers[currentQ.id]?.toString()}
                onValueChange={(value) => handleAnswerChange(currentQ.id, parseInt(value))}
                className="space-y-3"
              >
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-xl border transition-smooth cursor-pointer ${
                      currentAnswers[currentQ.id] === index
                        ? 'border-primary bg-primary/5 shadow-card'
                        : 'border-border hover:border-primary/50 hover:bg-accent/20'
                    }`}
                    onClick={() => handleAnswerChange(currentQ.id, index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-base"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {canProceed ? (
                    <div className="flex items-center space-x-1 text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span>Answer selected</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-warning">
                      <AlertCircle className="w-4 h-4" />
                      <span>Please select an answer</span>
                    </div>
                  )}
                </div>

                {isLastQuestion ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!allQuestionsAnswered}
                    variant="success"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    variant="default"
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Overview */}
          <div className="mt-6 p-4 rounded-xl bg-accent/20 border border-border/50">
            <h3 className="font-semibold mb-3">Question Overview</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg border transition-smooth ${
                    index === currentQuestion
                      ? 'border-primary bg-primary text-primary-foreground'
                      : currentAnswers[questions[index].id] !== undefined
                      ? 'border-success bg-success/10 text-success'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;