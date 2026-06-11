import React from 'react';
import ZaloIcon from '~/assets/Image/Logo-Zalo-Arc.webp';
import { useWebInfo } from '~/Hooks/useWebInfo';
export default function ZaloButton() {
  const {webInfo} = useWebInfo()
  return (
    <a
      href={`https://zalo.me/${webInfo.zalo}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Zalo"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white/50 shadow-lg transition hover:-translate-y-1"
    >
      <img
        src={ZaloIcon}
        alt="Zalo"
        className="h-9 w-9 object-contain"
      />
    </a>
  );
}