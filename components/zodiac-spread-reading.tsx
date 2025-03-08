"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import ReactMarkdown from 'react-markdown'
import { useState, useEffect, useCallback, useRef } from "react"
import { tarotCards } from "@/data/tarot-cards"
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Share2, Sparkles, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import { Button } from "@/components/ui/button"

const ZodiacWheel = () => {
  // 별자리 정보 배열 추가
  const zodiacSigns = [
    { symbol: '♈', name: 'Aries' },
    { symbol: '♉', name: 'Taurus' },
    { symbol: '♊', name: 'Gemini' },
    { symbol: '♋', name: 'Cancer' },
    { symbol: '♌', name: 'Leo' },
    { symbol: '♍', name: 'Virgo' },
    { symbol: '♎', name: 'Libra' },
    { symbol: '♏', name: 'Scorpio' },
    { symbol: '♐', name: 'Sagittarius' },
    { symbol: '♑', name: 'Capricorn' },
    { symbol: '♒', name: 'Aquarius' },
    { symbol: '♓', name: 'Pisces' },
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-full"
    >
      {/* 배경 그라데이션 */}
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(147, 51, 234, 0.2)" />
          <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
        </radialGradient>
      </defs>

      {/* 배경 발광 효과 */}
      <circle
        cx="200"
        cy="200"
        r="180"
        fill="url(#centerGlow)"
        className="animate-pulse-slow"
      />

      {/* 회전하는 외부 원 */}
      <g className="animate-spin-slow">
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="none"
          stroke="rgba(147, 51, 234, 0.3)"
          strokeWidth="2"
          className="animate-glow"
        />
        
        {/* 외부 원의 장식 점들 */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10) * (Math.PI / 180)
          const x = 200 + 190 * Math.cos(angle)
          const y = 200 + 190 * Math.sin(angle)
          
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r="1"
              fill="rgba(216, 180, 254, 0.6)"
              className="animate-glow"
            />
          )
        })}
      </g>

      {/* 반대 방향으로 회전하는 내부 원 */}
      <g className="animate-spin-reverse-slow">
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke="rgba(147, 51, 234, 0.2)"
          strokeWidth="1"
          className="animate-glow"
        />
        
        {/* 내부 원의 장식 점들 */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15) * (Math.PI / 180)
          const x = 200 + 160 * Math.cos(angle)
          const y = 200 + 160 * Math.sin(angle)
          
          return (
            <circle
              key={`inner-dot-${i}`}
              cx={x}
              cy={y}
              r="1"
              fill="rgba(216, 180, 254, 0.4)"
              className="animate-glow"
            />
          )
        })}
      </g>

      {/* 중앙 별 */}
      <g className="animate-pulse-slow">
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45) * (Math.PI / 180)
          return (
            <line
              key={`star-${i}`}
              x1="200"
              y1="200"
              x2={200 + 20 * Math.cos(angle)}
              y2={200 + 20 * Math.sin(angle)}
              stroke="rgba(216, 180, 254, 0.6)"
              strokeWidth="2"
            />
          )
        })}
      </g>

      {/* 번호와 한글 이름 (안쪽으로 이동) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = ((i * 30) - 90) * (Math.PI / 180)
        const r = 140 // 번호 위치의 반지름
        const nameR = 115 // 한글 이름 위치의 반지름 (더 안쪽으로)
        const x = 200 + r * Math.cos(angle)
        const y = 200 + r * Math.sin(angle)
        const nameX = 200 + nameR * Math.cos(angle)
        const nameY = 200 + nameR * Math.sin(angle)
        
        return (
          <g key={i}>
            {/* 번호 원 */}
            <circle
              cx={x}
              cy={y}
              r="12"
              fill="rgba(88, 28, 135, 0.8)"
              stroke="rgba(147, 51, 234, 0.5)"
              strokeWidth="1"
            />
            {/* 번호 */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(216, 180, 254, 1)"
              fontSize="12"
            >
              {i + 1}
            </text>
            {/* 한글 이름 (안쪽에 배치) */}
            <text
              x={nameX}
              y={nameY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(216, 180, 254, 0.8)"
              fontSize="10"
              className="font-medium"
            >
              {zodiacSigns[i].name}
            </text>
          </g>
        )
      })}

      {/* 고정된 조디악 사인 (가장 바깥쪽) */}
      {zodiacSigns.map((sign, i) => {
        const angle = ((i * 30) - 90) * (Math.PI / 180)
        const r = 175 // 조디악 사인은 가장 바깥쪽에 유지
        const x = 200 + r * Math.cos(angle)
        const y = 200 + r * Math.sin(angle)
        
        return (
          <g key={`fixed-symbol-${i}`} className="animate-glow">
            <circle
              cx={x}
              cy={y}
              r="15"
              fill="rgba(88, 28, 135, 0.6)"
              className="animate-pulse-slow"
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(216, 180, 254, 1)"
              fontSize="18"
              className="font-astro"
            >
              {sign.symbol}
            </text>
          </g>
        )
      })}

      {/* 중앙 순환하는 조디악 사인 */}
      <g className="zodiac-symbols">
        {zodiacSigns.map((sign, i) => (
          <text
            key={`symbol-${i}`}
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(216, 180, 254, 0.8)"
            fontSize="24"
            className="font-astro opacity-0"
            style={{
              animation: `fadeInOut 24s linear infinite ${i * -2}s`
            }}
          >
            {sign.symbol}
          </text>
        ))}
      </g>

      {/* 12개의 구획선 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180)
        const x1 = 200 + 160 * Math.cos(angle)
        const y1 = 200 + 160 * Math.sin(angle)
        const x2 = 200 + 190 * Math.cos(angle)
        const y2 = 200 + 190 * Math.sin(angle)

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(147, 51, 234, 0.3)"
            strokeWidth="1"
          />
        )
      })}
    </svg>
  )
}

export default function ZodiacSpreadReading({ selectedCards }: { selectedCards: number[] }) {
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [interpretation, setInterpretation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)  // 해석 완료 상태 추가
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [hasRequested, setHasRequested] = useState(false)
  const requestRef = useRef(false) // useRef를 사용하여 요청 상태 관리
  const [isCapturing, setIsCapturing] = useState(false);
  const cardsSectionRef = useRef<HTMLDivElement>(null);
  
  const selectedTarotCards = selectedCards.map((index) => tarotCards[index])

  // 캐러셀 설정
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 2,
    dragFree: true
  })

  // 이전/다음 버튼을 위한 상태
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // 스크롤 버튼 상태 업데이트
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  // 카드 뒤집기 효과
  useEffect(() => {
    const flipCards = async () => {
      setFlippedCards([]) // 카드 선택이 바뀌면 초기화
      setIsComplete(false) // 완료 상태 초기화
      for (let i = 0; i < selectedCards.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setFlippedCards((prev) => [...prev, i])
      }
    }
    flipCards()
  }, [selectedCards])

  // API 요청은 모든 카드가 뒤집혔을 때만 실행
  useEffect(() => {
    const getInterpretation = async () => {
      if (flippedCards.length !== selectedCards.length) return;
      if (isComplete) return; // 이미 완료된 경우 중복 실행 방지
      
      setIsLoading(true)
      try {
        const requestBody = {
          selectedCards: selectedCards.map(i => tarotCards[i].name),
          readingType: 'zodiac-spread'
        };
        
        console.log('API 요청:', requestBody);

        const response = await fetch('/api/run-api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log('API 응답:', data);
        setInterpretation(data.reading);
        setIsComplete(true); // 해석 완료 표시
      } catch (error) {
        console.error('Failed to get interpretation:', error);
        setInterpretation("Sorry, an error occurred while retrieving the interpretation.");
      } finally {
        setIsLoading(false)
      }
    }

    getInterpretation()
  }, [flippedCards.length, selectedCards, isComplete])

  // 각 위치의 의미 정의
  const positionMeanings = [
    "Aries: Self-expression and individuality",
    "Taurus: Materialism and values",
    "Gemini: Communication and learning",
    "Cancer: Family and emotions",
    "Leo: Creativity and self-expression",
    "Virgo: Work and health",
    "Libra: Relationships and partnership",
    "Scorpio: Change and regeneration",
    "Sagittarius: Philosophy and travel",
    "Capricorn: Career and social status",
    "Aquarius: Hope and friendship",
    "Pisces: Spirituality and potential"
  ];

  // Add saveImage function
  const saveImage = async () => {
    try {
      setIsCapturing(true);

      // Check if mobile
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Mobile: Capture cards section
        if (cardsSectionRef.current) {
          const cardCanvas = await html2canvas(cardsSectionRef.current, {
            backgroundColor: '#1a1033',
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true,
          });

          const link = document.createElement('a');
          link.download = `zodiac_spread_cards.png`;
          link.href = cardCanvas.toDataURL('image/png');
          link.click();
        }
      } else {
        // Desktop: Capture entire content
        if (cardsSectionRef.current) {
          const canvas = await html2canvas(cardsSectionRef.current, {
            backgroundColor: '#1a1033',
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true,
          });

          const link = document.createElement('a');
          link.download = 'zodiac_spread.png';
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

  // Add shareToX function
  const shareToX = async () => {
    if (!interpretation || !cardsSectionRef.current) {
      console.error('No content to capture');
      return;
    }

    try {
      console.log('Starting capture...');
      setIsCapturing(true);

      // Capture current cards
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(cardsSectionRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
      });
      
      console.log('Canvas created');
      setIsCapturing(false);

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            
            const firstParagraph = "Press Ctrl+V to paste!"
            const shareText = `${firstParagraph}\n\n#TarotReading #Zodiac #Astrology`;
            
            alert('Image copied to clipboard. Please paste (Ctrl+V) it on X!\n(Please allow popups!)');
            const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            window.open(xUrl, '_blank');
            
          } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            alert('Failed to copy to clipboard. Please check your browser settings.');
          }
        }
      });

    } catch (error) {
      console.error('Error sharing to X:', error);
      alert('An error occurred while sharing to X.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* 황도 12궁 */}
      <div className="relative w-full aspect-square max-w-2xl mx-auto mb-12">
        <ZodiacWheel />
      </div>

      {/* 카드 슬라이더 */}
      <div className="relative mb-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {selectedCards.map((cardIndex, i) => {
              const card = selectedTarotCards[i]
              return (
                <div key={i} className="flex-[0_0_calc(50%-8px)] sm:flex-[0_0_calc(33.333%-16px)]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                    onClick={() => flippedCards.includes(i) && setSelectedCardIndex(i)}
                  >
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-purple-900 rounded-full flex items-center justify-center text-purple-100 text-sm border border-purple-500 z-10">
                      {i + 1}
                    </div>
                    <div className="perspective-1000">
                      <motion.div
                        className="relative w-full aspect-[2/3] transition-all duration-500 transform-gpu preserve-3d"
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: flippedCards.includes(i) ? 180 : 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        {/* Card Back */}
                        <Card className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-900 to-purple-950 border-2 border-indigo-700">
                          <CardContent className="p-0 h-full">
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
                                    <div className="w-8 h-8">
                                      <div className="absolute inset-0 border-2 border-amber-400/40 rounded-full" />
                                      <div className="absolute inset-1 border border-purple-400/30 rotate-45" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Card Front */}
                        <Card className="absolute w-full h-full backface-hidden rotateY-180 border-2 border-purple-500 overflow-hidden">
                          <CardContent className="p-0 h-full flex flex-col">
                            <div className="bg-gradient-to-b from-indigo-900 to-purple-900 p-1.5 text-center">
                              <h3 className="text-xs font-medium text-purple-200 truncate">
                                {card.name}
                              </h3>
                            </div>
                            <div className="relative flex-grow bg-black flex items-center justify-center">
                              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
                              </div>
                              <div className="relative w-[90%] h-[90%]">
                                <Image
                                  src={card.image}
                                  alt={card.name}
                                  fill
                                  sizes="(max-width: 768px) 25vw, 20vw"
                                  className="object-contain"
                                  priority
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 이전/다음 버튼 */}
        <button
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 flex items-center justify-center rounded-full bg-purple-900/80 border border-purple-500 ${
            !prevBtnEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-800'
          }`}
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
        >
          <ChevronLeft className="w-5 h-5 text-purple-200" />
        </button>
        
        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 flex items-center justify-center rounded-full bg-purple-900/80 border border-purple-500 ${
            !nextBtnEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-800'
          }`}
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
        >
          <ChevronRight className="w-5 h-5 text-purple-200" />
        </button>
      </div>

      {/* 선택된 카드의 의미 */}
      {selectedCardIndex !== null && flippedCards.includes(selectedCardIndex) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 sm:p-6 rounded-lg bg-purple-900/30 border border-purple-500"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-1 sm:gap-4">
                <h3 className="text-base sm:text-lg font-medium text-amber-300">
                  {selectedTarotCards[selectedCardIndex].name}
                </h3>
                <span className="text-xs sm:text-sm text-purple-200">
                  {positionMeanings[selectedCardIndex]}
                </span>
              </div>
              <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
                {selectedTarotCards[selectedCardIndex].meaning}
              </p>
            </div>
            <button 
              onClick={() => setSelectedCardIndex(null)}
              className="text-purple-300 hover:text-purple-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* 해석 섹션 */}
      <motion.div
        className="mt-12 p-4 sm:p-6 rounded-lg bg-purple-900/30 border border-purple-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl font-medium text-amber-300">Tarot Interpretation</h3>
        </div>
        <div className="text-purple-200 leading-relaxed prose prose-invert prose-purple max-w-none">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span className="animate-pulse text-sm">Retrieving interpretation...</span>
            </div>
          ) : interpretation ? (
            <div className="text-xs md:text-base prose-p:text-xs md:prose-p:text-base prose-headings:text-sm md:prose-headings:text-lg">
              <ReactMarkdown>{interpretation}</ReactMarkdown>
            </div>
          ) : null}
          {/* Add Return Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-2 rounded-full text-lg shadow-lg shadow-purple-900/30"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 