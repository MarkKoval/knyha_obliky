const STORAGE_KEY = 'income-book:last';

export function saveLastDocument(payload) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('Failed to save document', error);
  }
}

export function loadLastDocument() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to load document', error);
    return null;
  }
}

export function clearLastDocument() {
  sessionStorage.removeItem(STORAGE_KEY);
}
