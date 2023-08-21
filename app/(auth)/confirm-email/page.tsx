'use client';
import * as z from 'zod';
import React from 'react';
import { Button, Input } from 'pakt-ui';
import { Container } from '@/components/common/container';
import Link from 'next/link';
import Image from 'next/image';

export default function ConfirmEmail() {
  return (
    <div>
      <Container className="flex items-center justify-between mt-16">
        <div className="max-w-[200px]">
          <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
        </div>
      </Container>

      <Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center text-white">
          <h3 className="font-sans text-3xl font-bold">Verify Email</h3>
          <p className="font-sans text-base">An OTP has been sent to your email address.</p>
        </div>
        <form className="flex relative z-[100] w-full mx-auto max-w-[600px] flex-col bg-[rgba(0,124,91,0.20)] backdrop-blur-md items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0, 124, 91, 0.20)] px-[40px] py-10 backdrop-blur-lg">
          <Button fullWidth>Verify Email</Button>
        </form>
      </Container>
    </div>
  );
}
