import { useSyncExternalStore } from 'react';

// Central store state outside React lifecycle
let state = {
  activeReelId: null,
  activePreviewId: null,
  userMutedPreference: typeof window !== 'undefined' && sessionStorage.getItem('dear_ekra_muted') === 'true',
  effectiveMuted: typeof window !== 'undefined' && sessionStorage.getItem('dear_ekra_muted') === 'true',
  theaterReel: null, // { reel, currentTime, isMuted }
  currentTime: 0
};

const listeners = new Set();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const videoStore = {
  getState() {
    return state;
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  playReel(id, startTime = 0) {
    if (state.activeReelId === id && state.currentTime === startTime) return;
    state = {
      ...state,
      activeReelId: id,
      activePreviewId: null, // Cancel any preview immediately
      currentTime: startTime,
      effectiveMuted: state.userMutedPreference
    };
    emitChange();
  },

  pauseReel(id) {
    if (state.activeReelId === id) {
      state = { ...state, activeReelId: null };
      emitChange();
    }
  },

  stopAll() {
    if (state.activeReelId !== null || state.activePreviewId !== null) {
      state = { ...state, activeReelId: null, activePreviewId: null };
      emitChange();
    }
  },

  setPreview(id) {
    // Only set preview if no active player is currently playing
    if (state.activeReelId) return;
    if (state.activePreviewId === id) return;
    state = { ...state, activePreviewId: id };
    emitChange();
  },

  clearPreview(id) {
    if (state.activePreviewId === id) {
      state = { ...state, activePreviewId: null };
      emitChange();
    }
  },

  toggleMute() {
    const newPref = !state.userMutedPreference;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dear_ekra_muted', String(newPref));
    }
    state = {
      ...state,
      userMutedPreference: newPref,
      effectiveMuted: newPref
    };
    emitChange();
  },

  setInvoluntaryMuted(isMuted) {
    // Browser enforced muted playback (does NOT overwrite userMutedPreference)
    state = { ...state, effectiveMuted: isMuted };
    emitChange();
  },

  unmuteWithUserGesture() {
    // User tapped "Tap for sound" or video body
    state = {
      ...state,
      userMutedPreference: false,
      effectiveMuted: false
    };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dear_ekra_muted', 'false');
    }
    emitChange();
  },

  openTheater(reel, currentTime = 0) {
    state = {
      ...state,
      activeReelId: null, // Pause inline player
      theaterReel: {
        reel,
        currentTime,
        isMuted: state.effectiveMuted
      }
    };
    emitChange();
  },

  closeTheater(updatedTime = null) {
    const currentTheater = state.theaterReel;
    state = {
      ...state,
      theaterReel: null,
      activeReelId: currentTheater && updatedTime !== null ? currentTheater.reel.id : null,
      currentTime: updatedTime !== null ? updatedTime : 0
    };
    emitChange();
  }
};

/**
 * Custom React hook with granular selector to avoid whole-grid re-renders
 */
export function useVideoStore(selector) {
  return useSyncExternalStore(
    videoStore.subscribe,
    () => selector(videoStore.getState())
  );
}

