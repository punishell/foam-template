'use client';
import React from 'react';
import { Button } from 'pakt-ui';
import { Tag, Calendar, PenLine } from 'lucide-react';

const DELIVERABLES = [
  'Develop the new company landing page',
  'Optimize performance for mobile devices',
  'Create a new blog with headless CMS integration',
];

const SKILLS = ['React', 'Next.js', 'Tailwind CSS', 'Figma'];

export const Review: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-primary-gradient rounded-t-xl justify-between flex p-4 gap-4">
        <div className="grow max-w-3xl flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-white">Frontend Developer</h2>
          <div className="flex gap-4 items-center mt-auto justify-between w-full">
            <div className="flex gap-4 items-center">
              <span className="bg-[#C9F0FF] text-[#0065D0] gap-2 flex items-center px-4 rounded-full py-1">
                <Tag size={20} />
                <span>$ 500</span>
              </span>

              <span className="bg-[#ECFCE5] text-[#198155] gap-2 flex items-center px-4 rounded-full py-1">
                <Calendar size={20} />
                <span>Due December 5</span>
              </span>
            </div>
          </div>
        </div>
        <div className="self-end">
          <button className="flex gap-2 items-center text-white">
            <PenLine size={20} />
            <span>Edit</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col border border-line border-t-0 p-6 rounded-b-xl gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <h4 className="font-medium">Preferred Skills</h4>

            <EditButton />
          </div>

          <div className="flex gap-1 items-center">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="bg-[#ECFCE5] text-[#198155] gap-2 flex items-center px-4 text-sm rounded-full py-1"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-col w-full">
          <div className="flex items-center gap-4">
            <h4 className="font-medium">Job Description</h4>
            <EditButton />
          </div>
          <p className="text-base font-normal text-[#202325] rounded-lg py-2 px-3 bg-[#FEF4E3]">
            Are you a naturally goofy person who loves making people laugh? Do you have a wild imagination and a passion
            for creating hilarious product designs? If so, we have the perfect short-term contract position for you as
            our Chief Goofiness Officer!
          </p>
        </div>

        <div className="flex gap-2 flex-col w-full">
          <div className="flex items-center gap-4">
            <h4 className="font-medium">Deliverables</h4>
            <EditButton />
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto h-full">
            {DELIVERABLES.map((deliverable, index) => (
              <div key={index} className="rounded-md bg-[#F7F9FA] p-4 py-2 text-[#090A0A]">
                {deliverable}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <div className="max-w-[200px] w-full">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            // onClick={() => {
            //   setActiveStep('visibility');
            //   setStepsStatus({ visibility: 'active' });
            //   setStepsStatus({ project: 'complete' });
            // }}
          >
            Post Job
          </Button>
        </div>
      </div>
    </div>
  );
};

const EditButton = () => {
  return (
    <button className="flex gap-2 items-center text-title text-sm">
      <PenLine size={20} />
      <span>Edit</span>
    </button>
  );
};
