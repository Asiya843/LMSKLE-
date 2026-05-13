export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
  category: string;
  coverUrl: string;
  audience: 'student' | 'employee' | 'both';
}

export type UserRole = 'student' | 'employee' | 'admin';

export interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}
