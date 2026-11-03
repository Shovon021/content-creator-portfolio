import { initialProjects } from '../data/portfolioData';

// Configurable Google Sheet published CSV URL
// Can be provided via Vite env or localStorage (via #admin)
const LOCAL_STORAGE_SHEET_KEY = 'dear_ekra_google_sheet_url';
const LOCAL_STORAGE_CACHE_KEY = 'dear_ekra_sheet_projects_cache';
const CACHE_TTL_MS = 60 * 1000; // 1 minute fresh cache before background revalidation

// Permanent Google Sheet published CSV URL
export const DEFAULT_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQRbRtO-wz9r1jq5LKa6Ce_RnqKE3klDActaR0aSo7KPPhdUFADBl5cwJEUHarvuQLBvR2_hVnXThi1/pub?output=csv';

/**
 * Get the active Google Sheet CSV URL (Environment variable or Admin setting or default)
 */
export function getGoogleSheetUrl() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCAL_STORAGE_SHEET_KEY);
    if (saved) return saved.trim();
  }
  return import.meta.env.VITE_GOOGLE_SHEET_CSV_URL || DEFAULT_SHEET_CSV_URL;
}

/**
 * Save a new Google Sheet CSV URL from the Admin panel
 */
export function setGoogleSheetUrl(url) {
  if (typeof window !== 'undefined') {
    if (url) {
      localStorage.setItem(LOCAL_STORAGE_SHEET_KEY, url.trim());
      localStorage.removeItem(LOCAL_STORAGE_CACHE_KEY); // Invalidate cache
    } else {
      localStorage.removeItem(LOCAL_STORAGE_SHEET_KEY);
      localStorage.removeItem(LOCAL_STORAGE_CACHE_KEY);
    }
  }
}

/**
 * Lightweight, zero-dependency CSV parser
 * Handles quoted fields, commas, escaped quotes, and multiline values
 */
export function parseCSV(text) {
  const lines = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // Skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++; // Skip \r\n
      currentRow.push(currentField.trim());
      if (currentRow.some(c => c.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(c => c.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map(h => h.toLowerCase().replace(/[^a-z0-9_]/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i];
    const obj = {};
    headers.forEach((h, index) => {
      obj[h] = values[index] !== undefined ? values[index] : '';
    });

    // Skip inactive rows
    if (obj.active && obj.active.toUpperCase() === 'FALSE') {
      continue;
    }

    // Normalize types and merge with bundled data if available
    const foundInitial = initialProjects.find(p => p.id === obj.id);
    rows.push({
      id: obj.id || `sheet-${i}`,
      brand: obj.brand || (foundInitial ? foundInitial.brand : 'Dear Ekra'),
      category: (obj.category || (foundInitial ? foundInitial.category : 'other')).toLowerCase().trim(),
      categoryLabel: obj.categorylabel || (foundInitial ? foundInitial.categoryLabel : '') || obj.category || '',
      headline: obj.headline || (foundInitial ? foundInitial.headline : ''),
      title: obj.headline || obj.title || obj.brand || (foundInitial ? foundInitial.title : 'Dear Ekra'),
      videoUrl: obj.videourl || (foundInitial ? foundInitial.videoUrl : ''),
      localVideoUrl: obj.localvideourl || (foundInitial ? foundInitial.localVideoUrl : ''),
      previewSrc: foundInitial?.previewSrc || '',
      videoThumbnail: obj.videothumbnail || obj.thumbnail || (foundInitial ? foundInitial.videoThumbnail : '/thumbnails/intro_video.webp'),
      brandLogo: obj.brandlogo || (foundInitial ? foundInitial.brandLogo : '/logos/dear_ekra_default.jpg'),
      viewCount: obj.viewcount || (foundInitial ? foundInitial.viewCount : ''),
      location: obj.location || (foundInitial ? foundInitial.location : 'Dhaka, Bangladesh'),
      featured: obj.featured !== undefined ? String(obj.featured).toUpperCase() === 'TRUE' : (foundInitial ? foundInitial.featured : false),
      story: obj.story || (foundInitial ? foundInitial.story : ''),
      aspect: 'vertical'
    });
  }

  return rows;
}

/**
 * Fetch portfolio projects from Google Sheets with localStorage caching & fallback
 */
export async function fetchPortfolioProjects() {
  const sheetUrl = getGoogleSheetUrl();

  // If no sheet URL configured, immediately return pre-bundled portfolioData
  if (!sheetUrl) {
    return initialProjects;
  }

  // 1. Check local cache first for instant paint
  let cached = null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.data)) {
        cached = parsed.data;
      }
    }
  } catch (err) {
    console.warn('Cache read error:', err);
  }

  // If cache is fresh, return cached data
  if (cached && cached.length > 0) {
    return cached;
  }

  // 2. Fetch fresh CSV from Google Sheets
  try {
    const res = await fetch(sheetUrl);
    if (!res.ok) throw new Error(`Google Sheets fetch failed with status ${res.status}`);
    const text = await res.text();
    const parsedRows = parseCSV(text);

    if (parsedRows && parsedRows.length > 0) {
      // Save to localStorage cache
      try {
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: parsedRows
        }));
      } catch {
        // quota exceeded or private mode
      }
      return parsedRows;
    }
  } catch (error) {
    console.warn('Failed to fetch from Google Sheets, using fallback data:', error);
  }

  // Fallback to pre-bundled local data
  return initialProjects;
}

