import React from 'react';
import { CandidateSwiper } from '../components/CandidateSwiper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { dummySkills } from '../data/dummyData';

export const EmployerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main swiping area */}
          <div className="md:col-span-2">
            <CandidateSwiper />
          </div>

          {/* Sidebar with top skills */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Top Skills in Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dummySkills.map((skill) => (
                    <div
                      key={skill.keyword}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm font-medium">{skill.keyword}</span>
                      <span className="text-xs text-gray-500">{skill.frequency} matches</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}; 