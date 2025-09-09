import { JSX } from "react";

const Title = ({ title }: { title: string }): JSX.Element => {
  return (
    <div className={`w-full text-center py-8`}>
      <h1 className="font-semibold text-4xl sm:text-5xl lg:text-6xl uppercase">
        {title}
      </h1>
    </div>
  );
};
export default Title;
