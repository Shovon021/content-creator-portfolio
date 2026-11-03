import React, { useState } from 'react';
import { Plus, X, Trash2, Eye, ExternalLink, Check, Copy, AlertCircle, ArrowLeft } from 'lucide-react';
import { getGoogleSheetUrl, setGoogleSheetUrl } from '../services/sheetService';

const CATEGORY_OPTIONS = [
  { id: 'beauty', label: 'Beauty & Skincare PR', tag: 'Beauty & Skincare PR' },
  { id: 'food', label: 'Launch & Grand Opening Promotion, Food Experience Reviews', tag: 'Launch & Grand Opening Promotion, Food Experience Reviews' },
  { id: 'fashion', label: 'Fashion Styling & Collection Showcase, Brand Product Review', tag: 'Fashion Styling & Collection Showcase, Brand Product Review' },
  { id: 'travel', label: 'Destination & Resort Marketing, Travel Review Content', tag: 'Destination & Resort Marketing, Travel Review Content' },
  { id: 'personal', label: 'Personal Vlogs & Campus Life', tag: 'Personal Vlogs' }
];

export default function AdminPWA({ isOpen, onClose, projects, onAddProject, onDeleteProject }) {
  const [view, setView] = useState('list'); // 'list' | 'new'
  const [isPublished, setIsPublished] = useState(false);
  
  // New Post Form State
  const [category, setCategory] = useState('beauty');
  const [fbLink, setFbLink] = useState('');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [headline, setHeadline] = useState('');
  const [story, setStory] = useState('');
  const [impact, setImpact] = useState('');

  // Google Sheet Link State
  const [sheetUrl, setSheetUrlState] = useState(() => getGoogleSheetUrl());
  const [sheetSaved, setSheetSaved] = useState(false);

  const handleSaveSheetUrl = () => {
    setGoogleSheetUrl(sheetUrl);
    setSheetSaved(true);
    setTimeout(() => {
      setSheetSaved(false);
      window.location.reload();
    }, 1200);
  };

  if (!isOpen) return null;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setFbLink(text);
    } catch (err) {
      // Fallback
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!clientName || !fbLink) return;

    const selectedCat = CATEGORY_OPTIONS.find(c => c.id === category) || CATEGORY_OPTIONS[0];

    const newEntry = {
      id: `proj-${Date.now()}`,
      brand: clientName,
      location: location || "Dhaka, Bangladesh",
      category: category,
      categoryLabel: selectedCat.tag,
      title: headline || `${clientName} Collaboration`,
      headline: headline || "Authentic brand presentation with genuine audience appreciation.",
      story: story || "Featured promotional reel exploring key offerings with aesthetic visuals.",
      impact: impact || "দর্শকদের কাছ থেকে ভালো সাড়া ও ইতিবাচক প্রতিক্রিয়া তৈরি হয়েছে।",
      whatSheMade: story || "60-second featured reel and story promotion.",
      whatHappened: impact || "Positive community reaction and brand inquiries.",
      metricBadge: "Verified Reel",
      metricDetail: "Organic engagement",
      featured: false,
      videoThumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      videoUrl: fbLink,
      date: "Just now"
    };

    onAddProject(newEntry);
    setIsPublished(true);

    setTimeout(() => {
      setIsPublished(false);
      setView('list');
      // Reset form
      setClientName('');
      setFbLink('');
      setHeadline('');
      setStory('');
      setImpact('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-teal-darker/80 backdrop-blur-md flex justify-center items-end sm:items-center p-0 sm:p-4">
      
      {/* Mobile-first Admin Canvas (Deep Teal Base) */}
      <div className="w-full max-w-lg bg-teal-deep text-mist-rain rounded-t-3xl sm:rounded-3xl border border-teal-subtle shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Splash Bar / Header */}
        <div className="p-4 sm:p-6 border-b border-teal-subtle flex items-center justify-between bg-teal-darker/60">
          <div className="flex items-center space-x-3">
            {view === 'new' && (
              <button 
                onClick={() => setView('list')}
                className="p-2 rounded-full hover:bg-teal-subtle text-jade-soft"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="font-display font-bold text-lg text-mist-rain">
                {view === 'new' ? 'Add New Video' : 'Creator Admin Hub'}
              </div>
              <div className="text-xs text-jade-soft">
                Dear Ekra • No coding required
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-teal-subtle text-mist-rain transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-left">
          
          {view === 'list' ? (
            <div className="space-y-6">
              
              {/* Google Sheets Live Sync Connector */}
              <div className="p-4 rounded-2xl bg-teal-darker/70 border border-teal-subtle space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-mist-rain flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Google Sheets Live Sync</span>
                  </div>
                  <a 
                    href="/portfolio_starter_sheet.csv" 
                    download 
                    className="text-[11px] text-marigold hover:underline font-medium"
                    title="Download template to import into Google Sheets"
                  >
                    Download Starter CSV ↓
                  </a>
                </div>
                <p className="text-[11px] text-jade-soft leading-relaxed">
                  Publish your Google Sheet to the web as CSV and paste the URL below to auto-sync without code:
                </p>
                <div className="flex gap-2">
                  <input 
                    type="url"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrlState(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                    className="flex-1 px-3 py-2 rounded-xl bg-teal-deep border border-teal-subtle text-xs text-mist-rain placeholder:text-jade-soft/50 focus:outline-none focus:border-marigold"
                  />
                  <button
                    onClick={handleSaveSheetUrl}
                    className="px-3.5 py-2 rounded-xl bg-marigold text-teal-darker font-bold text-xs hover:bg-marigold-hover transition-colors shrink-0 cursor-pointer"
                  >
                    {sheetSaved ? 'Saved! ✓' : 'Connect'}
                  </button>
                </div>
              </div>

              {/* One Large Marigold Button as specified */}
              <button
                onClick={() => setView('new')}
                className="w-full bg-marigold hover:bg-marigold-hover active:scale-[0.98] text-teal-darker font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center space-x-2 text-base transition-all"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>+ New post</span>
              </button>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-jade-soft">
                    Live Posts on Website ({projects.length})
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">Auto-Synced</span>
                </div>

                <div className="space-y-3">
                  {projects.map(p => (
                    <div 
                      key={p.id}
                      className="p-4 rounded-2xl bg-teal-darker/90 border border-teal-subtle flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <img 
                          src={p.videoThumbnail} 
                          alt="" 
                          className="w-12 h-14 rounded-xl object-cover shrink-0 bg-teal-deep" 
                        />
                        <div className="overflow-hidden">
                          <div className="text-xs font-semibold text-marigold truncate">{p.categoryLabel}</div>
                          <div className="font-bold text-sm text-mist-rain truncate">{p.brand}</div>
                          <div className="text-[11px] text-jade-soft truncate">{p.title}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove "${p.brand}" from the website?`)) {
                              onDeleteProject(p.id);
                            }
                          }}
                          className="p-2 rounded-xl text-jade-soft hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete from website"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <form onSubmit={handlePublish} className="space-y-6">
              
              {/* 1. Category Chips */}
              <div>
                <label className="block text-xs font-semibold text-jade-soft mb-2">
                  1. Select Category *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all active:scale-[0.98] ${
                        category === cat.id 
                          ? 'bg-marigold text-teal-darker border-marigold shadow-md' 
                          : 'bg-teal-darker text-mist-rain border-teal-subtle hover:border-jade-soft'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Facebook Link Field with 1-Tap Paste */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-jade-soft">
                    2. Facebook Video / Reel Link *
                  </label>
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="text-[11px] text-marigold font-semibold hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Paste from Clipboard</span>
                  </button>
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://facebook.com/reel/..."
                  value={fbLink}
                  onChange={(e) => setFbLink(e.target.value)}
                  className="w-full bg-teal-darker border border-teal-subtle focus:border-marigold rounded-xl px-4 py-3 text-sm text-mist-rain placeholder:text-jade-soft/40 outline-none"
                />
              </div>

              {/* 3. Client Name & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-jade-soft mb-1.5">
                    3. Brand / Place Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nomad Cafe"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-teal-darker border border-teal-subtle focus:border-marigold rounded-xl px-3.5 py-3 text-sm text-mist-rain placeholder:text-jade-soft/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-jade-soft mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Banani, Dhaka"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-teal-darker border border-teal-subtle focus:border-marigold rounded-xl px-3.5 py-3 text-sm text-mist-rain placeholder:text-jade-soft/40 outline-none"
                  />
                </div>
              </div>

              {/* 4. One-line Italic Headline */}
              <div>
                <label className="block text-xs font-semibold text-jade-soft mb-1.5">
                  4. Card Headline (1-line editorial quote)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Graceful festive drape styling with authentic texture."
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-teal-darker border border-teal-subtle focus:border-marigold rounded-xl px-4 py-3 text-sm text-mist-rain placeholder:text-jade-soft/40 outline-none"
                />
              </div>

              {/* 5. What She Did (Story) */}
              <div>
                <label className="block text-xs font-semibold text-jade-soft mb-1.5">
                  5. What She Did (Story Drawer)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Highlighted 3 signature platters and the cozy evening adda vibe."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full bg-teal-darker border border-teal-subtle focus:border-marigold rounded-xl px-4 py-2.5 text-sm text-mist-rain placeholder:text-jade-soft/40 outline-none resize-none"
                />
              </div>

              {/* 6. Real Value & Impact (Honest feedback / results) */}
              <div>
                <label className="block text-xs font-semibold text-jade-soft mb-1.5">
                  6. Real Value & Impact (Honest client/audience result)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. দর্শকদের কাছ থেকে ভালো সাড়া ও নতুন কাস্টমারদের ইনবক্স এনকোয়ারি এসেছে।"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  className="w-full bg-teal-darker border border-teal-subtle focus:border-marigold rounded-xl px-4 py-2.5 text-sm text-mist-rain placeholder:text-jade-soft/40 outline-none resize-none"
                />
              </div>

              {/* Live Preview Box */}
              {clientName && (
                <div className="p-3.5 rounded-2xl bg-teal-darker border border-marigold/30 text-left space-y-1">
                  <div className="text-[10px] uppercase font-bold text-marigold mb-1">
                    Live Preview on Website
                  </div>
                  <div className="text-xs font-bold text-mist-rain">{clientName}</div>
                  <div className="text-[12px] italic text-zinc-300 font-serif">"{headline || "Authentic brand collaboration"}"</div>
                  {impact && (
                    <div className="text-[10px] text-emerald-400 font-medium pt-1">
                      Impact: {impact}
                    </div>
                  )}
                </div>
              )}

              {/* Publish Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPublished}
                  className={`w-full py-4 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center space-x-2 transition-all ${
                    isPublished 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-marigold hover:bg-marigold-hover active:scale-[0.98] text-teal-darker'
                  }`}
                >
                  {isPublished ? (
                    <>
                      <Check className="w-5 h-5 stroke-[2.5]" />
                      <span>Published</span>
                    </>
                  ) : (
                    <span>Publish</span>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}

