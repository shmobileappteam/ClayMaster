import { storage } from '../api/api';
import { KEYS } from '../constants';
import { OFFLINE_VIDEO_STORAGE } from '../constants/modeSections';

export function parseSizeMb(sizeLabel) {
  if (typeof sizeLabel === 'number') return sizeLabel;
  if (!sizeLabel || typeof sizeLabel !== 'string') return 0;
  const match = sizeLabel.match(/([\d.]+)\s*MB/i);
  return match ? parseFloat(match[1]) : 0;
}

export function getDownloadedVideos() {
  const raw = storage.getString(KEYS.DOWNLOADED_VIDEOS);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isVideoDownloaded(videoId) {
  return getDownloadedVideos().some(v => v.id === videoId);
}

export function getOfflineStorageSummary() {
  const videos = getDownloadedVideos();
  const totalMb = videos.reduce(
    (sum, v) => sum + (Number(v.sizeMb) || parseSizeMb(v.size) || 0),
    0,
  );
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

/** Persist clip for offline Field Mode. */
export function saveDownloadedVideo(video) {
  const list = getDownloadedVideos();
  if (list.some(v => v.id === video.id)) {
    return list;
  }
  const entry = {
    id: video.id,
    title: video.title,
    videoUrl: video.videoUrl ?? video.video_url ?? null,
    description: video.description || '',
    source: video.source ?? 'library',
    sizeMb: video.sizeMb || 0,
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
    source: video.source ?? 'library',
    videoUrl: video.videoUrl ?? video.video_url ?? null,
    description: video.description || '',
    sizeMb: video.sizeMb || 0,
  };
}
