"use client";

import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";

interface PricingTier {
  name: string;
  subtitle: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  buttonVariant: "primary" | "secondary" | "outline";
}

const pricingTiers: PricingTier[] = [
  {
    name: "α - Alpha",
    subtitle: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "Basic bill splitting",
      "Create up to 3 groups",
      "Add up to 10 friends",
      "Manual expense entry",
      "Basic settlement history",
      "Light theme only",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
  },
  {
    name: "β - Beta",
    subtitle: "Growth",
    price: 99,
    description: "For casual group expenses",
    features: [
      "Unlimited groups",
      "Add up to 50 friends",
      "Image upload for receipts",
      "Smart reminders for due amounts",
      "Categorized expenses",
      "Export to CSV",
    ],
    buttonText: "Choose Plan",
    buttonVariant: "secondary",
  },
  {
    name: "γ - Gamma",
    subtitle: "Popular",
    price: 199,
    description: "Most recommended for active users",
    features: [
      "All Beta features",
      "Auto-settlement suggestions",
      "Multi-currency support",
      "Monthly analytics dashboard",
      "Expense insights + charts",
      "Priority notifications",
    ],
    highlighted: true,
    buttonText: "Start Free Trial",
    buttonVariant: "primary",
  },
  {
    name: "ϕ - Phi",
    subtitle: "Pro",
    price: 399,
    description: "For power users & communities",
    features: [
      "All Gamma features",
      "AI-powered smart settlement",
      "Auto-sync with UPI apps",
      "Split across multiple circles",
      "Unlimited storage",
      "Early access to new features",
      "Dedicated support channel",
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "secondary",
  },
];

const PricingCard: React.FC<{ tier: PricingTier; index: number }> = ({ tier, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className={`relative rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 ${
        tier.highlighted
          ? "border-2 border-blue-500/80 bg-gradient-to-br from-blue-500/15 to-purple-500/15 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
          : "border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900/70 hover:border-neutral-700"
      }`}
    >
      {/* Most Recommended Badge */}
      {tier.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 rounded-full text-xs font-semibold text-white">
            Most Recommended
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
        <p className="text-sm text-neutral-400 mt-1">{tier.subtitle}</p>
        <p className="text-neutral-500 text-sm mt-3">{tier.description}</p>
      </div>

      {/* Pricing */}
      <div className="mb-6 pb-6 border-b border-neutral-800">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-neutral-400">₹</span>
          <span className="text-4xl font-bold text-white">{tier.price}</span>
          <span className="text-neutral-400 ml-1">/month</span>
        </div>
        {tier.price === 0 && (
          <p className="text-xs text-neutral-500 mt-2">Forever free, upgrade anytime</p>
        )}
      </div>

      {/* Features List */}
      <div className="mb-8 space-y-3">
        {tier.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-neutral-300">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
          tier.buttonVariant === "primary"
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
            : tier.buttonVariant === "secondary"
              ? "bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600"
              : "bg-transparent border border-neutral-600 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-900/50"
        }`}
      >
        {tier.buttonText}
      </button>

      {/* Footer note for free tier */}
      {tier.price === 0 && (
        <p className="text-xs text-neutral-500 text-center mt-4">No credit card required</p>
      )}
    </motion.div>
  );
};

export function PricingSection() {
  return (
    <section className="relative w-full py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your bill-splitting needs. All plans include secure encryption and cloud sync.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 lg:mt-16 text-center"
        >
          <p className="text-neutral-400 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="text-blue-500 hover:text-blue-400 font-semibold transition-colors"
            >
              Have questions? Contact us →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSection;
