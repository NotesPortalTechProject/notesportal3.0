"use client";
import { useEffect, useState } from "react";

export default function FileIframe({ filelink, filename }) {
  const [iframeSrc, setIframeSrc] = useState(filelink);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|ipad|iphone|ipod/i.test(ua);

    if (isMobile) {
      setIframeSrc(`/api/file-proxy?url=${encodeURIComponent(filelink)}&name=${encodeURIComponent(filename)}`);
    } else {
      setIframeSrc(filelink);
    }
  }, [filelink, filename]);

  return (
    <iframe
      src={iframeSrc}
      className="w-full h-48 rounded-lg border border-white/10"
    />
  );
}