import { JSX } from "react";

const Loader = (): JSX.Element => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default Loader;
