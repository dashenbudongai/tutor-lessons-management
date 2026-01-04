import React, { useState } from 'react';
import { CourseFilters } from '../types';
import { Calendar, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRangePicker } from './DateRangePicker';
interface FilterBarProps {
  filters: CourseFilters;
  onFilterChange: (filters: CourseFilters) => void;
  onClearFilters: () => void;
}

export function FilterBar({ filters, onFilterChange, onClearFilters }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<CourseFilters>(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
    setShowFilters(false);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
    setShowFilters(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {Object.keys(filters).length > 0 && (
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </button>

          {Object.keys(filters).length > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={localFilters.startDate ? format(localFilters.startDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setLocalFilters(prev => ({ 
                  ...prev, 
                  startDate: e.target.value ? new Date(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={localFilters.endDate ? format(localFilters.endDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setLocalFilters(prev => ({ 
                  ...prev, 
                  endDate: e.target.value ? new Date(e.target.value) : undefined 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}