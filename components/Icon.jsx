const paths = {
  'arrow-up-right': 'M7 17 17 7M7 7h10v10',
  'arrow-down': 'M12 4v16m-7-7 7 7 7-7',
  'arrow-up': 'M12 20V4m-7 7 7-7 7 7',
  mail: 'M4 6h16v12H4zM4 6l8 6 8-6',
  code: 'm8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16',
  sun: 'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17m10-10 1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M20.4 13.4A8.5 8.5 0 0 1 10.6 3.6 8.5 8.5 0 1 0 20.4 13.4Z',
};

export default function Icon({ name, className = '' }) {
  return (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}
