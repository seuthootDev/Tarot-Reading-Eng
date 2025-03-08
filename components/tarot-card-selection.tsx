"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TarotCardSelectionProps {
  selectedCards: number[]
  setSelectedCards: (cards: number[]) => void
  readingType: "past-present-future" | "zodiac-spread" | "zodiac-fortune"
  currentRound: number
  setShowReading: (show: boolean) => void
  onNextRound?: () => void
}

export default function TarotCardSelection({ 
  selectedCards, 
  setSelectedCards, 
  readingType,
  currentRound,
  setShowReading,
  onNextRound
}: TarotCardSelectionProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [availableCards, setAvailableCards] = useState<number[]>([])
  const [displayedCards, setDisplayedCards] = useState<number[]>([])

  useEffect(() => {
    const initialCards = Array.from({ length: 78 }, (_, i) => i)
    const remainingCards = initialCards.filter(card => !selectedCards.includes(card))
    const shuffled = [...remainingCards].sort(() => Math.random() - 0.5)
    
    setAvailableCards(shuffled)
    
    // 리딩 타입에 따라 표시할 카드 수 결정
    const displayCount = readingType === "zodiac-spread" 
      ? 16 
      : readingType === "zodiac-fortune"
        ? 9  // 별자리 연애운의 경우 9장만 표시
        : 16
    setDisplayedCards(shuffled.slice(0, displayCount))
  }, [currentRound, readingType])

  const handleCardSelect = (index: number) => {
    if (readingType === "zodiac-fortune") {
      // 별자리 연애운의 경우 1장만 선택 가능
      if (selectedCards.includes(index)) {
        setSelectedCards([])
      } else if (selectedCards.length === 0) {
        setSelectedCards([index])
      }
    } else if (readingType === "zodiac-spread") {
      const startIndex = (currentRound - 1) * 4
      const currentRoundCards = selectedCards.slice(startIndex, startIndex + 4)
      
      if (currentRoundCards.includes(index)) {
        // 현재 라운드에서 선택된 카드 제거
        const newSelectedCards = [...selectedCards]
        const removeIndex = startIndex + currentRoundCards.indexOf(index)
        newSelectedCards.splice(removeIndex, 1)
        setSelectedCards(newSelectedCards)
      } else if (currentRoundCards.length < 4) {
        // 새 카드 추가
        const newSelectedCards = [...selectedCards]
        newSelectedCards.splice(startIndex + currentRoundCards.length, 0, index)
        setSelectedCards(newSelectedCards)
      }
    } else {
      // 기존 로직 (과거-현재-미래 리딩)
      if (selectedCards.includes(index)) {
        setSelectedCards(selectedCards.filter(cardIndex => cardIndex !== index))
      } else if (selectedCards.length < 3) {
        setSelectedCards([...selectedCards, index])
      }
    }
  }

  // 현재 라운드의 선택된 카드 수 계산
  const getCurrentRoundSelectionCount = () => {
    if (readingType === "zodiac-spread") {
      const startIndex = (currentRound - 1) * 4
      return selectedCards.slice(startIndex, startIndex + 4).length
    }
    if (readingType === "zodiac-fortune") {
      return selectedCards.length === 1 ? 1 : 0
    }
    return selectedCards.length
  }

  const handleButtonClick = () => {
    if (readingType === "zodiac-spread" && currentRound < 3) {
      onNextRound?.();
    } else {
      setShowReading(true);
    }
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-purple-200">
          {readingType === "zodiac-spread" 
            ? `Round ${currentRound}: Select cards (${4 - getCurrentRoundSelectionCount()} remaining)`
            : readingType === "zodiac-fortune"
              ? "Select one card"
              : "Select your cards"}
        </h2>
        <p className="text-purple-300">
          {readingType === "zodiac-spread"
            ? `Choose 4 cards from 16 (Round ${currentRound}/3)`
            : readingType === "zodiac-fortune"
              ? "Choose one destiny card from 9 cards"
              : `You can select ${3 - selectedCards.length} more cards`}
        </p>
      </div>

      <div className={cn(
        "grid gap-4 max-w-4xl mx-auto",
        readingType === "zodiac-fortune"
          ? "grid-cols-3 md:grid-cols-9" // 별자리 연애운은 3x3 그리드
          : "grid-cols-4 md:grid-cols-8"
      )}>
        {displayedCards.map((cardIndex) => {
          const startIndex = (currentRound - 1) * 4
          const currentRoundCards = selectedCards.slice(startIndex, startIndex + 4)
          const isSelected = currentRoundCards.includes(cardIndex)

          return (
            <motion.div
              key={cardIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: displayedCards.indexOf(cardIndex) * 0.05 }}
              className="aspect-[2/3]"
            >
              <Card
                className={cn(
                  "w-full h-full cursor-pointer transition-all duration-300",
                  "relative overflow-hidden",
                  isSelected
                    ? "border-amber-400 shadow-lg shadow-amber-500/20"
                    : "border-indigo-700 hover:border-purple-400",
                )}
                onClick={() => handleCardSelect(cardIndex)}
                onMouseEnter={() => setHoveredCard(cardIndex)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="h-full flex items-center justify-center">
                  <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-950">
                    {/* Card back design */}
                    <div className="absolute inset-0">
                      {/* 메인 테두리 */}
                      <div className="absolute inset-2 border-2 border-gold-400/40" />
                      
                      {/* 반복되는 패턴 배경 */}
                      <div className="absolute inset-4 grid grid-cols-3 grid-rows-4 gap-1 p-2">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className="relative">
                            <div className="absolute inset-0 border border-purple-400/20 rotate-45" />
                            <div className="absolute inset-1 border border-amber-400/10" />
                          </div>
                        ))}
                      </div>

                      {/* 중앙 장식적 요소 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                          {/* 달 */}
                          <div className="absolute inset-0 border-2 border-amber-400/40 rounded-full" />
                          {/* 별 */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3/4 h-3/4 relative">
                              {[0, 45, 90, 135].map((rotation) => (
                                <div
                                  key={rotation}
                                  className="absolute inset-0 border border-purple-400/30"
                                  style={{ transform: `rotate(${rotation}deg)` }}
                                />
                              ))}
                            </div>
                          </div>
                          {/* 신비로운 문양 */}
                          <div className="absolute inset-2 flex items-center justify-center">
                            <div className="w-2/3 h-2/3 border border-amber-400/40 rotate-45" />
                          </div>
                        </div>
                      </div>

                      {/* 모서리 장식 */}
                      <div className="absolute top-2 left-2 w-6 h-6">
                        <div className="absolute inset-0 border-t-2 border-l-2 border-amber-400/40" />
                        <div className="absolute inset-1 rotate-45 border border-purple-400/30" />
                      </div>
                      <div className="absolute top-2 right-2 w-6 h-6 rotate-90">
                        <div className="absolute inset-0 border-t-2 border-l-2 border-amber-400/40" />
                        <div className="absolute inset-1 rotate-45 border border-purple-400/30" />
                      </div>
                      <div className="absolute bottom-2 left-2 w-6 h-6 -rotate-90">
                        <div className="absolute inset-0 border-t-2 border-l-2 border-amber-400/40" />
                        <div className="absolute inset-1 rotate-45 border border-purple-400/30" />
                      </div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 rotate-180">
                        <div className="absolute inset-0 border-t-2 border-l-2 border-amber-400/40" />
                        <div className="absolute inset-1 rotate-45 border border-purple-400/30" />
                      </div>

                      {/* 추가적인 장식적 요소들 */}
                      <div className="absolute inset-8 border border-purple-400/20 rounded-full" />
                      <div className="absolute inset-10 border border-amber-400/10 rotate-45" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* 리딩 버튼 */}
      {((readingType === "zodiac-fortune" && selectedCards.length === 1) ||
        (readingType === "zodiac-spread" && getCurrentRoundSelectionCount() === 4) ||
        (readingType === "past-present-future" && selectedCards.length === 3)) && (
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleButtonClick}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-2 rounded-full text-lg shadow-lg shadow-purple-900/30"
          >
            {readingType === "zodiac-fortune" 
              ? "View Love Fortune" 
              : readingType === "zodiac-spread" && currentRound < 3
                ? "Next Round"
                : "View Reading"}
          </button>
        </motion.div>
      )}
    </div>
  )
}

