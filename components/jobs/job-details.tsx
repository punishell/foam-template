import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, Tag } from 'lucide-react';
import { AfroProfile } from '@/components/common/afro-profile';
import { DefaultAvatar } from '@/components/common/default-avatar';
interface JobHeaderProps {
  title: string;
  price: number;
  dueDate: string;
  creator?: {
    name: string;
    score: number;
    avatar?: string;
  };
}

export const JobHeader: React.FC<JobHeaderProps> = ({ title, price, dueDate, creator }) => {
  return (
    <div className="bg-primary-gradient rounded-t-xl justify-between items-center flex p-4 gap-4">
      <div className="max-w-2xl flex flex-col gap-6 w-full">
        <h2 className="text-3xl font-medium text-white">{title}</h2>
        <div className="flex gap-4 items-center mt-auto">
          <span className="bg-[#C9F0FF] text-[#0065D0] gap-2 flex items-center px-3 rounded-full py-1">
            <Tag size={20} />
            <span>$ {price}</span>
          </span>

          <span className="bg-[#ECFCE5] text-[#198155] gap-2 flex items-center px-3 rounded-full py-1">
            <Calendar size={20} />
            <span>Due {format(new Date(dueDate), 'MMM dd, yyyy')}</span>
          </span>
        </div>
      </div>
      {creator && (
        <div className="flex flex-col text-center gap-0 items-center">
          <AfroProfile score={creator.score} size="md">
            <div className="h-full w-full rounded-full">
              {creator.avatar ? (
                <Image src={creator.avatar} fill alt="profile" className="rounded-full" />
              ) : (
                <DefaultAvatar />
              )}
            </div>
          </AfroProfile>
          <span className="text-white text-xl font-bold">{creator.name}</span>
        </div>
      )}
    </div>
  );
};

interface JobDescriptionProps {
  description: string;
}

export const JobDescription: React.FC<JobDescriptionProps> = ({ description }) => {
  return (
    <div className="bg-[#C9F0FF] flex gap-2 flex-col p-4 rounded-2xl w-full">
      <h3 className="text-title text-lg font-bold">Job Description</h3>
      <p className="text-lg font-normal text-[#202325]">{description}</p>
    </div>
  );
};

interface JobSkillsProps {
  skills: string[];
}

export const JobSkills: React.FC<JobSkillsProps> = ({ skills }) => {
  return (
    <div className="bg-white rounded-2xl flex flex-col gap-2 w-full p-4">
      <h3 className="text-title text-lg font-bold">Preferred Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span key={index} className="bg-[#F7F9FA] grow whitespace-nowrap text-[#090A0A] rounded-full px-4 py-2">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

interface DeliverablesProps {
  deliverables: string[];
}

export const JobDeliverables: React.FC<DeliverablesProps> = ({ deliverables }) => {
  return (
    <div className="bg-white rounded-2xl flex flex-col gap-2 w-full p-4 h-full">
      <h3 className="text-title text-lg font-bold">Deliverables</h3>

      <div className="flex flex-col gap-4 overflow-y-auto h-full">
        {deliverables.map((deliverable, index) => (
          <div key={index} className="rounded-md bg-[#F7F9FA] p-4 text-[#090A0A]">
            {deliverable}
          </div>
        ))}
      </div>
    </div>
  );
};
