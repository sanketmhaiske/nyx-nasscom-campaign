import * as React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  MarkerType,
  Position,
  BackgroundVariant,
  Panel,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  IndianRupee,
  FileDown,
  HelpCircle,
  Home,
  Info,
  LineChart,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Plus,
  RotateCw,
  Settings,
  Share2,
  Sparkles,
  Target,
  ThumbsUp,
  Upload,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import CustomNode from "../components/CustomNode";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useTheme } from "next-themes";
import { useQuery, useMutation, useQueries } from "@tanstack/react-query";
import { analyticsApi } from "../services/api";
import { toast } from "react-toastify";
import { useJsApiLoader, Autocomplete, useLoadScript } from "@react-google-maps/api";
import LocationInput from "./locationInput";
import { useQueryClient } from "@tanstack/react-query";


interface SubStep {
  name: string;
  status: "pending" | "running" | "completed" | "error";
}

interface WorkflowStep {
  name: string;
  status: "pending" | "running" | "completed" | "error";
  subSteps: SubStep[];
  type: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  activeInstances: number;
  successRate: number;
  completedCount: number;
  steps: WorkflowStep[];
}

interface WorkflowCardProps {
  workflow: Workflow;
}

interface CreativeAsset {
  url: string;
  aspectRatio: string;
  type: "image" | "video";
  name: string;
  size: string;
  dimensions: string;
}

interface GeneratedContent {
  headlines: string[];
  descriptions: string[];
  captions: string[];
}

interface CampaignConfig {
  name: string;
  brandPersona: string;
  targetDemographic: {
    ageRange: { min: number; max: number };
    gender: string[];
    locations: string[];
  };
  channel_budget_allocation: {
    [key in 'meta' | 'google' | 'linkedin']: number;
  };
  budget: {
    total: number;
    currency: string;
  };
  dates: {
    start: string;
    end: string;
  };
}


interface StepType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  subSteps: { name: string; status: WorkflowStep["status"] }[];
  type: string;
}

const stepTypes: StepType[] = [
  {
    id: "content-creation",
    name: "Content Creation",
    description: "Create content for your campaign",
    icon: MessageSquare,
    subSteps: [
      { name: "Creating social media posts", status: "pending" },
      { name: "Designing social media graphics", status: "pending" },
      { name: "Writing social media captions", status: "pending" },
    ],
    type: "content-creation",
  },
  {
    id: "target-audience",
    name: "Target Audience",
    description: "Define your target audience",
    icon: Target,
    subSteps: [
      { name: "Defining target audience", status: "pending" },
      { name: "Configuring target demographic", status: "pending" },
      { name: "Selecting relevant ad platforms", status: "pending" },
    ],
    type: "target-audience",
  },
  {
    id: "social-schedule",
    name: "Social Schedule",
    description: "Create posting schedule",
    icon: Calendar,
    subSteps: [
      { name: "Scheduling social media posts", status: "pending" },
      { name: "Publishing social media posts", status: "pending" },
    ],
    type: "social-schedule",
  },
  {
    id: "performance-tracking",
    name: "Performance Tracking",
    description: "Set up tracking metrics",
    icon: LineChart,
    subSteps: [
      { name: "Setting up tracking metrics", status: "pending" },
      { name: "Monitoring campaign performance", status: "pending" },
    ],
    type: "performance-tracking",
  },
  {
    id: "distribution",
    name: "Distribution",
    description: "Configure content distribution",
    icon: Share2,
    subSteps: [
      { name: "Configuring content distribution", status: "pending" },
      { name: "Publishing content", status: "pending" },
    ],
    type: "distribution",
  },
  {
    id: "settings",
    name: "Settings",
    description: "Configure workflow settings",
    icon: Settings,
    subSteps: [
      { name: "Configuring workflow settings", status: "pending" },
      { name: "Saving changes", status: "pending" },
    ],
    type: "settings",
  },
] as const;

const getThemeClasses = (theme: string) => {
  if (theme === "light") {
    return {
      background:
        "min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50",
      text: "text-gray-900",
      subText: "text-gray-600",
      card: "bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow",
      cardHeader: "bg-gray-50 border-b border-gray-200",
      cardTitle: "text-gray-900 font-semibold text-lg",
      cardDescription: "text-gray-600 mt-1",
      button: "bg-purple-600 hover:bg-purple-700 text-white shadow-sm",
      buttonOutline:
        "bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20",
      input:
        "bg-white border-gray-300 focus:border-purple-500 text-gray-900 placeholder:text-gray-500",
      textarea:
        "w-full px-3 py-2 bg-white border border-gray-300 focus:border-purple-500 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none rounded-md",
      select: "bg-white border-gray-300 text-gray-900",
      dialog: "bg-white shadow-lg",
      dialogHeader: "bg-gray-50 border-b border-gray-200",
      flowBackground: "bg-gray-50",
      nodeBackground: "bg-white",
      nodeBorder: "border-gray-300",
      nodeText: "text-gray-900",
      edgeStroke: "#4B5563",
      controlsBackground: "bg-white shadow-md border border-gray-200",
      controlsButton: "text-gray-700 hover:text-purple-600",
      statusBadge: {
        waiting: "bg-gray-100 text-gray-700",
        running: "bg-blue-100 text-blue-700",
        completed: "bg-green-100 text-green-700",
        error: "bg-red-100 text-red-700",
      },
      heading: "text-gray-900 font-semibold",
      link: "text-purple-600 hover:text-purple-700",
      progressBar: "bg-gray-200",
      progressBarFill: "bg-purple-600",
      breadcrumb:
        "text-gray-700 hover:text-purple-600 font-medium flex items-center",
      breadcrumbIcon: "text-gray-400",
      selectContent: "bg-white border-gray-200",
      selectItem:
        "bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200",
    };
  }
  return {
    background:
      "min-h-screen bg-gradient-to-b from-[#0F0720] via-[#1A0B2E] to-[#0F0720]",
    text: "text-purple-200",
    subText: "text-purple-300/70",
    card: "bg-[#1A0B2E] border border-purple-900 shadow-purple-900/20 hover:shadow-purple-900/30",
    cardHeader: "bg-transparent",
    cardTitle: "text-purple-200 font-semibold text-lg",
    cardDescription: "text-purple-300/70 mt-1",
    button: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/30",
    secondaryButton: "bg-purple-900/30 hover:bg-purple-900/50 text-purple-200",
    input:
      "bg-[#150923] border-purple-900 focus:border-purple-500 text-purple-200 placeholder:text-purple-400/50",
    textarea:
      "w-full px-3 py-2 bg-[#150923] border border-purple-900 focus:border-purple-500 text-purple-200 placeholder:text-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none rounded-md",
    select: "bg-[#150923] border-purple-900 text-purple-200",
    dialog: "bg-[#1A0B2E] shadow-purple-900/20",
    dialogHeader: "bg-[#150923] border-b border-purple-900/50",
    flowBackground: "bg-[#150923]",
    nodeBackground: "bg-[#1A0B2E]",
    nodeBorder: "border-purple-900",
    nodeText: "text-purple-200",
    edgeStroke: "#9333ea",
    controlsBackground:
      "bg-[#150923] shadow-purple-900/20 border border-purple-900/50",
    controlsButton: "text-purple-200 hover:text-purple-400",
    statusBadge: {
      waiting: "bg-purple-400/5 text-purple-400/50",
      running: "bg-purple-400/10 text-purple-400",
      completed: "bg-green-400/10 text-green-400",
      error: "bg-red-400/10 text-red-400",
    },
    heading: "text-purple-200 font-semibold",
    link: "text-purple-400 hover:text-purple-300",
    progressBar: "bg-purple-900/50",
    progressBarFill: "bg-purple-500",
    breadcrumb:
      "text-purple-200 hover:text-purple-300 font-medium flex items-center",
    breadcrumbIcon: "text-purple-300/60",
    selectContent: "bg-[#1A0B2E] border-purple-900/50",
    selectItem:
      "bg-[#2D1B69]/40 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20",
  };
};

type WorkflowStepStatus = "pending" | "running" | "completed" | "error";

interface WorkflowStep {
  name: string;
  status: WorkflowStepStatus;
  subSteps: { name: string; status: WorkflowStepStatus }[];
  type: string;
}

interface WorkflowCardProps {
  workflow: Workflow;
  // brandDetails: any;
  // campaignObjective: string;
  platforms: any;
  cGoal: string,
  cgUrl: string
  openDialog: (value: boolean) => void
  runFlow: boolean
  driveClickedArray: [{ file_id: number, signed_image_url: string }]
  createTemplate: boolean
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  activeInstances: number;
  successRate: number;
  completedCount: number;
  steps: WorkflowStep[];

}

const WorkflowCard = ({ workflow, platforms, cGoal, cgUrl, openDialog, runFlow, driveClickedArray, createTemplate }: WorkflowCardProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentSteps, setCurrentSteps] = useState<WorkflowStep[]>(
    workflow.steps
  );
  
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState<number | null>(
    null
  );
  const [isRunning, setIsRunning] = useState(false);
  const [nodePositions, setNodePositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  // const [timeLeft, setTimeLeft] = useState(10);
  // const [countdown, setCountdown] = useState<number>(30);
  // const [isPaused, setIsPaused] = useState<boolean>(false);
  // const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showAddStepDialog, setShowAddStepDialog] = useState(false);
  // campaign publish button - confirm & launch

  // Add state for approval feedback
  const [showApprovalFeedback, setShowApprovalFeedback] =
    useState<boolean>(false);
  const [approvedStep, setApprovedStep] = useState<number | null>(null);

  // Add state for workflow pausing
  const [isWaitingForApproval, setIsWaitingForApproval] =
    useState<boolean>(false);

  const [campaignRequestId, setCampaignRequestId] = useState<string>("");
  const [isEntryEditing, setIsEntryEditing] = useState('')
  // Status fethching Delay 
  const [cgdelayEnabled, setCgDelayEnabled] = useState(false);
  const [crdelayEnabled, setCrDelayEnabled] = useState(false);
  const [ctdelayEnabled, setCtDelayEnabled] = useState(false);
  const [targetNameErr, setTargetNameErr] = useState(false);
  // Gen template 
  const [genTemplates, setGenTemplates] = useState([]);
  const [cgLaunched, setCgLaunched] = useState(false);
  const queryClient = useQueryClient();
  //data validation 
  const [dataError, setDataError] = useState('');
  const [publish, setPublish] = useState(false)

  // React.useEffect(() => {
  //   if (isReviewDialogOpen && !isPaused && countdown > 0) {
  //     timerRef.current = setInterval(() => {
  //       setCountdown((prev) => {
  //         if (prev <= 1) {
  //           clearInterval(timerRef.current!);
  //           handlePublishCampaign();
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);
  //   }
  //   return () => {
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //     }
  //   };
  // }, [isReviewDialogOpen, isPaused, countdown]);


  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>();

  const [campaignConfig, setCampaignConfig] = useState<CampaignConfig>({
    name: "Sample Campaign",
    brandPersona: "Professional and Innovative",
    targetDemographic: {
      ageRange: { min: 18, max: 65 },
      gender: ["male", "female"],
      locations: ["New York", "Los Angeles", "Chicago"],
    },
    // channel_budget_allocation: {
    //   meta: { selected: true, budget: 40 },
    //   google: { selected: true, budget: 35 },
    //   linkedin: { selected: true, budget: 25 },
    // },
    channel_budget_allocation: {
      meta: 40,
      google: 35,
      linkedin: 25,
    },
    budget: {
      total: 1000,
      currency: "USD",
    },
    dates: {
      start: new Date().toISOString().split("T")[0],
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  });

  const handleAddStep = (stepType: StepType) => {
    const newStep: WorkflowStep = {
      name: stepType.name,
      status: "pending" as WorkflowStepStatus,
      subSteps: stepType.subSteps.map((step) => ({
        ...step,
        status: "pending" as WorkflowStepStatus,
      })),
      type: stepType.type,
    };
    setCurrentSteps([...currentSteps, newStep]);
    setShowAddStepDialog(false);
  };

  // Initialize steps from workflow prop
  React.useEffect(() => {
    if (workflow.steps) {
      setCurrentSteps(workflow.steps);
    }
  }, [workflow.steps]);

  // Initialize node positions if not set
  React.useEffect(() => {
    const spacing = 250; // Increased spacing between nodes
    const startY = 100; // Starting Y position
    const initialPositions: { [key: string]: { x: number; y: number } } = {};
    currentSteps.forEach((_, index) => {
      if (!nodePositions[index]) {
        initialPositions[index] = { x: spacing * index, y: startY };
      }
    });
    if (Object.keys(initialPositions).length > 0) {
      setNodePositions((prev) => ({ ...prev, ...initialPositions }));
    }
  }, [currentSteps.length]);

  // Calculate zoom level based on number of steps
  const calculateZoom = (numSteps: number) => {
    // Base zoom levels
    if (numSteps <= 3) return 0.9;
    if (numSteps <= 5) return 0.75;
    if (numSteps <= 7) return 0.6;
    return 0.5;
  };

  // Create flow nodes and edges based on workflow steps
  const getFlowElements = React.useCallback(() => {
    const nodes: Node[] = currentSteps.map((step, index) => ({
      id: `${index}`,
      type: "custom",
      position: nodePositions[index] || { x: 250 * index, y: 100 },
      data: {
        label: step.name,
        status:
          step.status === "pending"
            ? "waiting"
            : step.status === "completed"
              ? "completed"
              : step.status === "error"
                ? "error"
                : "running",
        type:
          index === 0
            ? "start"
            : index === currentSteps.length - 1
              ? "end"
              : "process",
        onDelete: (id: string) => {
          const nodeIndex = parseInt(id);
          if (!isRunning) {
            const newSteps = [...currentSteps];
            newSteps.splice(nodeIndex, 1);
            setCurrentSteps(newSteps);

            // Clear the position of the deleted node
            setNodePositions((prev) => {
              const newPositions = { ...prev };
              delete newPositions[id];
              // Shift remaining positions
              for (let i = nodeIndex + 1; i < currentSteps.length; i++) {
                if (newPositions[i]) {
                  newPositions[i - 1] = newPositions[i];
                  delete newPositions[i];
                }
              }
              return newPositions;
            });

            // Remove edges connected to the deleted node
            setEdges((prev) =>
              prev.filter((edge) => edge.source !== id && edge.target !== id)
            );
            setSelectedEdge(null);
          }
        },
      },
      draggable: true,
    }));

    return { nodes };
  }, [currentSteps, nodePositions, isRunning]);

  const { nodes } = getFlowElements();

  // Initialize edges when steps change
  React.useEffect(() => {
    // Create default sequential connections
    const defaultEdges: Edge[] = currentSteps.slice(0, -1).map((_, index) => ({
      id: `e${index}-${index + 1}`,
      source: `${index}`,
      target: `${index + 1}`,
      type: "bezier",
      animated: currentSteps[index].status === "running",
      style: {
        stroke:
          theme === "light"
            ? "#6B7280"
            : currentSteps[index].status === "completed"
              ? "#9333ea"
              : currentSteps[index].status === "running"
                ? "#7e22ce"
                : "#a855f7",
        strokeWidth: 1.5,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color:
          theme === "light"
            ? "#6B7280"
            : currentSteps[index].status === "completed"
              ? "#9333ea"
              : currentSteps[index].status === "running"
                ? "#7e22ce"
                : "#a855f7",
        width: 20,
        height: 20,
      },
    }));

    // Keep any custom edges that don't conflict with default edges
    const customEdges = edges.filter(
      (edge) =>
        !defaultEdges.some(
          (defaultEdge) =>
            defaultEdge.source === edge.source &&
            defaultEdge.target === edge.target
        )
    );

    setEdges([...defaultEdges, ...customEdges]);
  }, [currentSteps]);



  // const brandInfo = brandDetails[0] ?? {};
  const [accountIds, setAccountIds] = useState(["5225726401", "2156545051397647"]);
  const [cgStatus, setCgStatus] = useState('');
  const [crStatus, setCrStatus] = useState('');
  const [stopCgCall, setStopCgCall] = useState(false)
  const [stopCrCall, setStopCrCall] = useState(false)
  const [stopReqCr, setStopReqCr] = useState(false)
  const [intAdPlatforms, setIntAdPlatforms] = useState([])


  const mutateRequestCampaignPlan = useMutation({
    mutationKey: ["request-campaign-plan"],
    mutationFn: analyticsApi.requestCampaignPlan, // Ensure filters are passed
  });

  // Handle running workflow
  const runWorkflow = React.useCallback(() => {
    if (!cgUrl || !cGoal) {
      openDialog(true)
    }
    if (!currentSteps.length || isRunning) return;
    setIsRunning(true);
    setCurrentStepIndex(0);
    setCurrentSubStepIndex(0);

    // Reset all steps to pending
    setCurrentSteps((steps) =>
      steps.map((step) => ({
        ...step,
        status: "pending" as const,
        subSteps: step.subSteps.map((subStep) => ({
          ...subStep,
          status: "pending" as const,
        })),
      }))
    );


    const reqPlanPlayload = {
      account_ids: ["5225726401", "2156545051397647"],
      brand_description: `Trent Limited, part of the Tata Group, is a leading Indian retailer in fashion and lifestyle. **Mission:To build fresh, responsible brands that bring joy to all. **Vision:** To touch lives across choice markets with a portfolio of fashion and lifestyle brands. **Tagline:** "Designing the Future Responsibly." **Voice & Tone:** Professional and innovative, adapting to context with warmth and clarity. **Messaging Pillars:** Customer-centricity, sustainability, innovation, quality, and affordability. **Story:** Founded in 1952 as Lakme Limited, transitioned to apparel retailing in 1998, becoming Trent Limited. **Personality Traits:** Innovative, responsible, customer-focused, quality-driven, and sustainable. **Differentiators:** In-house designed brands, commitment to sustainability, and a strong Tata Group heritage.`,
      brand_name: "Trent Limited",
      campaign_objective: "Leads Generation",
      integrated_ad_platforms: ["Meta", "Google"],
      product_description: "",
      product_name: "Trent Limited",
      website: "www.trentlimited.com",
    };

    if (accountIds?.length === 0) {
      toast.error(
        <>
          <span className="text-red-500 text-[16px] leading-[20px]">
            {" "}
            Error!
          </span>
          <br />
          <span className="text-sm font-semibold leading-[18px] truncate2lines mt-2">
            {" "}
            No account Ids are found!
          </span>
        </>,
        { autoClose: 5000 }
      );
      return;
    }
    // get **request_id Id By Request Campaign 
    accountIds?.length && mutateRequestCampaignPlan.mutate(reqPlanPlayload, {
      onSuccess: (response: any) => {
        setCampaignRequestId(response?.request_id);
      },
      onError: (res: any) => {
        console.log(res, "Error - Request Campaign Plan");
      },
    });

  }, [currentSteps.length, isRunning]);


  useEffect(() => {
    if (runFlow) {
      runWorkflow();
    }
  }, [runFlow]);

  // Delay in status checking 
  useEffect(() => {
    if (campaignRequestId && cgStatus === '') {
      const timeout = setTimeout(() => {
        setCgDelayEnabled(true);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [campaignRequestId, cgStatus]);


  const { data: campaignPlanStatus } = useQuery({
    queryKey: ["get-campaign-status"],
    queryFn: () => analyticsApi.getCampaignPlanStatus(campaignRequestId),
    enabled: cgdelayEnabled,
    refetchInterval: !!campaignRequestId && stopCgCall === false && cgStatus === '' ? 3000 : false,
  });

  // get Campaign plan 
  const { data: campaignData } = useQuery({
    queryKey: ["get-campaign-data"],
    queryFn: () => analyticsApi.getCampaignPlanData(campaignRequestId!),
    enabled: !!campaignRequestId && cgStatus == 'COMPLETE',
    refetchInterval: !!campaignRequestId && cgStatus == 'COMPLETE' && stopCgCall === false ? 3000 : false,
  });


  // Creatives 
  const { data: reqCreativePlanData, refetch } = useQuery({
    queryKey: ["get-creative-request"],
    queryFn: () => {
      const transformedData: Omit<typeof campaignData, 'campaign_objective' | 'brand_description'> = {
        ...campaignData,
        user_prompt: cGoal,
        campaign_objective: "Leads Generation",
        brand_description: "Top 3 quick delivery service startup",
      };
      return analyticsApi.requestCreativePlan(transformedData);
    },
    enabled: !!campaignData && stopReqCr === false && !driveClickedArray.length,
    refetchInterval: !!campaignData && cgStatus == 'COMPLETE' && stopReqCr === false ? 3000 : false,
  });


  // Delay in creative status checking 
  useEffect(() => {
    if (reqCreativePlanData?.request_id && crStatus === '') {
      const timeout = setTimeout(() => {
        setCrDelayEnabled(true);
      }, 6000);

      return () => clearTimeout(timeout);
    }
  }, [reqCreativePlanData?.request_id, crStatus]);


  // Status Creative Plan 
  const { data: statusCreativePlan } = useQuery({
    queryKey: ["get-creative-status"],
    queryFn: () => analyticsApi.getCampaignCreativesStatus(reqCreativePlanData?.request_id),
    enabled: crdelayEnabled,
    refetchInterval: !!reqCreativePlanData?.request_id && stopCrCall === false && crStatus == '' ? 4000 : false,
  });

  // get Creative Plan 
  const { data: getCampaignCreatives } = useQuery({
    queryKey: ["get-creatives"],
    queryFn: () => analyticsApi.getCampaignCreatives(reqCreativePlanData?.request_id!),
    enabled: !!reqCreativePlanData?.request_id && crStatus == 'COMPLETE',
    refetchInterval: !!reqCreativePlanData?.request_id && stopCrCall === false && crStatus == 'COMPLETE' ? 4000 : false,
  });



  const getTempGenRes = async (req_id: string) => {
    const url = `https://nyx-ai-api.dev.nyx.today/nyx-creative-agent/nyx-agents/nyx-template-agent/get_template_result/${req_id}`;
    const res = await fetch(url)
    // if(res.status===500){
    //    ToastMsg("Error While Generating Templates. Try Again", 'error')
    //    return 
    // }
    const data = await res.json();
    if (data.signed_url) {
      setGenTemplates(prev => [
        ...prev,
        data.signed_url
      ]);
    } else {
      setTimeout(() => {
        getTempGenRes(req_id)
      }, 2000);
    }
  }

  const [tempGenStatus, setTempGenStatus] = useState('');
  // Generate Template for Creatives ******
  const getTempGenStatus = async (req_id: string) => {
    if (req_id) {
      const url = `https://nyx-ai-api.dev.nyx.today/nyx-creative-agent/nyx-agents/nyx-template-agent/status_template_generation/${req_id}`;
      const res = await fetch(url)
      const data = await res.json();
      setTempGenStatus(data?.processing_status);
      if (data.processing_status === 'COMPLETE') {
        setTimeout(() => {
          getTempGenRes(req_id)
        }, 2000);
      } else {
        setTimeout(() => {
          getTempGenStatus(req_id)
        }, 2000);
      }
    } else {
      return 'No request id found..!'
    }
  }


  const reqPlayloadForTemplate = {
    account_ids: ["5225726401", "2156545051397647"],
    brand_description: `Trent Limited, part of the Tata Group, is a leading Indian retailer in fashion and lifestyle. **Mission:To build fresh, responsible brands that bring joy to all. **Vision:** To touch lives across choice markets with a portfolio of fashion and lifestyle brands. **Tagline:** "Designing the Future Responsibly." **Voice & Tone:** Professional and innovative, adapting to context with warmth and clarity. **Messaging Pillars:** Customer-centricity, sustainability, innovation, quality, and affordability. **Story:** Founded in 1952 as Lakme Limited, transitioned to apparel retailing in 1998, becoming Trent Limited. **Personality Traits:** Innovative, responsible, customer-focused, quality-driven, and sustainable. **Differentiators:** In-house designed brands, commitment to sustainability, and a strong Tata Group heritage.`,
    brand_name: "Trent Limited",
    campaign_objective: "Leads Generation",
    integrated_ad_platforms: ["Meta", "Google"],
    product_description: "",
    product_name: "Trent Limited",
    website: "www.trentlimited.com",
  };


  useEffect(() => {
    if (campaignData && createTemplate) {
      const genTemp = async (img: string) => {
        const transformedData: Omit<typeof campaignData, 'website' | 'brand_description'> = {
          ...campaignData,
          locations: locations,
          website: reqPlayloadForTemplate?.website ?? '',
          campaign_objective: reqPlayloadForTemplate?.campaign_objective ?? '',
          brand_description: reqPlayloadForTemplate?.brand_description ?? '',
          user_prompt: cGoal,
        };

        const payload = {
          hero_image_url: img,
          prompt: transformedData,
        }

        const url = `https://nyx-ai-api.dev.nyx.today/nyx-creative-agent/nyx-agents/nyx-template-agent/request_template_generation`
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        const data = await res.json();
        if (data.request_id) {
          getTempGenStatus(data.request_id as string)
        }
      }
      driveClickedArray.forEach((item, index) => {
        setTimeout(() => {
          genTemp(item.signed_image_url);
        }, 2000 * index);
      });
    }
  }, [campaignData, createTemplate])


  // Regenerating Creative 
  const regenCreative = () => {
    queryClient.setQueryData(
      ["get-creative-status"],
      { processing_status: "BUILDING", processing_node: "prompt_generator" }
    );
    setCurrentStepIndex(1)
    currentSteps[currentStepIndex].status = "pending";
    currentSteps[currentStepIndex]?.subSteps.map(subStep => {
      subStep.status === "running";
    })
    refetch();
    setStopCrCall(false)
    setCrStatus('')
    setSignedUrl('');
  }


  // Get Headlines Recommedations 
  useEffect(() => {
    const headRecomPayload = {
      campaign: {
        name: campaignData?.campaign_name ?? '',
        objective: "Leads Generation",
        ad_platform: intAdPlatforms,
        brand: {
          id: 1217,
          brand_name: "Trent Limited",
          cat_name: 'Retail and E-commerce',
          brand_logos: [""],
          description: `Trent Limited, part of the Tata Group, is a leading Indian retailer in fashion and lifestyle. **Mission:To build fresh, responsible brands that bring joy to all. **Vision:** To touch lives across choice markets with a portfolio of fashion and lifestyle brands. **Tagline:** "Designing the Future Responsibly." **Voice & Tone:** Professional and innovative, adapting to context with warmth and clarity. **Messaging Pillars:** Customer-centricity, sustainability, innovation, quality, and affordability. **Story:** Founded in 1952 as Lakme Limited, transitioned to apparel retailing in 1998, becoming Trent Limited. **Personality Traits:** Innovative, responsible, customer-focused, quality-driven, and sustainable. **Differentiators:** In-house designed brands, commitment to sustainability, and a strong Tata Group heritage.`
        }
      },
      product: [],
      targetGroup: []
    }
    if (campaignData && (getCampaignCreatives || genTemplates.length || createTemplate === false)) {
      const fetchHeadlinesRecommendation = async () => {
        const url = "https://nyx-ai-api.dev.nyx.today/nyx-ad-recommendation/get_headline_recomm/";
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(headRecomPayload),
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json();
        if (data.error) {
          // console.log("Got Error in Headlines- refetching.")
          fetchHeadlinesRecommendation();
        } else {
          // console.log(data, "Headlines Data")
          setGeneratedContent(data);
        }
      }
      fetchHeadlinesRecommendation();
    }
  }, [campaignData, getCampaignCreatives, genTemplates.length])



  // Stop Checking status 
  useEffect(() => {
    campaignPlanStatus?.processing_status === "COMPLETE" && setCgStatus("COMPLETE");
  }, [campaignPlanStatus]);

  // Stop campaign call 
  useEffect(() => {
    campaignData && setStopCgCall(true);
    if (campaignData && !campaignData?.campaign_name) {
      toast.error(
        <>
          <span className="text-red-500 text-[16px] leading-[20px]">
            {" "}
            Error!
          </span>
          <br />
          <span className="text-sm font-semibold leading-[18px] truncate2lines mt-2">
            {" "}
            Campaign Data Fetch Failed. Try Reloading The Page!
          </span>
        </>,
        { autoClose: 5000 }
      );
      return;
    }

  }, [campaignData]);


  useEffect(() => {
    reqCreativePlanData?.request_id && setStopReqCr(true)
  }, [reqCreativePlanData]);

  useEffect(() => {
    statusCreativePlan?.processing_status == "COMPLETE" && setCrStatus('COMPLETE')
  }, [statusCreativePlan])

  useEffect(() => {
    getCampaignCreatives && setStopCrCall(true);
  }, [getCampaignCreatives]);



  // Getting steps from status - For Campaing and creatives 
  useEffect(() => {
    setCurrentSteps((prevSteps) =>
      prevSteps.map((step, index) => {
        let statusObj = null;
        // Apply campaign status any time
        if (step.type === "campaign-planning" && currentStepIndex === 0) {
          statusObj = campaignPlanStatus;
        }
        else if (step.type === "creative-selection" && currentStepIndex == 1) {
          statusObj = statusCreativePlan;
        }

        if (step.type === "ad-copy" && generatedContent) {
          return {
            ...step,
            subSteps: step.subSteps.map((s) => ({ ...s, status: "completed" })),
            status: "completed",
          };
        }
        // Gen Templates 
        if (step.type === "template-generation" && genTemplates.length > 0) {
          return {
            ...step,
            subSteps: step.subSteps.map((s) => ({ ...s, status: "completed" })),
            status: "completed",
          };
        }

        // Selected Creatives - no generation 
        if (step.type === "selected-creatives") {
          return {
            ...step,
            subSteps: step.subSteps.map((s) => ({ ...s, status: "completed" })),
            status: "completed",
          };
        }

        if (!statusObj) return step;

        if (statusObj.processing_status === "COMPLETE") {
          return {
            ...step,
            subSteps: step.subSteps.map((s) => ({ ...s, status: "completed" })),
            status: "completed",
          };
        }

        const currentIndex = step.subSteps.findIndex(
          (subStep) => subStep.name === statusObj.processing_node
        );

        return {
          ...step,
          subSteps: step.subSteps.map((subStep, i) => ({
            ...subStep,
            status: i < currentIndex ? "completed" : "pending",
          })),
          status:
            currentIndex === step.subSteps.length - 1
              ? "completed"
              : step.status,
        };
      })
    );
  }, [campaignPlanStatus, statusCreativePlan, currentStepIndex, generatedContent, genTemplates]);


  const isAproveBtnDissable = (csi: number) => {
    // csi => current step index 
    if (csi === 0 && campaignData) return false;
    if (csi === 1 && (signedUrl || genTemplates)) return false;
    if (csi >= 2) return false;
    return true
  }

  const CircularTimer = ({ timeLeft }: { timeLeft: number }) => {
    const circumference = 2 * Math.PI * 18; // radius = 18
    const strokeDashoffset = ((10 - timeLeft) / 10) * circumference;

    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="transform -rotate-90 w-12 h-12">
          <circle
            cx="24"
            cy="24"
            r="18"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-purple-500/20"
          />
          <circle
            cx="24"
            cy="24"
            r="18"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-purple-500 transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute text-sm font-medium text-purple-200">
          {timeLeft}
        </span>
      </div>
    );
  };

  const getFunctionDescription = (subStepName: any) => {
    const descriptions = {
      // campaign 
      brand_industry_classifier: "Profiling Brand and Industry",
      audience_segment_analyzer: "Analyzing Optimal Audience Segments",
      ad_channel_recommender: "Determining the best Ad Channels",
      campaign_schedule_recommender: "Planning Campaign Schedule",
      marketing_budget_allocator: "Allocating Marketing Budget",
      campaign_name_generator: "Generating Campaign Name",
      // creative 
      prompt_generator: "Writing prompts for Static Ads",
      image_generator: "Generating Static Ads",
      image_analyzer: "Predicting CTR of ads",
      mask_generator: "Generating Content for CTAs",
      cta_generator: "Implementing Changes",
      text_layering: "Finishing Touches",
      //template
      content_generation: "Generating Content",
      environment_setup: "Setting Up Templates",
      image_processor: "Processing Images",
      input_validator: "Analyzing CTR",
      logo_processor: "Implementing Content changes",
      template_renderer: "Rendering Final Results",
      // no template
      selected_creatives: "Selected Creatives",
    };

    return descriptions[subStepName] || subStepName;
  };


  // ** Edit Target Demographic Entries -> agegoup, location, schedule, Gender 

  // pencil icon SVG for edit entries 
  type EditEntryTypes = {
    onClick: () => void;
  };

  const PenciIcon = ({ onClick }: EditEntryTypes) => {
    return (
      <svg
        onClick={onClick}
        className="flex-shrink-0 cursor-pointer"
        xmlns="http://www.w3.org/2000/svg"
        width="16" height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    )
  }

  type InputProps = {
    name: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string; // <- required for controlled input
  };


  function mergeAgeRange(ageString: string): string {
    if (!ageString) return '';

    // Handle "All" case (case-insensitive)
    if (ageString.trim().toLowerCase() === 'all' || ageString.trim() === '65+') {
      return '18-65';
    }

    const parts = ageString.split(',').map(p => p.trim());
    let min = Infinity;
    let max = -Infinity;

    parts.forEach(part => {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = Number(startStr);
        const end = Number(endStr);
        if (!isNaN(start) && start < min) min = start;
        if (!isNaN(end) && end > max) max = end;
      } else {
        const num = Number(part);
        if (!isNaN(num)) {
          if (num < min) min = num;
          if (num > max) max = num;
        }
      }
    });

    if (min !== Infinity && max !== -Infinity) {
      return `${min}-${max}`;
    }

    return ''; // fallback for invalid input
  }


  const inputStyle = `p-1 px-2 bg-[#200f40] outline-none rounded border border-[#36225b]`
  const selectInputStyle = `p-1 px-2 w-[120px] bg-[#200f40] outline-none rounded border border-[#36225b]`

  // Setting up Entries fetched from AI 
  const [fromAge, setFromAge] = useState<number>(0);
  const [toAge, setToAge] = useState<number>(0);
  const [fromSchedule, setFromSchedule] = useState('');
  const [toSchedule, setToSchedule] = useState("");
  const [locations, setLocations] = useState([]);
  const [gender, setGender] = useState('');
  const [adPlatformBudgets, setAdPlatformBudgets] = useState({ meta: 0, google: 0, linkedin: 0 });
  const [total_budget, setTotalBudget] = useState<Number>();
  // Generatied creative image url 
  const [signedUrl, setSignedUrl] = useState('');
  // const [inputLocationValue, setInputLocationValue] = useState<string>('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBSFMQBxQq-xldlXEHVaVcXF7twGIBbyvg",
    libraries: ["places"],
  });

  // Date Format 
  const toInputFormat = (dateStr: string) => {
    const [dd, mm, yyyy] = dateStr.split('-');
    return `${yyyy}-${mm}-${dd}`;
  };

  const toDisplayFormat = (isoStr: string) => {
    const [yyyy, mm, dd] = isoStr.split('-');
    return `${dd}-${mm}-${yyyy}`;
  };

  const parseDate = (dateStr: string) => {
    const [dd, mm, yyyy] = dateStr.split('-');
    return new Date(`${yyyy}-${mm}-${dd}`);
  };



  const removeItem = (indexToRemove) => {
    const newArray = locations.filter((_, index) => index !== indexToRemove);
    setLocations(newArray);
  };


  useEffect(() => {
    if (campaignData) {
      setFromAge(Number(mergeAgeRange(campaignData?.age_group).split('-')[0]))
      setToAge(Number(mergeAgeRange(campaignData?.age_group).split('-')[1]))
      setFromSchedule(campaignData?.campaign_start_date)
      setToSchedule(campaignData?.campaign_end_date)
      setLocations(campaignData?.locations)
      setGender(campaignData?.gender)
      setAdPlatformBudgets(campaignData?.channel_budget_allocation)
    }
  }, [campaignData])

  useEffect(() => {
    if (getCampaignCreatives) {
      setSignedUrl(getCampaignCreatives.signed_url);
    }
  }, [getCampaignCreatives]);


  useEffect(() => {
    if (adPlatformBudgets) {
      const total_budget = Object.values(adPlatformBudgets).reduce(
        (sum, value) => sum + (value as number),
        0
      );
      setTotalBudget(total_budget)
    }
  }, [adPlatformBudgets])


  const addBudget = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;

    setAdPlatformBudgets((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const refs = {
    ageGroup: useRef<HTMLDivElement | null>(null),
    gender: useRef<HTMLDivElement | null>(null),
    loc: useRef<HTMLDivElement | null>(null),
    schedule: useRef<HTMLDivElement | null>(null),
    fromSchdl: useRef<HTMLDivElement | null>(null),
    toSchdl: useRef<HTMLDivElement | null>(null),
    meta: useRef<HTMLDivElement | null>(null),
    google: useRef<HTMLDivElement | null>(null),
    linkedin: useRef<HTMLDivElement | null>(null),
    head0: useRef<HTMLDivElement | null>(null),
    head1: useRef<HTMLDivElement | null>(null),
    head2: useRef<HTMLDivElement | null>(null),
    desc: useRef<HTMLDivElement | null>(null),
    desc0: useRef<HTMLDivElement | null>(null),
    desc1: useRef<HTMLDivElement | null>(null),
    desc2: useRef<HTMLDivElement | null>(null),
    cap0: useRef<HTMLDivElement | null>(null),
    cap1: useRef<HTMLDivElement | null>(null),
    cap2: useRef<HTMLDivElement | null>(null),
  };

  // This useeffect is for closing inputs if click outside of it - Target Demographics
  useEffect(() => {
    const handleOutSideClick = (e: MouseEvent) => {
      if (!isEntryEditing) return;
      const activeRef = refs[isEntryEditing as keyof typeof refs];
      if (activeRef?.current && e.target instanceof HTMLElement && !activeRef.current.contains(e.target)) {
        setIsEntryEditing('');
      }
    }
    window.addEventListener('mousedown', handleOutSideClick)
    return () => {
      window.removeEventListener('mousedown', handleOutSideClick)
    }
  }, [isEntryEditing])


  //  msg- message 
  //  type- success or error 
  const ToastMsg = (msg: string, type: string) => {
    if (type === 'error') {
      toast.error(
        <>
          <span className="text-red-500 text-[16px] leading-[20px]">
            {" "}
            Error!
          </span>
          <br />
          <span className="text-white text-[12px] leading-[18px] truncate2lines mt-2">
            {" "}
            {msg}!
          </span>
        </>,
        { autoClose: 5000 }
      );
      return;
    }
    if (type === "success") {
      toast.success(
        <>
          <span className="text-green-600 text-[16px] leading-[20px]">
            {" "}
            Campaign created successfully!
          </span>
          <br />
          <span className="text-white text-[12px] leading-[18px] truncate2lines mt-2">
            {" "}
            {msg}
          </span>
        </>,
        { autoClose: 5000 }
      );
    }
  }


  interface DotLoaderProps {
    text: string;
  }
  const DotLoader: React.FC<DotLoaderProps> = ({ text }: { text: string }) => {
    return (
      <>
        <p style={{ color: 'white', fontWeight: 500, position: 'relative', display: 'inline-block' }}>
          {text}
          <span className="dot-loader" />
        </p>

        <style>
          {`
          .dot-loader::after {
            content: '.';
            animation: dots 1.5s steps(4, end) infinite;
            margin-left: 4px;
            white-space: pre;
          }

          @keyframes dots {
            0%   { content: '.'; }
            25%  { content: '..'; }
            50%  { content: '...'; }
            75%  { content: ''; }
            100% { content: '.'; }
          }
        `}
        </style>
      </>
    );
  };


  const [showModal, setShowModal] = useState(false);
  const [fullScreenImg, setFullScreenImg] = useState('');

  const handleImageClick = (imgurl: string) => {
    setShowModal(true);
    setFullScreenImg(imgurl)
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const [headlineError, setHeadlineError] = useState<number[]>([]);
  const [descError, setDescError] = useState<number[]>([]);
  const [capError, setCapError] = useState<number[]>([]);


  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";

    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [a, b, c] = parts;
      if (/^\d+$/.test(a) && /^\d+$/.test(b) && /^\d+$/.test(c)) {
        if (a.length === 4) {
          // yyyy-mm-dd
          return `${c}-${b}-${a}`;
        } else if (c.length === 4) {
          // dd-mm-yyyy
          return dateStr; // already formatted
        }
      }
    }

    return dateStr; // not matching pattern
  };

  const parseDMY = (dateStr: string) => {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  // Data Validation 
  const DataValidation = (stepIndex: number) => {
    if (stepIndex == 0 || stepIndex > 2) { // > 2 is for publish campaign 
      if (fromAge > toAge) {
        setDataError('age');
        return false;
      } else {
        if (parseDMY(fromSchedule) > parseDMY(toSchedule)) {
          setDataError('schedule');
          return false;
        } else {
          if (!(locations?.length > 0)) {
            setDataError('location');
            return false;
          } else {
            setDataError('');
            return true;
          }
        }
      }
    }
    if (stepIndex == 2 || stepIndex > 2) { // > 2 is for publish campaign 
      if (headlineError.length) {
        setDataError('headline');
        return false;
      } else {
        if (descError.length) {
          setDataError('desc');
          return false;
        } else {
          if (capError.length) {
            setDataError('cap');
            return false;
          } else {
            setDataError('');
            return true;
          }
        }
      }
    }
  }


  // Approve & continue Button function 
  const handleApproveAndContinue = React.useCallback((stepIndex: number) => {
    const isValidData = DataValidation(stepIndex)
    if (isValidData === false) return false;
    console.log(
      `Approving step ${stepIndex} and continuing to step ${stepIndex + 1}`
    );
    if (stepIndex === 2) {
      setIsReviewDialogOpen(true);
      return; // Don't continue until user reviews and approves
    } else {
      // Show feedback animation
      setApprovedStep(stepIndex);
      setShowApprovalFeedback(true);
      setIsWaitingForApproval(false);
      // Ensure the current step is marked as completed
      setCurrentSteps((steps) => {
        const updatedSteps = steps.map((step, sIndex) => ({
          ...step,
          status:
            sIndex <= stepIndex ? ("completed" as const) : ("pending" as const),
          subSteps: step.subSteps.map((subStep) => ({
            ...subStep,
            status:
              sIndex <= stepIndex
                ? ("completed" as const)
                : ("pending" as const),
          })),
        }));
        return updatedSteps;
      });
      // Move to the next step after a short delay to show completion
      setTimeout(() => {
        setShowApprovalFeedback(false);

        // Only move to the next step if we're not at the end
        if (stepIndex < currentSteps.length - 1) {
          setCurrentStepIndex(stepIndex + 1);
          setCurrentSubStepIndex(0);
          // handleSubStep(stepIndex + 1, 0);
        }
      }, 1000);
    }
  },
    [currentSteps.length, campaignData, fromAge, toAge, locations, fromSchedule, toSchedule, headlineError, descError, capError]
  );


  // Launch Campaign 
  const handlePublishCampaign = async () => {
    const isValidData = DataValidation(3)
    if (isValidData === false) return false;
    setPublish(true)
    const fileDetails = [];
    signedUrl && fileDetails.push({
      url: signedUrl,
      type: "external",
      file_id: null,
    })
    genTemplates?.map(item => {
      fileDetails.push({
        url: item,
        type: "external",
        file_id: item.file_id,
      })
    })

    const payload = {
      // campaign_objective: cgObjective?.campaign_objective ?? 'Traffic',
      // brand_description: brandInfo?.description ?? '',
      brand_name: "Zepto",
      brandId: 1217,
      industry: "",
      product_description: campaignData?.product_description ?? "",
      product_name: campaignData?.product_name ?? "",
      psychographic_traits: [""],
      integrated_ad_platforms: campaignData?.integrated_ad_platforms.length > 0 ? campaignData?.integrated_ad_platforms.map((item: string) => item.toLowerCase()) : ["google", "linkedin", "meta"],
      recommended_ad_platforms: campaignData?.recommended_ad_platforms?.map((item: string) => item.toLowerCase()) ?? [""],
      workspace_id: Number(localStorage.getItem('workspace_id')),
      campaign_name: campaignData?.campaign_name ?? "",
      campaign_start_date: formatDate(fromSchedule) ?? "",
      campaign_end_date: formatDate(toSchedule) ?? "",
      // totalDailybudget: campaignData?.total_budget ?? 0,
      totalDailybudget: Object.values(campaignData?.channel_budget_allocation).reduce((sum: number, value: number) => sum + value, 0) ?? 0,
      dailyBudget: Object.fromEntries(Object.entries(campaignData?.channel_budget_allocation).map(([key, value]) => [key.toLowerCase(), value])
      ) ?? {},
      targeting: [
        {
          age_group: `${fromAge}-${toAge}`,
          gender: gender ?? '',
          interests: [],
          locations: locations,
          ads_content: [
            {
              headings: generatedContent?.headlines,
              descriptions: generatedContent?.descriptions,
              captions: generatedContent?.captions,
              file_details: fileDetails
            }
          ]
        }
      ]
    }

    if (campaignData && cgLaunched === false) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APT_URL_V3}/admanager/create-agentic-campaign`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': localStorage.getItem('token') as string,
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json();
      if (data.status === 'error') {
        ToastMsg(data.message, 'error')
      } else {
        setCgLaunched(true)
        ToastMsg(data.message, 'success')
        setIsReviewDialogOpen(false);
        // navigate("/campaigns");
        const ws = localStorage.getItem("workspace_name")
        window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/apphome/${ws}/admanager/dashboard?view=campaigns`
      }
    } else {
      ToastMsg('No Campaign Data', 'error')
    }
  };

  const publishCampaign = async () => {
      const campaignNames = JSON.parse(localStorage.getItem('campaign_names') || '[]');
      campaignNames.push(campaignData?.campaign_name)
      localStorage.setItem('campaign_names', JSON.stringify(campaignNames))
      window.location.href = '/campaigns'
  }


  return (
    <>
      <Card className={getThemeClasses(theme).card}>
        <CardHeader className={getThemeClasses(theme).cardHeader}>
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <CardTitle className={getThemeClasses(theme).cardTitle}>
                {workflow.name}
              </CardTitle>
              <div className={getThemeClasses(theme).cardDescription}>
                {workflow.description}
              </div>
            </div>
            {/* Metrics moved to top right, made smaller */}
            {/* <div className="flex space-x-4 text-right">
              <div className="space-y-0.5">
                <div className={getThemeClasses(theme).subText}>Active</div>
                <div
                  className={`${getThemeClasses(theme).text
                    } flex justify-center`}
                >
                  {workflow.activeInstances}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className={getThemeClasses(theme).subText}>Success</div>
                <div
                  className={`${getThemeClasses(theme).text
                    } flex justify-center`}
                >
                  {workflow.successRate}%
                </div>
              </div>
              <div className="space-y-0.5">
                <div className={getThemeClasses(theme).subText}>Done</div>
                <div
                  className={`${getThemeClasses(theme).text
                    } flex justify-center`}
                >
                  {workflow.completedCount}
                </div>
              </div>
            </div> */}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <span className={getThemeClasses(theme).text}>
                  Workflow Diagram
                </span>
              </div>
              {/* <Button
                variant="outline"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-4 glow-effect",
                  theme === "light"
                    ? "bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-900 border-purple-300 hover:border-purple-400"
                    : "bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                )}
                onClick={runWorkflow}
                disabled={isRunning || currentSteps.length === 0}
              >
                {isRunning ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Workflow
                  </>
                )}
              </Button> */}
            </div>

            {/* Flow diagram with add step capability */}
            <div
              className={cn(
                "relative w-full h-[180px] rounded-lg border",
                theme === "light"
                  ? "bg-white border-gray-200"
                  : "bg-[#1A0B2E] border-purple-500/20"
              )}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges.map((edge) => ({
                  ...edge,
                  style: {
                    stroke:
                      theme === "light"
                        ? "#6B7280"
                        : edge.animated
                          ? "#7e22ce"
                          : edge.target === "end"
                            ? "#9333ea"
                            : "#a855f7",
                    strokeWidth: 1.5,
                  },
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color:
                      theme === "light"
                        ? "#6B7280"
                        : edge.animated
                          ? "#7e22ce"
                          : edge.target === "end"
                            ? "#9333ea"
                            : "#a855f7",
                    width: 20,
                    height: 20,
                  },
                }))}
                nodeTypes={{ custom: CustomNode }}
                fitView
                minZoom={0.5}
                maxZoom={1.5}
                defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
                fitViewOptions={{
                  padding: 0.2,
                  duration: 800,
                  minZoom: 0.85,
                  maxZoom: 0.85,
                }}
                panOnDrag={true}
                panOnScroll={false}
                zoomOnScroll={true}
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
                preventScrolling={true}
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
                onNodesChange={(changes) => {
                  changes.forEach((change) => {
                    if (change.type === "position" && change.position) {
                      setNodePositions((prev) => ({
                        ...prev,
                        [change.id]: change.position,
                      }));
                    }
                  });
                }}
                onConnect={(params) => {
                  const newEdge: Edge = {
                    id: `e${params.source}-${params.target}`,
                    source: params.source,
                    target: params.target,
                    type: "bezier",
                    animated:
                      currentSteps[parseInt(params.source)].status ===
                      "running",
                    style: {
                      stroke:
                        theme === "light"
                          ? "#6B7280"
                          : currentSteps[parseInt(params.source)].status ===
                            "running"
                            ? "#7e22ce"
                            : "#a855f7",
                      strokeWidth: 1.5,
                    },
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color:
                        theme === "light"
                          ? "#6B7280"
                          : currentSteps[parseInt(params.source)].status ===
                            "running"
                            ? "#7e22ce"
                            : "#a855f7",
                      width: 20,
                      height: 20,
                    },
                  };
                  setEdges((prev) => [...prev, newEdge]);
                }}
                onEdgeClick={(event, edge) => {
                  setSelectedEdge(edge.id);
                }}
                onPaneClick={() => {
                  setSelectedEdge(null);
                }}
                onEdgesDelete={(edgesToDelete) => {
                  setEdges((prev) =>
                    prev.filter(
                      (edge) => !edgesToDelete.find((e) => e.id === edge.id)
                    )
                  );
                  setSelectedEdge(null);
                }}
                proOptions={{ hideAttribution: true }}
              >
                <div
                  className={`grid-background ${theme === "light"
                    ? "grid-background--light"
                    : "grid-background--dark"
                    }`}
                />
                <Controls className="react-flow__controls" />
                {/* Add Step Button */}
                {/* <div className="absolute bottom-4 right-4 z-10">
                  <button
                    onClick={() => setShowAddStepDialog(true)}
                    className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1A0B2E]"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div> */}
              </ReactFlow>
            </div>
            <div className="relative w-full justify-center flex py-2">
              <Button
                // variant="outline"
                className={'bg-yellow-300 text-black rounded-full'}
                onClick={runWorkflow}
                disabled={isRunning || currentSteps.length === 0}
              >
                {isRunning ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Workflow
                  </>
                )}
              </Button>
            </div>
            {/* Processing step - only show current running step */}
            {isRunning &&
              currentStepIndex !== null &&
              currentSubStepIndex !== null &&
              currentSteps[currentStepIndex] && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div className={getThemeClasses(theme).text}>
                      {currentStepIndex !== null &&
                        currentSteps[currentStepIndex]
                        ? currentSteps[currentStepIndex].name
                        : ""}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column - Processing Steps */}
                    <div className="p-4 rounded-lg bg-[#2D1B69]/30 border border-purple-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <RotateCw className="w-4 h-4 text-purple-400 animate-spin" />
                          <div>
                            <div className={getThemeClasses(theme).text}>
                              {currentStepIndex !== null &&
                                currentSteps[currentStepIndex]
                                ? currentSteps[currentStepIndex].name
                                : ""}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Substeps progress with connecting lines */}
                      <div className="space-y-1.5 mt-3">
                        <div className="relative">
                          {/* Connecting lines */}
                          {currentStepIndex !== null &&
                            currentSteps[currentStepIndex] &&
                            currentSteps[currentStepIndex].subSteps &&
                            currentSteps[currentStepIndex].subSteps.map(
                              (subStep, index) =>
                                index <
                                currentSteps[currentStepIndex].subSteps
                                  .length -
                                1 && (
                                  <div
                                    key={index}
                                    className="absolute"
                                    style={{
                                      left: "2.025rem",
                                      top: `${index * 48 + 12}px`,
                                      width: "2px",
                                      height: "48px",
                                      backgroundColor:
                                        subStep.status === "completed"
                                          ? "#8B5CF6"
                                          : "rgba(109, 40, 217, 0.2)",
                                      transition: "background-color 0.3s ease",
                                    }}
                                  />

                                )
                            )}

                          {/* Step Items with enhanced layout */}
                          {currentStepIndex !== null &&
                            currentSteps[currentStepIndex] &&
                            currentSteps[currentStepIndex]?.subSteps &&
                            currentSteps[currentStepIndex]?.subSteps.map(
                              (subStep, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "flex items-center justify-between p-2.5 rounded-lg transition-colors duration-200",
                                    theme === "light"
                                      ? subStep.status === "running"
                                        ? "bg-purple-100/70 shadow-lg shadow-purple-500/10"
                                        : subStep.status === "completed"
                                          ? "bg-green-50"
                                          : "bg-gray-50"
                                      : subStep.status === "running"
                                        ? "bg-[#2D1B69]/70 shadow-lg shadow-purple-500/10"
                                        : subStep.status === "completed"
                                          ? "bg-green-900/20"
                                          : "bg-[#2D1B69]/20"
                                  )}
                                >
                                  <div className="flex items-center min-w-0 gap-3">
                                    <div className="relative flex items-center justify-center w-[3rem] flex-shrink-0">
                                      <div
                                        className={cn(
                                          "w-5 h-5 rounded-full transition-all duration-300 border-2 flex items-center justify-center",
                                          theme === "light"
                                            ? subStep.status === "running"
                                              ? "border-purple-500 bg-white shadow-lg shadow-purple-500/20"
                                              : subStep.status === "completed"
                                                ? "border-green-500 bg-green-500"
                                                : "border-gray-300 bg-white"
                                            : subStep.status === "running"
                                              ? "border-purple-400 bg-[#1A0B2E] shadow-lg shadow-purple-500/20"
                                              : subStep.status === "completed"
                                                ? "border-green-400 bg-green-400"
                                                : "border-purple-500/20 bg-[#1A0B2E]"
                                        )}
                                      >
                                        {subStep.status === "running" && (
                                          <RotateCw
                                            className={cn(
                                              "w-2.5 h-2.5",
                                              theme === "light"
                                                ? "text-purple-600"
                                                : "text-purple-400",
                                              "animate-spin"
                                            )}
                                          />
                                        )}
                                        {subStep.status === "completed" && (
                                          <div
                                            className={cn(
                                              "w-1.5 h-1.5 rounded-full",
                                              theme === "light"
                                                ? "bg-gray-50"
                                                : "bg-[#1A0B2E]"
                                            )}
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p
                                        className={cn(
                                          theme === "light"
                                            ? subStep.status === "running"
                                              ? "text-purple-900 font-medium"
                                              : subStep.status === "completed"
                                                ? "text-green-800"
                                                : "text-gray-600"
                                            : subStep.status === "running"
                                              ? "text-purple-200 font-medium"
                                              : subStep.status === "completed"
                                                ? "text-green-300"
                                                : "text-purple-300/70"
                                        )}
                                      >
                                        {/* {subStep.name} */}
                                        {getFunctionDescription(subStep.name)}
                                      </p>
                                    </div>
                                  </div>
                                  <span
                                    className={cn(
                                      "text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-4 font-medium",
                                      theme === "light"
                                        ? subStep.status === "completed"
                                          ? "bg-green-100 text-green-700"
                                          : subStep.status === "running"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-gray-100 text-gray-600"
                                        : subStep.status === "completed"
                                          ? "bg-green-400/10 text-green-400"
                                          : subStep.status === "running"
                                            ? "bg-purple-400/10 text-purple-400"
                                            : "bg-purple-400/5 text-purple-400/50"
                                    )}
                                  >
                                    {subStep.status.charAt(0).toUpperCase() +
                                      subStep.status.slice(1)}
                                  </span>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Final Results */}
                    <div className="p-4 rounded-lg bg-[#2D1B69]/30 border border-purple-500/20 relative">
                      <div className="mb-3">
                        <div className="flex items-center">
                          {currentSteps[currentStepIndex].type === 'campaign-planning' && campaignData &&
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <div>
                                <div className={getThemeClasses(theme).text}>
                                  {currentStepIndex !== null &&
                                    currentSteps[currentStepIndex]
                                    ? currentSteps[currentStepIndex].name : ""}
                                  {" "}
                                  Results
                                </div>
                              </div>
                            </div>
                          }
                          {currentSteps[currentStepIndex].type === 'creative-selection' && getCampaignCreatives && signedUrl &&
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <div>
                                <div className={getThemeClasses(theme).text}>
                                  {currentStepIndex !== null &&
                                    currentSteps[currentStepIndex]
                                    ? currentSteps[currentStepIndex].name
                                    : ""}{" "}
                                  Results
                                </div>
                              </div>
                            </div>
                          }
                          {currentSteps[currentStepIndex].type === 'template-generation' && genTemplates.length > 0 &&
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <div>
                                <div className={getThemeClasses(theme).text}>
                                  {currentStepIndex !== null &&
                                    currentSteps[currentStepIndex]
                                    ? currentSteps[currentStepIndex].name
                                    : ""}{" "}
                                  Results
                                </div>
                              </div>
                            </div>
                          }
                          {currentSteps[currentStepIndex].type === 'ad-copy' && generatedContent &&
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <div>
                                <div className={getThemeClasses(theme).text}>
                                  {currentStepIndex !== null &&
                                    currentSteps[currentStepIndex]
                                    ? currentSteps[currentStepIndex].name
                                    : ""}{" "}
                                  Results
                                </div>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                      {/* Campaign Planning Results */}
                      {currentStepIndex !== null &&
                        currentSteps[currentStepIndex] &&
                        currentSteps[currentStepIndex].status === "completed" ? (
                        <div className="space-y-3 ralative h-full">
                          {stopCgCall === true && campaignData && currentStepIndex !== null &&
                            currentSteps[currentStepIndex] &&
                            currentSteps[currentStepIndex].type ===
                            "campaign-planning" && (
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <h4
                                    className={cn(
                                      "text-sm font-medium",
                                      theme === "light"
                                        ? "text-black font-semibold"
                                        : "text-purple-200"
                                    )}
                                  >
                                    Target Demographic
                                  </h4>
                                  <div
                                    className={cn(
                                      "p-3 rounded-md text-sm",
                                      theme === "light"
                                        ? "bg-gray-50"
                                        : "bg-[#1A0B2E]"
                                    )}
                                  >
                                    <div className="grid grid-cols-2 gap-6">
                                      {/* Age  */}
                                      <div>
                                        <span
                                          className={cn(
                                            "text-xs flex items-center gap-2",
                                            theme === "light"
                                              ? "text-blue-600"
                                              : "text-purple-400"
                                          )}
                                        >
                                          Age Range
                                          {dataError === 'age' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                                        </span>
                                        <div className="flex gap-2 items-center" ref={refs.ageGroup}>
                                          {isEntryEditing === 'ageGroup' ? (
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="number"
                                                placeholder="from"
                                                min={0}
                                                value={fromAge}
                                                onChange={(e) => setFromAge(parseInt(e.target.value))}
                                                className={`${inputStyle} w-[60px]`}
                                              />
                                              <span>-</span>
                                              <input
                                                type="number"
                                                placeholder="to"
                                                min={fromAge + 1}
                                                value={toAge}
                                                onChange={(e) => setToAge(parseInt(e.target.value))}
                                                className={`${inputStyle} w-[60px]`}
                                              />
                                            </div>
                                          ) : (
                                            <p className={theme === "light" ? "text-black font-medium" : ""}>
                                              {fromAge}
                                              <span className="mx-2">-</span>
                                              {toAge} &nbsp;years
                                            </p>
                                          )}
                                          <PenciIcon onClick={() => setIsEntryEditing('ageGroup')} />
                                        </div>

                                      </div>
                                      {/* Gender  */}
                                      <div>
                                        <span
                                          className={cn(
                                            "text-xs",
                                            theme === "light"
                                              ? "text-blue-600"
                                              : "text-purple-400"
                                          )}
                                        >
                                          Gender
                                        </span>
                                        <div className="flex gap-2 items-center" ref={refs.gender}>
                                          {
                                            isEntryEditing === 'gender' ?
                                              <select
                                                onChange={(e) => setGender(e.target.value)}
                                                className={`${selectInputStyle} w-[150px]`}
                                              >
                                                <option value="">Choose Gender</option>
                                                <option value="All">All</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                              </select>
                                              :
                                              <p>
                                                {gender}
                                              </p>
                                          }
                                          <PenciIcon onClick={() => setIsEntryEditing('gender')} />
                                        </div>
                                      </div>
                                      {/* Location  */}
                                      <div>
                                        <span
                                          className={cn(
                                            "text-xs flex items-center gap-2",
                                            theme === "light"
                                              ? "text-blue-600"
                                              : "text-purple-400"
                                          )}
                                        >
                                          Locations
                                          {dataError === 'location' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                                        </span>
                                        <div className="flex gap-4">
                                          <div className="flex flex-col">
                                            {!locations.length &&
                                              <small className="text-[#6f6f6f] text-xs">Location is required</small>
                                            }
                                            {locations?.slice(0, 5)?.map((item, index) => (
                                              <span className="flex items-center gap-[8px]" key={index}>
                                                {item}
                                                <span
                                                  onClick={() => removeItem(index)}
                                                  className="flex items-center justify-center w-3 h-3 text-[#6f6f6f] hover:text-nyx-yellow  rounded-full text-[12px] cursor-pointer hover:border-text-nyx-yellow "
                                                >
                                                  &#10005;
                                                  {/* cross icon  */}
                                                </span>
                                              </span>
                                            ))}
                                            {locations?.length > 5 && <span className="text-[#9f68d6]">+ {locations?.length - 5}</span>}
                                            {
                                              isEntryEditing === 'loc' && isLoaded &&
                                              <LocationInput
                                                onPlaceChanged={(address) => {
                                                  setLocations(prev => [address, ...prev]);
                                                }}
                                                targetNameErr={targetNameErr}
                                                isEntryEditing={isEntryEditing}
                                                setIsEntryEditing={setIsEntryEditing}
                                              />
                                              // <LocationInput
                                              //   onPlaceChanged={(autocomplete) => {
                                              //     const place = autocomplete?.getPlace();
                                              //     const formatted_address = place.formatted_address;
                                              //     setLocations(prev => [formatted_address, ...prev]);
                                              //   }}
                                              //   targetNameErr={targetNameErr}
                                              //   isEntryEditing={isEntryEditing}
                                              //   setIsEntryEditing={setIsEntryEditing}
                                              // />
                                            }
                                          </div>
                                          {isEntryEditing !== 'loc' && <PenciIcon onClick={() => setIsEntryEditing('loc')} />}
                                        </div>
                                      </div>
                                      <div>
                                        <span
                                          className={cn(
                                            "text-xs flex items-center gap-2",
                                            theme === "light"
                                              ? "text-blue-600"
                                              : "text-purple-400"
                                          )}
                                        >
                                          Schedule
                                          {dataError === 'schedule' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                                        </span>
                                        <div className="flex gap-2 items-center" ref={refs.schedule}>
                                          {
                                            isEntryEditing === 'schedule' ?
                                              <div className="flex items-center gap-2 ">
                                                <div className="flex">
                                                  <input
                                                    type="date"
                                                    onChange={(e) => {
                                                      const val = e.target.value; // yyyy-mm-dd
                                                      if (val) {
                                                        setFromSchedule(toDisplayFormat(val)); // Store in dd/mm/yyyy
                                                      }
                                                    }}
                                                    value={
                                                      fromSchedule && fromSchedule.includes('-')
                                                        ? toInputFormat(fromSchedule)
                                                        : ""
                                                    }
                                                    min={new Date().toISOString().split("T")[0]}
                                                    max={
                                                      toSchedule && toSchedule.includes('-')
                                                        ? parseDate(toSchedule).toISOString().split("T")[0]
                                                        : undefined
                                                    }
                                                    onKeyDown={(e) => e.preventDefault()} // Prevent keyboard input
                                                    className={`${inputStyle} w-[120px]`}
                                                  />
                                                </div>
                                                <span>-</span>
                                                <div className="flex">
                                                  <input
                                                    type="date"
                                                    onChange={(e) => {
                                                      const val = e.target.value; // yyyy-mm-dd
                                                      if (val) {
                                                        setToSchedule(toDisplayFormat(val)); // Store in dd/mm/yyyy
                                                      }
                                                    }}
                                                    value={
                                                      toSchedule && toSchedule.includes('-')
                                                        ? toInputFormat(toSchedule)
                                                        : ""
                                                    }
                                                    min={
                                                      fromSchedule && fromSchedule.includes('-')
                                                        ? parseDate(fromSchedule).toISOString().split("T")[0]
                                                        : new Date().toISOString().split("T")[0]
                                                    }
                                                    onKeyDown={(e) => e.preventDefault()} // Prevent keyboard input
                                                    className={`${inputStyle} w-[120px]`}
                                                  />
                                                </div>
                                              </div>
                                              :
                                              <p>
                                                {formatDate(fromSchedule)} - {" "}
                                                {formatDate(toSchedule)}
                                              </p>
                                          }

                                          <PenciIcon onClick={() => setIsEntryEditing('schedule')} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4
                                    className={cn(
                                      "text-sm font-medium",
                                      theme === "light"
                                        ? "text-black font-semibold"
                                        : "text-purple-200"
                                    )}
                                  >
                                    Budget Distribution
                                  </h4>
                                  <div
                                    className={cn(
                                      "p-3 rounded-md text-sm",
                                      theme === "light"
                                        ? "bg-gray-50"
                                        : "bg-[#1A0B2E]"
                                    )}
                                  >
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span
                                          className={cn(
                                            "text-xs",
                                            theme === "light"
                                              ? "text-blue-600"
                                              : "text-purple-400"
                                          )}
                                        >
                                          Total Budget
                                        </span>
                                        <p
                                          className={
                                            theme === "light"
                                              ? "text-black font-medium"
                                              : ""
                                          }
                                        >
                                          {"INR"}&nbsp;&nbsp;
                                          {`${total_budget}`}
                                        </p>
                                      </div>
                                      <div className="space-y-1.5">
                                        {campaignData && Object.entries(campaignData.channel_budget_allocation).map(([channel, budget]) => (
                                          <div key={channel} className="flex justify-between items-center">
                                            <span
                                              className={cn(
                                                "text-xs capitalize",
                                                theme === "light" ? "text-black font-medium" : ""
                                              )}
                                            >
                                              {channel}
                                            </span>

                                            <div className="flex items-center gap-2" ref={refs[channel.toLocaleLowerCase()]}>
                                              {"INR"}
                                              {isEntryEditing === channel.toLowerCase() ? (
                                                <input
                                                  type="text"
                                                  name={channel}
                                                  placeholder="budget"
                                                  onChange={addBudget}
                                                  value={adPlatformBudgets?.[channel] ?? ""}
                                                  className={`${inputStyle} w-[94px]`}
                                                />
                                              ) : (
                                                <p>{adPlatformBudgets?.[channel]}</p>
                                              )}
                                              <PenciIcon onClick={() => setIsEntryEditing(channel.toLowerCase())} />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* Creative Selection Results */}
                          {/* crStatus == 'COMPLETE' && */}
                          {(signedUrl || genTemplates.length > 0) && currentStepIndex !== null &&
                            currentSteps[currentStepIndex] &&
                            (currentSteps[currentStepIndex].type ===
                              "creative-selection" ||
                              currentSteps[currentStepIndex].type ===
                              "template-generation") ? (
                            <div className="space-y-2 relative">
                              <div className="flex gap-2">
                                {/* only single signed url  */}
                                <div
                                  className={cn(
                                    "",
                                    theme === "light"
                                      ? "bg-gray-200"
                                      : ""
                                  )}
                                >
                                  <div className="flex flex-col gap-6">
                                    {signedUrl ?
                                      <div className="flex items-center gap-6">
                                        <img
                                          src={signedUrl}
                                          alt={`Creative`}
                                          className="w-[200px] max-h-[125px] rounded-lg object-cover"
                                          onClick={() => handleImageClick(signedUrl)}
                                        />
                                        {/* Re-Generate  */}
                                        <button onClick={regenCreative} className="flex flex-col gap-2 items-center" title="Regenerate Creative">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none">
                                            <path d="M11 2L13 3.99545L12.9408 4.05474M13 18.0001L11 19.9108L11.0297 19.9417M12.9408 4.05474L11 6M12.9408 4.05474C12.6323 4.01859 12.3183 4 12 4C7.58172 4 4 7.58172 4 12C4 14.5264 5.17107 16.7793 7 18.2454M17 5.75463C18.8289 7.22075 20 9.47362 20 12C20 16.4183 16.4183 20 12 20C11.6716 20 11.3477 19.9802 11.0297 19.9417M13 22.0001L11.0297 19.9417" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                          </svg>
                                          <small className="text-xs text-[#a855f7]">Regenerate</small>
                                        </button>
                                      </div> : ""
                                    }
                                    {/* Templates  */}
                                    {createTemplate === true ?
                                      <div className="flex flex-wrap gap-6">
                                        {genTemplates?.map((item, index) => (
                                          <img
                                            key={index}
                                            src={item}
                                            alt={`Template`}
                                            className="w-[200px] max-h-[125px] rounded-lg object-cover"
                                            onClick={() => handleImageClick(item)}
                                          />
                                        ))}
                                      </div> :
                                      ""
                                    }
                                    <br />
                                  </div>
                                  {showModal && (
                                    <div
                                      onClick={handleClose}
                                      style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        width: '100vw',
                                        height: '100vh',
                                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 9999,
                                      }}
                                    >
                                      <img
                                        src={fullScreenImg}
                                        alt="Fullscreen"
                                        style={{
                                          maxWidth: '90%',
                                          maxHeight: '90%',
                                          borderRadius: '8px',
                                          boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) :
                            ""}

                          {/* No creatives generation -Showing only selections */}
                          {createTemplate === false && driveClickedArray.length && currentStepIndex !== null &&
                            currentSteps[currentStepIndex] &&
                            currentSteps[currentStepIndex].type === "selected-creatives" ? (
                            <div className="flex flex-wrap gap-6">
                              {createTemplate === false && driveClickedArray?.map((item, index) => (
                                <img
                                  key={index}
                                  src={item.signed_image_url}
                                  alt={`creative`}
                                  className="w-[200px] max-h-[125px] rounded-lg object-cover"
                                  onClick={() => handleImageClick(item.signed_image_url)}
                                />
                              ))}
                              {showModal && (
                                <div
                                  onClick={handleClose}
                                  style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100vw',
                                    height: '100vh',
                                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 9999,
                                  }}
                                >
                                  <img
                                    src={fullScreenImg}
                                    alt="Fullscreen"
                                    style={{
                                      maxWidth: '90%',
                                      maxHeight: '90%',
                                      borderRadius: '8px',
                                      boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ) : ""
                          }

                          {/* Ad Copy Results */}
                          {currentStepIndex !== null &&
                            currentSteps[currentStepIndex] &&
                            currentSteps[currentStepIndex].type ===
                            "ad-copy" && (
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <h4
                                    className={cn(
                                      "text-sm font-medium flex items-center gap-2 relative",
                                      theme === "light"
                                        ? "text-black font-semibold"
                                        : "text-purple-200"
                                    )}
                                  >
                                    Generated Headlines
                                    {dataError === 'headline' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                                  </h4>
                                  <div className="grid gap-2">
                                    {generatedContent?.headlines
                                      .slice(0, 3)
                                      .map((headline, index) => (
                                        <div
                                          key={index}
                                          className={cn(
                                            "p-1.5 rounded-lg",
                                            theme === "light"
                                              ? "bg-gray-50"
                                              : "bg-[#2D1B69]/30"
                                          )}
                                        >

                                          <div className="flex gap-2 items-center"
                                            ref={index === 0 ? refs.head0 : index === 1 ? refs.head1 : index === 2 ? refs.head2 : null}>
                                            {
                                              isEntryEditing === `head${index}` ?
                                                <input
                                                  key={index}
                                                  value={headline}
                                                  placeholder="Enter Headline"
                                                  onChange={(e) => {
                                                    const updated = [...generatedContent.headlines];
                                                    const value = e.target.value;
                                                    if (!value.trim() || value.length < 10 || value.length > 30) {
                                                      // throw new Error("Headline cannot be empty");
                                                      setHeadlineError((prev) => [...prev, index]);
                                                    } else {
                                                      setHeadlineError((prev) => prev.filter((item) => item !== index));
                                                    }
                                                    updated[index] = value;
                                                    setGeneratedContent((prev) => ({ ...prev, headlines: updated }));
                                                  }}
                                                  className={`bg-[#1a0b2e] p-2 rounded outline-none w-full text-sm ${headlineError.includes(index) && 'border-2 border-red-500'}`}
                                                />
                                                :
                                                <p
                                                  className={cn(
                                                    "text-sm",
                                                    theme === "light"
                                                      ? "text-gray-900"
                                                      : "text-purple-200"
                                                  )}
                                                >
                                                  {headline}
                                                </p>
                                            }
                                            <PenciIcon onClick={() => setIsEntryEditing(`head${index}`)} />
                                          </div>
                                          <div className="flex items-center gap-2 mt-1">
                                            <span
                                              className={cn(
                                                "text-[10px] py-0.5 px-1.5 rounded",
                                                theme === "light"
                                                  ? "bg-gray-100 text-gray-600"
                                                  : "bg-[#2D1B69] text-purple-300/70"
                                              )}
                                            >
                                              {headline.length}/30 chars
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4
                                    className={cn(
                                      "text-sm font-medium mt-4 flex items-center gap-2 relative",
                                      theme === "light"
                                        ? "text-black font-semibold"
                                        : "text-purple-200"
                                    )}
                                  >
                                    Generated Descriptions
                                    {dataError === 'desc' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                                  </h4>
                                  <div className="grid gap-2">
                                    {generatedContent?.descriptions
                                      .slice(0, 3)
                                      .map((desc, index) => (
                                        <div
                                          key={index}
                                          className={cn(
                                            "p-1.5 rounded-lg",
                                            theme === "light"
                                              ? "bg-gray-50"
                                              : "bg-[#2D1B69]/30"
                                          )}
                                        >
                                          <div className="flex gap-2 items-center" ref={refs.desc}>
                                            {
                                              isEntryEditing === `desc` ?
                                                <input
                                                  key={index}
                                                  value={desc}
                                                  onChange={(e) => {
                                                    const updated = [...generatedContent.descriptions];
                                                    const value = e.target.value;
                                                    if (!value.trim() || value.length < 10 || value.length > 90) {
                                                      // throw new Error("Headline cannot be empty");
                                                      setDescError((prev) => [...prev, index]);
                                                    } else {
                                                      setDescError((prev) => prev.filter((item) => item !== index));
                                                    }
                                                    updated[index] = value;
                                                    setGeneratedContent((prev) => ({ ...prev, descriptions: updated }));
                                                  }}
                                                  className={`bg-[#1a0b2e] p-2 rounded outline-none w-full text-sm ${descError.includes(index) && 'border-2 border-red-500'}`}
                                                />
                                                :
                                                <p
                                                  className={cn(
                                                    "text-sm",
                                                    theme === "light"
                                                      ? "text-gray-900"
                                                      : "text-purple-200"
                                                  )}
                                                >
                                                  {desc}
                                                </p>
                                            }
                                            <PenciIcon onClick={() => setIsEntryEditing(`desc`)} />
                                          </div>
                                          {/* <p
                                            className={cn(
                                              "text-sm",
                                              theme === "light"
                                                ? "text-gray-900"
                                                : "text-purple-200"
                                            )}
                                          >
                                            {desc}
                                          </p> */}
                                          <div className="flex items-center gap-2 mt-1">
                                            <span
                                              className={cn(
                                                "text-[10px] py-0.5 px-1.5 rounded",
                                                theme === "light"
                                                  ? "bg-gray-100 text-gray-600"
                                                  : "bg-[#2D1B69] text-purple-300/70"
                                              )}
                                            >
                                              {desc.length}/90 chars
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                  <div>
                                    <h4
                                      className={cn(
                                        "text-sm font-medium mt-4 flex items-center gap-2 relative",
                                        theme === "light"
                                          ? "text-black font-semibold"
                                          : "text-purple-200"
                                      )}
                                    >
                                      Generated Captions
                                      {dataError === 'cap' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                                    </h4>
                                    <div className="grid gap-2">
                                      {generatedContent?.captions
                                        .slice(0, 2)
                                        .map((caption, index) => (
                                          <div
                                            key={index}
                                            className={cn(
                                              "p-1.5 rounded-lg",
                                              theme === "light"
                                                ? "bg-gray-50"
                                                : "bg-[#2D1B69]/30"
                                            )}
                                          >
                                            <div className="flex gap-2 items-center"
                                              ref={index === 0 ? refs.cap0 : index === 1 ? refs.cap1 : index === 1 ? refs.cap2 : null}>
                                              {
                                                isEntryEditing === `cap${index}` ?
                                                  <input
                                                    key={index}
                                                    value={caption}
                                                    placeholder="Enter Caption"
                                                    onChange={(e) => {
                                                      const updated = [...generatedContent.captions];
                                                      const value = e.target.value;
                                                      if (!value.trim() || value.length < 10 || value.length > 60) {
                                                        // throw new Error("Headline cannot be empty");
                                                        setCapError((prev) => [...prev, index]);
                                                      } else {
                                                        setCapError((prev) => prev.filter((item) => item !== index));
                                                      }
                                                      updated[index] = value;
                                                      setGeneratedContent((prev) => ({ ...prev, captions: updated }));
                                                    }}
                                                    className={`bg-[#1a0b2e] p-2 rounded outline-none w-full text-sm  ${capError.includes(index) && 'border-2 border-red-500'}`}
                                                  />
                                                  :
                                                  <p
                                                    className={cn(
                                                      "text-sm",
                                                      theme === "light"
                                                        ? "text-gray-900"
                                                        : "text-purple-200"
                                                    )}
                                                  >
                                                    {caption}
                                                  </p>
                                              }
                                              <PenciIcon onClick={() => setIsEntryEditing(`cap${index}`)} />
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span
                                                className={cn(
                                                  "text-[10px] py-0.5 px-1.5 rounded",
                                                  theme === "light"
                                                    ? "bg-gray-100 text-gray-600"
                                                    : "bg-[#2D1B69] text-purple-300/70"
                                                )}
                                              >
                                                {caption.length}/60 chars
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* User Review Results */}
                          {currentStepIndex !== null &&
                            currentSteps[currentStepIndex] &&
                            currentSteps[currentStepIndex].type ===
                            "user-review" && (
                              <div className="text-center py-4">
                                <CheckCircle className="w-8 h-8 mx-auto text-green-400 mb-2" />
                                <p className={getThemeClasses(theme).text}>
                                  Campaign ready to launch
                                </p>
                                <p
                                  className={cn(
                                    "text-sm mt-1",
                                    theme === "light"
                                      ? "text-gray-600"
                                      : "text-purple-300/50"
                                  )}
                                >
                                  All steps have been completed and reviewed
                                </p>
                              </div>
                            )}

                          {/* Default for other step types */}
                          {currentStepIndex !== null &&
                            currentSteps[currentStepIndex] &&
                            currentSteps[currentStepIndex].type !==
                            "campaign-planning" &&
                            currentSteps[currentStepIndex].type !==
                            "creative-selection" &&
                            currentSteps[currentStepIndex].type !==
                            "template-generation" &&
                            currentSteps[currentStepIndex].type !==
                            "selected-creatives" &&
                            currentSteps[currentStepIndex].type !== "ad-copy" &&
                            currentSteps[currentStepIndex].type !==
                            "user-review" && (
                              <div className="text-center py-4">
                                <CheckCircle className="w-8 h-8 mx-auto text-green-400 mb-2" />
                                <p className={getThemeClasses(theme).text}>
                                  {currentStepIndex !== null &&
                                    currentSteps[currentStepIndex]
                                    ? currentSteps[currentStepIndex].name
                                    : ""}{" "}
                                  completed successfully
                                </p>
                              </div>
                            )}

                          {/* Approve Button */}
                          {showApprovalFeedback &&
                            approvedStep === currentStepIndex && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg z-10 animate-in fade-in duration-300">
                                <div className="bg-green-500 text-white p-3 rounded-full animate-bounce">
                                  <CheckCircle className="w-8 h-8" />
                                </div>
                              </div>
                            )}

                          {currentStepIndex !== null &&
                            currentStepIndex < currentSteps.length - 1 && (
                              <div className="mt-6 space-y-2">
                                {isAproveBtnDissable(currentStepIndex) === false &&
                                  <div className="flex flex-col items-center">
                                    <button onClick={() => {
                                      if (currentStepIndex !== null) {
                                        handleApproveAndContinue(
                                          currentStepIndex
                                        );
                                      }
                                    }}
                                      // disabled={isAproveBtnDissable(currentStepIndex)}
                                      // className={cn(
                                      //   "w-full py-2.5 px-4 rounded-md flex items-center justify-center font-medium transition-colors shadow-sm",
                                      //   theme === "light"
                                      //     ? "bg-green-600 hover:bg-green-700 text-white"
                                      //     : "bg-green-600 hover:bg-green-700 text-white"
                                      // )}
                                      className={'flex items-center bg-yellow-300 text-black rounded-full p-2 px-6 mt-8'}
                                    >
                                      {/* <ThumbsUp className="w-4 h-4 mr-2" /> */}
                                      Approve & Continue
                                    </button>
                                    <p
                                      className={cn(
                                        "text-xs text-center px-4 mt-4",
                                        theme === "light"
                                          ? "text-gray-600"
                                          : "text-purple-300/50"
                                      )}
                                    >
                                      Review the results above and click to proceed
                                      to the next step
                                    </p>
                                  </div>
                                }
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center h-full py-8 justify-center">
                          <div className="text-center space-y-2 items-center flex flex-col">
                            {/* <Clock
                              className={cn(
                                "w-8 h-8 opacity-50",
                                theme === "light"
                                  ? "text-gray-400"
                                  : "text-purple-400/50"
                              )}
                            /> */}
                            <div
                              className={cn(
                                "w-[80px] h-[80px] opacity-50",
                                theme === "light" ? "text-gray-400" : "text-purple-400/50"
                              )}
                            >
                              <svg viewBox="0 0 100 100" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="none" />

                                {/* Hour hand */}
                                <line x1="50" y1="50" x2="50" y2="28" stroke="currentColor" strokeWidth="6">
                                  <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 50 50"
                                    to="360 50 50"
                                    dur="6s"
                                    repeatCount="indefinite"
                                  />
                                </line>

                                {/* Minute/second hand */}
                                <line x1="50" y1="50" x2="72" y2="50" stroke="currentColor" strokeWidth="4">
                                  <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 50 50"
                                    to="360 50 50"
                                    dur="2s"
                                    repeatCount="indefinite"
                                  />
                                </line>
                              </svg>
                            </div>
                            <p
                              className={cn(
                                "text-sm",
                                theme === "light"
                                  ? "text-gray-600"
                                  : "text-purple-300/50"
                              )}
                            >
                              Results will appear here when{" "}
                              {currentStepIndex !== null &&
                                currentSteps[currentStepIndex]
                                ? currentSteps[currentStepIndex].name
                                : ""}{" "}
                              is completed
                            </p>
                            {/* {currentStepIndex == 0 && campaignPlanStatus?.processing_status == "BUILDING" &&
                              <div className="p-4 px-8 text-sm text-[#e9d5ff] font-medium ">
                                <DotLoader text={"Generating Campaign Data"} />
                              </div>
                            }
                            {currentStepIndex == 1 && statusCreativePlan?.processing_status == "BUILDING" &&
                              <div className="p-4 px-8 text-sm text-[#e9d5ff] font-medium ">
                                <DotLoader text={'Generating Creatives'} />
                              </div>
                            } */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Review Dialog */}
            <Dialog
              open={isReviewDialogOpen}
              onOpenChange={setIsReviewDialogOpen}
            >
              <DialogContent
                className={cn(
                  "max-w-[1400px] h-[95vh] flex flex-col p-0",
                  theme === "light"
                    ? "bg-gray-50"
                    : getThemeClasses(theme).dialog
                )}
              >
                <DialogHeader
                  className={cn(
                    "flex-none px-3 py-1.5 border-b",
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-[#1A0B2E] border-purple-500/20"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      <DialogTitle
                        className={cn(
                          "text-base font-semibold",
                          theme === "light"
                            ? "text-gray-900"
                            : getThemeClasses(theme).heading
                        )}
                      >
                        Campaign Review
                      </DialogTitle>
                    </div>
                  </div>
                </DialogHeader>

                <div
                  className={cn(
                    "flex-1 p-3 overflow-y-auto min-h-0",
                    theme === "light" ? "bg-gray-50" : "bg-[#0F0225]"
                  )}
                >
                  <div className="grid grid-cols-2 gap-3 max-w-[1300px] mx-auto">
                    {/* Left Column - Campaign Details */}
                    <div className="space-y-2 h-full flex flex-col">
                      {/* Campaign Configuration Section */}
                      <div
                        className={cn(
                          "rounded-lg p-2",
                          theme === "light"
                            ? "bg-white border border-gray-200"
                            : "bg-[#1A0B2E] border border-purple-500/20"
                        )}
                      >
                        <div className="space-y-2">
                          {/* Basic Info */}
                          <div>
                            <h3
                              className={cn(
                                "text-sm font-medium mb-1.5 flex items-center gap-0.5",
                                theme === "light"
                                  ? "text-gray-900"
                                  : "text-purple-200"
                              )}
                            >
                              <Info className="w-3.5 h-3.5 text-purple-500" />
                              Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label
                                  className={cn(
                                    "block text-xs font-medium",
                                    theme === "light"
                                      ? "text-gray-600"
                                      : "text-purple-300/70"
                                  )}
                                >
                                  Campaign Name
                                </label>
                                <p
                                  className={cn(
                                    "text-sm mt-0.5 text-ellipsis overflow-hidden",
                                    theme === "light"
                                      ? "text-gray-900"
                                      : "text-purple-200"
                                  )}
                                >
                                  {campaignData?.campaign_name}
                                </p>
                              </div>
                              <div>
                                <label
                                  className={cn(
                                    "block text-xs font-medium",
                                    theme === "light"
                                      ? "text-gray-600"
                                      : "text-purple-300/70"
                                  )}
                                >
                                  Brand Persona
                                </label>
                                <p
                                  className={cn(
                                    "text-sm mt-0.5",
                                    theme === "light"
                                      ? "text-gray-900"
                                      : "text-purple-200"
                                  )}
                                >
                                  {campaignConfig.brandPersona}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Target Demographic */}
                          <div>
                            <h3
                              className={cn(
                                "text-sm font-semibold mb-1.5 mt-4 flex items-center gap-0.5",
                                theme === "light"
                                  ? "text-gray-900"
                                  : "text-purple-200"
                              )}
                            >
                              <Users className="w-3.5 h-3.5 text-purple-500" />
                              Target Demographic
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <span
                                  className={cn(
                                    "text-xs flex items-center gap-2",
                                    theme === "light"
                                      ? "text-blue-600"
                                      : "text-purple-400"
                                  )}
                                >
                                  Age Range
                                  {dataError === 'age' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                                </span>
                                <div className="flex gap-2 items-center" ref={refs.ageGroup}>
                                  {isEntryEditing === 'ageGroup' ?
                                    <div className="flex items-center gap-4">
                                      <input
                                        type="number"
                                        placeholder="from"
                                        min={0}
                                        value={fromAge}
                                        onChange={(e) => setFromAge(parseInt(e.target.value))}
                                        className={`${inputStyle} w-[60px]`}
                                      />
                                      <span>-</span>
                                      <input
                                        type="number"
                                        placeholder="to"
                                        min={fromAge}
                                        value={toAge}
                                        onChange={(e) => setToAge(parseInt(e.target.value))}
                                        className={`${inputStyle} w-[60px]`}
                                      />
                                    </div>
                                    :
                                    <p
                                      className={
                                        theme === "light"
                                          ? "text-black font-medium"
                                          : ""
                                      }
                                    >
                                      {/* {campaignData?.age_group} years */}
                                      {fromAge}
                                      <span>-</span>
                                      {toAge} &nbsp;
                                      years
                                    </p>
                                  }
                                  <PenciIcon onClick={() => setIsEntryEditing('ageGroup')} />
                                </div>
                              </div>
                              <div>
                                <span
                                  className={cn(
                                    "text-xs",
                                    theme === "light"
                                      ? "text-blue-600"
                                      : "text-purple-400"
                                  )}
                                >
                                  Gender
                                </span>
                                <div className="flex gap-4 items-center" ref={refs.gender}>
                                  {
                                    isEntryEditing === 'gender' ?
                                      <select
                                        onChange={(e) => setGender(e.target.value)}
                                        className={`${selectInputStyle} w-[164px]`}
                                      >
                                        <option value="">Choose Gender</option>
                                        <option value="All">All</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                      </select>
                                      :
                                      <p>
                                        {gender}
                                      </p>
                                  }
                                  <PenciIcon onClick={() => setIsEntryEditing('gender')} />
                                </div>
                              </div>
                              <div className="col-span-2">
                                <span
                                  className={cn(
                                    "text-xs flex items-center gap-2",
                                    theme === "light"
                                      ? "text-blue-600"
                                      : "text-purple-400"
                                  )}
                                >
                                  Locations
                                  {dataError === 'location' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                                </span>
                                <div className="flex gap-4">
                                  <div className="flex flex-col">
                                    {!locations.length &&
                                      <small className="text-[#6f6f6f] text-xs">Location is required</small>
                                    }
                                    {locations?.slice(0, 5).map((item, index) => (
                                      <span className="flex items-center gap-[2px]" key={index}>
                                        {item}
                                        <span
                                          onClick={() => removeItem(index)}
                                          className="w-3 h-3 flex items-center justify-center text-[#6f6f6f] hover:text-nyx-yellow rounded-full text-[12px] cursor-pointer hover:border-text-nyx-yellow "
                                        >
                                          &#10005;
                                        </span>
                                      </span>
                                    ))}
                                    {locations?.length > 5 && <span className="text-[#9f68d6]">+ {locations?.length - 5}</span>}

                                    {
                                      isEntryEditing === 'loc' && isLoaded &&
                                      <LocationInput
                                        onPlaceChanged={(address) => {
                                          setLocations(prev => [address, ...prev]);
                                        }}
                                        targetNameErr={targetNameErr}
                                        isEntryEditing={isEntryEditing}
                                        setIsEntryEditing={setIsEntryEditing}
                                      />
                                    }
                                  </div>
                                  {isEntryEditing !== 'loc' && <PenciIcon onClick={() => setIsEntryEditing('loc')} />}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Budget & Timeline */}
                          <div>
                            <h3
                              className={cn(
                                "text-sm font-semibold mb-1.5 flex items-center gap-0.5",
                                theme === "light"
                                  ? "text-gray-900"
                                  : "text-purple-200"
                              )}
                            >
                              <IndianRupee className="w-3.5 h-3.5 text-purple-500" />
                              Budget & Timeline
                            </h3>
                            <div className="space-y-2">
                              {/* Total Budget and Daily Budget */}
                              <div
                                className={cn(
                                  "p-1.5 rounded-lg",
                                  theme === "light"
                                    ? "bg-gray-50"
                                    : "bg-[#2D1B69]/30"
                                )}
                              >
                                <label
                                  className={cn(
                                    "block text-xs font-medium",
                                    theme === "light"
                                      ? "text-gray-600"
                                      : "text-purple-300/70"
                                  )}
                                >
                                  Total Budget
                                </label>
                                <p
                                  className={cn(
                                    "text-sm mt-0.5",
                                    theme === "light"
                                      ? "text-gray-900"
                                      : "text-purple-200"
                                  )}
                                >
                                  {"INR"}{" "}
                                  {Number(total_budget)}
                                </p>
                                <div className="mt-1">
                                  <p
                                    className={cn(
                                      "text-xs",
                                      theme === "light"
                                        ? "text-gray-600"
                                        : "text-purple-300/70"
                                    )}
                                  >
                                    Daily Budget:
                                    <span className="ml-1">
                                      {"INR"}{" "}
                                      {(
                                        Number(total_budget) / 30
                                      ).toFixed(2)}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Platform Budget Distribution */}
                              <div className="grid grid-cols-2 gap-4 my-4">
                                {campaignData && Object.entries(campaignData.channel_budget_allocation).map(([channel, budget]) => (
                                  <div
                                    key={channel}
                                    className="flex justify-between items-center gap-4 max-w-[200px]"
                                    ref={refs[channel.toLowerCase()]}
                                  >
                                    <span
                                      className={cn(
                                        "text-xs capitalize",
                                        theme === "light" ? "text-black font-medium" : ""
                                      )}
                                    >
                                      {channel}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {"INR"}{" "}
                                      {isEntryEditing === channel.toLowerCase() ? (
                                        <input
                                          type="text"
                                          name={channel}
                                          placeholder="budget"
                                          onChange={addBudget}
                                          value={adPlatformBudgets?.[channel] ?? ""}
                                          className={`${inputStyle} w-[100px]`}
                                        />
                                      ) : (
                                        <p>{adPlatformBudgets?.[channel]}</p>
                                      )}
                                      <PenciIcon onClick={() => setIsEntryEditing(channel.toLowerCase())} />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Campaign Duration */}
                              <div
                                className={cn(
                                  "p-1.5 rounded-lg",
                                  theme === "light"
                                    ? "bg-gray-50"
                                    : "bg-[#2D1B69]/30"
                                )}
                              >
                                <label
                                  className={cn(
                                    "block text-xs font-medium",
                                    theme === "light"
                                      ? "text-gray-600"
                                      : "text-purple-300/70"
                                  )}
                                >
                                  Campaign Duration
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <p
                                      className={cn(
                                        "text-xs mb-1 flex items-center gap-2",
                                        theme === "light"
                                          ? "text-gray-600"
                                          : "text-purple-300/70"
                                      )}
                                    >
                                      Start Date
                                      {dataError === 'schedule' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                                    </p>
                                    <div
                                      ref={refs.fromSchdl}
                                      className={cn(
                                        "text-sm flex items-center gap-4",
                                        theme === "light"
                                          ? "text-gray-900"
                                          : "text-purple-200"
                                      )}
                                    >
                                      {
                                        isEntryEditing === 'fromSchdl' ?
                                          <div className="flex">
                                            <input
                                              type="date"
                                              onChange={(e) => {
                                                const val = e.target.value; // yyyy-mm-dd
                                                if (val) {
                                                  setFromSchedule(toDisplayFormat(val)); // Store in dd/mm/yyyy
                                                }
                                              }}
                                              value={
                                                fromSchedule && fromSchedule.includes('-')
                                                  ? toInputFormat(fromSchedule)
                                                  : ""
                                              }
                                              min={new Date().toISOString().split("T")[0]}
                                              max={
                                                toSchedule && toSchedule.includes('-')
                                                  ? parseDate(toSchedule).toISOString().split("T")[0]
                                                  : undefined
                                              }
                                              onKeyDown={(e) => e.preventDefault()} // Prevent keyboard input
                                              className={`${inputStyle} w-[124px]`}
                                            />
                                          </div>

                                          :
                                          <p> {formatDate(fromSchedule)}</p>
                                      }
                                      <PenciIcon onClick={() => setIsEntryEditing('fromSchdl')} />
                                    </div>
                                  </div>
                                  <div>
                                    <p
                                      className={cn(
                                        "text-xs mb-1 flex items-center gap-2",
                                        theme === "light"
                                          ? "text-gray-600"
                                          : "text-purple-300/70"
                                      )}
                                    >
                                      End Date
                                      {dataError === 'schedule' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                                    </p>
                                    <div
                                      ref={refs.toSchdl}
                                      className={cn(
                                        "text-sm flex items-center gap-4",
                                        theme === "light"
                                          ? "text-gray-900"
                                          : "text-purple-200"
                                      )}
                                    >
                                      {isEntryEditing === 'toSchdl' ?
                                        // <input
                                        //   type="text"
                                        //   name="toSchedule"
                                        //   placeholder="to"
                                        //   min={fromSchedule}
                                        //   onFocus={(e) => (e.currentTarget.type = 'date')}
                                        //   onChange={(e) => setToSchedule(e.target.value)}
                                        //   value={toSchedule}
                                        //   className={`${inputStyle} w-[120px]`}
                                        // /> 
                                        <div className="flex">
                                          <input
                                            type="date"
                                            onChange={(e) => {
                                              const val = e.target.value; // yyyy-mm-dd
                                              if (val) {
                                                setToSchedule(toDisplayFormat(val)); // Store in dd/mm/yyyy
                                              }
                                            }}
                                            value={
                                              toSchedule && toSchedule.includes('-')
                                                ? toInputFormat(toSchedule)
                                                : ""
                                            }
                                            min={
                                              fromSchedule && fromSchedule.includes('-')
                                                ? parseDate(fromSchedule).toISOString().split("T")[0]
                                                : new Date().toISOString().split("T")[0]
                                            }
                                            onKeyDown={(e) => e.preventDefault()} // Prevent keyboard input
                                            className={`${inputStyle} w-[124px]`}
                                          />
                                        </div>
                                        :
                                        <p>{formatDate(toSchedule)}</p>
                                      }
                                      <PenciIcon onClick={() => setIsEntryEditing('toSchdl')} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Creative Assets Section */}
                      <div
                        className={cn(
                          "rounded-lg p-2 mt-auto",
                          theme === "light"
                            ? "bg-white border border-gray-200"
                            : "bg-[#1A0B2E] border border-purple-500/20"
                        )}
                      >
                        <h3
                          className={cn(
                            "text-sm font-semibold mb-1.5 flex items-center gap-0.5",
                            theme === "light"
                              ? "text-gray-900"
                              : "text-purple-200"
                          )}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          Creative Assets
                        </h3>
                        <div className="flex">
                          <div
                            className={cn(
                              "rounded-lg overflow-hidden",
                              theme === "light"
                                ? "bg-gray-200"
                                : "bg-[#2D1B69]/30"
                            )}
                          >
                            <div className="flex gap-4 flex-wrap p-3">
                              {signedUrl ?
                                <img
                                  src={signedUrl}
                                  alt={`Creative`}
                                  className="w-[220px] max-h-[125px] object-cover rounded-lg"
                                  onClick={() => handleImageClick(signedUrl)}
                                /> : ""
                              }
                              {createTemplate ? genTemplates?.map((item: string, index: number) => (
                                <img
                                  key={index}
                                  src={item}
                                  alt={`Creative`}
                                  className="w-[220px] max-h-[125px] object-cover rounded-lg"
                                  onClick={() => handleImageClick(item)}
                                />
                              )) : ""}
                              {!createTemplate && driveClickedArray?.length ? driveClickedArray?.map((item, i) => (
                                <img
                                  key={i}
                                  src={item.signed_image_url}
                                  alt={`Creative`}
                                  className="w-[220px] max-h-[125px] object-cover rounded-lg"
                                  onClick={() => handleImageClick(item.signed_image_url)}
                                />
                              )) : ""}
                            </div>
                          </div>
                          {showModal ? (
                            <div
                              onClick={handleClose}
                              style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 9999,
                              }}
                            >
                              <img
                                src={fullScreenImg}
                                alt="Fullscreen"
                                style={{
                                  maxWidth: '90%',
                                  maxHeight: '90%',
                                  borderRadius: '8px',
                                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                                }}
                              />
                            </div>
                          ) : ""}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Ad Copy */}
                    <div
                      className={cn(
                        "rounded-lg p-2 h-full",
                        theme === "light"
                          ? "bg-white border border-gray-200"
                          : "bg-[#1A0B2E] border border-purple-500/20"
                      )}
                    >
                      <h3
                        className={cn(
                          "text-sm font-semibold mb-1.5 flex items-center gap-0.5",
                          theme === "light"
                            ? "text-gray-900"
                            : "text-purple-200"
                        )}
                      >
                        <Mail className="w-3.5 h-3.5 text-purple-500" />
                        Ad Copy
                      </h3>

                      <div className="space-y-2">
                        <h4
                          className={cn(
                            "text-xs font-medium mb-1 flex items-center gap-2 relative",
                            theme === "light"
                              ? "text-gray-600"
                              : "text-purple-300/70"
                          )}
                        >
                          Headlines
                          {dataError === 'headline' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                        </h4>
                        <div className="grid gap-2">
                          {generatedContent?.headlines
                            .slice(0, 3)
                            .map((headline, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "p-1.5 rounded-lg",
                                  theme === "light"
                                    ? "bg-gray-50"
                                    : "bg-[#2D1B69]/30"
                                )}
                              >
                                <div className="flex gap-2 items-center"
                                  ref={index === 0 ? refs.head0 : index === 1 ? refs.head1 : index === 2 ? refs.head2 : null}>
                                  {
                                    isEntryEditing === `head${index}` ?
                                      <input
                                        key={index}
                                        value={headline}
                                        placeholder="Enter Headline"
                                        onChange={(e) => {
                                          const updated = [...generatedContent.headlines];
                                          const value = e.target.value;
                                          if (!value.trim() || value.length < 10 || value.length > 30) {
                                            // throw new Error("Headline cannot be empty");
                                            setHeadlineError((prev) => [...prev, index]);
                                          } else {
                                            setHeadlineError((prev) => prev.filter((item) => item !== index));
                                          }
                                          updated[index] = value;
                                          setGeneratedContent((prev) => ({ ...prev, headlines: updated }));
                                        }}
                                        className={`bg-[#1a0b2e] p-2 rounded outline-none w-full text-sm ${headlineError.includes(index) && 'border-2 border-red-500'}`}
                                      />
                                      :
                                      <p
                                        className={cn(
                                          "text-sm",
                                          theme === "light"
                                            ? "text-gray-900"
                                            : "text-purple-200"
                                        )}
                                      >
                                        {headline}
                                      </p>
                                  }
                                  <PenciIcon onClick={() => setIsEntryEditing(`head${index}`)} />
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={cn(
                                      "text-[10px] py-0.5 px-1.5 rounded",
                                      theme === "light"
                                        ? "bg-gray-100 text-gray-600"
                                        : "bg-[#2D1B69] text-purple-300/70"
                                    )}
                                  >
                                    {headline.length}/30 chars
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>

                        <h4
                          className={cn(
                            "text-xs font-medium mb-1 flex items-center gap-2 relative",
                            theme === "light"
                              ? "text-gray-600"
                              : "text-purple-300/70"
                          )}
                        >
                          Descriptions
                          {dataError === 'desc' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                        </h4>
                        <div className="grid gap-2">
                          {generatedContent?.descriptions
                            .slice(0, 3)
                            .map((desc, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "p-1.5 rounded-lg",
                                  theme === "light"
                                    ? "bg-gray-50"
                                    : "bg-[#2D1B69]/30"
                                )}
                              >
                                <div className="flex gap-2 items-center"
                                  ref={index === 0 ? refs.desc0 : index === 1 ? refs.desc1 : index === 1 ? refs.desc2 : null}>
                                  {
                                    isEntryEditing === `desc${index}` ?
                                      <input
                                        key={index}
                                        value={desc}
                                        placeholder="Enter Description"
                                        onChange={(e) => {
                                          const updated = [...generatedContent.descriptions];
                                          const value = e.target.value;
                                          if (!value.trim() || value.length < 10 || value.length > 90) {
                                            // throw new Error("Headline cannot be empty");
                                            setDescError((prev) => [...prev, index]);
                                          } else {
                                            setDescError((prev) => prev.filter((item) => item !== index));
                                          }
                                          updated[index] = value;
                                          setGeneratedContent((prev) => ({ ...prev, descriptions: updated }));
                                        }}
                                        className={`bg-[#1a0b2e] p-2 rounded outline-none w-full text-sm ${descError.includes(index) && 'border-2 border-red-500'}`}
                                      />
                                      :
                                      <p
                                        className={cn(
                                          "text-sm",
                                          theme === "light"
                                            ? "text-gray-900"
                                            : "text-purple-200"
                                        )}
                                      >
                                        {desc}
                                      </p>
                                  }
                                  <PenciIcon onClick={() => setIsEntryEditing(`desc${index}`)} />
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={cn(
                                      "text-[10px] py-0.5 px-1.5 rounded",
                                      theme === "light"
                                        ? "bg-gray-100 text-gray-600"
                                        : "bg-[#2D1B69] text-purple-300/70"
                                    )}
                                  >
                                    {desc.length}/90 chars
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>

                        <h4
                          className={cn(
                            "text-xs font-medium mb-1 flex items-center gap-2 relative",
                            theme === "light"
                              ? "text-gray-600"
                              : "text-purple-300/70"
                          )}
                        >
                          Captions
                          {dataError === 'cap' && <span className={`bg-red-500 w-2 h-2 rounded-full`}></span>}
                        </h4>
                        <div className="grid gap-2">
                          {generatedContent?.captions
                            .slice(0, 3)
                            .map((caption, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "p-1.5 rounded-lg",
                                  theme === "light"
                                    ? "bg-gray-50"
                                    : "bg-[#2D1B69]/30"
                                )}
                              >
                                <div className="flex gap-2 items-center"
                                  ref={index === 0 ? refs.cap0 : index === 1 ? refs.cap1 : index === 1 ? refs.cap2 : null}>
                                  {
                                    isEntryEditing === `cap${index}` ?
                                      <input
                                        key={index}
                                        value={caption}
                                        placeholder="Enter Caption"
                                        onChange={(e) => {
                                          const updated = [...generatedContent.captions];
                                          const value = e.target.value;
                                          if (!value.trim() || value.length < 10 || value.length > 60) {
                                            // throw new Error("Headline cannot be empty");
                                            setCapError((prev) => [...prev, index]);
                                          } else {
                                            setCapError((prev) => prev.filter((item) => item !== index));
                                          }
                                          updated[index] = value;
                                          setGeneratedContent((prev) => ({ ...prev, captions: updated }));
                                        }}
                                        className={`bg-[#1a0b2e] p-2 rounded outline-none w-full text-sm  ${capError.includes(index) && 'border-2 border-red-500'}`}
                                      />
                                      :
                                      <p
                                        className={cn(
                                          "text-sm",
                                          theme === "light"
                                            ? "text-gray-900"
                                            : "text-purple-200"
                                        )}
                                      >
                                        {caption}
                                      </p>
                                  }
                                  <PenciIcon onClick={() => setIsEntryEditing(`cap${index}`)} />
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={cn(
                                      "text-[10px] py-0.5 px-1.5 rounded",
                                      theme === "light"
                                        ? "bg-gray-100 text-gray-600"
                                        : "bg-[#2D1B69] text-purple-300/70"
                                    )}
                                  >
                                    {caption.length}/60 chars
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter
                  className={cn(
                    "flex px-3 py-4 gap-4 relative items-center",
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-[#1A0B2E] border-purple-500/20"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <button
                      className="border-2 text-white border-yellow-300 rounded-full p-2 px-8 hover:bg-yellow-300 hover:text-black duration-200"
                      onClick={() => setIsReviewDialogOpen(false)}
                    >
                      Back
                    </button>
                    <button
                      disabled={publish}
                      onClick={publishCampaign}
                      className="bg-yellow-300 text-black rounded-full p-2 px-8">
                      {publish ? <>Publishing...</> : <>Publish</>}
                    </button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Step Dialog */}
            <Dialog
              open={showAddStepDialog}
              onOpenChange={setShowAddStepDialog}
            >
              <DialogContent
                className={cn(
                  "max-w-lg",
                  theme === "light" ? "bg-gray-50" : "bg-[#1A0B2E]"
                )}
              >
                <DialogHeader>
                  <DialogTitle
                    className={
                      theme === "light" ? "text-gray-900" : "text-purple-200"
                    }
                  >
                    Add Step
                  </DialogTitle>
                  <DialogDescription
                    className={
                      theme === "light" ? "text-gray-600" : "text-purple-200/70"
                    }
                  >
                    Choose a step type to add to your workflow
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2 py-4">
                  {stepTypes.map((type, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleAddStep(type)}
                      className={cn(
                        "justify-start text-left font-normal",
                        theme === "light"
                          ? "hover:bg-gray-100 border-gray-200"
                          : "hover:bg-purple-500/10 border-purple-500/20"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "p-1 rounded",
                            theme === "light"
                              ? "bg-gray-100"
                              : "bg-purple-500/20"
                          )}
                        >
                          {React.createElement(type.icon, {
                            className:
                              theme === "light"
                                ? "text-gray-600"
                                : "text-purple-200",
                          })}
                        </div>
                        <div>
                          <div
                            className={
                              theme === "light"
                                ? "text-gray-900"
                                : "text-purple-200"
                            }
                          >
                            {type.name}
                          </div>
                          <div
                            className={cn(
                              "text-xs",
                              theme === "light"
                                ? "text-gray-600"
                                : "text-purple-200/70"
                            )}
                          >
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default WorkflowCard;

