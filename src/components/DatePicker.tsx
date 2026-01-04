import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

interface DatePickerProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  label?: string;
}

export function DatePicker({ selectedDate, onDateChange, label }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setIsOpen(false);
  };

  const clearDate = () => {
    onDateChange(undefined);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          readOnly
          value={selectedDate ? format(selectedDate, 'MMM dd, yyyy') : ''}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer bg-white"
          placeholder="Select date"
        />
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        {selectedDate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearDate();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="h-8" />
            ))}
            
            {days.map((day) => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              return (
                <button
                  key={day.toString()}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`
                    h-8 rounded flex items-center justify-center text-sm
                    ${isSelected 
                      ? 'bg-primary-600 text-white' 
                      : isCurrentMonth
                        ? 'text-gray-900 hover:bg-gray-100'
                        : 'text-gray-400 hover:bg-gray-50'
                    }
                    ${isSameDay(day, new Date()) && !isSelected 
                      ? 'border border-primary-500' 
                      : ''
                    }
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(startOfMonth(today));
                  handleDateSelect(today);
                }}
                className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200"
              >
                Today
              </button>
              <button
                type="button"
                onClick={clearDate}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}