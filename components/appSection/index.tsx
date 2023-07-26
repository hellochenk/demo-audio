import { FC, PropsWithChildren } from "react";

export const AppSection: FC<PropsWithChildren> = ({ children }) => {
  return <div className="bg-white p-2 rounded">{children}</div>;
};
