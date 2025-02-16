import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const LoadingButton = ({ className }: { className?: string }) => {
  return (
    <Button disabled className={cn('flex-1', className)}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading
    </Button>
  );
};

export default LoadingButton;
