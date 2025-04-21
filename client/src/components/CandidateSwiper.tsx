import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Star, X, Check, X as XIcon } from 'lucide-react';
import { dummyCandidates, Candidate } from '../data/dummyData';
import { toast } from 'react-hot-toast';

export const CandidateSwiper: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const swipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = () => {
    try {
      setLoading(true);
      setCandidates(dummyCandidates);
      setError(null);
    } catch (err) {
      setError('Failed to load candidates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    // Show toast notification
    if (direction === 'right') {
      toast.success('Liked candidate!', {
        icon: '👍',
        duration: 2000,
      });
    } else {
      toast.error('Passed on candidate', {
        icon: '👎',
        duration: 2000,
      });
    }
    
    // Reset direction after animation
    setTimeout(() => {
      setSwipeDirection(null);
    }, 300);
    
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Reset to the beginning when we reach the end
      setCurrentIndex(0);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading candidates...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  if (candidates.length === 0) {
    return <div className="flex items-center justify-center h-screen">No candidates found</div>;
  }

  const currentCandidate = candidates[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            ref={swipeRef}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: swipeDirection === 'left' ? -100 : swipeDirection === 'right' ? 100 : 0,
              rotate: swipeDirection === 'left' ? -10 : swipeDirection === 'right' ? 10 : 0
            }}
            exit={{ 
              scale: 0.8, 
              opacity: 0,
              x: swipeDirection === 'left' ? -200 : swipeDirection === 'right' ? 200 : 0,
              rotate: swipeDirection === 'left' ? -20 : swipeDirection === 'right' ? 20 : 0
            }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Swipe indicators */}
            {swipeDirection === 'left' && (
              <div className="absolute top-10 left-10 bg-red-500 text-white px-4 py-2 rounded-lg z-10 transform -rotate-12">
                <XIcon className="w-6 h-6" />
                <span className="ml-2 font-bold">PASS</span>
              </div>
            )}
            
            {swipeDirection === 'right' && (
              <div className="absolute top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-lg z-10 transform rotate-12">
                <Check className="w-6 h-6" />
                <span className="ml-2 font-bold">LIKE</span>
              </div>
            )}
            
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <img
                    src={currentCandidate.avatar_url}
                    alt={currentCandidate.employee_name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <CardTitle className="flex items-center justify-between">
                      <span>{currentCandidate.employee_name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {currentCandidate.match_percentage} Match
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-500">{currentCandidate.title}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    <span className="text-sm text-gray-600">{currentCandidate.employee_email}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentCandidate.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Experience</h3>
                    <p className="text-sm text-gray-600">
                      {currentCandidate.experience_years} years • {currentCandidate.education}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Preferences</h3>
                    <p className="text-sm text-gray-600">
                      {currentCandidate.preferred_location} • {currentCandidate.preferred_job_type}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Match Analysis</h3>
                    <p className="text-sm text-gray-600">{currentCandidate.analysis}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Match Score</h3>
                    <Progress value={currentCandidate.score * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleSwipe('left')}
            className="w-12 h-12 rounded-full"
          >
            <X className="w-6 h-6 text-red-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleSwipe('right')}
            className="w-12 h-12 rounded-full"
          >
            <Star className="w-6 h-6 text-green-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 