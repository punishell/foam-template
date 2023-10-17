import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, Tag } from 'lucide-react';
import { AfroScore, AfroProfile } from '@/components/common/afro-profile';
import { DefaultAvatar } from '@/components/common/default-avatar';
interface JobHeaderProps {
  title: string;
  price: number;
  dueDate: string;
  creator?: {
    _id: string;
    name: string;
    score: number;
    avatar?: string;
  };
}

export const JobHeader: React.FC<JobHeaderProps> = ({ title, price, dueDate, creator }) => {
  return (
    <div className="bg-primary-gradient rounded-t-xl justify-between items-center flex p-4 gap-4">
      <div className="max-w-2xl flex flex-col gap-6 w-full h-full">
        <div className="grow pt-3">
          <h2 className="text-3xl font-medium text-white">{title}</h2>
        </div>
        <div className="flex gap-4 items-center mt-auto">
          <span className="bg-[#ECFCE5] text-[#198155] gap-2 flex items-center px-3 rounded-full py-1">
            <Tag size={20} />
            <span>$ {price}</span>
          </span>

          <span className="bg-[#C9F0FF] text-[#0065D0] gap-2 flex items-center px-3 rounded-full py-1">
            <Calendar size={20} />
            <span>Due {format(new Date(dueDate), 'MMM dd, yyyy')}</span>
          </span>
        </div>
      </div>
      {creator && creator._id && (
        <div className="flex flex-col text-center gap-0 items-center">
          <AfroProfile src={creator.avatar} size="2md" score={creator.score} url={`/talents/${creator._id}`} />
          <span className="text-white text-xl whitespace-nowrap font-bold">{creator.name}</span>
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
    <div className="flex gap-2 flex-col w-full">
      <h3 className="text-title text-lg font-bold">Job Description</h3>
      <p className="text-lg font-normal text-[#202325] bg-[#C9F0FF] p-4 rounded-2xl border border-blue-200">
        {description}
      </p>
    </div>
  );
};

interface JobSkillsProps {
  skills: { name: string; color: string }[];
}

export const JobSkills: React.FC<JobSkillsProps> = ({ skills }) => {
  return (
    <div className="bg-white rounded-2xl flex flex-col gap-2 w-full pb-4">
      <h3 className="text-title text-lg font-bold">Preferred Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-[#F7F9FA] w-fit whitespace-nowrap text-[#090A0A] rounded-full px-4 py-2"
            style={{ background: skill.color }}
          >
            {skill.name}
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
    <div className="bg-white rounded-2xl flex flex-col gap-2 w-full py-4 h-full">
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
