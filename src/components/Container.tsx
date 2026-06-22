import { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-[140px] ${className}`}
    >
      {children}
    </div>
  );
}
