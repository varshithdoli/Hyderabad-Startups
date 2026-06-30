<<<<<<< HEAD
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-white/[0.04]',
        'after:absolute after:inset-0',
        'after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent',
        'after:animate-[shimmer_2s_infinite]',
        className
      )}
      {...props}
    />
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card rounded-2xl p-5 space-y-3', className)}>
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}

function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card rounded-xl p-4 flex items-center gap-4', className)}>
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonRow };
=======
version https://git-lfs.github.com/spec/v1
oid sha256:0b0cd1c68676e3f504d29df8ac4df184eebacb395fda0f385258341d7230c745
size 1507
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
