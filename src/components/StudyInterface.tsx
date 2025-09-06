"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Shuffle, 
  CheckCircle,
  ArrowLeft,
  Trophy
} from "lucide-react";

interface StudyCard {
  id: number;
  front: string;
  back: string;
}

interface StudyDeck {
  id: number;
  title: string;
  description: string | null;
  cards: StudyCard[];
}

interface StudyInterfaceProps {
  deck: StudyDeck;
}

export function StudyInterface({ deck }: StudyInterfaceProps) {
  const router = useRouter();
  const [cards, setCards] = useState<StudyCard[]>(deck.cards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
  const [isStudyComplete, setIsStudyComplete] = useState(false);

  // Check if study is complete
  useEffect(() => {
    if (studiedCards.size === cards.length && cards.length > 0) {
      setIsStudyComplete(true);
    }
  }, [studiedCards, cards.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
          previousCard();
          break;
        case 'ArrowRight':
        case 'd':
          nextCard();
          break;
        case ' ':
        case 'f':
          event.preventDefault();
          flipCard();
          break;
        case 'r':
          resetStudy();
          break;
        case 's':
          shuffleCards();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentCardIndex, isFlipped]);

  const flipCard = useCallback(() => {
    setIsFlipped(!isFlipped);
    
    // Mark card as studied when flipped to back
    if (!isFlipped) {
      setStudiedCards(prev => new Set(prev).add(cards[currentCardIndex].id));
    }
  }, [isFlipped, cards, currentCardIndex]);

  const nextCard = useCallback(() => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  }, [currentCardIndex, cards.length]);

  const previousCard = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  }, [currentCardIndex]);

  const goToCard = useCallback((index: number) => {
    setCurrentCardIndex(index);
    setIsFlipped(false);
  }, []);

  const shuffleCards = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [cards]);

  const resetStudy = useCallback(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
    setIsStudyComplete(false);
  }, []);

  const restartStudy = useCallback(() => {
    resetStudy();
    setCards(deck.cards);
  }, [deck.cards]);

  const shuffleAndRestart = useCallback(() => {
    const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
    setIsStudyComplete(false);
  }, [deck.cards]);

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;
  const studiedProgress = (studiedCards.size / cards.length) * 100;

  if (isStudyComplete) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <div className="text-center space-y-8">
          {/* Completion Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Trophy className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-green-600 dark:text-green-400">
              Study Complete!
            </h1>
            <p className="text-xl text-muted-foreground">
              You've reviewed all {cards.length} cards in "{deck.title}"
            </p>
          </div>

          {/* Study Stats */}
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Study Session Complete</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{cards.length}</div>
                    <div className="text-muted-foreground">Cards Studied</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-muted-foreground">Progress</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={restartStudy} size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Study Again
            </Button>
            <Button onClick={shuffleAndRestart} variant="outline" size="lg">
              <Shuffle className="h-4 w-4 mr-2" />
              Study Shuffled
            </Button>
            <Link href={`/decks/${deck.id}`}>
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Deck
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-4">
          <Link href={`/decks/${deck.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Deck
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{deck.title}</h1>
            <p className="text-muted-foreground">Study Mode</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{currentCardIndex + 1} / {cards.length}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Study Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Studied</span>
              <span>{studiedCards.size} / {cards.length}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${studiedProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <div 
          className="relative w-full h-96 cursor-pointer group perspective-1000"
          onClick={flipCard}
        >
          <div 
            className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of Card */}
            <Card className="absolute inset-0 backface-hidden border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Front
                  </div>
                  <div className="text-xl md:text-2xl font-medium leading-relaxed">
                    {currentCard.front}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Click to reveal answer
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back of Card */}
            <Card className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-green-200 hover:border-green-300 transition-colors">
              <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                    Back
                  </div>
                  <div className="text-xl md:text-2xl font-medium leading-relaxed">
                    {currentCard.back}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    Card studied!
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="space-y-6">
        {/* Main Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            onClick={previousCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            size="lg"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button 
            onClick={flipCard}
            variant="default"
            size="lg"
            className="min-w-24"
          >
            {isFlipped ? 'Hide' : 'Reveal'}
          </Button>
          
          <Button 
            onClick={nextCard}
            disabled={currentCardIndex === cards.length - 1}
            variant="outline"
            size="lg"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button onClick={shuffleCards} variant="outline" size="sm">
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
          <Button onClick={resetStudy} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Progress
          </Button>
        </div>

        {/* Card Indicators */}
        <div className="flex flex-wrap justify-center gap-1">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentCardIndex 
                  ? 'bg-blue-600' 
                  : studiedCards.has(cards[index].id)
                  ? 'bg-green-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              title={`Card ${index + 1}${studiedCards.has(cards[index].id) ? ' (studied)' : ''}`}
            />
          ))}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Keyboard shortcuts: <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">←</kbd> Previous • <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">→</kbd> Next • <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Space</kbd> Flip • <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">S</kbd> Shuffle • <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">R</kbd> Reset</p>
        </div>
      </div>
    </div>
  );
}
