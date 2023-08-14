import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Link href="/overview" className="text-blue-500 underline">
        Overview
      </Link>
    </main>
  );
}
