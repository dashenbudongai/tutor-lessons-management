import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { Course, CourseFilters, CourseContextType } from '../types';
import { courseService } from '../services/courseService';

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<CourseFilters>({});

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      if (filters.startDate && new Date(course.date) < filters.startDate) return false;
      if (filters.endDate && new Date(course.date) > filters.endDate) return false;
      if (filters.status && course.status !== filters.status) return false;
      if (filters.subject && !course.subject.toLowerCase().includes(filters.subject.toLowerCase())) return false;
      if (filters.studentName && !course.studentName.toLowerCase().includes(filters.studentName.toLowerCase())) return false;
      return true;
    });
  }, [courses, filters]);

  const setFilters = (newFilters: CourseFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFiltersState({});
  };

  const acceptCourse = async (courseId: string) => {
    try {
      const updatedCourse = await courseService.acceptCourse(courseId);
      setCourses(prev => prev.map(course => 
        course.id === courseId ? updatedCourse : course
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept course');
    }
  };

  const getCoursesByStatus = useCallback((status: Course['status']) => {
    return filteredCourses.filter(course => course.status === status);
  }, [filteredCourses]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        filteredCourses,
        loading,
        error,
        filters,
        setFilters,
        clearFilters,
        acceptCourse,
        getCoursesByStatus,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}