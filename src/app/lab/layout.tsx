import React from 'react';
import { LabShell } from '@/components/lab/LabShell';
import { LabProvider } from '@/lib/lab/context';

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LabProvider>
      <LabShell>{children}</LabShell>
    </LabProvider>
  );
}
