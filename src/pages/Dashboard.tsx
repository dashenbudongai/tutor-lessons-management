import React, { useState, useMemo } from 'react';
import { CourseCard } from '../components/CourseCard';
import { FilterBar } from '../components/FilterBar';
import { useCourses } from '../contexts/CourseContext';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Calendar, CheckCircle, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { format, startOfMonth, isSameMonth, parseISO } from 'date-fns';

interface MonthGroup {
  month: Date;
  monthName: string;
  courses: {
    today: any[];
    upcoming: any[];
    available: any[];
    completed: any[];
  };
}

export function Dashboard() {
  const { 
    filteredCourses, 
    acceptCourse, 
    loading, 
    error, 
    filters, 
    setFilters, 
    clearFilters 
  } = useCourses();
  const { user } = useAuth();
  
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['today', 'upcoming', 'available']));

  const stats = useMemo(() => {
    const today = filteredCourses.filter(course => course.status === 'today').length;
    const upcoming = filteredCourses.filter(course => course.status === 'upcoming').length;
    const available = filteredCourses.filter(course => course.status === 'available').length;
    const completed = filteredCourses.filter(course => course.status === 'completed').length;
    return { today, upcoming, available, completed };
  }, [filteredCourses]);

  // 按月份分组课程
  const monthGroups = useMemo(() => {
    const groups = new Map<string, MonthGroup>();
    
    filteredCourses.forEach(course => {
      const courseDate = parseISO(course.date);
      const monthStart = startOfMonth(courseDate);
      const monthKey = format(monthStart, 'yyyy-MM');
      
      if (!groups.has(monthKey)) {
        groups.set(monthKey, {
          month: monthStart,
          monthName: format(monthStart, 'MMMM yyyy'),
          courses: {
            today: [],
            upcoming: [],
            available: [],
            completed: []
          }
        });
      }
      
      const group = groups.get(monthKey)!;
      group.courses[course.status].push(course);
    });
    
    // 按月份排序（从旧到新）
    return Array.from(groups.values())
      .sort((a, b) => a.month.getTime() - b.month.getTime());
  }, [filteredCourses]);

  // 切换月份展开状态
  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(monthKey)) {
        newSet.delete(monthKey);
      } else {
        newSet.add(monthKey);
      }
      return newSet;
    });
  };

  // 切换课程类型部分展开状态
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // 展开所有月份
  const expandAll = () => {
    const allMonthKeys = monthGroups.map(group => format(group.month, 'yyyy-MM'));
    setExpandedMonths(new Set(allMonthKeys));
  };

  // 收起所有月份
  const collapseAll = () => {
    setExpandedMonths(new Set());
  };

  if (loading && filteredCourses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h1>
        <p className="text-gray-600">
          Today is {format(new Date(), 'EEEE, MMMM dd, yyyy')}
        </p>
      </div>

      {/* 统计数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.today}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.upcoming}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.available}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      <FilterBar 
        filters={filters} 
        onFilterChange={setFilters} 
        onClearFilters={clearFilters} 
      />

      {/* 课程列表 - 按月份分组 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Lessons</h2>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors duration-200"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                Collapse All
              </button>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No lessons found</p>
              {Object.keys(filters).length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 text-primary-600 hover:text-primary-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {monthGroups.map((group) => {
                const monthKey = format(group.month, 'yyyy-MM');
                const isMonthExpanded = expandedMonths.has(monthKey);
                const totalCourses = 
                  group.courses.today.length + 
                  group.courses.upcoming.length + 
                  group.courses.available.length + 
                  group.courses.completed.length;

                return (
                  <div key={monthKey} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* 月份标题 */}
                    <button
                      onClick={() => toggleMonth(monthKey)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg">
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">{group.monthName}</h3>
                          <p className="text-sm text-gray-500">
                            {totalCourses} course{totalCourses !== 1 ? 's' : ''}
                            {group.courses.today.length > 0 && ` • ${group.courses.today.length} today`}
                            {group.courses.upcoming.length > 0 && ` • ${group.courses.upcoming.length} upcoming`}
                            {group.courses.available.length > 0 && ` • ${group.courses.available.length} available`}
                            {group.courses.completed.length > 0 && ` • ${group.courses.completed.length} completed`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {isMonthExpanded ? 'Collapse' : 'Expand'}
                        </span>
                        {isMonthExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                    </button>

                    {/* 月份内的课程 */}
                    {isMonthExpanded && (
                      <div className="p-4 bg-white">
                        {/* 今日课程 */}
                        {group.courses.today.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                              <button
                                onClick={() => toggleSection(`${monthKey}-today`)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                              >
                                {expandedSections.has(`${monthKey}-today`) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                                <span className="font-semibold">Today's Lessons</span>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {group.courses.today.length}
                                </span>
                              </button>
                            </div>
                            
                            {expandedSections.has(`${monthKey}-today`) && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {group.courses.today.map((course) => (
                                  <CourseCard 
                                    key={course.id} 
                                    course={course} 
                                    onAccept={acceptCourse}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 即将开始的课程 */}
                        {group.courses.upcoming.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                              <button
                                onClick={() => toggleSection(`${monthKey}-upcoming`)}
                                className="flex items-center gap-2 text-green-600 hover:text-green-700"
                              >
                                {expandedSections.has(`${monthKey}-upcoming`) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                                <span className="font-semibold">Upcoming Lessons</span>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  {group.courses.upcoming.length}
                                </span>
                              </button>
                            </div>
                            
                            {expandedSections.has(`${monthKey}-upcoming`) && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {group.courses.upcoming.map((course) => (
                                  <CourseCard 
                                    key={course.id} 
                                    course={course} 
                                    onAccept={acceptCourse}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 可预约课程 */}
                        {group.courses.available.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                              <button
                                onClick={() => toggleSection(`${monthKey}-available`)}
                                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
                              >
                                {expandedSections.has(`${monthKey}-available`) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                                <span className="font-semibold">Available Lessons</span>
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                  {group.courses.available.length}
                                </span>
                              </button>
                            </div>
                            
                            {expandedSections.has(`${monthKey}-available`) && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {group.courses.available.map((course) => (
                                  <CourseCard 
                                    key={course.id} 
                                    course={course} 
                                    onAccept={acceptCourse}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 已完成的课程 */}
                        {group.courses.completed.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <button
                                onClick={() => toggleSection(`${monthKey}-completed`)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                              >
                                {expandedSections.has(`${monthKey}-completed`) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                                <span className="font-semibold">Completed Lessons</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                  {group.courses.completed.length}
                                </span>
                              </button>
                            </div>
                            
                            {expandedSections.has(`${monthKey}-completed`) && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {group.courses.completed.map((course) => (
                                  <CourseCard 
                                    key={course.id} 
                                    course={course} 
                                    onAccept={acceptCourse}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}