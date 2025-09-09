import { Suspense, lazy } from "react";
import Slider from "@/components/main/Slider";
import Title from "@/components/main/Title";

// Lazy load components that are below the fold
const CategoriesSlider = lazy(() => import("@/components/main/CategoriesSlider"));
const Deals = lazy(() => import("@/components/main/Deals"));
const TopRatedSlider = lazy(() => import("@/components/main/TopRatedSlider"));

// Loading component for suspense fallback
const ComponentLoader = () => (
  <div className="w-full py-8 flex justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const Home = () => {
  return (
    <div className={`pb-10`}>
      <Slider />
      <Title title={"categories"} />
      <Suspense fallback={<ComponentLoader />}>
        <CategoriesSlider />
      </Suspense>
      <Title title={"latest 3 sales"} />
      <Suspense fallback={<ComponentLoader />}>
        <Deals />
      </Suspense>
      <Title title={"Top Rated"} />
      <Suspense fallback={<ComponentLoader />}>
        <TopRatedSlider />
      </Suspense>
    </div>
  );
};
export default Home;
