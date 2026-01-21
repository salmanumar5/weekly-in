
import React from 'react';
import { Team, AvailabilityRecord, Status } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { isToday as checkIsToday } from '../utils';

interface TeamTableProps {
  team: Team;
  weekDates: Date[];
  availabilities: AvailabilityRecord[];
  currentUserId: string;
  onToggleCell: (userId: string, dayIndex: number) => void;
}

const TeamTable: React.FC<TeamTableProps> = ({ team, weekDates, availabilities, currentUserId, onToggleCell }) => {
  return (
    <div className="glass rounded-[32px] overflow-hidden apple-shadow ring-1 ring-black/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/40 border-b border-black/5">
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-black/30 min-w-[200px]">Team Member</th>
              {weekDates.map((date, idx) => {
                const isToday = checkIsToday(date);
                return (
                  <th key={idx} className={`p-4 text-center min-w-[80px] transition-colors duration-300 ${isToday ? 'bg-black/5 relative' : ''}`}>
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${isToday ? 'text-black' : 'text-black/30'}`}>
                        {DAYS_OF_WEEK[idx]}
                      </span>
                      <span className={`text-lg font-bold ${isToday ? 'text-black' : 'text-black/50'}`}>
                        {date.getDate()}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.03]">
            {team.memberIds.map(userId => {
              const record = availabilities.find(a => a.userId === userId);
              const isSelf = userId === currentUserId;

              return (
                <tr key={userId} className={`group transition-colors duration-300 hover:bg-white/50 ${isSelf ? 'bg-blue-50/20' : ''}`}>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold border border-black/5 shadow-sm group-hover:scale-110 transition-transform">
                        {isSelf ? 'YOU' : 'MT'}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isSelf ? 'text-blue-600' : 'text-black'}`}>
                          {isSelf ? 'You' : `Member ${userId.slice(-4)}`}
                        </span>
                        <span className="text-[10px] font-medium text-black/30">
                          {userId === team.adminId ? 'Admin' : 'Member'}
                        </span>
                      </div>
                    </div>
                  </td>
                  {weekDates.map((_, idx) => {
                    const isOff = team.offDays.includes(idx);
                    const status = isOff ? Status.WKND : (record?.days[idx] || Status.WFO);
                    
                    let tagClass = "bg-gray-50 text-black/20";
                    let text = "OFF";

                    if (status === Status.WFO) {
                      tagClass = "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20";
                      text = "WFO";
                    } else if (status === Status.WFH) {
                      tagClass = "bg-blue-600/10 text-blue-600 ring-1 ring-blue-600/20";
                      text = "WFH";
                    }

                    return (
                      <td key={idx} className={`p-4 text-center cursor-default ${checkIsToday(weekDates[idx]) ? 'bg-black/[0.02]' : ''}`}>
                         <button 
                           disabled={!isSelf || isOff}
                           onClick={() => onToggleCell(userId, idx)}
                           className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all duration-300 ${tagClass} ${isSelf && !isOff ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'}`}
                         >
                           {text}
                         </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamTable;
