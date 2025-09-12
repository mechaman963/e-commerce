import Link from "next/link";
import Image from "next/image";
const LoginWithGoogle = () => {
  return (
    <Link
      href={`https://mecha-man-e-commerce.up.railway.app/api/login-google`}
      className={`w-max flex items-center border-[1px] border-blue-500 rounded-md hover:shadow-[0_0_8px_0_#66A3FF] duration-200`}
    >
      <div className="relative size-12 overflow-hidden rounded-sm">
        <Image src={"/google.png"} fill alt="google" className="p-2" />
      </div>

      <div className="px-2 bg-blue-500 h-full leading-12 text-white font-semibold">
        Login With Google
      </div>
    </Link>
  );
};
export default LoginWithGoogle;
