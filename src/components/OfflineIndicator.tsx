import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div 
      id="offline-indicator-banner"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900/90 text-amber-300 px-4 py-2 text-xs font-semibold shadow-xl border border-amber-400/40 backdrop-blur-md animate-fade-in"
    >
      <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
      <span>ដំណើរការក្រៅបណ្តាញ (Offline Mode)</span>
    </div>
  );
}
