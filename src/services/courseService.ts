import { Course } from '../types';

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'High School Math Tutoring',
    subject: 'Mathematics',
    studentName: 'Alex Johnson',
    studentId: 's1',
    tutorId: 't1',
    date: '2024-01-02',
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    status: 'completed',
    type: 'online',
    description: 'Quadratic functions and trigonometry review',
    price: 200,
    meetingLink: 'https://zoom.us/j/123456'
  },
  {
    id: '2',
    title: 'English Speaking Practice',
    subject: 'English',
    studentName: 'Sarah Miller',
    studentId: 's2',
    tutorId: 't1',
    date: '2024-01-16',
    startTime: '10:00',
    endTime: '11:00',
    duration: 60,
    status: 'today',
    type: 'in-person',
    description: 'Daily conversation and pronunciation correction',
    price: 150,
    location: 'School Library'
  },
  {
    id: '3',
    title: 'Physics Mechanics',
    subject: 'Physics',
    studentName: 'Michael Chen',
    studentId: 's3',
    tutorId: 't1',
    date: '2024-01-17',
    startTime: '15:00',
    endTime: '16:30',
    duration: 90,
    status: 'upcoming',
    type: 'online',
    description: 'Application of Newton\'s Laws',
    price: 200
  },
  {
    id: '4',
    title: 'Chemistry Lab Guidance',
    subject: 'Chemistry',
    studentName: 'Emily Wang',
    studentId: 's4',
    tutorId: 't1',
    date: '2024-01-18',
    startTime: '09:00',
    endTime: '10:00',
    duration: 60,
    status: 'available',
    type: 'in-person',
    description: 'Organic chemistry experiment preparation',
    price: 180,
    location: 'Chemistry Lab'
  },
  {
    id: '5',
    title: 'Biology Genetics',
    subject: 'Biology',
    studentName: 'David Kim',
    studentId: 's5',
    tutorId: 't1',
    date: '2024-02-19',
    startTime: '13:00',
    endTime: '14:30',
    duration: 90,
    status: 'available',
    type: 'online',
    description: 'Mendelian Genetics Principles',
    price: 200
  }
];

export const courseService = {
  async getCourses(): Promise<Course[]> {
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockCourses];
  },

  async acceptCourse(courseId: string): Promise<Course> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const course = mockCourses.find(c => c.id === courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    
    const updatedCourse = {
      ...course,
      status: 'upcoming' as const
    };
    
    // 在实际应用中，这里会调用 API
    return updatedCourse;
  },

  async getCoursesByDateRange(startDate: Date, endDate: Date): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCourses.filter(course => {
      const courseDate = new Date(course.date);
      return courseDate >= startDate && courseDate <= endDate;
    });
  }
};