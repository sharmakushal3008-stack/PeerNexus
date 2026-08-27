import React from 'react';
import InteractiveMouseCanvas from './InteractiveMouseCanvas';

export default function Canvas3DPreview() {
  return (
    <div className="w-full h-full relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/80">
      <InteractiveMouseCanvas />
    </div>
  );
}
