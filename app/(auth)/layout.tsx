interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="h-screen w-full">
      <div className="bg-auth-gradient fixed inset-0" />
      <div className="bg-[url(/images/cardboard.png)] fixed opacity-40 inset-0" />
      <div className="relative h-screen p-5 flex flex-col w-full">{children}</div>
    </div>
  );
}
