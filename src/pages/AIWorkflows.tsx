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
  updateEdge,
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
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useTheme } from "next-themes";
import WorkflowCard from "../components/WorkflowCard";
import { useQuery } from "@tanstack/react-query";
import UploadAdCreative from "@/components/SelectImage";

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
  adPlatforms: {
    [key: string]: { selected: boolean; budget: number };
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
    subText: "text-white font-semibold",
    card: "bg-[#1A0B2E] border border-purple-900 shadow-purple-900/20 hover:shadow-purple-900/30",
    cardHeader: "bg-transparent",
    cardTitle: "text-purple-200 font-semibold text-lg",
    cardDescription: "text-purple-300/70 mt-1",
    button: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/30",
    secondaryButton: "bg-purple-900/30 hover:bg-purple-900/50 text-purple-200",
    input:
      "bg-[#150923] border-purple-900 focus:border-purple-500 text-purple-200 placeholder:text-purple-400/50",
    textarea:
      "w-full px-3 bg-[#332270] py-2 border placeholder-italic  placeholder:text-[#8297BD] focus:outline-none resize-none rounded-md",
    select: "bg-[#150923] border-purple-900 text-purple-200",
    // dialog: "bg-[#1A0B2E] shadow-purple-900/20 max-h-[700px] overflow-hidden overflow-y-auto",
    dialog: "bg-[#332270] shadow-purple-900/20 max-h-[700px] overflow-hidden overflow-y-auto",
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
    heading: "text-white font-semibold",
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
}



const workflowTemplates: Workflow[] = [
  {
    id: "1",
    name: "Agentic Campaign",
    description: "Setup and launch agentic campaigns",
    activeInstances: 5,
    successRate: 85,
    completedCount: 150,
    steps: [
      {
        name: "Campaign Planning",
        status: "pending",
        subSteps: [
          { name: "brand_industry_classifier", status: "pending" },
          { name: "audience_segment_analyzer", status: "pending" },
          { name: "ad_channel_recommender", status: "pending" },
          { name: "campaign_schedule_recommender", status: "pending" },
          { name: "marketing_budget_allocator", status: "pending" },
          { name: "campaign_name_generator", status: "pending" },
        ],
        type: "campaign-planning",
      },
      {
        name: "Creative Selection",
        status: "pending",
        subSteps: [
          { name: "prompt_generator", status: "pending" },
          { name: "image_generator", status: "pending" },
          { name: "image_analyzer", status: "pending" },
          { name: "mask_generator", status: "pending" },
          { name: "cta_generator", status: "pending" },
          { name: "text_layering", status: "pending" },
        ],
        type: "creative-selection",
      },
      {
        name: "Ad Copy",
        status: "pending",
        subSteps: [
          { name: "Writing headlines", status: "pending" },
          { name: "Writing captions", status: "pending" },
          { name: "Writing descriptions", status: "pending" },
        ],
        type: "ad-copy",
      },
      {
        name: "User Review",
        status: "pending",
        subSteps: [{ name: "Review campaign details", status: "pending" }],
        type: "user-review",
      },
    ],
  },
];
const workflowTemplatesWithTempGen: Workflow[] = [
  {
    id: "1",
    name: "Agentic Campaign",
    description: "Setup and launch agentic campaigns",
    activeInstances: 5,
    successRate: 85,
    completedCount: 150,
    steps: [
      {
        name: "Campaign Planning",
        status: "pending",
        subSteps: [
          { name: "brand_industry_classifier", status: "pending" },
          { name: "audience_segment_analyzer", status: "pending" },
          { name: "ad_channel_recommender", status: "pending" },
          { name: "campaign_schedule_recommender", status: "pending" },
          { name: "marketing_budget_allocator", status: "pending" },
          { name: "campaign_name_generator", status: "pending" },
        ],
        type: "campaign-planning",
      },
      {
        name: "Creative Selection",
        status: "pending",
        subSteps: [
          { name: "content_generation", status: "pending" },
          { name: "environment_setup", status: "pending" },
          { name: "image_processor", status: "pending" },
          { name: "input_validator", status: "pending" },
          { name: "logo_processor", status: "pending" },
          { name: "template_renderer", status: "pending" },
        ],
        type: "template-generation",
      },
      {
        name: "Ad Copy",
        status: "pending",
        subSteps: [
          { name: "Writing headlines", status: "pending" },
          { name: "Writing captions", status: "pending" },
          { name: "Writing descriptions", status: "pending" },
        ],
        type: "ad-copy",
      },
      {
        name: "User Review",
        status: "pending",
        subSteps: [{ name: "Review campaign details", status: "pending" }],
        type: "user-review",
      },
    ],
  },
];

const workflowWithNoSelection: Workflow[] = [
  {
    id: "1",
    name: "Agentic Campaign",
    description: "Setup and launch agentic campaigns",
    activeInstances: 5,
    successRate: 85,
    completedCount: 150,
    steps: [
      {
        name: "Campaign Planning",
        status: "pending",
        subSteps: [
          { name: "brand_industry_classifier", status: "pending" },
          { name: "audience_segment_analyzer", status: "pending" },
          { name: "ad_channel_recommender", status: "pending" },
          { name: "campaign_schedule_recommender", status: "pending" },
          { name: "marketing_budget_allocator", status: "pending" },
          { name: "campaign_name_generator", status: "pending" },
        ],
        type: "campaign-planning",
      },
      {
        name: "Creative Selection",
        status: "completed",
        subSteps: [
          { name: "selected_creatives", status: "pending" },
        ],
        type: "selected-creatives",
      },
      {
        name: "Ad Copy",
        status: "pending",
        subSteps: [
          { name: "Writing headlines", status: "pending" },
          { name: "Writing captions", status: "pending" },
          { name: "Writing descriptions", status: "pending" },
        ],
        type: "ad-copy",
      },
      {
        name: "User Review",
        status: "pending",
        subSteps: [{ name: "Review campaign details", status: "pending" }],
        type: "user-review",
      },
    ],
  },
]


export default function AIWorkflows() {
  const { theme } = useTheme();
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(true);
  const [platforms, setPlatforms] = useState([]);
  const [isCustomWorkflowDialogOpen, setIsCustomWorkflowDialogOpen] =
    useState(false);
  // const [workflowName, setWorkflowName] = useState("");
  const [customWorkflowName, setCustomWorkflowName] = useState("");
  const [customWorkflowDescription, setCustomWorkflowDescription] =
    useState("");
  const [selectedProcess, setSelectedProcess] = useState<string>("");
  const [customNodes, setCustomNodes] = useState<Node[]>([]);
  const [customEdges, setCustomEdges] = useState<Edge[]>([]);
  const [countdown, setCountdown] = useState<number>(10);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [inpErrorMsg, setInpError] = useState({ type: "", msg: "" });
  const [workflowFormData, setWorkflowFormData] = useState({
    cGoal: "",
    website: "",
    cgUrl: ""
  })
  const [runFlow, setRunFlow] = useState(false);
  const [uploadImageProcess, setUploadImageProcess] = useState<boolean>(false);
  const workspaceName = localStorage.getItem("workspace_name");
  const [driveClickedArray, setDriveClickedArray] = useState<any>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>(workflowTemplates);


  // useEffect(() => {
  //   if (driveClickedArray?.length) {
  //     setWorkflows(workflowTemplatesWithTempGen);
  //   } else {
  //     setWorkflows(workflowTemplates);
  //   }
  // }, [driveClickedArray]);




  React.useEffect(() => {
    if (isCustomWorkflowDialogOpen && !isPaused && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsCustomWorkflowDialogOpen(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isCustomWorkflowDialogOpen, isPaused, countdown]);

  // React.useEffect(() => {
  //   const adPlatform = async () => {
  //     const storage: any = localStorage.getItem("workspace_id");
  //     const platformLists = ["GOOGLE", "LINKEDIN", "META"];
  //     const titleCaseMap: Record<string, string> = {
  //       google: "Google",
  //       linkedin: "LinkedIn",
  //       meta: "Meta",
  //     };
  //     const data = await AdService(storage);
  //     // const filterData = data.filter((item: { ad_platform: string }) => platformLists.includes(item.ad_platform)).map((item) => {
  //     //   return item?.ad_platform ?? ''
  //     // });
  //     const filterData = data
  //       .filter((item: { ad_platform: string }) =>
  //         platformLists.some(
  //           (p) => p.toLowerCase() === item.ad_platform.toLowerCase()
  //         )
  //       )
  //       .map((item) => titleCaseMap[item.ad_platform.toLowerCase()] ?? "");

  //     setPlatforms(filterData);
  //   };
  //   adPlatform();
  // }, []);

  // const { data: brandDetails, isPending: brandPending } = useQuery({
  //   queryKey: ["get-brands"],
  //   queryFn: async () =>
  //     await getbrandWorkspaceService(localStorage.getItem("workspace_id")),
  // });

  const handleSaveWorkflow = () => {
    if (!customWorkflowName.trim()) {
      // Show error message
      return;
    }

    const newWorkflow: Workflow = {
      id: `custom-${Date.now()}`,
      name: customWorkflowName,
      description: customWorkflowDescription,
      activeInstances: 0,
      successRate: 0,
      completedCount: 0,
      steps: [],
    };

    workflows.push(newWorkflow);

    setCustomWorkflowName("");
    setCustomWorkflowDescription("");
    setCustomNodes([]);
    setCustomEdges([]);
    setIsCustomWorkflowDialogOpen(false);
  };

  // Check URl valid or not 
  function isValidURL(url: string) {
    try {
      // for full url like https://...
      new URL(url);
      return true;
    } catch (_) {
      // simple domain line abc.com
      return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url);
    }
  }

  const handleStart = () => {
    const cgurl = workflowFormData?.cgUrl;
    const cggoal = workflowFormData?.cGoal;
    //
    const checkCgUrl = isValidURL(cgurl)
    if (!cggoal || !(typeof cggoal === 'string') || cggoal.length < 10) {
      setInpError({
        type: "cGoal",
        msg: "Business Goal is required!"
      })
    }
    else
      if (checkCgUrl === false || !cgurl) {
        setInpError({
          type: "cgUrl",
          msg: "Campaign URL is required!"
        })
      }
      else
        if (checkCgUrl === true) {
          setIsGoalDialogOpen(false)
          // direct running workflow 
          setTimeout(() => {
            setRunFlow(true)
          }, 1000)
        }
  }

  const handleWorkFlowForm = (e: { target: { name: string, value: string } }) => {
    setInpError({ msg: "", type: "" })
    setWorkflowFormData({
      ...workflowFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleCloseImageModal = () => {
    setUploadImageProcess(false);
  };

  const [createTemplate, setCreateTemplate] = useState(false);

  const createTemp = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (driveClickedArray.length > 0) {
      setCreateTemplate(e.target.checked); // allow check/uncheck
    } else {
      setCreateTemplate(false); // force unchecked
    }
  };

  useEffect(() => {
    if (!driveClickedArray?.length && createTemplate == false) setWorkflows(workflowTemplates);
    if (driveClickedArray?.length && createTemplate == true) setWorkflows(workflowTemplatesWithTempGen);
    if (driveClickedArray?.length && createTemplate == false) setWorkflows(workflowWithNoSelection);
  }, [driveClickedArray.length, createTemplate]);

  return (
    <div className={getThemeClasses(theme).background}>
      <style>{`
        .react-flow__attribution {
          display: none !important;
        }
        .react-flow__controls {
          background: transparent;
          border: none;
          box-shadow: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 6px;
          margin-bottom: 6px;
          margin-left: 6px;
        }
        .react-flow__controls-button {
          background: #7E22CE !important;
          border: none !important;
          border-radius: 6px !important;
          width: 20px !important;
          height: 20px !important;
          color: white !important;
          transition: all 0.2s ease-out !important;
          padding: 3px !important;
          margin: 0 !important;
        }
        .react-flow__controls-button:hover {
          background: #9333EA !important;
          color: white !important;
        }
        .react-flow__controls-button svg {
          fill: currentColor;
          width: 10px;
          height: 10px;
        }
        .react-flow__controls-button + .react-flow__controls-button {
          margin-top: 6px !important;
        }
        .grid-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .grid-background--light {
          background-image:
            linear-gradient(to right, #E5E7EB 1px, transparent 1px),
            linear-gradient(to bottom, #E5E7EB 1px, transparent 1px),
            linear-gradient(to right, #F3F4F6 1px, transparent 1px),
            linear-gradient(to bottom, #F3F4F6 1px, transparent 1px);
          background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px;
        }
        .grid-background--dark {
          background-image:
            linear-gradient(to right, rgba(109, 40, 217, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(109, 40, 217, 0.2) 1px, transparent 1px),
            linear-gradient(to right, rgba(109, 40, 217, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(109, 40, 217, 0.1) 1px, transparent 1px);
          background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px;
        }
        @keyframes subtle-glow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 16px rgba(168, 85, 247, 0.6);
          }
        }
        .glow-effect {
          animation: subtle-glow 2s ease-in-out infinite;
        }
      `}</style>
      <div className="p-0">
        <div className="w-full mx-auto">
          {/* Breadcrumbs */}
          {/* <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to={""}
                  onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/apphome/${workspaceName}/dashboard`}
                  className={getThemeClasses(theme).breadcrumb}
                >
                  <Home
                    className={cn(
                      "w-4 h-4 mr-2",
                      getThemeClasses(theme).breadcrumbIcon
                    )}
                  />
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight
                    className={getThemeClasses(theme).breadcrumbIcon}
                  />
                  <span className={getThemeClasses(theme).breadcrumb}>
                    AI Workflows
                  </span>
                </div>
              </li>
            </ol>
          </nav> */}

          {/* Header */}
          <div className="mb-8">
            {/* <h1 className={getThemeClasses(theme).heading}>AI Workflows</h1> */}
            <div className="flex justify-between items-center">
              {/* <p className={getThemeClasses(theme).subText}>
                Manage and monitor your AI-powered workflows
              </p> */}
              <div className="flex gap-3">
                {/* <Button
                  variant="ghost"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-4 glow-effect",
                    theme === "light"
                      ? "bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-900 border-purple-300 hover:border-purple-400"
                      : "bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                  )}
                  onClick={() => setIsCustomWorkflowDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add custom workflow
                </Button> */}
                {/* <Button
                  variant="ghost"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mt-4 glow-effect",
                    theme === "light"
                      ? "bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-900 border-purple-300 hover:border-purple-400"
                      : "bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                  )}
                  onClick={() => setIsGoalDialogOpen(true)}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Don't know where to start?
                </Button> */}
              </div>
            </div>
          </div>

          {/* Campaign Goal Dialog */}
          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogContent className={getThemeClasses(theme).dialog} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <DialogHeader>
                <DialogTitle className={getThemeClasses(theme).heading}>
                  {/* Tell Us about your Campaign Goals */}
                  Campaign Details
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className={getThemeClasses(theme).subText}>
                    Campaign Goal<small className="text-[#EF4562] text-lg">*</small>
                  </label>
                  <div
                    className={`border border-[#8297BD] rounded-lg h-[180px] relative px-3 pt-3 ${inpErrorMsg.type === "cGoal" && "border-2 border-red-600"}`}
                    onClick={() => {
                      const el = document.getElementById("goal-text-area-placeholder");
                      if (el) el.style.display = "none"
                    }}
                  >
                    {workflowFormData.cGoal === "" && (
                      <span
                        id="goal-text-area-placeholder"
                        className="absolute top-5 left-7 text-sm text-[#8297BD] italic pointer-events-none whitespace-pre-line">
                        {`Examples:\n• Launch a new product line to existing customers\n• Increase social media engagement by 30%\n• Generate qualified leads for B2B services\n• Boost online store sales during holiday season`}
                      </span>
                    )}
                    <textarea
                      id="goal-textarea"
                      name="cGoal"
                      value={workflowFormData.cGoal}
                      onChange={handleWorkFlowForm}
                      className={cn(
                        "h-full w-full text-sm bg-transparent outline-none resize-none border-none",
                        getThemeClasses(theme).textarea,
                        inpErrorMsg.type === "cGoal" && "border-2 border-red-600"
                      )}
                    />
                  </div>

                  {/* {inpErrorMsg.type === 'cGoal' && <span className="flex text-sm text-red-600 my-2">{inpErrorMsg.msg}</span>} */}
                </div>
                <div className="flex items-center gap-2">
                  <div className="space-y-2 w-full">
                    <label className={getThemeClasses(theme).subText}>
                      Campaign URL<small className="text-[#EF4562] text-lg">*</small>
                    </label>
                    <input
                      name="cgUrl"
                      type="text"
                      placeholder="Enter Campaign URL"
                      className={cn("h-12 border-[#8297BD]", getThemeClasses(theme).textarea, `${inpErrorMsg.type === 'cgUrl' && 'border-2 border-red-600'}`)}
                      onChange={handleWorkFlowForm}
                    />
                    {/* {inpErrorMsg.type === 'cgUrl' && <span className="flex text-sm text-red-600 my-2">{inpErrorMsg.msg}</span>} */}
                  </div>
                </div>
                {/* Upload  */}
                <div className="space-y-2 w-full">
                  <div className="flex flex-col gap-2 h-max rounded cursor-pointer w-full">
                    <div className="flex flex-col bg-[#543891] rounded py-4 mt-4" onClick={() => ""}>
                      <div className="flex items-center justify-between">
                        <span className={'flex items-center px-4 text-white font-medium'}>
                          <span>{driveClickedArray?.length ? <>{driveClickedArray?.length} Selected</> : <>Upload Creatives</>} </span>
                        </span>
                        <div className="flex items-center gap-2 px-4">
                          <div className="bg-[#342270] rounded-full text-center flex justify-center items-center p-1 px-4">
                            <button
                              onClick={() => setUploadImageProcess(true)}
                              className="text-xs">
                              Choose Creatives
                            </button>
                          </div>
                          {/* <div className="flex gap-2 mr-2">
                            <input type="checkbox" className="accent-yellow-500" onChange={createTemp} checked={createTemplate} />
                            <span className="text-xs">Create Template</span>
                          </div> */}
                        </div>
                      </div>
                      {driveClickedArray?.length ?
                        <div className="flex flex-wrap gap-2 my-2 p-2 px-4">
                          {driveClickedArray?.map((item, index) => (
                            <figure key={index} className="w-[94px] rounded-sm overflow-hidden">
                              <img src={item.signed_image_url} />
                            </figure>
                          ))}
                        </div> : <></>
                      }
                    </div>
                    <div className={`transition-all duration-500 ${uploadImageProcess ? 'max-h-[1000px] opacity-100 mb-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <UploadAdCreative
                        onClose={handleCloseImageModal}
                        driveClickedArray={driveClickedArray}
                        setDriveClickedArray={setDriveClickedArray}
                        position="relative"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-2">
                <div className="flex mx-auto">
                  <Button
                    onClick={handleStart}
                    className={'text-yellow-300 rounded-full p-2 px-6 border border-yellow-300 hover:bg-yellow-300 hover:text-black'}
                  >
                    Get Started
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Custom Workflow Dialog */}
          <Dialog
            open={isCustomWorkflowDialogOpen}
            onOpenChange={setIsCustomWorkflowDialogOpen}
          >
            <DialogContent
              className={cn(
                "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-w-4xl h-screen",
                theme === "light"
                  ? "bg-white border-gray-200 text-gray-900"
                  : "bg-[#1A0B2E] border-[#6D28D9]/20 text-purple-50"
              )}
            >
              <button
                type="button"
                className={cn(
                  "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2",
                  theme === "light" ? "text-gray-600" : "text-purple-200"
                )}
                onClick={() => setIsCustomWorkflowDialogOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-x h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                <span className="sr-only">Close</span>
              </button>
              <div className="flex flex-col text-center sm:text-left space-y-2 pb-4 border-b">
                <DialogTitle
                  className={cn(
                    "tracking-tight text-xl font-semibold",
                    theme === "light" ? "text-gray-900" : "text-purple-50"
                  )}
                >
                  Create Custom Workflow
                </DialogTitle>
                <DialogDescription
                  className={cn(
                    "text-sm",
                    theme === "light" ? "text-gray-500" : "text-purple-200/70"
                  )}
                >
                  Create a new workflow by adding steps and configuring their
                  sequence.
                </DialogDescription>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                {/* Workflow Name Input */}
                <div>
                  <label
                    htmlFor="workflowName"
                    className={cn(
                      "text-sm font-medium flex items-center gap-0.5",
                      theme === "light" ? "text-gray-900" : "text-purple-50"
                    )}
                  >
                    Workflow Name
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="workflowName"
                    value={customWorkflowName}
                    onChange={(e) => setCustomWorkflowName(e.target.value)}
                    required
                    placeholder="Enter workflow name"
                    className={cn(
                      "mt-1.5 flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                      !customWorkflowName.trim() && "border-red-500",
                      theme === "light"
                        ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-purple-500/30"
                        : "bg-[#150923] border-purple-900 text-purple-50 placeholder:text-purple-400/50 focus:ring-2 focus:ring-purple-500/30"
                    )}
                  />
                  {!customWorkflowName.trim() && (
                    <p
                      className={cn(
                        "text-xs mt-1",
                        theme === "light" ? "text-red-500" : "text-red-400"
                      )}
                    >
                      Workflow name is required
                    </p>
                  )}
                </div>

                {/* Process Selection */}
                <div>
                  <label
                    htmlFor="process"
                    className={cn(
                      "text-sm font-medium",
                      theme === "light" ? "text-gray-900" : "text-purple-50"
                    )}
                  >
                    Select Process
                  </label>
                  <Select
                    value={selectedProcess}
                    onValueChange={(value) => {
                      setSelectedProcess(value);
                      const selectedType = stepTypes.find(
                        (p) => p.id === value
                      );
                      if (selectedType) {
                        const newNode = {
                          id: `custom-step-${customNodes.length + 1}`,
                          type: "custom",
                          position: {
                            x: 100 + customNodes.length * 180,
                            y: 100,
                          },
                          data: {
                            label: selectedType.name,
                            status: "waiting",
                            type: "process",
                            onDelete: (id: string) => {
                              setCustomNodes((nds) =>
                                nds.filter((node) => node.id !== id)
                              );
                              setCustomEdges((eds) =>
                                eds.filter(
                                  (edge) =>
                                    edge.source !== id && edge.target !== id
                                )
                              );
                            },
                          },
                        };
                        setCustomNodes((nds) => [...nds, newNode]);
                      }
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        "mt-1.5 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-[#1A0B2E]",
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#150923] border-purple-900 text-purple-50"
                      )}
                    >
                      <SelectValue placeholder="Select a process type" />
                    </SelectTrigger>
                    <SelectContent
                      className={cn(
                        theme === "light"
                          ? "bg-white border-gray-200"
                          : "bg-[#1A0B2E] border-purple-900/50"
                      )}
                    >
                      {stepTypes.map((type) => (
                        <SelectItem
                          key={type.id}
                          value={type.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer",
                            theme === "light"
                              ? "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300"
                              : "bg-[#2D1B69]/70 hover:bg-[#2D1B69] text-purple-100 border border-purple-500/30"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span>{type.name}</span>
                            {React.createElement(type.icon, {
                              className: cn(
                                "w-4 h-4",
                                theme === "light"
                                  ? "text-gray-700"
                                  : "text-purple-300"
                              ),
                            })}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ReactFlow Canvas */}
              <div
                className={cn(
                  "flex-1 rounded-lg border min-h-[400px] relative",
                  theme === "light"
                    ? "bg-gray-200/90 border-gray-200"
                    : "bg-[#2D1B69]/20 border-purple-500/20"
                )}
              >
                <ReactFlow
                  nodes={customNodes}
                  edges={customEdges}
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
                    setCustomNodes((nds) => applyNodeChanges(changes, nds));
                  }}
                  onEdgesChange={(changes) => {
                    setCustomEdges((eds) => applyEdgeChanges(changes, eds));
                  }}
                  onConnect={(params) => {
                    const newEdge = {
                      ...params,
                      type: "smoothstep",
                      animated: true,
                      style: {
                        stroke: theme === "light" ? "#6B7280" : "#6D28D9",
                        strokeWidth: 2,
                      },
                      markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: theme === "light" ? "#6B7280" : "#6D28D9",
                      },
                    };
                    setCustomEdges((eds) => addEdge(newEdge, eds));
                  }}
                >
                  <div
                    className={`grid-background ${theme === "light"
                      ? "grid-background--light"
                      : "grid-background--dark"
                      }`}
                  />
                  <Controls className="react-flow__controls" />
                </ReactFlow>
              </div>

              <DialogFooter
                className={cn(
                  "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-6 border-t",
                  theme === "light" ? "border-gray-200" : "border-purple-500/20"
                )}
              >
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCustomWorkflowDialogOpen(false)}
                    className={cn(
                      "inline-flex items-center justify-center text-yellow-300 gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2",
                      theme === "light"
                        ? "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                        : "bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20"
                    )}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveWorkflow}
                    className={cn(
                      "inline-flex items-center text-yellow-300 justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2",
                      "bg-purple-600 hover:bg-purple-700 text-white"
                    )}
                    disabled={!customWorkflowName.trim()}
                  >
                    Create Workflow
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Workflow Templates Grid */}

          <div className="space-y-4">
            {!isGoalDialogOpen &&
              workflows.map((template) => (
                <WorkflowCard
                  key={template.id}
                  workflow={template}
                  // brandDetails={brandDetails}
                  cGoal={workflowFormData.cGoal}
                  cgUrl={workflowFormData.cgUrl}
                  platforms={platforms}
                  openDialog={setIsGoalDialogOpen}
                  runFlow={runFlow}
                  driveClickedArray={driveClickedArray}
                  createTemplate={createTemplate}
                />
              ))}
          </div>
        </div>
      </div>
    </div >
  );
}
