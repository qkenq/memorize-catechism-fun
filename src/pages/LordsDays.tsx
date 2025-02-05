
import { Navigation } from "@/components/Navigation";
import { catechism } from "@/data/catechism";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const LordsDays = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />

      <main className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-900 mb-8 text-center">
            Lord's Days
          </h1>

          <div className="grid gap-4">
            {catechism.map((lordsDay) => (
              <Link
                key={lordsDay.id}
                to={`/lords-days/${lordsDay.id}`}
                className="p-6 rounded-lg bg-white border border-brand-100 shadow-sm hover:shadow-md transition-all group animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-brand-800 group-hover:text-brand-900">
                      {lordsDay.title}
                    </h2>
                    <p className="text-brand-600 mt-1">
                      {lordsDay.questions.length} Question{lordsDay.questions.length !== 1 && "s"}
                    </p>
                  </div>
                  <ChevronRight className="text-brand-400 group-hover:text-brand-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LordsDays;
