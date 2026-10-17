// The mark: a ring (the work) with a point on its edge (the reference).
export function Mark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="10.5" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="51.72 12 2.25 0" strokeLinecap="round" />
      <circle className="dot" cx="23.42" cy="8.58" r="4.2" />
    </svg>
  );
}

export function Brand() {
  return (
    <a className="brand" href="/">
      <Mark />
      <span>Reference Point</span>
    </a>
  );
}
