import { dataService } from './dataService';

// Re-export dataService as base44 for backward compatibility.
// All components that import { base44 } from '@/api/base44Client'
// will now use Firebase Firestore instead of the deleted Base44 backend.
export const base44 = dataService;
