"use client"
import { useEffect, useState } from "react";
import Link from "next/link"; // 👈 Import Link
import { FeaturesSectionDemo1 } from "@/components/features-section-demo-1";
import { CustomNavbar } from "@/components/ui/custom/CustomNavbar";
import { CustomTestimonies } from "@/components/ui/custom/CustomTestimonies";
import CustomFooter from "@/components/ui/custom/CustomFooter";
import { Hero } from "@/components/ui/custom/Hero";
import { FlipWords } from "@/components/ui/flip-words";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { motion } from "motion/react";
import { HelpCircle, Zap, Clock, ShieldCheck, ArrowRight } from "lucide-react"; // 👈 Added ArrowRight
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FeaturesSection } from "@/components/ui/custom/FeaturesSection";
import { HeroProduct } from "@/components/ui/custom/HeroProduct";
import PricingSection from "@/components/ui/custom/PricingSection";
import ContactSection from "@/components/ui/custom/ContactSection";
import { ContactHighlight } from "@/components/ui/custom/ContactHighlight";
import { TestimonialTitle } from "@/components/ui/custom/TestimonialTitle";
import { CustomFeatures } from "@/components/ui/custom/CustomFeatures";
import { Ending } from "@/components/ui/custom/Ending";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { apiFetch } from "@/lib/api";

export default function Home() {
  const { data: user } = useSWR("/api/users/me", apiFetch);
  const name = user?.name || null;

  return (
    <>
      <div className="w-full">
        <CustomNavbar />
        
        {/* 👇 Updated Logged-in Banner */}
        {name && (
          <div className="w-full bg-emerald-500/10 border-b border-emerald-500/20">
            <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm md:text-base font-medium text-emerald-600 dark:text-emerald-400">
                Welcome back, <span className="font-bold">{name}!</span> Ready to settle up?
              </p>
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-sm font-bold px-5 py-2 rounded-xl transition-colors shadow-sm"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
        
        <Hero />
        <HeroProduct />
        
        <section id="features">
          <FeaturesSection />
        </section>
        
        <section id="pricing">
          <PricingSection />
        </section>
        
        <section id="testimonials">
          <TestimonialTitle />
        </section>
        
        <CustomTestimonies />
        
        <section id="contact">
          <ContactSection />
        </section>

        <section id="faq" className="py-12 lg:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-3xl lg:text-4xl font-bold text-center text-black dark:text-white">
              Frequently asked questions
            </h3>
            <p className="mt-2 text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Common questions about Batwara — how it works, privacy, and settlements.
            </p>

            <div className="mt-8">
              <Accordion type="multiple" className="space-y-3">
                <AccordionItem value="q-1" className="bg-white dark:bg-gray-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow">
                  <AccordionTrigger className="px-6">How does Batwara split bills?</AccordionTrigger>
                  <AccordionContent className="px-6">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">Create a group, add expenses with participants, and Batwara computes the net balances between members. We then offer minimal settlement suggestions so everyone pays as little as possible.</p>
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">You can mark expenses as shared equally, by percentage, or assign per-person amounts. Export settlements or send payment links directly to participants.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q-2" className="bg-white dark:bg-gray-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow">
                  <AccordionTrigger className="px-6">How fast are settlements?</AccordionTrigger>
                  <AccordionContent className="px-6">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">Settlement calculations are instantaneous. Once expenses are saved, the app computes optimized transfers immediately.</p>
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">For actual money transfers, Batwara can generate payment links (UPI, Stripe) or provide a minimal pay list you can use with your preferred payment app.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q-3" className="bg-white dark:bg-gray-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow">
                  <AccordionTrigger className="px-6">Is my data private?</AccordionTrigger>
                  <AccordionContent className="px-6">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">We store only information required to compute settlements: group membership, expenses, and minimal metadata. Personal payment credentials are not stored unless you explicitly connect a payment provider.</p>
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">You control group visibility and membership. We do not sell your data and follow standard security practices for stored data.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q-4" className="bg-white dark:bg-gray-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow">
                  <AccordionTrigger className="px-6">What payment methods are supported?</AccordionTrigger>
                  <AccordionContent className="px-6">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">Batwara supports common regional payment links and integrations depending on availability: UPI (India), Stripe/ACH, and direct payment links. Support depends on your region and enabled integrations.</p>
                    <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">If you need additional integrations, contact our support and we can prioritize connectors.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <Ending />
        <CustomFooter />
      </div>
    </>
  );
}