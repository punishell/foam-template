import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <h1 className="text-red-500">Afrofund</h1>
      <Link href="home">Home</Link>
    </main>
  );
}
