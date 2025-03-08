"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Clock, Asterisk, Star } from "lucide-react"
import TarotCardSelection from "@/components/tarot-card-selection"
import TarotReading from "@/components/tarot-reading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ZodiacSpreadReading from "@/components/zodiac-spread-reading"
import ZodiacSignSelection from "@/components/zodiac-sign-selection"
import LoveFortuneReading from "@/components/love-fortune-reading"

type ReadingType = "past-present-future" | "zodiac-spread" | "zodiac-fortune" | null;

// Zodiac Wheel 컴포넌트 추가
const ZodiacWheel = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1"
      className="opacity-70"
    />
    <circle
      cx="12"
      cy="12"
      r="7"
      stroke="currentColor"
      strokeWidth="0.5"
      className="opacity-50"
    />
    {/* 12개의 구획선 */}
    {[...Array(12)].map((_, i) => (
      <line
        key={i}
        x1="12"
        y1="5"
        x2="12"
        y2="2"
        stroke="currentColor"
        strokeWidth="0.5"
        className="opacity-60"
        transform={`rotate(${i * 30} 12 12)`}
      />
    ))}
    {/* 작은 장식 점들 */}
    {[...Array(12)].map((_, i) => (
      <circle
        key={i}
        cx="12"
        cy="3.5"
        r="0.5"
        fill="currentColor"
        className="opacity-80"
        transform={`rotate(${i * 30} 12 12)`}
      />
    ))}
  </svg>
);

const getHeaderText = (readingType: ReadingType) => {
  switch (readingType) {
    case "past-present-future":
      return "Tarot Reading: Exploring Your Past, Present, and Future";
    case "zodiac-spread":
      return "Destiny Tarot Reading Through the 12 Houses of the Zodiac";
    case "zodiac-fortune":
      return "Your Love Fortune Through the Stars";
    default:
      return "Choose Your Preferred Tarot Reading Method";
  }
};

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [showReading, setShowReading] = useState(false)
  const [readingType, setReadingType] = useState<ReadingType>(null)
  const [currentRound, setCurrentRound] = useState(1)
  const [selectedSign, setSelectedSign] = useState<string | null>(null)

  const startOver = () => {
    setSelectedCards([])
    setShowReading(false)
    setReadingType(null)
    setSelectedSign(null)
  }

  const handleNextRound = () => {
    if (readingType === "zodiac-spread" && currentRound < 3) {
      setCurrentRound(prev => prev + 1)
    }
  }

  // 현재 라운드의 선택이 완료되었는지 확인하는 함수
  const isCurrentRoundComplete = () => {
    if (readingType === "zodiac-spread") {
      const startIndex = (currentRound - 1) * 4;
      const currentRoundCards = selectedCards.slice(startIndex, startIndex + 4);
      return currentRoundCards.length === 4;
    }
    return selectedCards.length === 3; // 과거-현재-미래 리딩의 경우
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-[url('/stars-bg.svg')] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-8">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Mystical Tarot Reading
          </motion.h1>
          <motion.p
            className="text-lg text-purple-200 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {getHeaderText(readingType)}
            <Sparkles className="inline-block ml-2 text-amber-300" />
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {!readingType ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4"
            >
              {/* Love Fortune by Zodiac Sign */}
              <Card
                className="group relative overflow-hidden p-6 border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20"
                onClick={() => setReadingType("zodiac-fortune")}
              >
                {/* 우주 배경 */}
                <div className="absolute inset-0 bg-black">
                  {/* 별들 */}
                  <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          width: `${Math.random() * 2 + 1}px`,
                          height: `${Math.random() * 2 + 1}px`,
                          opacity: Math.random() * 0.7 + 0.3,
                          animation: `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  {/* 컬러 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-cyan-900/30" />
                </div>

                <div className="relative text-center z-10">
                  <div className="relative">
                    <div className="absolute inset-0 blur-sm">
                      <Star className="w-12 h-12 mx-auto mb-4 text-blue-300/50" />
                    </div>
                    <Star className="w-12 h-12 mx-auto mb-4 text-blue-200 animate-pulse-slow animate-glow" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Love Fortune by Zodiac</h3>
                  <p className="text-sm text-blue-200">
                    Discover your love and romance fortune through your zodiac sign
                  </p>
                </div>
              </Card>

              {/* Past-Present-Future Reading */}
              <Card
                className="group relative overflow-hidden p-6 border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20"
                onClick={() => setReadingType("past-present-future")}
              >
                {/* 우주 배경 */}
                <div className="absolute inset-0 bg-black">
                  {/* 별들 */}
                  <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          width: `${Math.random() * 2 + 1}px`,
                          height: `${Math.random() * 2 + 1}px`,
                          opacity: Math.random() * 0.7 + 0.3,
                          animation: `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  {/* 컬러 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-indigo-900/30" />
                </div>

                <div className="relative text-center z-10">
                  <div className="relative">
                    <div className="absolute inset-0 blur-sm">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-purple-300/50" />
                    </div>
                    <Clock className="w-12 h-12 mx-auto mb-4 text-purple-200 animate-spin-slow" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Past-Present-Future</h3>
                  <p className="text-sm text-purple-200">
                    Explore your past, present, and future through the flow of time
                  </p>
                </div>
              </Card>

              {/* Zodiac Spread */}
              <Card
                className="group relative overflow-hidden p-6 border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-indigo-500/20"
                onClick={() => setReadingType("zodiac-spread")}
              >
                {/* 우주 배경 */}
                <div className="absolute inset-0 bg-black">
                  {/* 별들 */}
                  <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          width: `${Math.random() * 2 + 1}px`,
                          height: `${Math.random() * 2 + 1}px`,
                          opacity: Math.random() * 0.7 + 0.3,
                          animation: `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  {/* 컬러 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-blue-900/30" />
                </div>

                <div className="relative text-center z-10">
                  <div className="relative">
                    <div className="absolute inset-0 blur-sm">
                      <ZodiacWheel className="w-12 h-12 mx-auto mb-4 text-indigo-300/50" />
                    </div>
                    <ZodiacWheel className="w-12 h-12 mx-auto mb-4 text-indigo-200" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Zodiac Spread</h3>
                  <p className="text-sm text-indigo-200">
                    Discover your destiny through the twelve houses of the zodiac
                  </p>
                </div>
              </Card>
            </motion.div>
          ) : !showReading ? (
            readingType === "zodiac-fortune" && !selectedSign ? (
              <ZodiacSignSelection onSelectSign={(sign) => setSelectedSign(sign)} />
            ) : (
              <TarotCardSelection 
                selectedCards={selectedCards} 
                setSelectedCards={setSelectedCards}
                readingType={readingType}
                currentRound={currentRound}
                setShowReading={setShowReading}
                onNextRound={handleNextRound}
              />
            )
          ) : (
            readingType === "zodiac-fortune" ? (
              <LoveFortuneReading 
                selectedCard={selectedCards[0]}
                zodiacSign={selectedSign}
              />
            ) : readingType === "zodiac-spread" ? (
              <ZodiacSpreadReading selectedCards={selectedCards} />
            ) : (
              <TarotReading selectedCards={selectedCards} />
            )
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

