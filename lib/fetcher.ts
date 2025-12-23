class FetchError extends Error {
  info?: any;
  status?: number;

  constructor(message: string, info?: any, status?: number) {
    super(message);
    this.name = 'FetchError';
    this.info = info;
    this.status = status;
  }
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const parsed = await res.json().catch(() => ({ message: 'Failed to parse error' }));
    throw new FetchError('An error occurred while fetching the data.', parsed, res.status);
  }

  return res.json();
};