// Simple toast hook using sonner
import { toast as sonnerToast } from 'sonner';

export function useToast() {
  return {
    toast: sonnerToast,
    toasts: [],
    dismiss: () => {},
  };
}

export { sonnerToast as toast };
