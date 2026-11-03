import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function CollaborateSection({ isModal = false, onClose = () => {} }) {
  const [message, setMessage] = useState('');
  const [copiedNotification, setCopiedNotification] = useState('');

  const showNotification = (msg) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(''), 3500);
  };

  const saveToLocal = (channel, text) => {
    try {
      const existing = JSON.parse(localStorage.getItem('dear_ekra_direct_messages') || '[]');
      const entry = {
        id: Date.now(),
        channel,
        message: text,
        sentAt: new Date().toISOString()
      };
      localStorage.setItem('dear_ekra_direct_messages', JSON.stringify([entry, ...existing]));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  // 1. Direct WhatsApp Dispatch
  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    const textToSend = message.trim() || 'Hi Ekra, I visited your portfolio and wanted to reach out!';
    saveToLocal('whatsapp', textToSend);
    showNotification('Opening WhatsApp...');
    const url = `https://wa.me/8801911133259?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 2. Direct Messenger Dispatch
  const handleSendMessenger = (e) => {
    e.preventDefault();
    const textToSend = message.trim();
    saveToLocal('messenger', textToSend || '(opened chat)');
    if (textToSend && navigator.clipboard) {
      navigator.clipboard.writeText(textToSend).catch(() => {});
      showNotification('Message copied! Opening Messenger...');
    } else {
      showNotification('Opening Messenger...');
    }
    const url = 'https://m.me/3kraneha';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 3. Direct Gmail Dispatch
  const handleSendGmail = (e) => {
    e.preventDefault();
    const textToSend = message.trim() || 'Hi Ekra, I would like to connect with you!';
    saveToLocal('gmail', textToSend);
    showNotification('Opening Gmail...');
    // Direct Gmail web compose URL with mailto fallback
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=rukaiyabintahossain@gmail.com&su=${encodeURIComponent('Message for Ekra')}&body=${encodeURIComponent(textToSend)}`;
    const newWindow = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = `mailto:rukaiyabintahossain@gmail.com?subject=${encodeURIComponent('Message for Ekra')}&body=${encodeURIComponent(textToSend)}`;
    }
  };

  return (
    <section 
      id="contact" 
      className={`relative bg-gradient-to-b from-[#FFFDFE] via-surface-blush to-white text-zinc-900 ${
        isModal ? 'p-6' : 'cv-auto py-16 sm:py-24 border-b border-pink-100/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {isModal && (
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-pink-100">
            <h3 className="font-serif italic text-2xl font-bold text-zinc-900">
              Direct Message <span className="not-italic font-sans font-light text-[0.85em] text-zinc-500">&amp;</span> Feedback
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-pink-100/60 text-zinc-500 hover:text-zinc-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Simple Headline & Intro */}
          <div className="lg:col-span-5 space-y-3 text-left">
            <h2 className="font-serif italic text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
              Let’s Connect.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Have a campaign idea, cafe opening, or feedback? Just type your message on the right and send it directly — no phone number, email, or sign-up required.
            </p>
          </div>

          {/* Right Column: Direct Text Box & 1-Click Send Channels */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-pink-100 shadow-soft-pink p-6 sm:p-8 relative overflow-hidden text-left">
            {/* Ambient luxury radial glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif italic text-2xl sm:text-3xl font-bold text-zinc-900">
                  Send Direct Message or Feedback
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Type your message or campaign idea below. Click your preferred app to send it directly to Ekra with one tap.
                </p>
              </div>

              {/* Toast / Notification Banner */}
              {copiedNotification && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{copiedNotification}</span>
                </div>
              )}

              {/* Single Direct Text Area */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Your Message, Brief, or Feedback
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your feedback, question, cafe opening details, or collaboration idea here..."
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-50/80 hover:bg-white focus:bg-white border border-pink-100/90 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Direct Send Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Send directly to:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* 1. Direct WhatsApp Button */}
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-98 cursor-pointer group"
                    title="Send directly to WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-white shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.835 11.835 0 005.712 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  {/* 2. Direct Messenger Button */}
                  <button
                    type="button"
                    onClick={handleSendMessenger}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0084FF] to-[#A033FF] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-98 cursor-pointer group"
                    title="Send directly to Messenger"
                  >
                    <svg className="w-4 h-4 fill-white shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652v4.237l4.086-2.242c1.093.303 2.254.464 3.445.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.196 14.931l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"/>
                    </svg>
                    <span>Messenger</span>
                  </button>

                  {/* 3. Direct Gmail Button */}
                  <button
                    type="button"
                    onClick={handleSendGmail}
                    className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-rose-50 border border-zinc-200 hover:border-[#EA4335]/50 text-zinc-800 hover:text-[#EA4335] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-sm active:scale-98 cursor-pointer group"
                    title="Send directly via Gmail"
                  >
                    <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 49.4 512 399.42">
                      <path fill="#4285f4" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" />
                      <path fill="#34a853" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" />
                      <path fill="#fbbc04" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" />
                      <path fill="#ea4335" d="M116.364 99.727L256 204.455 395.636 99.727V251L256 355.727z" />
                      <path fill="#c5221f" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" />
                    </svg>
                    <span>Gmail</span>
                  </button>

                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
