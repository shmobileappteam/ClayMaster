/** Academy / Library API → UI helpers */

export const stripHtml = html => {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
};

export const formatSizeFromKb = sizeKb => {
  const kb = Number(sizeKb);
  if (!Number.isFinite(kb) || kb <= 0) return '';
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(kb >= 10240 ? 0 : 1)} MB`;
};

export const sizeMbFromKb = sizeKb => {
  const kb = Number(sizeKb);
  if (!Number.isFinite(kb) || kb <= 0) return 0;
  return Math.round((kb / 1024) * 10) / 10;
};

const canAccess = item => {
  if (item?.can_access === false) return false;
  return item?.can_access !== false;
};

/** Shared video card / detail shape — API fields only */
export const mapLibraryVideo = (item, source = 'instructional') => {
  if (!item) return null;
  const locked = !canAccess(item) || !item.video_url;
  return {
    id: item.id,
    title: item.title || '',
    description: stripHtml(item.description) || '',
    thumbnail: item.thumbnail || null,
    videoUrl: item.video_url || null,
    trailerUrl: item.trailer?.video_url || null,
    trailerTitle: item.trailer?.title || null,
    canAccess: !locked,
    locked,
    packageId: item.package_id ?? null,
    source,
    orderBy: item.order_by ?? item.sort_order ?? 0,
    sizeKb: Number(item.size_kb) || 0,
    sizeMb: sizeMbFromKb(item.size_kb),
  };
};

export const mapTutorialVideo = item => mapLibraryVideo(item, 'tutorial');

export const mapInstructionalVideo = item =>
  mapLibraryVideo(item, 'instructional');

export const mapWebcast = item => mapLibraryVideo(item, 'webcast');

/**
 * Flatten nested additional-videos payload:
 * categories → subcategories → videos[] (or videos on category).
 */
export const flattenAdditionalVideos = payload => {
  const roots = Array.isArray(payload) ? payload : [];
  const videos = [];

  roots.forEach(cat => {
    const categoryName = cat.category_name || cat.title || '';
    const pushVideo = (v, subcategoryName) => {
      const mapped = mapLibraryVideo(v, 'additional');
      if (!mapped) return;
      videos.push({
        ...mapped,
        category: categoryName || null,
        subcategory: subcategoryName || null,
        illustration: v.illustration || null,
      });
    };

    if (Array.isArray(cat.videos)) {
      cat.videos.forEach(v => pushVideo(v, null));
    }

    (cat.subcategories || []).forEach(sub => {
      const subName = sub.subcategory_name || null;
      if (Array.isArray(sub.videos)) {
        sub.videos.forEach(v => pushVideo(v, subName));
      }
    });

    if (cat.id != null && (cat.video_url !== undefined || cat.title)) {
      if (!Array.isArray(cat.videos) && !cat.category_name) {
        pushVideo(cat, null);
      }
    }
  });

  return videos.sort((a, b) => (a.orderBy || 0) - (b.orderBy || 0));
};

export const mapPracticeDrill = item => {
  if (!item) return null;
  const desc = stripHtml(item.description);
  return {
    id: item.id,
    title: item.title || '',
    desc,
    description: desc,
    fileType: item.file_type || '',
    fileUrl: item.file_url || null,
    sizeMb: sizeMbFromKb(item.size_kb),
    sizeKb: Number(item.size_kb) || 0,
    canAccess: Boolean(item.file_url),
  };
};

export const mapWorkbook = item => {
  if (!item) return null;
  const locked = item.can_access === false || !item.file_url;
  const rawDescription =
    typeof item.description === 'string' ? item.description : '';
  return {
    id: item.id,
    title: item.title || '',
    /** Plain-text fallback (lists/headings flattened). Prefer descriptionHtml for UI. */
    description: stripHtml(rawDescription),
    /** Original API HTML so bullets / headings can render. */
    descriptionHtml: rawDescription,
    fileType: (item.file_type || '').toUpperCase(),
    fileUrl: item.file_url || null,
    canAccess: !locked,
    locked,
    packageId: item.package_id ?? null,
  };
};

export const mapManualDocument = item => {
  if (!item) return null;
  return {
    id: item.id,
    title: item.title || '',
    description: stripHtml(item.description),
    type: (item.file_type || '').toUpperCase(),
    category: item.kind || '',
    fileUrl: item.file_url || null,
    kind: item.kind || '',
  };
};

/** True when URL / mime / extension looks like a PDF. */
export const isPdfFile = (urlOrType) => {
  if (!urlOrType) return false;
  const s = String(urlOrType).toLowerCase();
  return s.includes('pdf') || s.endsWith('.pdf');
};

/** Same behavior as scorecard "Download File" — open remote URL in system handler. */
export const openRemoteFile = async (url, Linking, showMessage) => {
  if (!url) {
    showMessage?.({
      type: 'danger',
      title: 'Unavailable',
      message: 'No file is available for this item.',
    });
    return;
  }
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      showMessage?.({
        type: 'danger',
        title: 'Cannot open file',
        message: 'This file link is not supported on your device.',
      });
      return;
    }
    await Linking.openURL(url);
  } catch {
    showMessage?.({
      type: 'danger',
      title: 'Cannot open file',
      message: 'Please try again.',
    });
  }
};
