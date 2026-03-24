"use client"

import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  mode?: "words" | "letters"
}

export function AnimatedText({ text, className = "", delay = 0, mode = "words" }: AnimatedTextProps) {
  const items = mode === "words" ? text.split(" ") : text.split("")

  return (
    <span className={className}>
      {items.map((item, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {item}{mode === "words" && i < items.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  )
}
