"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Heart, Download } from "lucide-react"
import Image from "next/image"
import ReactMarkdown from 'react-markdown'
import { tarotCards } from "@/data/tarot-cards"
import html2canvas from 'html2canvas'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LoveFortuneReadingProps {
  selectedCard: number
  zodiacSign: string
}

const zodiacSymbols = {
  "Aries": "♈",
  "Taurus": "♉",
  "Gemini": "♊",
  "Cancer": "♋",
  "Leo": "♌",
  "Virgo": "♍",
  "Libra": "♎",
  "Scorpio": "♏",
  "Sagittarius": "♐",
  "Capricorn": "♑",
  "Aquarius": "♒",
  "Pisces": "♓"
}

export default function LoveFortuneReading({ selectedCard, zodiacSign }: LoveFortuneReadingProps) {
  const [flipped, setFlipped] = useState(false)
  const [interpretation, setInterpretation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const cardsSectionRef = useRef<HTMLDivElement>(null)
  const interpretationRef = useRef<HTMLDivElement>(null)
  const fullContentRef = useRef<HTMLDivElement>(null)

  const selectedTarotCard = tarotCards[selectedCard]

  useEffect(() => {
    const flipWithDelay = async () => {
      // 카드 뒤집기 애니메이션 대기
      await new Promise((resolve) => setTimeout(resolve, 800))
      setFlipped(true)
      
      // API 호출
      setIsLoading(true)
      try {
        const response = await fetch('/api/run-api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selectedCard: selectedTarotCard.name,
            zodiacSign: zodiacSign,
            readingType: 'love-fortune'
          })
        });
        const data = await response.json();
        setInterpretation(data.reading);
      } catch (error) {
        console.error('Failed to get interpretation:', error);
        setInterpretation("Sorry, an error occurred while retrieving the interpretation.");
      } finally {
        setIsLoading(false)
      }
    }

    flipWithDelay()
  }, [selectedCard, zodiacSign, selectedTarotCard.name])

  const saveImage = async () => {
    try {
      setIsCapturing(true);

      // 모바일인지 확인
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // 모바일: 카드와 해석을 따로 저장
        if (cardsSectionRef.current) {
          const cardCanvas = await html2canvas(cardsSectionRef.current, {
            backgroundColor: '#1a1033', // 우주 배경 색상으로 변경
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true,
          });

          const link = document.createElement('a');
          link.download = `${zodiacSign}_love_fortune_card.png`;
          link.href = cardCanvas.toDataURL('image/png');
          link.click();
        }

        if (interpretationRef.current) {
          const interpretationCanvas = await html2canvas(interpretationRef.current, {
            backgroundColor: '#0a0a0a',
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true,
          });

          const link = document.createElement('a');
          link.download = `${zodiacSign}_love_fortune_interpretation.png`;
          link.href = interpretationCanvas.toDataURL('image/png');
          link.click();
        }
      } else {
        // 데스크탑: 전체 내용을 한 장에 저장
        if (fullContentRef.current) {
          const canvas = await html2canvas(fullContentRef.current, {
            backgroundColor: '#1a1033', // 우주 배경 색상으로 변경
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true,
          });

          const link = document.createElement('a');
          link.download = `${zodiacSign}_love_fortune.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      }
    } catch (error) {
      console.error('Error saving images:', error);
      alert('An error occurred while saving the images.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 전체 캡처 영역 시작 (데스크탑) */}
      <div ref={fullContentRef} className={cn(
        "flex flex-col",
        isCapturing && "relative p-8 rounded-lg overflow-hidden"
      )}>
        {/* 우주 배경 - 캡처 시에만 표시 */}
        {isCapturing && (
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 2 + 'px',
                    height: Math.random() * 2 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.7 + 0.3,
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* 카드 섹션 */}
        <div ref={cardsSectionRef} className="flex flex-col items-center relative z-10">
          {/* 우주 배경 - 캡처 시에만 표시 */}
          {isCapturing && (
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
              <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: Math.random() * 2 + 'px',
                      height: Math.random() * 2 + 'px',
                      top: Math.random() * 100 + '%',
                      left: Math.random() * 100 + '%',
                      opacity: Math.random() * 0.7 + 0.3,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* 컨텐츠 */}
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-center text-purple-200 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Heart className="inline-block mr-2 text-pink-400" />
            Your Love Fortune
            <Heart className="inline-block ml-2 text-pink-400" />
          </motion.h2>

          {/* 카드 섹션 */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              className="mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: flipped ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center mb-1">
                <span className="text-3xl font-astro text-amber-300 mr-2">
                  {zodiacSymbols[zodiacSign as keyof typeof zodiacSymbols]}
                </span>
                <span className="text-lg font-medium text-purple-200">
                  Destiny Card for {zodiacSign}
                </span>
              </div>
            </motion.div>

            {/* 카드 컴포넌트 */}
            <div className="perspective-1000 w-full max-w-[250px] mx-auto aspect-[2/3]">
              <motion.div
                className="relative w-full h-full transition-all duration-500 transform-gpu preserve-3d"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Card Back */}
                <Card className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-900 to-purple-950 border-2 border-indigo-700">
                  <div className="h-full flex items-center justify-center">
                    <div className="w-full h-full relative overflow-hidden">
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
                            <div className="absolute inset-0 border-2 border-amber-400/40 rounded-full" />
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

                {/* Card Front */}
                <Card className="absolute w-full h-full backface-hidden rotateY-180 border-2 border-purple-500 overflow-hidden">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="bg-gradient-to-b from-indigo-900 to-purple-900 p-2 text-center">
                      <h3 className="text-sm font-medium text-purple-200">{selectedTarotCard.name}</h3>
                    </div>
                    <div className="relative flex-grow flex items-center justify-center overflow-hidden">
                      {/* 우주적 배경 효과 */}
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
                        <div className="absolute inset-0">
                          {[...Array(30)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute rounded-full bg-white"
                              style={{
                                width: Math.random() * 2 + 'px',
                                height: Math.random() * 2 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                opacity: Math.random() * 0.7 + 0.3,
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="relative w-[90%] h-[90%] z-10">
                        <Image
                          src={selectedTarotCard.image}
                          alt={selectedTarotCard.name}
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              className="mt-4 text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: flipped ? 1 : 0,
                y: flipped ? 0 : 20,
              }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-sm text-purple-200">{selectedTarotCard.meaning}</p>
            </motion.div>
          </div>
        </div>

        {/* Interpretation Section */}
        {flipped && (
          <motion.div
            ref={interpretationRef}
            className="mt-8 p-6 rounded-lg bg-purple-900/30 border border-purple-700 relative z-10"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-pink-300 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
                Love Fortune Reading
              </h3>
              {!isLoading && (
                <Button
                  onClick={saveImage}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-emerald-100"
                  disabled={isCapturing}
                >
                  <Download className="w-4 h-4" />
                  Save
                </Button>
              )}
            </div>
            <div className="text-purple-200 leading-relaxed prose prose-invert prose-purple max-w-none">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Interpreting your cards...</span>
                </span>
              ) : (
                <div className="text-xs md:text-base prose-p:text-xs md:prose-p:text-base prose-headings:text-sm md:prose-headings:text-lg">
                  <ReactMarkdown>{interpretation}</ReactMarkdown>
                </div>
              )}
            </div>
            {/* Add Return Button */}
            <div className="mt-8 text-center">
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-2 rounded-full text-lg shadow-lg shadow-purple-900/30"
              >
                Return to Home
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Capture Loading Indicator */}
      {isCapturing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white">Saving image...</div>
        </div>
      )}
    </div>
  )
} 


