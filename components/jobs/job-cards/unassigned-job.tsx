'use client';
import { Button } from 'pakt-ui';
import { useRouter } from 'next/navigation';

interface UnAssignedJobCardProps {
  id: string;
  title: string;
  price: number;
  createdAt: string;
  skills?: string;
  hasInvite: boolean;
  isPrivate?: boolean;
}

export const UnAssignedJobCard: React.FC<UnAssignedJobCardProps> = ({
  createdAt,
  price,
  title,
  id,
  skills,
  hasInvite,
  isPrivate,
}) => {
  const router = useRouter();

  return (
    <div className="gap-4 bg-white rounded-3xl border-line w-full flex flex-col grow border p-4">
      <div className="w-full flex gap-4">
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {<span className="text-body text-lg">{createdAt}</span>}
              {hasInvite && (
                <span className="px-3 text-blue-500 inline-flex rounded-full bg-blue-50 text-sm border border-blue-200">
                  Awaiting Talent Response
                </span>
              )}
            </div>

            <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${price}</span>
          </div>
          <div className="grow text-title text-2xl min-h-[58px]">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-auto">
        <div className="gap-2 flex items-center">
          {!hasInvite && isPrivate && (
            <Button
              size="xs"
              variant="secondary"
              onClick={() => {
                router.push(`/talents${skills ? `?skills=${skills}` : ''}`);
              }}
            >
              Find Talent
            </Button>
          )}

          {!hasInvite && !isPrivate && (
            <Button
              size="xs"
              variant="secondary"
              onClick={() => {
                router.push(`/jobs/${id}/applicants`);
              }}
            >
              View Applicants
            </Button>
          )}

          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              router.push(`/jobs/${id}`);
            }}
          >
            Job Details
          </Button>
        </div>
      </div>
    </div>
  );
};
