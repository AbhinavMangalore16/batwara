"use client"
import { FeaturesSectionDemo1 } from "@/components/features-section-demo-1";
import { CustomNavbar } from "@/components/ui/custom/CustomNavbar";
import { CustomTestimonies } from "@/components/ui/custom/CustomTestimonies";
import CustomFooter from "@/components/ui/custom/CustomFooter";
import { Hero } from "@/components/ui/custom/Hero";
import { FlipWords } from "@/components/ui/flip-words";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { motion } from "motion/react";
import { HelpCircle, Zap, Clock, ShieldCheck } from "lucide-react";
import { FeaturesSection } from "@/components/ui/custom/FeaturesSection";
import { HeroProduct } from "@/components/ui/custom/HeroProduct";
import PricingSection from "@/components/ui/custom/PricingSection";
import ContactSection from "@/components/ui/custom/ContactSection";
import { ContactHighlight } from "@/components/ui/custom/ContactHighlight";
import { TestimonialTitle } from "@/components/ui/custom/TestimonialTitle";
import { CustomFeatures } from "@/components/ui/custom/CustomFeatures";
import { Ending } from "@/components/ui/custom/Ending";

export default function Home() {
  return (
    <>
      <div className="w-full">
        <CustomNavbar />
        {/* <HeroHighlight>
      <motion.h1
        initial={{
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        {/* <Highlight className="text-black dark:text-white"> */}
        {/* </Highlight> */}
        {/* &nbsp; <FlipWords words={["family", "friends", "partner", "anyone!"]} className="text-5xl"/>
      </motion.h1> */}
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
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-3xl lg:text-4xl font-bold text-center text-black dark:text-white">
              Frequently asked questions
            </h3>
            <p className="mt-2 text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Common questions about Batwara — how it works, privacy, and settlements.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-black dark:text-white">How does Batwara split bills?</h4>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Create a group, add expenses, and Batwara computes who owes whom and suggests minimal settlements.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-black dark:text-white">How fast are settlements?</h4>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Settlements are computed instantly; you can settle immediately via supported payment links or export minimal-pay instructions.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-md bg-violet-50 dark:bg-violet-900/20 text-violet-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-black dark:text-white">Is my data private?</h4>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">We only store group and expense metadata needed for calculations. You control who joins groups. We do not sell your data.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-black dark:text-white">What payment methods are supported?</h4>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Batwara supports common payment links (UPI, Pay, Stripe links) depending on your region and integrations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Ending />
        <CustomFooter />
      </div>
    </>
  );
}
