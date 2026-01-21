
import React from 'react';
import { Status, Team, AvailabilityRecord } from '../types';
import { ICONS, DAYS_OF_WEEK } from '../constants';
import { isToday as checkIsToday } from '../utils';

interface AvailabilityCardsProps {
  weekDates: Date[];
  team: Team;
  availability?: AvailabilityRecord;
  onToggle: (dayIndex: number) => void;
}

const AvailabilityCards: React.FC<AvailabilityCardsProps> = ({ weekDates, team, availability, onToggle }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
      {weekDates.map((date, idx) => {
        const isOff = team.offDays.includes(idx);
        const currentStatus = isOff ? Status.WKND : (availability?.days[idx] || Status.WFO);
        const isToday = checkIsToday(date);
        
        let bgColor = "bg-white/60";
        let iconColor = "text-black/30";
        let label = "Office";
        let Icon = ICONS.Office;

        if (isOff) {
          bgColor = "bg-black/5";
          iconColor = "text-black/20";
          label = "Off";
          Icon = ICONS.Weekend;
        } else if (currentStatus === Status.WFO) {
          bgColor = "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/50";
          iconColor = "text-white/80";
          label = "Office";
          Icon = ICONS.Office;
        } else if (currentStatus === Status.WFH) {
          bgColor = "bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/50";
          iconColor = "text-white/80";
          label = "Home";
          Icon = ICONS.Home;
        }

        return (
          <button
            key={idx}
            disabled={isOff}
            onClick={() => onToggle(idx)}
            className={`relative flex flex-col items-center justify-center p-6 h-40 rounded-[28px] transition-all duration-500 ${bgColor} ${isOff ? 'cursor-not-allowed border-dashed border-2 border-black/5' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {isToday && (
              <span className="absolute top-3 px-2 py-0.5 bg-black/5 text-[9px] font-bold uppercase tracking-widest text-black/40 rounded-full border border-black/5">
                Today
              </span>
            )}
            
            <div className="flex flex-col items-center gap-4 mt-2">
              <div className="text-center">
                <span className={`text-[10px] font-bold tracking-widest uppercase mb-1 block ${currentStatus === Status.WFO || currentStatus === Status.WFH ? 'text-white/60' : 'text-black/30'}`}>
                  {DAYS_OF_WEEK[idx]}
                </span>
                <span className={`text-xl font-bold ${currentStatus === Status.WFO || currentStatus === Status.WFH ? 'text-white' : 'text-black'}`}>
                  {date.getDate()}
                </span>
              </div>
              
              <div className="flex flex-col items-center gap-1.5">
                <Icon className={`w-5 h-5 ${iconColor}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStatus === Status.WFO || currentStatus === Status.WFH ? 'text-white/90' : 'text-black/30'}`}>
                  {label}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AvailabilityCards;
