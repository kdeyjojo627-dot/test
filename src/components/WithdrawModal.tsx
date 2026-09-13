import { useState, FormEvent } from 'react';
import { X, CheckCircle2, AlertCircle, ArrowRight, Wallet } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const [step, setStep] = useState<'input' | 'success'>('input');
  const [username, setUsername] = useState('');
  const [bankName, setBankName] = useState('ABA Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 800);
  };

  const handleReset = () => {
    setStep('input');
    setUsername('');
    setAccountNumber('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="withdraw-modal-container"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-[#fbd786] p-6 text-slate-800 overflow-hidden"
      >
        <button
          id="close-modal-btn"
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="បិទ"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'input' ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#11998e] to-[#38ef7d] flex items-center justify-center text-white shadow-md">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Kantumruy_Pro']">
                  ដកប្រាក់សមតុល្យ KMR77
                </h3>
                <p className="text-xs text-amber-700 font-medium">
                  សូមដកប្រាក់មុនថ្ងៃទី ១៣ កញ្ញា ២០២៦
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ឈ្មោះគណនី KMR77 ឬ លេខទូរស័ព្ទ
                </label>
                <input
                  id="withdraw-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ឧទាហរណ៍: user123 ឬ 012 345 678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ជ្រើសរើសធនាគារ
                  </label>
                  <select
                    id="withdraw-bank-select"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option value="ABA Bank">ABA Bank</option>
                    <option value="ACLEDA Bank">ACLEDA Bank</option>
                    <option value="Wing Bank">Wing Bank</option>
                    <option value="Canadia Bank">Canadia Bank</option>
                    <option value="TrueMoney">TrueMoney</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ចំនួនទឹកប្រាក់ ($)
                  </label>
                  <input
                    id="withdraw-amount-input"
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="ឧ. 100"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  លេខគណនីធនាគារ / ឈ្មោះម្ចាស់គណនី
                </label>
                <input
                  id="withdraw-account-number"
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="ឧ. 000 123 456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  ក្រុមការងារនឹងផ្ទេរប្រាក់សមតុល្យដែលនៅសល់ក្នុងគណនីរបស់អ្នកក្នុងរយៈពេល ៥-១៥ នាទី។
                </span>
              </div>

              <button
                id="submit-withdraw-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-white font-bold text-sm shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    កំពុងដំណើរការ...
                  </span>
                ) : (
                  <>
                    <span>បញ្ជាក់ការដកប្រាក់</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              សំណើដកប្រាក់ត្រូវបានទទួលជោគជ័យ!
            </h3>
            <p className="text-sm text-slate-600 mb-4 px-2">
              ទឹកប្រាក់ចំនួន <strong>${amount || '0.00'}</strong> នឹងត្រូវបានផ្ទេរទៅគណនី {bankName} ({accountNumber}) ក្នុងពេលឆាប់ៗនេះ។
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 mb-5">
              សម្រាប់ជំនួយបន្ថែម ឬការផ្ទេរទៅ <strong>PPH855 & AFU855</strong> សូមទាក់ទងផ្នែកបម្រើអតិថិជន។
            </div>
            <button
              id="finish-withdraw-btn"
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              យល់ព្រម
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
