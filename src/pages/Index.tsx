import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { AuthForms } from '@/components/AuthForms';
import { TourDashboard } from '@/components/TourDashboard';
import { TourUpload } from '@/components/TourUpload';
import { VRViewer } from '@/components/VRViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useTours } from '@/hooks/useTours';
import { 
  Camera, 
  Zap, 
  Shield, 
  Share2, 
  Eye, 
  ArrowRight,
  Play,
  Users,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroImage from '@/assets/hero-vr.jpg';

const mockHotspots = [
  { id: '1', position: [10, 0, -20] as [number, number, number], label: 'Living Room' },
  { id: '2', position: [-15, 0, 10] as [number, number, number], label: 'Kitchen' },
  { id: '3', position: [0, 0, 25] as [number, number, number], label: 'Bedroom' },
];

const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Hero Background */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 gradient-hero opacity-90" />
    </div>

    {/* Content */}
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <Badge className="glass-effect text-primary border-primary/20">
            <Zap className="h-3 w-3 mr-1" />
            Now in Beta
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Create Stunning
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Virtual Tours
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your 360° images into immersive virtual experiences. 
            Share spaces like never before with professional-grade virtual tours.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="xl" 
            onClick={onGetStarted}
            className="shadow-glow hover:scale-105 transition-smooth group"
          >
            <Play className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
            Get Started Free
          </Button>
          
          <Button 
            variant="glass" 
            size="xl"
            className="backdrop-blur-md border-border/30"
          >
            <Eye className="h-5 w-5 mr-2" />
            View Demo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          {[
            { icon: Users, stat: '10K+', label: 'Tours Created' },
            { icon: Globe, stat: '2M+', label: 'Views Generated' },
            { icon: Camera, stat: '50K+', label: 'Images Processed' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className="glass-effect p-6 rounded-lg text-center"
            >
              <item.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">{item.stat}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-24 bg-card/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Everything You Need to Create
          <span className="bg-gradient-primary bg-clip-text text-transparent"> Amazing Tours</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional tools designed for creators, real estate agents, and businesses
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: Camera,
            title: 'Easy Upload',
            description: 'Support for all 360° cameras including Ricoh Theta, Insta360, and smartphone panoramas',
            features: ['Drag & drop interface', 'Batch processing', 'Auto-optimization']
          },
          {
            icon: Zap,
            title: 'Instant Processing',
            description: 'Our advanced processing engine creates smooth virtual tours in minutes, not hours',
            features: ['Real-time preview', 'Cloud processing', 'HD quality output']
          },
          {
            icon: Share2,
            title: 'Easy Sharing',
            description: 'Share your tours with a simple link or embed them anywhere with our iframe code',
            features: ['Custom domains', 'Social sharing', 'Analytics tracking']
          },
          {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your content is protected with enterprise-grade security and privacy controls',
            features: ['Password protection', 'Access controls', 'GDPR compliant']
          },
          {
            icon: Smartphone,
            title: 'Mobile Optimized',
            description: 'Perfect viewing experience across all devices, from desktop to mobile',
            features: ['Touch controls', 'Responsive design', 'Fast loading']
          },
          {
            icon: Monitor,
            title: 'Professional Tools',
            description: 'Advanced features for professionals including branding and lead capture',
            features: ['Custom branding', 'Lead forms', 'Team collaboration']
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full glass-effect hover:shadow-elegant transition-smooth group">
              <CardHeader>
                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const DemoSection = () => (
  <section className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Experience the <span className="bg-gradient-primary bg-clip-text text-transparent">Future</span> of Virtual Tours
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Try our interactive viewer below. Click and drag to look around, scroll to zoom.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <VRViewer
          panoramaUrl="/api/placeholder/2048/1024"
          hotspots={mockHotspots}
          onHotspotClick={(hotspot) => console.log('Clicked hotspot:', hotspot)}
          className="max-w-5xl mx-auto"
        />
      </motion.div>
    </div>
  </section>
);

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showUpload, setShowUpload] = useState(false);
  const { user, loading, signUp, signIn, signOut } = useAuth();
  const { tours, loading: toursLoading, createTour, updateTour, deleteTour } = useTours();

  const handleAuth = async (data: { email: string; password: string; name?: string }) => {
    try {
      if (authMode === 'login') {
        await signIn(data.email, data.password);
      } else {
        await signUp(data.email, data.password, data.name || '');
      }
      setCurrentPage('dashboard');
    } catch (error) {
      // Error handling is done in the auth hooks
      console.error('Auth error:', error);
    }
  };

  const handleAuthAction = (action: 'login' | 'logout') => {
    if (action === 'logout') {
      signOut();
      setCurrentPage('home');
    } else {
      setCurrentPage('auth');
    }
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('auth');
    }
  };

  const handleTourAction = async (action: string, tour?: any) => {
    try {
      switch (action) {
        case 'create':
          setShowUpload(true);
          break;
        case 'view':
          console.log('View tour:', tour);
          break;
        case 'edit':
          console.log('Edit tour:', tour);
          break;
        case 'delete':
          if (tour && confirm(`Are you sure you want to delete "${tour.title}"?`)) {
            await deleteTour(tour.id);
          }
          break;
        case 'share':
          if (tour?.shareToken) {
            const shareUrl = `${window.location.origin}/tour/${tour.shareToken}`;
            navigator.clipboard.writeText(shareUrl);
            console.log('Share URL copied:', shareUrl);
          }
          break;
      }
    } catch (error) {
      console.error('Tour action error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Render different pages
  if (currentPage === 'auth') {
    return (
      <AuthForms
        mode={authMode}
        onModeChange={setAuthMode}
        onSubmit={handleAuth}
        isLoading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isAuthenticated={!!user}
        onAuthAction={handleAuthAction}
        userEmail={user?.email}
      />

      <AnimatePresence>
        {showUpload && (
          <TourUpload
            onClose={() => setShowUpload(false)}
            onTourCreated={(tourId) => {
              setShowUpload(false);
              console.log('Tour created:', tourId);
            }}
          />
        )}
      </AnimatePresence>

      {currentPage === 'home' && (
        <>
          <HeroSection onGetStarted={handleGetStarted} />
          <FeaturesSection />
          <DemoSection />
        </>
      )}

      {currentPage === 'dashboard' && user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <TourDashboard
            projects={tours}
            loading={toursLoading}
            onCreateNew={() => handleTourAction('create')}
            onViewTour={(tour) => handleTourAction('view', tour)}
            onEditTour={(tour) => handleTourAction('edit', tour)}
            onDeleteTour={(tour) => handleTourAction('delete', tour)}
            onShareTour={(tour) => handleTourAction('share', tour)}
          />
        </div>
      )}

      {currentPage === 'settings' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your account and tour preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings panel coming soon...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {currentPage === 'help' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>
                Get help with creating and sharing your virtual tours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Help documentation coming soon...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;