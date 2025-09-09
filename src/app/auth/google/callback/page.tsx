"use client";

import Loader from "@/components/Loader";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from "universal-cookie";

const GoogleAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cookies = new Cookies();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const queryString = searchParams.toString();
    console.log(queryString);

    const exchange = async () => {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/auth/google/callback?${queryString}`
        );

        console.log(data);

        if (data?.access_token) {
          cookies.set("Bearer", data.access_token);
        }

        router.push("/");
      } catch (error) {
        console.error(error);
        router.replace("/login?error=oauth_failed");
      }
    };

    exchange();
  }, [searchParams, router]);

  return <Loader />;
};
export default GoogleAuth;
