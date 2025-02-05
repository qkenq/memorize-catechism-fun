
import { Navigation } from "@/components/Navigation";

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      
      <main className="pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-900 mb-4">
            Leaderboard
          </h1>
          <p className="text-brand-600">Coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
