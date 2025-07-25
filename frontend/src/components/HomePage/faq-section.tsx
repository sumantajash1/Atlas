"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function FaqSection() {
  const faqs = [
    {
      question: "Can I use Atlas for more than one goal at the same time?",
      answer: "Yes, you can use Atlas for multiple goals simultaneously. Each goal will have its own mindmap, schedule, and progress tracking."
    },
    {
      question: "What if my daily routine changes a lot?",
      answer: "It adjusts schedules automatically when things shift, whether you sleep late, have a busy day, or need to pause a task, it reschedules everything without you stressing over it.",
    },
    {
      question: "What happens if I skip a day or miss tasks?",
      answer:
        "Life happens. And Atlas gets that. It reschedules missed tasks intelligently and keeps your overall progress on track. I don’t need to drag things around manually."},
    {
      question: "Can I control how detailed the plan is?",
      answer:
        "Definitely. When you start a goal, you can choose whether you want a quick overview, a mid-level breakdown, or a deep dive. Atlas adjusts the number of subtasks and the overall timeline based on that.",
    },
    {
      question: "Is Atlas useful beyond just studying or work?",
      answer: "Yes, you can use it to plan personal goals too, like learning guitar, prepping for a trip, or tracking creative projects.",
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#0077b6] to-[#48cae4]">Frequently Asked Questions</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Have questions about Atlas? Find answers to common questions below.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-600 rounded-xl overflow-hidden">
              <button
                className="flex justify-between items-center w-full p-6 text-left text-slate-100"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-slate-100">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openIndex === index && <div className="p-6 pt-0 text-slate-400">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
