import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface Course {
  id: string;
  title: string;
  description: string;
  system: string;
  niveau: string;
  subject: string;
  price: number;
  xp_reward: number;
}

export const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setCourses(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="p-6 text-amber-400">Chargement des cours...</div>;
  if (error) return <div className="p-6 text-red-500">Erreur : {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {courses.map((course) => (
        <div key={course.id} className="bg-[#1a0f07] border border-amber-900/40 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold px-2 py-1 bg-amber-500/10 text-amber-400 rounded">
              {course.subject}
            </span>
            <span className="text-xs text-amber-500 font-bold">{course.niveau}</span>
          </div>
          <h3 className="text-lg font-bold text-amber-100 mb-2">{course.title}</h3>
          <p className="text-sm text-gray-400 mb-4">{course.description}</p>
          <div className="flex justify-between items-center text-xs text-amber-300 border-t border-amber-900/30 pt-3">
            <span>Prix : {course.price} FCFA</span>
            <span>+{course.xp_reward} XP</span>
          </div>
        </div>
      ))}
    </div>
  );
}; 
export default CourseList;
