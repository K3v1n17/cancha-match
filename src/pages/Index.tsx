import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FieldsSection from "@/components/FieldsSection";
import PlayersSection from "@/components/PlayersSection";
import OwnerDashboard from "@/components/OwnerDashboard";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FieldsSection />
      <PlayersSection />
      <OwnerDashboard />
    </div>
  );
};

export default Index;
