import React, { useState, useEffect, useRef } from 'react';
import { employerService, Candidate } from '../services/employerService';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Star, X } from 'lucide-react';

export const CandidateSwiper: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const swipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const response = await employerService.getMatchingCandidates();
      setCandidates(response.candidates);
      setError(null);
    } catch (err) {
      setError('Failed to load candidates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      loadCandidates();
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
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentCandidate.employee_name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {currentCandidate.match_percentage} Match
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    <span className="text-sm text-gray-600">{currentCandidate.employee_email}</span>
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