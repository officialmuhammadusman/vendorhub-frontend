import { HeroSection }         from "@/components/landing/HeroSection";
import { TrustBar }            from "@/components/landing/TrustBar";
import { FeaturesSection }     from "@/components/landing/FeaturesSection";
import { RolesSection }        from "@/components/landing/RolesSection";
import { HowItWorksSection }   from "@/components/landing/HowItWorksSection";
import { StatsSection }        from "@/components/landing/StatsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection }          from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <RolesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}