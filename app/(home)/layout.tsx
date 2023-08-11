interface Props {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: Props) {
  return <main className="flex min-h-screen flex-col">{children}</main>;
}
