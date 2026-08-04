import { Platform, StatusBar } from 'react-native';
import { showMessage as flashMessage } from 'react-native-flash-message';
import { COLORS } from '../globalStyle/Theme';

const TOAST_SHADOW = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
  },
  android: {
    elevation: 8,
  },
  default: {},
});

/**
 * Top floating toast — slides in below the status bar (Sonner-style).
 *
 * @param {string} [message] - Primary line (or body when `title` is set)
 * @param {string} [title] - Headline (web `toast({ title, description })`)
 * @param {string} [description] - Secondary line
 * @param {'default'|'success'|'danger'|'warning'|'card'} [type] - `card` = white surface
 * @param {string} [bgColor] - Override background
 * @param {string} [color] - Override text color
 * @param {'top'|'bottom'|'center'} [position] - Defaults to `top`
 */
export function showMessage({
  message = '',
  title = '',
  description = '',
  type = 'default',
  bgColor = '',
  color = '',
  position = 'top',
  duration = 3200,
}) {
  const isCardToast = type === 'card';

  const displayMessage = title || message;
  const displayDescription = title
    ? description || (title !== message ? message : '')
    : description;

  const backgroundColor = isCardToast
    ? COLORS.surface
    : bgColor ||
      (type === 'success'
        ? COLORS.primary
        : type === 'danger'
          ? COLORS.destructive
          : type === 'warning'
            ? COLORS.orange100
            : COLORS.secondary);

  const textColor =
    color ||
    (isCardToast ? COLORS.textPrimary : COLORS.white100);

  const flashType =
    isCardToast || type === 'default' || type === 'card'
      ? 'info'
      : type === 'warning'
        ? 'warning'
        : type;

  flashMessage({
    message: displayMessage,
    description: displayDescription || undefined,
    type: flashType,
    backgroundColor,
    color: textColor,
    icon: 'auto',
    floating: true,
    hideStatusBar: false,
    statusBarHeight:
      Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : undefined,
    position,
    duration,
    animated: true,
    animationDuration: 280,
    style: {
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 16,
      minHeight: 52,
      borderWidth: isCardToast ? 1 : 0,
      borderColor: isCardToast ? COLORS.borderMuted : 'transparent',
      ...TOAST_SHADOW,
    },
    titleStyle: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 15,
      lineHeight: 20,
      color: textColor,
      fontWeight: undefined,
    },
    textStyle: {
      fontFamily: 'Barlow-Regular',
      fontSize: 13,
      lineHeight: 18,
      color: isCardToast ? COLORS.textSecondary : textColor,
      opacity: isCardToast ? 1 : 0.92,
    },
  });
}

/** Web-style `{ title, description }` toast shorthand */
export function showToast({ title, description, type = 'card', duration = 3000 }) {
  showMessage({ title, description, type, duration });
}
export const formatBackendErrors = errors => {
  const errObj = {};

  if (errors && typeof errors === 'object') {
    Object.entries(errors).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        errObj[key] = value[0];
      }
    });
  }

  return errObj;
};

export const objectToFormData = (
  obj,
  formData = new FormData(),
  parentKey = '',
) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return; // Skip null/undefined values
    }

    const currentKey = parentKey ? `${parentKey}[${key}]` : key;

    if (Array.isArray(value)) {
      // Handle array of files or values
      value.forEach((item, index) => {
        const arrayKey = `${currentKey}[${index}]`;

        if (typeof item === 'object' && item?.uri) {
          // File object in array
          formData.append(arrayKey, {
            uri: item.uri,
            type: item.type,
            name: item.fileName,
          });
        } else {
          // Primitive value in array
          formData.append(arrayKey, item);
        }
      });
    } else if (typeof value === 'object' && value?.uri) {
      // Single file object
      formData.append(currentKey, {
        uri: value.uri,
        type: value.type,
        name: value.fileName,
      });
    } else {
      // Primitive value
      formData.append(currentKey, value);
    }
  });

  return formData;
};

export const maskPhoneNumber = input => {
  if (!input) return '';
  // Remove all non-numeric characters and take only first 10 digits
  const digits = String(input).replace(/\D/g, '').slice(0, 10);

  if (digits.length === 0) return '';

  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return digits.replace(/(\d{3})(\d+)/, '$1-$2');
  }
  return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
};

export const formatDate = isoDate => {
  const date = isoDate ? new Date(isoDate) : new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1; // months are 0-indexed
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// ✅ Function to generate pairOfTargets dynamically

export const generatePairOfTargets = idsArray => {
  const result = {};

  idsArray.forEach(id => {
    const shots = Array.from({ length: id * 2 }, (_, i) => ({
      sequence: i + 1,
      result: 'empty',
    }));
    result[id] = shots;
  });

  return result;
};

export const formatUsDate = dateLike => {
  const d = dateLike ? new Date(dateLike) : new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

export const formatExpiryDate = (expiryString) => {
  if (!expiryString) return '';

  // Parse the date (handles "2025-11-28 00:00:00" format)
  const date = new Date(expiryString.replace(' ', 'T') + 'Z');

  if (isNaN(date.getTime())) return 'Invalid date';

  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Show countdown if expiring soon, otherwise full date
  if (diffDays <= 7) {
    return `${diffDays} days left`;
  } else if (diffDays <= 30) {
    return `${Math.floor(diffDays / 7)} weeks left`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};
