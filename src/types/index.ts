export interface User {
  id: string;
  email: string;
  name: string;
  role: 'tutor' | 'student';
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  studentName: string;
  studentId: string;
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'completed' | 'upcoming' | 'available' | 'today';
  type: 'online' | 'in-person';
  description?: string;
  price?: number;
  location?: string;
  meetingLink?: string;
}

export interface CourseFilters {
  startDate?: Date;
  endDate?: Date;
  status?: Course['status'];
  subject?: string;
  studentName?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CourseContextType {
  courses: Course[];
  filteredCourses: Course[];
  loading: boolean;
  error: string | null;
  filters: CourseFilters;
  setFilters: (filters: CourseFilters) => void;
  clearFilters: () => void;
  acceptCourse: (courseId: string) => Promise<void>;
  getCoursesByStatus: (status: Course['status']) => Course[];
}