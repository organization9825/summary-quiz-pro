import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuiz } from '@/contexts/QuizContext';
import { Trophy, RotateCcw, CheckCircle, XCircle, Award } from 'lucide-react';

const Score: React.FC = () => {
  const { quizData, userAnswers, resetQuiz } = useQuiz();
  const navigate = useNavigate();

  if (!quizData || !quizData.questions.length || Object.keys(userAnswers).length === 0) {
    navigate('/');
    return null;
  }

  const { questions } = quizData;
  const totalQuestions = questions.length;
  
  // Calculate score
  const correctAnswers = questions.filter(q => 
    userAnswers[q.id] === q.correct_answer
  ).length;
  
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding! You have mastered this content.';
    if (score >= 80) return 'Great job! You have a solid understanding.';
    if (score >= 70) return 'Good work! You got most of it right.';
    if (score >= 60) return 'Not bad! Consider reviewing the material.';
    return 'Keep studying! Practice makes perfect.';
  };

  const handleTryAgain = () => {
    resetQuiz();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Quiz Complete!
          </h1>
          <p className="text-xl text-muted-foreground">
            Here's how you performed
          </p>
        </div>

        {/* Score Card */}
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {score >= 80 ? (
                  <Trophy className="w-10 h-10 text-primary" />
                ) : (
                  <Award className="w-10 h-10 text-primary" />
                )}
              </div>
              <CardTitle className="text-3xl mb-2">Your Score</CardTitle>
              <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>
                {score}%
              </div>
              <CardDescription className="text-lg">
                {correctAnswers} out of {totalQuestions} questions correct
              </CardDescription>
              <p className="text-base text-foreground mt-2">
                {getScoreMessage(score)}
              </p>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto">
                <Progress value={score} className="h-3 mb-4" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card className="shadow-card bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Detailed Results</CardTitle>
              <CardDescription>
                Review your answers for each question
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[question.id];
                const isCorrect = userAnswer === question.correct_answer;
                
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect
                        ? 'border-success/50 bg-success/5'
                        : 'border-destructive/50 bg-destructive/5'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">
                          {index + 1}. {question.question}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className={`${isCorrect ? 'text-success' : 'text-destructive'}`}>
                            <strong>Your answer:</strong> {question.options[userAnswer]}
                          </div>
                          {!isCorrect && (
                            <div className="text-success">
                              <strong>Correct answer:</strong> {question.options[question.correct_answer]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Action Button */}
          <Card className="shadow-card bg-gradient-card border-0">
            <CardContent className="flex justify-center pt-6">
              <Button
                onClick={handleTryAgain}
                size="lg"
                variant="hero"
                className="h-14 px-8 text-lg"
              >
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-5 h-5" />
                  <span>Try Another PDF</span>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-success/10 border border-success/20">
              <div className="text-3xl font-bold text-success mb-1">{correctAnswers}</div>
              <p className="text-sm font-medium">Correct Answers</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-destructive/10 border border-destructive/20">
              <div className="text-3xl font-bold text-destructive mb-1">{totalQuestions - correctAnswers}</div>
              <p className="text-sm font-medium">Incorrect Answers</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-primary/10 border border-primary/20">
              <div className="text-3xl font-bold text-primary mb-1">{score}%</div>
              <p className="text-sm font-medium">Overall Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;