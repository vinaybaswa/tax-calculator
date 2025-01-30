import { FC } from "react";

const Error: FC<{ error: string }> = ({ error }) => {
  return <div className="text-red-600 text-sm text-center py-4 ">{error}</div>;
};

export default Error;
