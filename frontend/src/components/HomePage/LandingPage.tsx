import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./features-section";
import { HowItWorksSection } from "./how-it-works-section";
import { FaqSection } from "./faq-section";
import { Footer } from "./footer";

function LandingPage() {
  return (
    <div className="">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
