export type LayoutMode = 'mobilePortrait' | 'mobileLandscape' | 'tablet' | 'desktop';

function classify(width:number, height:number): LayoutMode {
  const portrait = height >= width;
  if (width < 600) {
    return portrait ? 'mobilePortrait' : 'mobileLandscape';
  }
  if (width < 900) return 'tablet';
  return 'desktop';
}

export function getLayoutMode(): LayoutMode {
  return classify(window.innerWidth, window.innerHeight);
}

export interface ViewportSubscription { unsubscribe(): void; }

export function observeViewport(callback:(layout:LayoutMode)=>void, options?:{ debounce?: number }): ViewportSubscription {
  let last:LayoutMode = getLayoutMode();
  let frame = 0; let timeout:number|undefined;
  const debounce = options?.debounce ?? 120;
  const emit = () => {
    frame = 0;
    const next = getLayoutMode();
    if (next !== last) {
      last = next;
      // Ensure attribute is updated BEFORE callback so UI can read new layout
      document.documentElement.setAttribute('data-layout', next);
      callback(next);
    }
  };
  const onResize = () => {
    if (debounce <= 0) {
      if (!frame) frame = requestAnimationFrame(emit);
      return;
    }
    if (timeout) window.clearTimeout(timeout);
    timeout = window.setTimeout(emit, debounce);
  };
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });
  // initial mark
  document.documentElement.setAttribute('data-layout', last);
  callback(last);
  return { unsubscribe(){ window.removeEventListener('resize', onResize); window.removeEventListener('orientationchange', onResize); if (frame) cancelAnimationFrame(frame); if (timeout) window.clearTimeout(timeout);} };
}
