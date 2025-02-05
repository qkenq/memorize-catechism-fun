import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    console.log("Start Learning clicked"); // Debug log
    try {
      navigate("/lords-days/1");
      toast.success("Starting with Lord's Day 1");
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      
      <main className="container mx-auto pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-900">
              Memorize the Heidelberg Catechism
            </h1>
            <p className="text-lg md:text-xl text-brand-600">
              An interactive platform to help you learn and remember these timeless truths.
            </p>
            <div className="pt-4">
              <Button 
                onClick={handleStartLearning}
                size="lg"
                className="text-lg group"
              >
                Start Learning
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-brand-100 shadow-sm hover:shadow-md transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="w-12 h-12 text-sage-600 mb-4" />
                <h3 className="text-xl font-semibold text-brand-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-brand-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const features = [
  {
    title: "Interactive Learning",
    description: "Engage with the text through fill-in-the-blank exercises and memory challenges.",
    icon: ({ className }: { className?: string }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" 
        />
      </svg>
    ),
  },
  {
    title: "Track Progress",
    description: "Monitor your learning journey with detailed progress tracking and achievements.",
    icon: ({ className }: { className?: string }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" 
        />
      </svg>
    ),
  },
  {
    title: "Community Learning",
    description: "Join others in learning the catechism through leaderboards and church groups.",
    icon: ({ className }: { className?: string }) => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" 
        />
      </svg>
    ),
  },
];

export default Index;