"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface ZodiacSignSelectionProps {
  onSelectSign: (sign: string) => void
}

const zodiacSigns = [
  { name: "Aries", period: "March 21 - April 19", symbol: "♈" },
  { name: "Taurus", period: "April 20 - May 20", symbol: "♉" },
  { name: "Gemini", period: "May 21 - June 21", symbol: "♊" },
  { name: "Cancer", period: "June 22 - July 22", symbol: "♋" },
  { name: "Leo", period: "July 23 - August 22", symbol: "♌" },
  { name: "Virgo", period: "August 23 - September 22", symbol: "♍" },
  { name: "Libra", period: "September 23 - October 22", symbol: "♎" },
  { name: "Scorpio", period: "October 23 - November 21", symbol: "♏" },
  { name: "Sagittarius", period: "November 22 - December 21", symbol: "♐" },
  { name: "Capricorn", period: "December 22 - January 19", symbol: "♑" },
  { name: "Aquarius", period: "January 20 - February 18", symbol: "♒" },
  { name: "Pisces", period: "February 19 - March 20", symbol: "♓" },
]

export default function ZodiacSignSelection({ onSelectSign }: ZodiacSignSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.h2
        className="text-2xl text-center mb-8 text-purple-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Please Select Your Zodiac Sign
      </motion.h2>
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {zodiacSigns.map((sign, index) => (
          <motion.div
            key={sign.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="p-4 cursor-pointer hover:bg-purple-900/30 transition-colors border-purple-500/30 hover:border-purple-400"
              onClick={() => onSelectSign(sign.name)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2 font-astro text-amber-300">
                  {sign.symbol}
                </div>
                <h3 className="text-lg font-medium text-purple-200 mb-1">
                  {sign.name}
                </h3>
                <p className="text-sm text-purple-300">
                  {sign.period}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 