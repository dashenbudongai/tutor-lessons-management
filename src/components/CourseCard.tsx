import { Course } from '../types';
import { Calendar, Clock, User, BookOpen, MapPin, Video } from 'lucide-react';
import { format } from 'date-fns';

interface CourseCardProps {
  course: Course;
  onAccept?: (courseId: string) => void;
}

export function CourseCard({ course, onAccept }: CourseCardProps) {
  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'today': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Course['type']) => {
    return type === 'online' ? Video : MapPin;
  };

  const TypeIcon = getTypeIcon(course.type);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
              {course.status === 'completed' ? 'Historic' : 
               course.status === 'today' ? 'Today’s' : 
               course.status === 'upcoming' ? 'Upcoming' : 'Available'}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <TypeIcon className="w-4 h-4" />
              {course.type === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {format(new Date(course.date), 'yyyy/MM/dd')}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{course.startTime}-{course.endTime} ({course.duration} minutes)</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span className="text-sm">Student: {course.studentName}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm">Subject: {course.subject}</span>
        </div>

        {course.location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Location: {course.location}</span>
          </div>
        )}

        {course.meetingLink && (
          <div className="flex items-center gap-2 text-gray-600">
            <Video className="w-4 h-4" />
            <a 
              href={course.meetingLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:underline"
            >
              Join Meeting
            </a>
          </div>
        )}

        {course.description && (
          <p className="text-sm text-gray-500 mt-2">{course.description}</p>
        )}
      </div>

      {course.status === 'available' && onAccept && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => onAccept(course.id)}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200 font-medium"
          >
            Accept Course
          </button>
        </div>
      )}
    </div>
  );
}