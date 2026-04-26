export function Select({ children }: any) {
  return (
    <select className="border px-2 py-2 rounded w-full">
      {children}
    </select>
  );
}