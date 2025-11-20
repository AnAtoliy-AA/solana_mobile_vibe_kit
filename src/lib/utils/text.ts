export function getTokenInitials(name?: string, symbol?: string): string {
  const source = name || symbol || '';
  const trimmed = source.trim();

  if (!trimmed) {
    return '??';
  }

  const alphanumericOnly = trimmed.replace(/[^a-zA-Z0-9]/g, '');
  if (!alphanumericOnly) {
    return trimmed.slice(0, 2).toUpperCase();
  }

  return alphanumericOnly.slice(0, 2).toUpperCase();
}
