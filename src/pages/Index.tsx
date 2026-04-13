import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PhotosSection from "@/components/PhotosSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";

const Index = () => {
  const { businessId } = useParams();
  const [businessInfo, setBusinessInfo] = useState<any>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(
          `https://slotly-backend-92ig.onrender.com/api/businesses/${businessId}`
        );
        //console.log("Fetched business:", res.data); // <-- debug log
        setBusinessInfo(res.data); // backend returns an object
      } catch (err) {
        console.error("Error fetching business:", err);
      }
    };
    if (businessId) fetchBusiness();
  }, [businessId]);

  if (!businessInfo) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <HeroSection businessInfo={businessInfo} />
      <ServicesSection services={businessInfo.services} />
      <PhotosSection businessInfo={businessInfo} />
      <AboutSection businessInfo={businessInfo} />
      <CTASection businessInfo={businessInfo}  />
      <Footer businessInfo={businessInfo} />

    </div>
  );
};

export default Index;