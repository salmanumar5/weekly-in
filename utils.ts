
export function getCurrentWeekId(): string {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  const result = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
  return `${now.getFullYear()}-W${result.toString().padStart(2, '0')}`;
}

export function getWeekDates(weekId: string): Date[] {
  const [year, week] = weekId.split('-W').map(Number);
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay());
  else
      ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay());

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(ISOweekStart);
    d.setDate(ISOweekStart.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function formatDateRange(dates: Date[]): string {
  if (dates.length === 0) return '';
  const start = dates[0];
  const end = dates[6];
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}
