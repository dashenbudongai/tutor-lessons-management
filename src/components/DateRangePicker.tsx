import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onStartDateChange(value ? new Date(value) : undefined);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onEndDateChange(value ? new Date(value) : undefined);
  };

  const clearDates = () => {
    onStartDateChange(undefined);
    onEndDateChange(undefined);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <div className="relative">
            <input
              type="date"
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <div className="relative">
            <input
              type="date"
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
              onChange={handleEndDateChange}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {(startDate || endDate) && (
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {startDate && endDate 
              ? `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`
              : startDate
                ? `From ${format(startDate, 'MMM dd, yyyy')}`
                : `To ${endDate ? format(endDate, 'MMM dd, yyyy') : ''}`
            }
          </div>
          <button
            type="button"
            onClick={clearDates}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Clear dates
          </button>
        </div>
      )}

      {/* 快速日期范围选项 */}
      <div className="mt-3 space-y-2">
        <p className="text-xs text-gray-500 font-medium">Quick ranges:</p>
        <div className="flex flex-wrap gap-1">
          {[
            { label: 'Today', getRange: () => ({ 
              start: new Date(), 
              end: new Date() 
            })},
            { label: 'This Week', getRange: () => {
              const today = new Date();
              const start = new Date(today);
              start.setDate(today.getDate() - today.getDay());
              const end = new Date(start);
              end.setDate(start.getDate() + 6);
              return { start, end };
            }},
            { label: 'This Month', getRange: () => {
              const today = new Date();
              const start = new Date(today.getFullYear(), today.getMonth(), 1);
              const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              return { start, end };
            }},
            { label: 'Next 7 Days', getRange: () => {
              const start = new Date();
              const end = new Date();
              end.setDate(start.getDate() + 6);
              return { start, end };
            }},
          ].map(({ label, getRange }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                const { start, end } = getRange();
                onStartDateChange(start);
                onEndDateChange(end);
              }}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}