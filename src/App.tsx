import { useState, useEffect, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Share2, 
  Clock, 
  ExternalLink,
  Wallet,
  Sparkles,
  AlertTriangle,
  Smartphone,
  Download
} from 'lucide-react';
import { playNotificationChime } from './utils/audio';
import { WithdrawModal } from './components/WithdrawModal';
import { ApkInstallModal } from './components/ApkInstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const [isMuted, setIsMuted] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedBrand, setCopiedBrand] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Target deadline: September 13, 2026 00:00:00 local time
  const [timeLeft, setTimeLeft] = useState({
    hours: 16,
    minutes: 22,
    seconds: 5,
  });

  useEffect(() => {
    // Play subtle welcoming chime once on user click/interaction or load
    const targetDate = new Date('2026-09-13T00:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const totalSeconds = Math.floor(difference / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChimeToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      playNotificationChime();
    } else {
      setIsMuted(true);
    }
  };

  const handleCopyNotice = async () => {
    const text = `⚠️ ការជូនដំណឹងសំខាន់\n- KMR77 នឹងបិទជាអចិន្ត្រៃយ៍មុនថ្ងៃទី ១៣ កញ្ញា ២០២៦។\n- សូមចូលគណនី ហើយដកប្រាក់សមតុល្យរបស់អ្នកចេញឥឡូវនេះ!\n- បន្តរីករាយ និងឈ្នះរង្វាន់បន្ថែមទៀតជាមួយយើងនៅ PPH855 & AFU855!`;
    try {
      await navigator.clipboard.writeText(text);
      if (!isMuted) playNotificationChime();
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    } catch {
      // fallback
    }
  };

  const handleCopyBrand = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText("PPH855 & AFU855");
      if (!isMuted) playNotificationChime();
      setCopiedBrand(true);
      setTimeout(() => setCopiedBrand(false), 2200);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VIP Notification - KMR77',
          text: 'KMR77 នឹងបិទជាអចិន្ត្រៃយ៍មុនថ្ងៃទី ១៣ កញ្ញា ២០២៦។ សូមដកប្រាក់សមតុល្យចេញឥឡូវនេះ!',
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyNotice();
    }
  };

  return (
    <main 
      id="main-app" 
      className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 animate-gradient-bg selection:bg-amber-200 selection:text-amber-900"
    >
      {/* Top Utility Controls */}
      <nav 
        id="top-controls-nav"
        className="mb-4 flex flex-wrap items-center justify-center gap-2 bg-white/75 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-white/60 text-slate-700 text-xs font-medium"
      >
        <button
          id="open-apk-modal-btn"
          onClick={() => setIsApkModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-full font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all text-xs cursor-pointer"
          title="ដំឡើងជាកម្មវិធី Android .APK"
          aria-label="Install as APK"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>ដំឡើង App (.APK)</span>
        </button>

        <span className="w-px h-3.5 bg-slate-300 hidden sm:inline-block"></span>

        <button
          id="sound-toggle-btn"
          onClick={handleChimeToggle}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-slate-100/80 active:scale-95 transition-all text-slate-700 cursor-pointer"
          title={isMuted ? "បើកសំឡេង" : "បិទសំឡេង"}
          aria-label="Toggle Sound"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>សំឡេង: បិទ</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>សំឡេង: បើក</span>
            </>
          )}
        </button>

        <span className="w-px h-3.5 bg-slate-300"></span>

        <button
          id="copy-notice-btn"
          onClick={handleCopyNotice}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-slate-100/80 active:scale-95 transition-all text-slate-700 cursor-pointer"
          title="ចម្លងអត្ថបទជូនដំណឹង"
          aria-label="Copy Notice"
        >
          {copiedText ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">បានចម្លង!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>ចម្លងសារ</span>
            </>
          )}
        </button>

        <span className="w-px h-3.5 bg-slate-300"></span>

        <button
          id="share-notice-btn"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-slate-100/80 active:scale-95 transition-all text-slate-700 cursor-pointer"
          title="ចែករំលែក"
          aria-label="Share Notice"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>ចែករំលែក</span>
        </button>
      </nav>

      {/* Main VIP Container */}
      <motion.div 
        id="vip-notification-card"
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-[460px] bg-white/85 backdrop-blur-[15px] rounded-[24px] p-6 sm:p-8 text-center relative overflow-hidden border-2 border-[#fbd786] shadow-[0_20px_45px_rgba(0,0,0,0.14)]"
      >
        {/* Subtle Decorative Golden Glow in Corner */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-red-300/25 rounded-full blur-2xl pointer-events-none" />

        {/* ចំណងជើង Header */}
        <header className="mb-6 flex items-center justify-center gap-2.5">
          <span className="text-2xl filter drop-shadow-sm select-none" aria-hidden="true">
            ⚠️
          </span>
          <h1 
            id="vip-header-title"
            className="text-[#d32f2f] text-xl sm:text-2xl font-bold tracking-normal drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] flex items-center gap-2"
          >
            ការជូនដំណឹងសំខាន់
          </h1>
        </header>

        {/* ប្រអប់ទី១ ព័ត៌មានបិទ (Box Warning) */}
        <div 
          id="box-warning"
          className="rounded-[16px] p-5 mb-4 text-white text-center shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)] transition-all duration-300 relative z-1 bg-gradient-to-br from-[#ff416c] to-[#ff4b2b]"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-100 font-semibold mb-1 tracking-wider uppercase">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>សេចក្តីប្រកាសបិទសេវាកម្ម</span>
          </div>
          <p className="text-[1.05rem] leading-[1.65] font-semibold">
            KMR77 នឹងបិទជាអចិន្ត្រៃយ៍មុនថ្ងៃទី ១៣ កញ្ញា ២០២៦។
          </p>

          {/* Countdown timer pill */}
          <div className="mt-3.5 pt-2.5 border-t border-white/20 flex items-center justify-center gap-1.5 text-xs font-medium text-rose-50">
            <Clock className="w-3.5 h-3.5 text-amber-200" />
            <span>ពេលវេលានៅសល់: </span>
            <span className="font-bold tracking-wide bg-black/20 px-2 py-0.5 rounded-full">
              {String(timeLeft.hours).padStart(2, '0')} ម៉ោង : {String(timeLeft.minutes).padStart(2, '0')} នាទី : {String(timeLeft.seconds).padStart(2, '0')} វិនាទី
            </span>
          </div>
        </div>

        {/* ប្រអប់ទី២ ព័ត៌មានដកប្រាក់ (Box Action with Pulse) */}
        <div 
          id="box-action"
          className="animate-pulse-custom rounded-[16px] p-5 mb-4 text-white text-center shadow-[0_8px_22px_rgba(17,153,142,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition-all duration-300 relative z-1 bg-gradient-to-br from-[#11998e] to-[#38ef7d]"
        >
          <span className="text-4xl mb-2.5 block filter drop-shadow-sm select-none" role="img" aria-label="Bank and Cash">
            🏦💵
          </span>
          <p className="text-[1.05rem] leading-[1.65] font-semibold">
            សូមចូលគណនី ហើយដកប្រាក់សមតុល្យរបស់អ្នកចេញឥឡូវនេះ!
          </p>
          
          <button
            id="withdraw-action-button"
            onClick={() => {
              if (!isMuted) playNotificationChime();
              setIsModalOpen(true);
            }}
            className="mt-3.5 inline-flex items-center justify-center gap-2 bg-white text-emerald-800 font-bold px-5 py-2.5 rounded-full text-sm shadow-md hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer group"
          >
            <Wallet className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>ដកប្រាក់សមតុល្យឥឡូវនេះ</span>
          </button>
        </div>

        {/* ប្រអប់ទី៣ ព័ត៌មាន VIP ថ្មី (Box VIP) */}
        <div 
          id="box-vip"
          className="rounded-[16px] p-5 text-white text-center shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)] transition-all duration-300 relative z-1 bg-gradient-to-br from-[#f5af19] to-[#f12711] border-2 border-[#ffeaa7]"
        >
          <span className="text-[2em] mb-2.5 block filter drop-shadow select-none" role="img" aria-label="Sparkles and Gift">
            ✨🎁✨
          </span>
          <p className="text-[1.05rem] leading-[1.65] font-semibold">
            បន្តរីករាយ និងឈ្នះរង្វាន់បន្ថែមទៀតជាមួយយើងនៅ
          </p>

          <div className="mt-2.5 flex items-center justify-center gap-2">
            <span 
              id="brand-highlight"
              className="text-white text-[1.25rem] font-bold uppercase tracking-[1px] drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] bg-black/15 px-4 py-1.5 rounded-full inline-block border border-white/20"
            >
              PPH855 &amp; AFU855!
            </span>
            <button
              id="copy-brand-btn"
              onClick={handleCopyBrand}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white active:scale-90 transition-all cursor-pointer"
              title="ចម្លងឈ្មោះម៉ាក"
              aria-label="Copy brand name"
            >
              {copiedBrand ? (
                <Check className="w-4 h-4 text-emerald-200" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-amber-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>ទទួលការស្វាគមន៍ពិសេស និងប្រូម៉ូសិនថ្មីៗ</span>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="mt-5 text-[0.8rem] text-slate-500 font-medium flex items-center justify-center gap-1.5">
          <span>ជំនួយអតិថិជន ២៤/៧</span>
          <span>•</span>
          <span>សេវាសុវត្ថិភាព VIP</span>
        </footer>
      </motion.div>

      {/* APK / Mobile Install Quick Banner */}
      {!isInstalled && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 w-full max-w-[460px]"
        >
          <button
            id="open-apk-banner-btn"
            onClick={() => setIsApkModalOpen(true)}
            className="w-full py-3 px-4 bg-white/85 hover:bg-white backdrop-blur-md rounded-2xl border-2 border-amber-300/80 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-between gap-3 text-xs text-slate-800 cursor-pointer group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>ដំឡើង VIP Notification លើទូរស័ព្ទ</span>
                  <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                    .APK
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  គាំទ្រ Android WebAPK &amp; Standalone APK កញ្ចប់ដំឡើង
                </div>
              </div>
            </div>
            <span className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0 group-hover:bg-slate-800 transition-colors shadow-sm">
              ដំឡើង App
            </span>
          </button>
        </motion.div>
      )}

      {/* Interactive Withdrawal Dialog */}
      <WithdrawModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* APK & PWA Install Modal */}
      <ApkInstallModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </main>
  );
}
