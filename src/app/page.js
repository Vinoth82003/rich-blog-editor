"use client";
import styles from "../styles/Landing.module.css";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer/Footer";
import TechStack from "@/components/TechStack";

export default function Home() {
  return (
    <main className={styles.main}>

      {/* Hero */}
      <Hero />

      {/* feature */}
      <Features />

      {/* How it work */}
      <HowItWorks />

      {/* Tech Stack */}
      <TechStack />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
