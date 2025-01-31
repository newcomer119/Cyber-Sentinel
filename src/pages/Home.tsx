import { useState, useEffect } from 'react';
import { Shield, Trophy, Brain, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';


const slides = [
  {
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    title: "Welcome to CyberSentinel",
    description: "Test your skills in cybersecurity challenges"
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    title: "Learn & Compete",
    description: "Join the elite ranks of cyber defenders"
  },
  {
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f",
    title: "Real-World Challenges",
    description: "Face authentic cybersecurity scenarios"
  }
];

const features = [
  {
    icon: Shield,
    title: "Security Challenges",
    description: "Test your skills across various security domains"
  },
  {
    icon: Trophy,
    title: "Compete & Win",
    description: "Climb the leaderboard and earn recognition"
  },
  {
    icon: Brain,
    title: "Learn & Grow",
    description: "Develop practical cybersecurity skills"
  },
  {
    icon: Lock,
    title: "CTF Competitions",
    description: "Regular competitions with real prizes"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-cyber-black">
      {/* Hero Section with Slider */}
      <div className="relative h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-black to-transparent z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <h1 
                    className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up"
                    style={{
                      animation: 'fadeInUp 0.5s ease-out',
                      opacity: currentSlide === index ? 1 : 0
                    }}
                  >
                    {slide.title}
                  </h1>
                  <p 
                    className="text-xl text-gray-300 mb-8"
                    style={{
                      animation: 'fadeInUp 0.5s ease-out 0.2s',
                      opacity: currentSlide === index ? 1 : 0
                    }}
                  >
                    {slide.description}
                  </p>
                  <Link
                    to="/compete"
                    className="inline-block bg-cyber-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 animate-bounce"
                  >
                    Start Competing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentSlide === index ? 'bg-cyber-red' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-cyber-black p-6 rounded-lg border border-cyber-red hover:border-cyber-blue transition-colors duration-300"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s`
              }}
            >
              <feature.icon className="w-12 h-12 text-cyber-red mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* <Leaderboard /> */}
    </div>
  );
}