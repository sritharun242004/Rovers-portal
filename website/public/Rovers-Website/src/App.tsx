import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ScrollToTopButton } from './components/common/ScrollToTopButton';
import { LoadingIntro } from './components/common/LoadingIntro';
import { Home } from './pages/Home';
import { About } from './pages/About';
import Sports from './pages/Sports';
import { SportDetail } from './pages/SportDetail';
import { Academy } from './pages/Academy';
import { Partners } from './pages/Partners';
import { Contact } from './pages/Contact';
import { EventDetail } from './pages/EventDetail';
import { India } from './pages/India';
import { UAE } from './pages/UAE';
import { Malaysia } from './pages/Malaysia';
import { ComingSoon } from './pages/ComingSoon';
import { ComingSoonEvent } from './pages/ComingSoonEvent';
import { MalaysiaKarateEvent } from './pages/MalaysiaKarateEvent';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // 🔍 DEBUG: Log app initialization
    console.log('🚀 [Rovers-Website] App.tsx - Initializing');
    console.log('🔍 [Rovers-Website] Environment:', {
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
      mode: import.meta.env.MODE,
      apiUrl: import.meta.env.VITE_API_URL,
      baseUrl: import.meta.env.BASE_URL,
    });
    console.log('🔍 [Rovers-Website] Window Location:', {
      href: window.location.href,
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      hash: window.location.hash,
      search: window.location.search,
    });

    // Check if user has seen the intro in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    console.log('🔍 [Rovers-Website] Has seen intro:', hasSeenIntro);

    if (hasSeenIntro) {
      console.log('✅ [Rovers-Website] Skipping intro - already seen');
      setShowIntro(false);
    } else {
      console.log('🎬 [Rovers-Website] Showing intro animation');
    }
  }, []);

  const handleIntroComplete = () => {
    console.log('✅ [Rovers-Website] Intro complete - marking as seen');
    // Mark intro as seen for this session
    sessionStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
  };

  if (showIntro) {
    console.log('🎬 [Rovers-Website] Rendering LoadingIntro component');
    return <LoadingIntro onComplete={handleIntroComplete} />;
  }

  console.log('🏠 [Rovers-Website] Rendering main app with HashRouter');

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/sports/:sport" element={<SportDetail />} />
            <Route path="/sports/badminton" element={<SportDetail />} />
            <Route path="/sports/silambam" element={<SportDetail />} />
            <Route path="/sports/karate" element={<SportDetail />} />
            <Route path="/sports/swimming" element={<SportDetail />} />
            <Route path="/sports/athletics" element={<SportDetail />} />
            <Route path="/sports/football" element={<SportDetail />} />
            <Route path="/sports/cricket" element={<SportDetail />} />
            <Route path="/sports/basketball" element={<SportDetail />} />
            <Route path="/sports/chess" element={<SportDetail />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/india" element={<India />} />
            <Route path="/uae" element={<UAE />} />
            <Route path="/malaysia" element={<Malaysia />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/events/coming-soon-event" element={<ComingSoonEvent />} />
            <Route path="/events/malaysia-karate" element={<MalaysiaKarateEvent />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </Router>
  );
}

export default App;