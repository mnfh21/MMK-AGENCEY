import React from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { ProjectConfigurator } from "@/components/ProjectConfigurator";
import { ProjectTracker } from "@/components/ProjectTracker";
import { TechStack } from "@/components/TechStack";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <ProjectConfigurator />
      <ProjectTracker />
      <TechStack />
      <Footer />
    </main>
  );
}
