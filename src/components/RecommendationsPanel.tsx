import React, { useState } from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSignIcon, Users2Icon, LayoutTemplateIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  RotateCw
} from "lucide-react";

export interface Recommendation {
  id: string;
  campaignId: number;
  type: 'budget' | 'content' | 'demographics';
  description: string;
  impact: {
    metric: string;
    value: string;
    direction: 'up' | 'down';
  };
  details: string;
  changes?: any;
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  onApplyRecommendation: (recommendation: Recommendation) => void;
}

const typeConfig = {
  budget: {
    icon: DollarSignIcon,
    gradient: "from-emerald-400 to-emerald-600",
    bgGradient: "from-emerald-400/10 to-emerald-600/10",
    iconColor: "text-emerald-400",
    lightGradient: "from-emerald-50 to-emerald-100",
    lightBgGradient: "from-emerald-50 to-emerald-100",
    lightIconColor: "text-emerald-600",
    lightHoverBg: "hover:bg-emerald-50"
  },
  demographics: {
    icon: Users2Icon,
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-400/10 to-blue-600/10",
    iconColor: "text-blue-400",
    lightGradient: "from-blue-50 to-blue-100",
    lightBgGradient: "from-blue-50 to-blue-100",
    lightIconColor: "text-blue-600",
    lightHoverBg: "hover:bg-blue-50"
  },
  content: {
    icon: LayoutTemplateIcon,
    gradient: "from-purple-400 to-purple-600",
    bgGradient: "from-purple-400/10 to-purple-600/10",
    iconColor: "text-purple-400",
    lightGradient: "from-purple-50 to-purple-100",
    lightBgGradient: "from-purple-50 to-purple-100",
    lightIconColor: "text-purple-600",
    lightHoverBg: "hover:bg-purple-50"
  }
};

const getImpactColor = (direction: 'up' | 'down', isDark: boolean) => {
  if (isDark) {
    return direction === 'up' ? 'text-green-400' : 'text-red-400';
  }
  return direction === 'up' ? 'text-green-600' : 'text-red-600';
};

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
  onApplyRecommendation,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [applyingToCampaign, setApplyingToCampaign] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  if (recommendations.length === 0) {
    return (
      <div className={cn(
        "text-center py-4",
        isDark ? "text-purple-300" : "text-gray-500"
      )}>
        No recommendations available at this time.
      </div>
    );
  }

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
    <div className="flex flex-col gap-3">
      {recommendations.map((recommendation) => {
        const config = typeConfig[recommendation.type];
        const Icon = config.icon;

        return (
          <Card
            key={recommendation.id}
            className={cn(
              "border transition-colors w-full",
              isDark
                ? "border-purple-500/20 hover:bg-purple-500/5"
                : "border-gray-200 bg-white",
              !isDark && config.lightHoverBg
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark
                    ? `bg-gradient-to-br ${config.bgGradient}`
                    : `bg-gradient-to-br ${config.lightBgGradient}`
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    isDark ? config.iconColor : config.lightIconColor
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-1.5">
                        <h3 className={cn(
                          "font-medium text-sm leading-tight",
                          isDark ? "text-gray-100" : "text-gray-800"
                        )}>
                          {recommendation.description}
                        </h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className={cn(
                                "h-4 w-4 flex-shrink-0 mt-0.5",
                                isDark ? "text-purple-400" : "text-purple-600"
                              )} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className={cn(
                                "text-sm max-w-xs",
                                isDark ? "text-gray-100" : "text-gray-800"
                              )}>{recommendation.details}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={cn(
                          "text-sm",
                          isDark ? "text-purple-300" : "text-gray-600"
                        )}>{recommendation.impact.metric}:</span>
                        <span className={cn(
                          "text-sm font-medium",
                          getImpactColor(recommendation.impact.direction, isDark)
                        )}>{recommendation.impact.value}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleApplyRecommendations(recommendation.description)}
                      className={cn(
                        "px-3 py-1.5 h-auto text-sm font-medium whitespace-nowrap",
                        isDark
                          ? "bg-purple-500/20 hover:bg-purple-500/30 text-purple-200"
                          : `bg-${recommendation.type === 'budget' ? 'emerald' : recommendation.type === 'demographics' ? 'blue' : 'purple'}-50 hover:bg-${recommendation.type === 'budget' ? 'emerald' : recommendation.type === 'demographics' ? 'blue' : 'purple'}-100 text-${recommendation.type === 'budget' ? 'emerald' : recommendation.type === 'demographics' ? 'blue' : 'purple'}-700`
                      )}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
};

export default RecommendationsPanel;
