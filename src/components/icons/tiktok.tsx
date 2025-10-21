import type { SVGProps } from 'react';

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 4h-2a4 4 0 0 0-4 4v10" />
      <path d="M12 14a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
      <path d="M20 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
    </svg>
  );
}
