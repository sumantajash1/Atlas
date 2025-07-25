import AddAGoal from "@/components/HomePage/AddAGoal";
import LandingPage from "@/components/HomePage/LandingPage";
import { useUser } from "@/context/UserContext";

function Home() {
  const { user } = useUser();
  if (!user) {
    return <LandingPage />;
  }
  return (
    <div>
      <AddAGoal />
    </div>
  );
}

export default Home;
