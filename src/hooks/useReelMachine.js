import { useReducer, useCallback } from 'react';

export const REEL_STATES = {
  IDLE: 'idle',
  PREVIEW_LOADING: 'previewLoading',
  PREVIEWING: 'previewing',
  PLAYER_LOADING: 'playerLoading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
  ERROR: 'error'
};

const initialState = {
  status: REEL_STATES.IDLE,
  errorMessage: null
};

function reelReducer(state, action) {
  switch (state.status) {
    case REEL_STATES.IDLE:
      if (action.type === 'HOVER_INTENT' || action.type === 'IN_VIEW') {
        return { status: REEL_STATES.PREVIEW_LOADING, errorMessage: null };
      }
      if (action.type === 'START_PLAY') {
        return { status: REEL_STATES.PLAYER_LOADING, errorMessage: null };
      }
      if (action.type === 'PLAYING') {
        return { status: REEL_STATES.PLAYING, errorMessage: null };
      }
      return state;

    case REEL_STATES.PREVIEW_LOADING:
      if (action.type === 'CANPLAY') {
        return { status: REEL_STATES.PREVIEWING, errorMessage: null };
      }
      if (action.type === 'LEAVE' || action.type === 'OUT_OF_VIEW' || action.type === 'RESET') {
        return { status: REEL_STATES.IDLE, errorMessage: null };
      }
      if (action.type === 'START_PLAY') {
        return { status: REEL_STATES.PLAYER_LOADING, errorMessage: null };
      }
      if (action.type === 'PLAYING') {
        return { status: REEL_STATES.PLAYING, errorMessage: null };
      }
      return state;

    case REEL_STATES.PREVIEWING:
      if (action.type === 'LEAVE' || action.type === 'OUT_OF_VIEW' || action.type === 'RESET') {
        return { status: REEL_STATES.IDLE, errorMessage: null };
      }
      if (action.type === 'START_PLAY') {
        return { status: REEL_STATES.PLAYER_LOADING, errorMessage: null };
      }
      if (action.type === 'PLAYING') {
        return { status: REEL_STATES.PLAYING, errorMessage: null };
      }
      return state;

    case REEL_STATES.PLAYER_LOADING:
      if (action.type === 'PLAYING') {
        return { status: REEL_STATES.PLAYING, errorMessage: null };
      }
      if (action.type === 'ERROR') {
        return { status: REEL_STATES.ERROR, errorMessage: action.payload || 'Failed to load video' };
      }
      if (action.type === 'RESET') {
        return { status: REEL_STATES.IDLE, errorMessage: null };
      }
      return state;

    case REEL_STATES.PLAYING:
      if (action.type === 'PAUSE' || action.type === 'SCROLLED_OUT' || action.type === 'TAB_HIDDEN') {
        return { status: REEL_STATES.PAUSED, errorMessage: null };
      }
      if (action.type === 'ENDED') {
        return { status: REEL_STATES.ENDED, errorMessage: null };
      }
      if (action.type === 'RESET') {
        return { status: REEL_STATES.IDLE, errorMessage: null };
      }
      if (action.type === 'ERROR') {
        return { status: REEL_STATES.ERROR, errorMessage: action.payload || 'Playback error' };
      }
      return state;

    case REEL_STATES.PAUSED:
      if (action.type === 'PLAY') {
        return { status: REEL_STATES.PLAYING, errorMessage: null };
      }
      if (action.type === 'RESET') {
        return { status: REEL_STATES.IDLE, errorMessage: null };
      }
      return state;

    case REEL_STATES.ENDED:
      if (action.type === 'RESTART' || action.type === 'START_PLAY') {
        return { status: REEL_STATES.PLAYER_LOADING, errorMessage: null };
      }
      if (action.type === 'RESET') {
        return { status: REEL_STATES.IDLE, errorMessage: null };
      }
      return state;

    case REEL_STATES.ERROR:
      if (action.type === 'RETRY' || action.type === 'START_PLAY') {
        return { status: REEL_STATES.PLAYER_LOADING, errorMessage: null };
      }
      if (action.type === 'RESET') {
        return { status: REEL_STATES.IDLE, errorMessage: null };
      }
      return state;

    default:
      return state;
  }
}

export function useReelMachine() {
  const [machineState, dispatch] = useReducer(reelReducer, initialState);

  const triggerHoverIntent = useCallback(() => dispatch({ type: 'HOVER_INTENT' }), []);
  const triggerInView = useCallback(() => dispatch({ type: 'IN_VIEW' }), []);
  const triggerCanPlay = useCallback(() => dispatch({ type: 'CANPLAY' }), []);
  const triggerLeave = useCallback(() => dispatch({ type: 'LEAVE' }), []);
  const triggerStartPlay = useCallback(() => dispatch({ type: 'START_PLAY' }), []);
  const triggerPlaying = useCallback(() => dispatch({ type: 'PLAYING' }), []);
  const triggerPause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const triggerResume = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const triggerEnded = useCallback(() => dispatch({ type: 'ENDED' }), []);
  const triggerRestart = useCallback(() => dispatch({ type: 'RESTART' }), []);
  const triggerReset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const triggerError = useCallback((msg) => dispatch({ type: 'ERROR', payload: msg }), []);

  return {
    status: machineState.status,
    errorMessage: machineState.errorMessage,
    dispatch,
    triggerHoverIntent,
    triggerInView,
    triggerCanPlay,
    triggerLeave,
    triggerStartPlay,
    triggerPlaying,
    triggerPause,
    triggerResume,
    triggerEnded,
    triggerRestart,
    triggerReset,
    triggerError
  };
}

