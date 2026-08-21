import { Suspense } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import HomeAmbiance from "./components/HomeAmbiance";
import HomeReglement from "./components/HomeReglement";
import HomeSteps from "./components/HomeSteps";
import HomeStreamers from "./components/HomeStreamers";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <HomeAmbiance />
      <HomeReglement />
      <HomeSteps />
      <Suspense fallback={null}>
        <HomeStreamers />
      </Suspense>
      <Footer />
    </>
  );
}
