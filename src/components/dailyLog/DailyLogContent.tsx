
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DailyGoalsSection from './DailyGoalsSection';
import MealsTableSection from './MealsTableSection';
import WorkoutTrackerSection from './WorkoutTrackerSection';
import { useDailyLogNew } from '@/hooks/useDailyLogNew';

interface DailyLogContentProps {
  date: Date | null;
  user?: any;
  onDataSaved?: () => void;
}

const DailyLogContent: React.FC<DailyLogContentProps> = ({
  date,
  user,
  onDataSaved
}) => {
  const navigate = useNavigate();
  const {
    dailyLogData,
    setDailyLogData,
    loading,
    saving,
    resetState,
    fetchData,
    saveData
  } = useDailyLogNew({ date, user, onDataSaved });

  useEffect(() => {
    if (date && user) {
      fetchData();
    }
  }, [date, user]);

  useEffect(() => {
    if (!date) {
      resetState();
    }
  }, [date]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse text-muted-foreground">Loading your fitness data...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Authentication Required</h3>
          <p className="text-muted-foreground mb-4">Please log in to access your daily fitness tracker</p>
          <Button onClick={() => navigate('/auth')} className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Log In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 min-h-[600px] space-y-6">
        {/* Top Section - Goals and Workouts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Side - Daily Goals (40%) */}
          <div className="lg:col-span-2">
            <DailyGoalsSection
              goals={dailyLogData.goals}
              waterIntake={dailyLogData.waterIntake}
              steps={dailyLogData.steps}
              weight={dailyLogData.weight}
              onGoalsChange={(goals) => setDailyLogData(prev => ({ ...prev, goals }))}
              onWaterIntakeChange={(waterIntake) => setDailyLogData(prev => ({ ...prev, waterIntake }))}
              onStepsChange={(steps) => setDailyLogData(prev => ({ ...prev, steps }))}
              onWeightChange={(weight) => setDailyLogData(prev => ({ ...prev, weight }))}
            />
          </div>
          
          {/* Right Side - Workout Tracker (60%) */}
          <div className="lg:col-span-3">
            <WorkoutTrackerSection
              workouts={dailyLogData.workouts}
              onWorkoutsChange={(workouts) => setDailyLogData(prev => ({ ...prev, workouts }))}
            />
          </div>
        </div>

        {/* Bottom Section - Meals Table (Full Width) */}
        <div className="w-full">
          <MealsTableSection
            meals={dailyLogData.meals}
            macros={dailyLogData.macros}
            onMealsChange={(meals) => setDailyLogData(prev => ({ ...prev, meals }))}
            onMacrosChange={(macros) => setDailyLogData(prev => ({ ...prev, macros }))}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pb-6">
        <Button
          onClick={saveData}
          disabled={saving}
          size="lg"
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Daily Log'}
        </Button>
      </div>
    </div>
  );
};

export default DailyLogContent;
