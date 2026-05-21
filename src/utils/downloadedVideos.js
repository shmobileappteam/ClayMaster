import { storage } from '../api/api';
import { KEYS } from '../constants';
import { OFFLINE_VIDEO_STORAGE } from '../constants/modeSections';

/** Seed clips available offline in Field Mode until user saves more from the library. */
export const DEFAULT_DOWNLOADED_VIDEOS = [
  {
    id: 'pre-shot-routine',
    title: 'Pre-Shot Routine',
    duration: '2:30',
    size: '48 MB',
    instructor: 'Kevin DeMichiel',
  },
  {
    id: 'reading-target',
    title: 'Reading the Target',
    duration: '4:15',
    size: '72 MB',
    instructor: 'Bill McGuire',
  },
  {
    id: 'tower-quick-review',
    title: 'Tower Shot — Quick Review',
    duration: '3:40',
    size: '55 MB',
    instructor: 'Kevin DeMichiel',
  },
];

/** Rough placeholder sizing (~6 MB/min) until API returns real asset bytes. */
export function estimateSizeFromDuration(duration) {
  if (!duration || typeof duration !== 'string') {
    return '—';
  }
  const parts = duration.split(':').map(n => parseInt(n, 10) || 0);
  const minutes = parts.length >= 2 ? parts[0] + parts[1] / 60 : parts[0];
  const mb = Math.max(8, Math.round(minutes * 6));
  return `${mb} MB`;
}

export function parseSizeMb(sizeLabel) {
  if (!sizeLabel || typeof sizeLabel !== 'string') {
    return 0;
  }
  const match = sizeLabel.match(/([\d.]+)\s*MB/i);
  return match ? parseFloat(match[1]) : 0;
}

export function getDownloadedVideos() {
  const raw = storage.getString(KEYS.DOWNLOADED_VIDEOS);
  if (!raw) {
    storage.set(KEYS.DOWNLOADED_VIDEOS, JSON.stringify(DEFAULT_DOWNLOADED_VIDEOS));
    return [...DEFAULT_DOWNLOADED_VIDEOS];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_DOWNLOADED_VIDEOS];
  } catch {
    return [...DEFAULT_DOWNLOADED_VIDEOS];
  }
}

export function isVideoDownloaded(videoId) {
  return getDownloadedVideos().some(v => v.id === videoId);
}

export function getOfflineStorageSummary() {
  const videos = getDownloadedVideos();
  const totalMb = videos.reduce((sum, v) => sum + parseSizeMb(v.size), 0);
  const { recommendedBudgetMb, warnAboveMb } = OFFLINE_VIDEO_STORAGE;
  return {
    count: videos.length,
    totalMb: Math.round(totalMb),
    recommendedBudgetMb,
    warnAboveMb,
    isNearLimit: totalMb >= warnAboveMb,
    isOverBudget: totalMb >= recommendedBudgetMb,
  };
}

/** Persist clip for offline Field Mode (PAGE 11 / PAGE 12). */
export function saveDownloadedVideo(video) {
  const list = getDownloadedVideos();
  if (list.some(v => v.id === video.id)) {
    return list;
  }
  const entry = {
    ...video,
    size: video.size ?? estimateSizeFromDuration(video.duration),
    downloadedAt: new Date().toISOString(),
  };
  const next = [entry, ...list];
  storage.set(KEYS.DOWNLOADED_VIDEOS, JSON.stringify(next));
  return next;
}

export function removeDownloadedVideo(videoId) {
  const next = getDownloadedVideos().filter(v => v.id !== videoId);
  storage.set(KEYS.DOWNLOADED_VIDEOS, JSON.stringify(next));
  return next;
}

export function toDownloadEntry(video) {
  return {
    id: video.id,
    title: video.title,
    duration: video.duration,
    instructor: video.coach ?? video.instructor ?? 'Kevin DeMichiel',
    size: video.size ?? estimateSizeFromDuration(video.duration),
    source: video.source ?? 'library',
  };
}
