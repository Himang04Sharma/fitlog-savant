
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { format } from 'date-fns';
import DailyLogContent from './dailyLog/DailyLogContent';
import { useIsMobile } from '@/hooks/use-mobile';

interface DailyLogDialogProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onDataSaved?: () => void;
}

const DailyLogDialog = ({ date, open, onOpenChange, user, onDataSaved }: DailyLogDialogProps) => {
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={
        isMobile 
          ? "w-[95vw] h-[95vh] max-w-none max-h-none p-4 overflow-y-auto rounded-lg bg-primary border-custom" 
          : "sm:max-w-[90vw] max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-primary border-custom"
      }>
        <DialogHeader className={isMobile ? "text-center pb-2" : "text-center pb-4"}>
          <DialogTitle className={
            isMobile 
              ? "text-xl font-heading font-bold text-primary"
              : "text-3xl font-heading font-bold text-primary"
          }>
            Fitness Tracker - {date ? format(date, 'MMMM d, yyyy') : ''}
          </DialogTitle>
          <DialogDescription className={
            isMobile 
              ? "text-sm text-secondary"
              : "text-lg text-secondary"
          }>
            Track your daily goals, meals, and workouts all in one place
          </DialogDescription>
        </DialogHeader>
        
        <DailyLogContent
          date={date}
          user={user}
          onDataSaved={onDataSaved}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DailyLogDialog;
