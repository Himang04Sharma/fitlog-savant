
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DailyGoalsSection from './DailyGoalsSection';
import MealsTableSection from './MealsTableSection';
import WorkoutTrackerSection from './WorkoutTrackerSection';
import { useDailyLogNew } from '@/hooks/useDailyLogNew';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
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
          <h3 className="text-lg font-semibold text-primary mb-2">Authentication Required</h3>
          <p className="text-secondary mb-4">Please log in to access your daily fitness tracker</p>
          <Button onClick={() => navigate('/auth')} className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Log In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={isMobile ? "space-y-6" : "max-w-7xl mx-auto p-6 space-y-8"}>
      {/* Balanced Grid Layout - Equal column widths */}
      <div className={isMobile ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
        {/* Daily Goals Section */}
        <div className="space-y-6">
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
        
        {/* Workout and Meals Section */}
        <div className="space-y-6">
          <WorkoutTrackerSection
            workouts={dailyLogData.workouts}
            muscleGroupsTrained={dailyLogData.muscleGroupsTrained}
            onWorkoutsChange={(workouts) => setDailyLogData(prev => ({ ...prev, workouts }))}
            onMuscleGroupsTrainedChange={(muscleGroupsTrained) => 
              setDailyLogData(prev => ({ ...prev, muscleGroupsTrained }))
            }
          />
          
          <MealsTableSection
            meals={dailyLogData.meals}
            macros={dailyLogData.macros}
            onMealsChange={(meals) => setDailyLogData(prev => ({ ...prev, meals }))}
            onMacrosChange={(macros) => setDailyLogData(prev => ({ ...prev, macros }))}
          />
        </div>
      </div>

      {/* Save Button - Theme-aware styling */}
      <div className={
        isMobile 
          ? "sticky bottom-0 bg-primary border-t border-custom p-4 -m-4 mt-6"
          : "flex justify-center pt-6"
      }>
        <Button
          onClick={saveData}
          disabled={saving}
          size="lg"
          className={`flex items-center gap-2 bg-accent-green hover:bg-accent-green-hover text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
            isMobile ? "w-full px-6 py-3" : "px-8 py-3"
          }`}
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Daily Log'}
        </Button>
      </div>
    </div>
  );
};

export default DailyLogContent;
