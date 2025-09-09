import Link from "next/link";

const Logo = () => {
  return (
    <div className="flex justify-center text-sm">
      <Link
        href={"/"}
        className="p-2 bg-primary rounded-xl flex items-center gap-2"
      >
        <span className="text-white font-bold">MECHA</span>
        <span className="bg-white font-semibold p-2 rounded-md">
          &lt;/MAN&gt;
        </span>
      </Link>
    </div>
  );
};
export default Logo;
