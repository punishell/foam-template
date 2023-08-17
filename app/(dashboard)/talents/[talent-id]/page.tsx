import { UserAvatar } from '@/components/common/user-avatar';

export default function TalentDetails() {
  return (
    <div className="flex flex-col gap-6">
      <Header />
      <SkillsAndBio />
      <Reviews />
    </div>
  );
}

const Header = () => {
  return <div className=""></div>;
};

const BIO = `I'm a full-stack developer with 5 years of experience.
I have worked with multiple technologies and frameworks like React, Vue, Angular, Node, Express, Laravel, Django, etc.`;

const SKILLS = [
  {
    name: 'React',
    backgroundColor: '#61DBFB',
  },
  {
    name: 'Vue',
    backgroundColor: '#41B883',
  },
  {
    name: 'Angular',
    backgroundColor: '#DD0031',
  },
  {
    name: 'Node',
    backgroundColor: '#339933',
  },
];

const SkillsAndBio = () => {
  return (
    <div>
      <UserAvatar score={100} size="lg" />
    </div>
  );
};

const REVIEWS = [];

const Reviews = () => {
  return <div></div>;
};
