import { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApkInstallModal({ isOpen, onClose }: ApkInstallModalProps) {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'direct' | 'apk_generator'>('direct');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPWALink, setCopiedPWALink] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-izjmdty3lk5ok33mjbx6io-665340718514.asia-southeast1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?url=${encodeURIComponent(currentUrl)}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDirectInstall = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div 
        id="apk-modal-dialog"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-[#fbd786] p-5 sm:p-6 text-slate-800 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="close-apk-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="បិទ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Kantumruy_Pro']">
                ដំឡើងជាកម្មវិធីទូរស័ព្ទ (.APK)
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Android Ready
              </span>
            </div>
            <p className="text-xs text-slate-500">
              ទាញយក ឬដំឡើងកម្មវិធី VIP Notification លើទូរស័ព្ទរបស់អ្នក
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-semibold">
          <button
            id="tab-direct-install"
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'direct'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>ដំឡើងផ្ទាល់លើទូរស័ព្ទ (WebAPK)</span>
          </button>
          <button
            id="tab-apk-generator"
            onClick={() => setActiveTab('apk_generator')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'apk_generator'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>ទាញយកឯកសារ .APK</span>
          </button>
        </div>

        {/* Tab 1: Direct Mobile Install (WebAPK) */}
        {activeTab === 'direct' && (
          <div className="space-y-4">
            {isInstalled ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-emerald-900 text-sm mb-1">
                  កម្មវិធីត្រូវបានដំឡើងរួចរាល់ហើយ!
                </h4>
                <p className="text-xs text-emerald-700">
                  អ្នកកំពុងដំណើរការកម្មវិធីជា Native App / Standalone រួចជាស្រេចនៅលើឧបករណ៍របស់អ្នក។
                </p>
              </div>
            ) : isInstallable ? (
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>ឧបករណ៍របស់អ្នកគាំទ្រការដំឡើង ១-ចុច!</span>
                </div>
                <p className="text-xs text-amber-800 mb-3 leading-relaxed">
                  ចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើត និងដំឡើងជាកម្មវិធី Android (WebAPK) លើអេក្រង់ដើមរបស់អ្នកដោយផ្ទាល់ មិនបាច់ចូល Play Store ឡើយ។
                </p>
                <button
                  id="direct-pwa-install-btn"
                  onClick={handleDirectInstall}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>ដំឡើងកម្មវិធីលើ Android ឥឡូវនេះ</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>របៀបដំឡើងលើ Android (Chrome / Samsung Internet):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 pl-1">
                    <li>បើកគេហទំព័រនេះក្នុងកម្មវិធីរុករក <strong>Chrome</strong> លើទូរស័ព្ទ Android</li>
                    <li>ចុចលើសញ្ញាចុចបី <strong>(⋮)</strong> នៅជ្រុងខាងស្តាំខាងលើ</li>
                    <li>ជ្រើសរើស <strong>"ដំឡើងកម្មវិធី (Install app)"</strong> ឬ <strong>"បន្ថែមទៅអេក្រង់ដើម (Add to Home screen)"</strong></li>
                    <li>ទូរស័ព្ទ Android នឹងបង្កើតឯកសារ <strong>WebAPK</strong> ដោយស្វ័យប្រវត្តិក្លាយជា App លើអេក្រង់ដើមភ្លាមៗ!</li>
                  </ol>
                </div>

                {isIOS && (
                  <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs text-indigo-900 leading-relaxed">
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      <span>📱</span>
                      <span>របៀបដំឡើងលើ iPhone / iPad (iOS Safari):</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-indigo-800">
                      <li>ចុចលើប៊ូតុងចែករំលែក <strong>Share (ប្រអប់មានព្រួញឡើងលើ)</strong></li>
                      <li>អូសចុះក្រោម រួចជ្រើសយក <strong>"Add to Home Screen" (បន្ថែមទៅអេក្រង់ដើម)</strong></li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Benefit Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>សុវត្ថិភាពខ្ពស់ &amp; ទំហំស្រាល &lt;1MB</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-700">
                <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                <span>ដំណើរការក្រៅបណ្តាញ (Offline)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Standalone .APK File Generator */}
        {activeTab === 'apk_generator' && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 leading-relaxed">
              <h4 className="font-bold text-amber-900 text-sm mb-1 flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-700" />
                <span>បង្កើតជាឯកសារដំឡើង Standalone .APK</span>
              </h4>
              <p className="text-amber-800">
                ដើម្បីទទួលបានឯកសារ <strong>.apk</strong> ដាច់ដោយឡែកសម្រាប់ផ្ញើតាម Telegram, WhatsApp ឬដាក់ក្នុងគេហទំព័រផ្ទាល់ខ្លួន៖
              </p>
            </div>

            {/* Step 1: Copy App URL */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>ជំហានទី ១: ចម្លងតំណភ្ជាប់កម្មវិធី (App URL)</span>
                <button
                  id="copy-app-link-btn"
                  onClick={handleCopyUrl}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">បានចម្លង!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>ចម្លង URL</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600 break-all select-all">
                {currentUrl}
              </div>
            </div>

            {/* Step 2: Use PWABuilder (Official Microsoft / Google APK Packager) */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>ជំហានទី ២: វេចខ្ចប់ជា APK ដោយឥតគិតថ្លៃ (PWABuilder)</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                PWABuilder (គាំទ្រដោយ Google និង Microsoft) នឹងបង្កើតឯកសារ <strong>.apk</strong> និង <strong>.aab</strong> ដោយស្វ័យប្រវត្តិចេញពី Manifest និង Service Worker ដែលយើងបានកំណត់រួច៖
              </p>

              <a
                id="open-pwabuilder-btn"
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                <span>បើក PWABuilder ដើម្បីទាញយក .APK</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>
            </div>

            {/* Step 3: Capacitor / CLI (For Developers) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px]">
              <span className="font-bold text-slate-800 block mb-1">
                សម្រាប់ Developer ចង់ Build ក្នុង Android Studio:
              </span>
              <code className="block bg-slate-900 text-emerald-400 p-2 rounded-lg font-mono text-[10px] overflow-x-auto">
                npx @capacitor/cli create &amp;&amp; npx cap add android &amp;&amp; npx cap open android
              </code>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            id="dismiss-apk-modal-btn"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
}
