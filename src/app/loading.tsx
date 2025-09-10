import { JSX } from "react";

const Loading = (): JSX.Element => {
  return (
    <div className="flex justify-center items-center h-screen w-screen z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default Loading;
