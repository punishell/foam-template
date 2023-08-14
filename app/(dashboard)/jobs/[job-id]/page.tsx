'use client';
import React from 'react';
import { Button } from 'pakt-ui';
import { Tag, Calendar } from 'lucide-react';
import { Modal } from '@/components/common/modal';
import { UserAvatar } from '@/components/common/user-avatar';
import { SideModal } from '@/components/common/side-modal';

interface Props {
  params: {
    'job-id': string;
  };
}

export default function JobDetails({ params }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="pt-[70px] h-full">
      <div className="bg-white absolute left-0 right-0 top-0 h-[50px] flex items-center px-6 border py-2">
        <span>Jobs</span>
      </div>

      <div className="flex gap-6 h-full">
        <div className="grow overflow-y-auto h-full flex flex-col pb-20">
          <JobHeader
            title="Email Newsletter Design for a Monthly Newsletter"
            price={6000}
            dueDate="2023"
            creator={{
              score: 85,
              avatar: '',
              name: 'John Doe',
            }}
          />
          <div className="bg-white flex flex-col w-full p-6 rounded-b-xl grow border-line border-t-0 border">
            <Deliverables
              deliverables={[
                'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
                'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
                'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
                'All the source files used to create the final design in a compatible format to provide the flexibility to modify the design elements in the future.',
              ]}
            />

            <div className="mt-auto w-full flex items-center justify-end gap-4">
              <div className="max-w-[200px] w-full">
                <Button fullWidth>Apply</Button>
              </div>
              <SideModal isOpen={false} onOpenChange={setIsSidebarOpen}>
                <div className=" h-full">Hello</div>
              </SideModal>
            </div>
          </div>
        </div>

        <div className="basis-[300px] h-full gap-7 w-fit flex flex-col items-center">
          <JobDescription />
          <JobSkills skills={['Adobe Photoshop', 'Adobe Illustrator', 'Figma']} />
        </div>
      </div>
    </div>
  );
}

interface JobHeaderProps {
  title: string;
  price: number;
  dueDate: string;
  creator: {
    name: string;
    score: number;
    avatar: string;
  };
}

const JobHeader: React.FC<JobHeaderProps> = ({ title, price, dueDate, creator }) => {
  return (
    <div className="bg-primary-gradient rounded-t-xl justify-between flex p-4 gap-4">
      <div className="grow max-w-3xl flex flex-col">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <div className="flex gap-4 items-center mt-auto">
          <span className="bg-[#C9F0FF] text-[#0065D0] gap-2 flex items-center px-3 rounded-md py-1">
            <Tag size={20} />
            <span>$ {price}</span>
          </span>

          <span className="bg-[#ECFCE5] text-[#198155] gap-2 flex items-center px-3 rounded-md py-1">
            <Calendar size={20} />
            <span>Due {dueDate}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col text-center gap-2  items-center">
        <UserAvatar score={creator.score} />
        <span className="text-white text-xl font-bold">{creator.name}</span>
      </div>
    </div>
  );
};

const JobDescription = () => {
  return (
    <div className="bg-[#C9F0FF] flex gap-2 flex-col p-4 rounded-2xl w-full">
      <h3 className="text-title text-lg font-bold">Job Description</h3>
      <p className="text-lg font-normal text-[#202325]">
        Are you a naturally goofy person who loves making people laugh? Do you have a wild imagination and a passion for
        creating hilarious product designs? If so, we have the perfect short-term contract position for you as our Chief
        Goofiness Officer!
      </p>
    </div>
  );
};

interface JobSkillsProps {
  skills: string[];
}

const JobSkills: React.FC<JobSkillsProps> = ({ skills }) => {
  return (
    <div className="bg-white rounded-2xl flex flex-col gap-2 w-full p-4">
      <h3 className="text-title text-lg font-bold">Preferred Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span key={index} className="bg-[#F7F9FA] grow whitespace-nowrap text-[#090A0A] rounded-md px-4 py-2">
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

const Deliverables: React.FC<DeliverablesProps> = ({ deliverables }) => {
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
