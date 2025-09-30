import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSignIcon,
  Users2Icon,
  LayoutTemplateIcon,
  SlidersHorizontal,
  RotateCw
} from "lucide-react";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { useState } from "react";

type RecommendationType = 'budget' | 'demographics' | 'content';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  impact: string;
  type: RecommendationType;
}

interface RecommendationsProps {
  buttonClassName?: string;
}

const recommendations: Recommendation[] = [
  {
    id: 1,
    title: "Optimize Campaign Budget",
    description: "Increase budget allocation for top performing ads",
    impact: "+15% ROAS",
    type: "budget"
  },
  {
    id: 2,
    title: "Target New Age Group",
    description: "Expand to 25-34 age group showing high engagement",
    impact: "+20% Reach",
    type: "demographics"
  },
  {
    id: 3,
    title: "Update Ad Creative",
    description: "Test video format for better engagement",
    impact: "+25% CTR",
    type: "content"
  }
];

const typeConfig = {
  budget: {
    icon: DollarSignIcon,
    gradient: "from-emerald-400 to-emerald-600",
    bgGradient: "from-emerald-400/10 to-emerald-600/10",
    iconColor: "text-emerald-400"
  },
  demographics: {
    icon: Users2Icon,
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-400/10 to-blue-600/10",
    iconColor: "text-blue-400"
  },
  content: {
    icon: LayoutTemplateIcon,
    gradient: "from-purple-400 to-purple-600",
    bgGradient: "from-purple-400/10 to-purple-600/10",
    iconColor: "text-purple-400"
  }
};

export function Recommendations({ buttonClassName }: RecommendationsProps) {
  const { theme } = useTheme();
  const [applyingToCampaign, setApplyingToCampaign] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const handleApply = (id: number) => {
    // TODO: Implement recommendation application logic
    console.log(`Applying recommendation ${id}`);
  };

  const [steps, setSteps] = useState([
    {
      id: 1,
      title: "Analyzing Campaign Data",
      description: "Evaluating performance metrics and historical data",
      status: 'pending'
    },
    {
      id: 2,
      title: "Optimizing Budget Allocation",
      description: "Adjusting budget distribution for maximum ROI",
      status: 'pending'
    },
    {
      id: 3,
      title: "Updating Targeting Parameters",
      description: "Refining audience segments and demographics",
      status: 'pending'
    },
    {
      id: 4,
      title: "Implementing Changes",
      description: "Applying optimized settings to your campaign",
      status: 'pending'
    }
  ]);

  const handleApplyRecommendations = (campaignName: string) => {
    setApplyingToCampaign(campaignName);

    // Reset steps status
    setSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));
    setCurrentStep(1);

    // Simulate AI agent progress
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setSteps(prevSteps => prevSteps.map((step, idx) => ({
          ...step,
          status: idx === stepIndex ? 'running' : idx < stepIndex ? 'completed' : 'pending'
        })));
        stepIndex += 1;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setSteps(prevSteps => prevSteps.map(step => ({ ...step, status: 'completed' })));
          setTimeout(() => {
            setApplyingToCampaign(null);
            setCurrentStep(1);
          }, 1000);
        }, 1000);
      }
    }, 2000);
  };


  return (
    <Card className={cn(
      "border",
      theme === 'dark'
        ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
        : "bg-white border-gray-200"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className={cn(
            "h-5 w-5",
            theme === 'dark' ? "text-purple-400" : "text-purple-600"
          )} />
          <CardTitle className={cn(
            "text-lg font-semibold",
            theme === 'dark'
              ? "bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400"
              : "text-gray-800"
          )}>
            AI Recommendations
          </CardTitle>
        </div>
        <CardDescription className={cn(
          "text-sm",
          theme === 'dark' ? "text-purple-300/80" : "text-gray-500"
        )}>
          Smart suggestions to improve performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => {
          const config = typeConfig[rec.type];
          const Icon = config.icon;

          return (
            <div
              key={rec.id}
              className={cn(
                "p-3 rounded-lg border transition-all duration-200",
                theme === 'dark'
                  ? "bg-[#2D1B69]/30 border-[#6D28D9]/20 hover:bg-[#2D1B69]/40"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-1.5 rounded-lg",
                  theme === 'dark' ? `bg-gradient-to-br ${config.bgGradient}` : "bg-white"
                )}>
                  <Icon className={`h-4 w-4 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "text-sm font-medium truncate",
                    theme === 'dark' ? "text-purple-200" : "text-gray-800"
                  )}>{rec.title}</h3>
                  <p className={cn(
                    "text-xs truncate",
                    theme === 'dark' ? "text-purple-300/80" : "text-gray-500"
                  )}>{rec.description}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">{rec.impact}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className={buttonClassName}
                  onClick={() => handleApplyRecommendations(rec?.description)}
                >
                  Apply
                </Button>
              </div>
            </div>
          );
        })}

        {/* Progress Overlay */}
        {applyingToCampaign && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="w-full max-w-2xl">
              <h2 className="text-2xl font-semibold text-purple-200 mb-4">
                {/* Applying Recommendations to {applyingToCampaign} */}
              </h2>

              {/* Processing step - show all steps with status */}
              <div className="space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="text-purple-200">
                    Current Progress
                  </div>
                  <div className="text-purple-300/70">
                    {steps.filter(step => step.status === 'completed').length} of {steps.length} steps completed
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#2D1B69] border border-purple-500/20">
                  {/* Step Items with connecting lines */}
                  <div className="space-y-1.5 relative">
                    {/* Connecting lines */}
                    {steps.map((step, index) => (
                      index < steps.length - 1 && (
                        <div
                          key={`line-${index}`}
                          className="absolute"
                          style={{
                            left: '2.025rem',
                            top: `${(index * 48) + 24}px`,
                            width: '2px',
                            height: '48px',
                            backgroundColor: step.status === 'completed'
                              ? '#8B5CF6'
                              : 'rgba(109, 40, 217, 0.2)',
                            transition: 'background-color 0.3s ease'
                          }}
                        />
                      )
                    ))}

                    {/* Steps */}
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-lg transition-colors duration-200",
                          step.status === 'running'
                            ? 'bg-[#2D1B69]/70 shadow-lg shadow-purple-500/10'
                            : step.status === 'completed'
                              ? 'bg-green-900/20'
                              : 'bg-[#2D1B69]/20'
                        )}
                      >
                        <div className="flex items-center min-w-0 gap-3">
                          <div className="relative flex items-center justify-center w-[3rem] flex-shrink-0">
                            <div className={cn(
                              "w-5 h-5 rounded-full transition-all duration-300 border-2 flex items-center justify-center",
                              step.status === 'running'
                                ? 'border-purple-400 bg-[#1A0B2E] shadow-lg shadow-purple-500/20'
                                : step.status === 'completed'
                                  ? 'border-green-400 bg-green-400'
                                  : 'border-purple-500/20 bg-[#1A0B2E]'
                            )}>
                              {step.status === 'running' && (
                                <RotateCw className="w-2.5 h-2.5 text-purple-400 animate-spin" />
                              )}
                              {step.status === 'completed' && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1A0B2E]" />
                              )}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={cn(
                              step.status === 'running'
                                ? 'text-purple-200 font-medium'
                                : step.status === 'completed'
                                  ? 'text-green-400'
                                  : 'text-purple-300/70'
                            )}>
                              {step.title}
                            </p>
                            <p className="text-sm text-purple-300/50">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
