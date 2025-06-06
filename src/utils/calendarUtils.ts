
export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay();
};

export const calculateWorkoutStreak = (workoutDates: string[]): number => {
  if (workoutDates.length === 0) return 0;

  // Sort dates in descending order (most recent first)
  const sortedDates = workoutDates.sort().reverse();
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  // Check if today or yesterday has a workout (to handle today not being complete yet)
  const todayStr = currentDate.toISOString().split('T')[0];
  const yesterdayStr = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  let startFromToday = sortedDates.includes(todayStr);
  if (!startFromToday && sortedDates.includes(yesterdayStr)) {
    currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    startFromToday = true;
  }

  if (!startFromToday) return 0;

  // Count consecutive days
  for (const dateStr of sortedDates) {
    const workoutDate = currentDate.toISOString().split('T')[0];
    if (dateStr === workoutDate) {
      streak++;
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return streak;
};

export const getMonthlyStats = (monthIndex: number, year: number, dateHasData: Record<string, any>) => {
  const daysInMonth = getDaysInMonth(monthIndex, year);
  let workoutDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (dateHasData[dateString]?.workout) {
      workoutDays++;
    }
  }

  const restDays = daysInMonth - workoutDays;
  return { workoutDays, restDays };
};

export const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};
