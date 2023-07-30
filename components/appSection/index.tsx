import { FC, PropsWithChildren } from "react";

export const AppSection: FC<PropsWithChildren> = ({ children }) => {
  return <div className="bg-white m-4 p-4 rounded">{children}</div>;
};
