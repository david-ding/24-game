"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  coerceIntoNumber,
  Fraction,
  fractionToString,
  performAddition,
  performDivision,
  performMultiplication,
  performSubtraction,
} from "@/lib/math";
import { getRandomPuzzle } from "@/lib/puzzles";
import {
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Timer,
  Trophy,
  Undo,
  Lightbulb,
} from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SoundPlayer from "@/lib/sounds";

type GameState = {
  numbers: (number | Fraction)[];
  solutions: string[];
  history: string[];
};

type PlayerScore = {
  totalTime: number;
  solvedPuzzles: number;
};

const NumberDisplay: FC<{
  input: number | Fraction;
  isFirstNumber: boolean;
  isLastResult: boolean;
}> = ({ input, isFirstNumber, isLastResult }) => {
  if (typeof input === "number") {
    return <div>{input}</div>;
  }

  const { numerator, denominator, isNegative } = input;

  const viaColorClass =
    isFirstNumber && !isLastResult ? "via-yellow-900" : "via-white";
  const fractionClassName = `flex flex-col justify-between items-center px-1 bg-gradient-to-b from-transparent from-50% ${viaColorClass} via-[calc(50%+2px)] to-transparent to-[calc(50%+2px)]`;

  return (
    <div className="flex items-center gap-2">
      {isNegative && <div>-</div>}
      <div className={fractionClassName}>
        <div>{numerator}</div>
        <div>{denominator}</div>
      </div>
    </div>
  );
};

export default function Game() {
  const [gameStates, setGameStates] = useState<GameState[]>([]);
  const [currentState, setCurrentState] = useState<GameState>({
    numbers: [],
    solutions: [],
    history: [],
  });
  const [firstNumber, setFirstNumber] = useState<{
    value: number | Fraction;
    index: number;
  } | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [message, setMessage] = useState("");
  const [lastResultIndex, setLastResultIndex] = useState<number | null>(null);

  // Player state
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [round, setRound] = useState(1);
  const [player1Score, setPlayer1Score] = useState<PlayerScore>({
    totalTime: 0,
    solvedPuzzles: 0,
  });
  const [player2Score, setPlayer2Score] = useState<PlayerScore>({
    totalTime: 0,
    solvedPuzzles: 0,
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Add this state near your other state declarations
  const [showSolutionsModal, setShowSolutionsModal] = useState(false);

  // Initialize the game
  useEffect(() => {
    generateNumbers();
    startTimer();
    SoundPlayer.preloadSounds();

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isPaused || isGameOver) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now() - elapsedTime * 1000;

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const newElapsedTime = Math.floor((now - startTimeRef.current) / 1000);
      setElapsedTime(newElapsedTime);
    }, 100);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isPaused, isGameOver, currentPlayer]);

  // Auto-select the last result when a new number array is set
  useEffect(() => {
    if (
      lastResultIndex !== null &&
      lastResultIndex < currentState.numbers.length
    ) {
      setFirstNumber({
        value: currentState.numbers[lastResultIndex],
        index: lastResultIndex,
      });
    }
  }, [currentState.numbers, lastResultIndex]);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    setElapsedTime(0);
  };

  const switchPlayer = (isSolutionsShown = false) => {
    const timeToAdd = elapsedTime + (isSolutionsShown ? 60 : 0);

    SoundPlayer.play("switchPlayer");

    // Save current player's time
    if (currentPlayer === 1) {
      setPlayer1Score((prev) => ({
        ...prev,
        totalTime: prev.totalTime + timeToAdd,
        solvedPuzzles: prev.solvedPuzzles + 1,
      }));
      setCurrentPlayer(2);
    } else {
      setPlayer2Score((prev) => ({
        ...prev,
        totalTime: prev.totalTime + timeToAdd,
        solvedPuzzles: prev.solvedPuzzles + 1,
      }));
      setCurrentPlayer(1);

      // Update round if player 2 just finished
      const newRound = round + 1;
      if (newRound > 10) {
        setIsGameOver(true);
        return;
      }
      setRound(newRound);
    }

    // Reset timer and generate new numbers
    setElapsedTime(0);
    startTimeRef.current = Date.now();
    setLastResultIndex(null);
    generateNumbers();
  };

  const generateNumbers = () => {
    const puzzle = getRandomPuzzle();
    const initialState = {
      numbers: [...puzzle.numbers],
      solutions: [...puzzle.solutions],
      history: [],
    };
    setGameStates([initialState]);
    setCurrentState(initialState);
    setFirstNumber(null);
    setSelectedOperator(null);
    setResult(null);
    setMessage("");
    setLastResultIndex(null);
  };

  const calculateResult = (
    a: number | Fraction,
    operator: string,
    b: number | Fraction
  ): number | Fraction => {
    switch (operator) {
      case "+":
        return performAddition(a, b);
      case "-":
        return performSubtraction(a, b);
      case "×":
        return performMultiplication(a, b);
      case "÷":
        return performDivision(a, b);
      default:
        return 0;
    }
  };

  const handleNumberClick = (number: number | Fraction, index: number) => {
    if (isPaused || isGameOver) return;

    SoundPlayer.play("click");

    // If clicking the same number that's already selected, unselect it
    if (firstNumber && firstNumber.index === index) {
      setFirstNumber(null);
      return;
    }

    if (firstNumber === null) {
      // First number selection
      setFirstNumber({ value: number, index });
    } else if (selectedOperator) {
      // Second number selection with operator - perform calculation
      if (index !== firstNumber.index) {
        const result = calculateResult(
          firstNumber.value,
          selectedOperator,
          number
        );

        const newNumbers = currentState.numbers.filter(
          (_, i) => i !== index && i !== firstNumber.index
        );
        newNumbers.push(result);

        const newHistory = [
          ...currentState.history,
          `${fractionToString(
            firstNumber.value
          )} ${selectedOperator} ${fractionToString(
            number
          )} = ${fractionToString(result)}`,
        ];

        const newState = {
          ...currentState,
          numbers: newNumbers,
          history: newHistory,
        };

        setGameStates([...gameStates, newState]);
        setCurrentState(newState);
        setSelectedOperator(null);

        // Set the last result index to the last element in the array
        setLastResultIndex(newNumbers.length - 1);

        if (newNumbers.length === 1) {
          if (Math.abs(coerceIntoNumber(newNumbers[0]) - 24) < 0.0001) {
            SoundPlayer.play("success");
            setResult("correct");
            setMessage("Correct! You made 24!");
            setIsPaused(true);
            setFirstNumber(null);

            setTimeout(() => {
              setIsPaused(false);
              switchPlayer();
            }, 2000);
          } else {
            SoundPlayer.play("error");
            setResult("incorrect");
            setMessage(
              `Got ${fractionToString(newNumbers[0])}, but needed 24!`
            );
            setFirstNumber(null);
          }
        }
      }
    } else {
      // Clicking another number without an operator - replace the selection
      setFirstNumber({ value: number, index });
    }
  };

  const handleOperatorClick = (operator: string) => {
    if (!isPaused && !isGameOver && firstNumber !== null) {
      SoundPlayer.play("click");
      setSelectedOperator(operator);
    }
  };

  const handleUndo = () => {
    if (gameStates.length > 1) {
      const newStates = gameStates.slice(0, -1);
      setGameStates(newStates);
      setCurrentState(newStates[newStates.length - 1]);
      setFirstNumber(null);
      setSelectedOperator(null);
      setResult(null);
      setMessage("");

      // If we're going back to a state with more than 1 number, set the last result index
      if (newStates[newStates.length - 1].numbers.length > 1) {
        setLastResultIndex(null);
      }
    }
  };

  const resetToOriginal = () => {
    if (gameStates.length > 0) {
      setGameStates([gameStates[0]]);
      setCurrentState(gameStates[0]);
      setFirstNumber(null);
      setSelectedOperator(null);
      setResult(null);
      setMessage("");
      setLastResultIndex(null);
    }
  };

  const showAnswer = () => {
    SoundPlayer.play("showAnswer");
    setShowSolutionsModal(true);
    setIsPaused(true);
  };

  const onShowAnswerModalOpenChange = (isOpen: boolean) => {
    setShowSolutionsModal(isOpen);

    if (!isOpen) {
      switchPlayer(true);
      setIsPaused(false);
    }
  };

  const startNewGame = () => {
    setRound(1);
    setCurrentPlayer(1);
    setPlayer1Score({ totalTime: 0, solvedPuzzles: 0 });
    setPlayer2Score({ totalTime: 0, solvedPuzzles: 0 });
    setIsGameOver(false);
    setElapsedTime(0);
    startTimeRef.current = Date.now();
    setLastResultIndex(null);
    generateNumbers();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isGameOver) {
    const winner = player1Score.totalTime < player2Score.totalTime ? 1 : 2;
    return (
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 text-center">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-2">Player 1</h3>
            <p>Total Time: {formatTime(player1Score.totalTime)}</p>
            <p>Puzzles Solved: {player1Score.solvedPuzzles}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-2">Player 2</h3>
            <p>Total Time: {formatTime(player2Score.totalTime)}</p>
            <p>Puzzles Solved: {player2Score.solvedPuzzles}</p>
          </div>
        </div>
        <div className="text-xl font-bold mb-6 text-green-600">
          Player {winner} Wins!
        </div>
        <Button onClick={startNewGame} className="w-full">
          Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      {/* Game Info */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold">Round {round}/10</div>
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="text-center text-lg font-medium text-blue-800">
          Player {currentPlayer}'s Turn
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleUndo}
              disabled={gameStates.length <= 1 || isPaused}
              className="flex items-center gap-2"
            >
              <Undo className="h-4 w-4" />
              Undo
            </Button>
            <Button
              variant="outline"
              onClick={resetToOriginal}
              disabled={gameStates.length <= 1 || isPaused}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={showAnswer}
                  disabled={isPaused}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Show Answer
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>1 minute penalty</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* History */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 min-h-[60px] text-sm">
          {currentState.history.map((step, index) => (
            <div key={index} className="text-gray-600 mb-1">
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Available Numbers */}
      <div className="flex justify-center gap-4 mb-8">
        {currentState.numbers.map((number, index) => (
          <Card
            key={index}
            className={`w-16 h-20 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-200
              ${
                firstNumber?.index === index
                  ? "bg-yellow-400 text-yellow-900"
                  : index === lastResultIndex && firstNumber?.index !== index
                  ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-md"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
              } ${isPaused ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => handleNumberClick(number, index)}
          >
            <NumberDisplay
              input={number}
              isFirstNumber={firstNumber?.index === index}
              isLastResult={
                index === lastResultIndex && firstNumber?.index !== index
              }
            />
          </Card>
        ))}
      </div>

      {/* Operators */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {["+", "-", "×", "÷"].map((op) => (
          <Button
            key={op}
            variant={selectedOperator === op ? "default" : "outline"}
            onClick={() => handleOperatorClick(op)}
            disabled={firstNumber === null || isPaused}
            className={`text-lg ${
              selectedOperator === op ? "bg-blue-600 text-white" : ""
            }`}
          >
            {op}
          </Button>
        ))}
      </div>

      {/* Result Message */}
      {(result || message) && (
        <div
          className={`p-4 mb-6 rounded-lg flex items-center gap-2 ${
            result === "correct"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {result === "correct" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <p>{message}</p>
        </div>
      )}

      {/* Score Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={`p-3 rounded-lg ${
            currentPlayer === 1 ? "bg-blue-50" : "bg-gray-50"
          }`}
        >
          <div className="text-sm font-medium mb-1">Player 1</div>
          <div className="text-xs text-gray-600">
            Total: {formatTime(player1Score.totalTime)}
          </div>
        </div>
        <div
          className={`p-3 rounded-lg ${
            currentPlayer === 2 ? "bg-blue-50" : "bg-gray-50"
          }`}
        >
          <div className="text-sm font-medium mb-1">Player 2</div>
          <div className="text-xs text-gray-600">
            Total: {formatTime(player2Score.totalTime)}
          </div>
        </div>
      </div>

      {/* Add this Dialog component */}
      <Dialog
        open={showSolutionsModal}
        onOpenChange={onShowAnswerModalOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solutions</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {currentState.solutions.map((solution, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg text-center text-lg"
              >
                {solution}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              variant="default"
              onClick={() => onShowAnswerModalOpenChange(false)}
              className="w-full"
            >
              Proceed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
