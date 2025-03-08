"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Moon, Sun, Star, Share2 } from "lucide-react"
import Image from "next/image"
import ReactMarkdown from 'react-markdown'
import html2canvas from 'html2canvas'
import { tarotCards } from "@/data/tarot-cards"
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from "@/components/ui/button"

interface TarotReadingProps {
  selectedCards: number[]
}

export default function TarotReading({ selectedCards }: TarotReadingProps) {
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [readingComplete, setReadingComplete] = useState(false)
  const [interpretation, setInterpretation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const cardsSectionRef = useRef<HTMLDivElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps'
  })

  // Get the selected tarot cards
  const selectedTarotCards = selectedCards.map((index) => tarotCards[index])

  // Positions and their meanings
  const positions = [
    { title: "Past", icon: <Moon className="h-5 w-5 text-indigo-300" /> },
    { title: "Present", icon: <Sun className="h-5 w-5 text-amber-300" /> },
    { title: "Future", icon: <Star className="h-5 w-5 text-purple-300" /> },
  ]

  useEffect(() => {
    const flipWithDelay = async () => {
      // 과거 카드 뒤집기
      await new Promise((resolve) => setTimeout(resolve, 800))
      setFlippedCards((prev) => [...prev, 0])
      
      if (emblaApi) {
        // 과거 카드 보여주기 위한 대기
        await new Promise((resolve) => setTimeout(resolve, 2500))
        // 현재 카드로 이동
        emblaApi.scrollNext()
        // 슬라이드 애니메이션 완료 대기
        await new Promise((resolve) => setTimeout(resolve, 800))
        // 현재 카드 뒤집기
        setFlippedCards((prev) => [...prev, 1])
        
        // 현재 카드 보여주기 위한 대기
        await new Promise((resolve) => setTimeout(resolve, 2500))
        // 미래 카드로 이동
        emblaApi.scrollNext()
        // 슬라이드 애니메이션 완료 대기
        await new Promise((resolve) => setTimeout(resolve, 800))
        // 미래 카드 뒤집기
        setFlippedCards((prev) => [...prev, 2])
        
        // 모든 카드가 뒤집힌 후에 API 호출
        setReadingComplete(true)
        setIsLoading(true)
        try {
          const response = await fetch('/api/run-api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              selectedCards: selectedCards.map(card => tarotCards[card].name),
              readingType: 'past-present-future'
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
    }

    flipWithDelay()
  }, [selectedCards, emblaApi])

  const shareToX = async () => {
    if (!interpretation || !cardsSectionRef.current) {
      console.error('No content to capture');
      return;
    }

    try {
      console.log('Starting capture...');
      setIsCapturing(true);

      // 현재 보이는 카드만 캡처
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
            const shareText = `${firstParagraph}\n\n#TarotReading #Fortune #TarotCards`;
            
            alert('The image has been copied to your clipboard. Please paste (Ctrl+V) it on X!\n(Please allow popups!)');
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

  const saveImage = async () => {
    try {
      setIsCapturing(true);

      // 모바일인지 확인
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // 모바일: 각 카드별로 캡처
        for (let i = 0; i < selectedCards.length; i++) {
          if (emblaApi) {
            emblaApi.scrollTo(i);
            await new Promise((resolve) => setTimeout(resolve, 1500));
          }

          const canvas = await html2canvas(cardsSectionRef.current, {
            backgroundColor: '#1a1033',
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true,
          });

          const positions = ['Past', 'Present', 'Future'];
          const link = document.createElement('a');
          link.download = `tarot_reading_${positions[i]}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();

          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } else {
        // 데스크탑: 3장의 카드를 한 번에 캡처
        const canvas = await html2canvas(cardsSectionRef.current, {
          backgroundColor: '#1a1033',
          scale: 2,
          logging: true,
          useCORS: true,
          allowTaint: true,
        });

        const link = document.createElement('a');
        link.download = 'tarot_reading.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
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
      {/* 캡처할 섹션 */}
      <div 
        ref={cardsSectionRef} 
        className={`relative p-4 rounded-lg overflow-hidden ${
          isCapturing ? 'aspect-[3/4] w-full max-w-[500px] mx-auto' : ''
        }`}
      >
        {/* 우주적 배경 효과 - 캡처 시에만 표시 */}
        {isCapturing && (
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
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
        <div className="relative z-10">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-center text-purple-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="inline-block mr-2 text-amber-300" />
            Your Tarot Reading
            <Sparkles className="inline-block ml-2 text-amber-300" />
          </motion.h2>

          {/* 모바일에서는 슬라이더, 데스크톱에서는 그리드 */}
          <div className="md:hidden">
            <div className="overflow-hidden mobile-cards-container" ref={emblaRef}>
              <div className="flex">
                {selectedTarotCards.map((card, index) => (
                  <div key={index} className="flex-[0_0_100%] px-4">
                    <TarotCardItem 
                      card={card} 
                      index={index} 
                      position={positions[index]} 
                      flippedCards={flippedCards} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 데스크톱 레이아웃 */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {selectedTarotCards.map((card, index) => (
              <TarotCardItem 
                key={index} 
                card={card} 
                index={index} 
                position={positions[index]} 
                flippedCards={flippedCards} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* 해석 섹션 */}
      {readingComplete && (
        <motion.div
          className="mt-12 p-6 rounded-lg bg-purple-900/30 border border-purple-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-3">
            <h3 className="text-xl font-medium text-amber-300">Tarot Interpretation</h3>
            {!isLoading && interpretation && (
              <div className="flex gap-2 self-end sm:self-auto">
                <button
                  onClick={saveImage}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-700 hover:bg-emerald-600 transition-colors text-xs sm:text-sm text-emerald-100"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M19 12v7H5v-7H3v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
                  </svg>
                  Save
                </button>
                <button
                  onClick={shareToX}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-800 hover:bg-purple-700 transition-colors text-xs sm:text-sm text-purple-200"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="flex items-center gap-1">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Share
                  </span>
                </button>
              </div>
            )}
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
  )
}

// CardContent를 TarotCardItem으로 이름 변경
const TarotCardItem = ({ card, index, position, flippedCards }) => (
  <div className="flex flex-col items-center">
    <motion.div
      className="mb-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: flippedCards.includes(index) ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center mb-1">
        {position.icon}
        <span className="ml-2 text-base sm:text-lg font-medium text-purple-200">{position.title}</span>
      </div>
    </motion.div>

    <div className="perspective-1000 w-full max-w-[200px] mx-auto aspect-[2/3]">
      <motion.div
        className="relative w-full h-full transition-all duration-500 transform-gpu preserve-3d"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: flippedCards.includes(index) ? 180 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Card Back */}
        <Card className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-900 to-purple-950 border-2 border-indigo-700">
          <div className="h-full flex items-center justify-center">
            <div className="w-full h-full relative overflow-hidden">
              {/* Card back design */}
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
        </Card>

        {/* Card Front */}
        <Card className="absolute w-full h-full backface-hidden rotateY-180 border-2 border-purple-500 overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="bg-gradient-to-b from-indigo-900 to-purple-900 p-1 sm:p-2 text-center">
              <h3 className="text-xs sm:text-sm font-medium text-purple-200">{card.name}</h3>
            </div>
            <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
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
                        animation: `twinkle ${Math.random() * 4 + 2}s infinite`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="relative w-[90%] h-[90%] z-10">
                <Image
                  src={card.image || "/placeholder.svg"}
                  alt={card.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
      className="mt-4 sm:mt-6 text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: flippedCards.includes(index) ? 1 : 0,
        y: flippedCards.includes(index) ? 0 : 20,
      }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <p className="text-sm sm:text-base text-purple-200">{card.meaning}</p>
    </motion.div>
  </div>
)

