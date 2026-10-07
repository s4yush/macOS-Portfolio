interface FsDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}

interface FsDocument extends Document {
  webkitIsFullScreen?: boolean;
  mozFullScreen?: boolean;
  msFullscreenElement?: Element;
}

export const enterFullScreen = async (): Promise<void> => {
  if (!isFullScreen()) {
    const element = document.documentElement as FsDocumentElement;
    try {
      if (element.requestFullscreen) await element.requestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
      
      // Keyboard lock allows the app to handle system-style shortcuts.
      if ('keyboard' in navigator && (navigator as any).keyboard && (navigator as any).keyboard.lock) {
         await (navigator as any).keyboard.lock();
      }
    } catch (e) {
      console.warn("Fullscreen or keyboard lock failed:", e);
    }
  }
};

export const exitFullScreen = (): void => {
  if (isFullScreen()) {
    if ('keyboard' in navigator && (navigator as any).keyboard && (navigator as any).keyboard.unlock) {
       (navigator as any).keyboard.unlock();
    }
    document.exitFullscreen();
  }
};

export const isFullScreen = (): boolean => {
  const fsDoc = document as FsDocument;
  return !!(
    fsDoc.fullscreenElement ||
    fsDoc.webkitIsFullScreen ||
    fsDoc.mozFullScreen ||
    fsDoc.msFullscreenElement
  );
};
