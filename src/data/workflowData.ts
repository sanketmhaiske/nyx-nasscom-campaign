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
  LucideIcon
} from 'lucide-react';
import { Workflow, WorkflowStep, StepType, CreativeAsset, GeneratedContent } from '../types/workflow';

export const workflowTemplates: Workflow[] = [
  {
    id: '1',
    name: 'Traffic Campaign',
    description: 'Setup and launch traffic campaigns',
    activeInstances: 5,
    successRate: 85,
    completedCount: 150,
    steps: [
      {
        name: 'Campaign Planning',
        status: 'pending',
        subSteps: [
          { name: 'Naming your ad campaign', status: 'pending' },
          { name: 'Defining brand persona', status: 'pending' },
          { name: 'Configuring target demographic', status: 'pending' },
          { name: 'Selecting relevant ad platforms', status: 'pending' },
          { name: 'Allocating total budget', status: 'pending' },
          { name: 'Distributing budget between ad platforms', status: 'pending' },
          { name: 'Determining campaign start and end date', status: 'pending' }
        ],
        type: 'campaign-planning'
      },
      {
        name: 'Creative Selection',
        status: 'pending',
        subSteps: [
          { name: 'Uploading creative assets', status: 'pending' },
          { name: 'Selecting primary creative', status: 'pending' },
          { name: 'Selecting secondary creatives', status: 'pending' }
        ],
        type: 'creative-selection'
      },
      {
        name: 'Ad Copy Generation',
        status: 'pending',
        subSteps: [
          { name: 'Generating headlines', status: 'pending' },
          { name: 'Generating descriptions', status: 'pending' },
          { name: 'Generating captions', status: 'pending' }
        ],
        type: 'ad-copy'
      },
      {
        name: 'User Review',
        status: 'pending',
        subSteps: [
          { name: 'Review campaign settings', status: 'pending' },
          { name: 'Review creative assets', status: 'pending' },
          { name: 'Review ad copy', status: 'pending' },
          { name: 'Final approval', status: 'pending' }
        ],
        type: 'user-review'
      }
    ]
  },
  {
    id: '2',
    name: 'Lead Generation',
    description: 'Generate qualified leads for your business',
    activeInstances: 3,
    successRate: 78,
    completedCount: 92,
    steps: [
      {
        name: 'Campaign Planning',
        status: 'pending',
        subSteps: [
          { name: 'Naming your ad campaign', status: 'pending' },
          { name: 'Defining brand persona', status: 'pending' },
          { name: 'Configuring target demographic', status: 'pending' },
          { name: 'Selecting relevant ad platforms', status: 'pending' },
          { name: 'Allocating total budget', status: 'pending' },
          { name: 'Distributing budget between ad platforms', status: 'pending' },
          { name: 'Determining campaign start and end date', status: 'pending' }
        ],
        type: 'campaign-planning'
      },
      {
        name: 'Lead Magnet Creation',
        status: 'pending',
        subSteps: [
          { name: 'Selecting lead magnet type', status: 'pending' },
          { name: 'Configuring lead form fields', status: 'pending' },
          { name: 'Setting up lead qualification criteria', status: 'pending' }
        ],
        type: 'lead-magnet'
      },
      {
        name: 'Creative Selection',
        status: 'pending',
        subSteps: [
          { name: 'Uploading creative assets', status: 'pending' },
          { name: 'Selecting primary creative', status: 'pending' },
          { name: 'Selecting secondary creatives', status: 'pending' }
        ],
        type: 'creative-selection'
      },
      {
        name: 'Ad Copy Generation',
        status: 'pending',
        subSteps: [
          { name: 'Generating headlines', status: 'pending' },
          { name: 'Generating descriptions', status: 'pending' },
          { name: 'Generating captions', status: 'pending' }
        ],
        type: 'ad-copy'
      },
      {
        name: 'User Review',
        status: 'pending',
        subSteps: [
          { name: 'Review campaign settings', status: 'pending' },
          { name: 'Review lead magnet', status: 'pending' },
          { name: 'Review creative assets', status: 'pending' },
          { name: 'Review ad copy', status: 'pending' },
          { name: 'Final approval', status: 'pending' }
        ],
        type: 'user-review'
      }
    ]
  },
  {
    id: '3',
    name: 'Brand Awareness',
    description: 'Increase visibility and recognition for your brand',
    activeInstances: 2,
    successRate: 92,
    completedCount: 45,
    steps: [
      {
        name: 'Campaign Planning',
        status: 'pending',
        subSteps: [
          { name: 'Naming your ad campaign', status: 'pending' },
          { name: 'Defining brand persona', status: 'pending' },
          { name: 'Configuring target demographic', status: 'pending' },
          { name: 'Selecting relevant ad platforms', status: 'pending' },
          { name: 'Allocating total budget', status: 'pending' },
          { name: 'Distributing budget between ad platforms', status: 'pending' },
          { name: 'Determining campaign start and end date', status: 'pending' }
        ],
        type: 'campaign-planning'
      },
      {
        name: 'Creative Selection',
        status: 'pending',
        subSteps: [
          { name: 'Uploading creative assets', status: 'pending' },
          { name: 'Selecting primary creative', status: 'pending' },
          { name: 'Selecting secondary creatives', status: 'pending' }
        ],
        type: 'creative-selection'
      },
      {
        name: 'Ad Copy Generation',
        status: 'pending',
        subSteps: [
          { name: 'Generating headlines', status: 'pending' },
          { name: 'Generating descriptions', status: 'pending' },
          { name: 'Generating captions', status: 'pending' }
        ],
        type: 'ad-copy'
      },
      {
        name: 'User Review',
        status: 'pending',
        subSteps: [
          { name: 'Review campaign settings', status: 'pending' },
          { name: 'Review creative assets', status: 'pending' },
          { name: 'Review ad copy', status: 'pending' },
          { name: 'Final approval', status: 'pending' }
        ],
        type: 'user-review'
      }
    ]
  }
];

export const stepTypes: StepType[] = [
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Create content for your campaign',
    icon: Sparkles,
    subSteps: [
      { name: 'Generate headlines', status: 'pending' },
      { name: 'Generate descriptions', status: 'pending' },
      { name: 'Generate captions', status: 'pending' }
    ],
    type: 'content-creation'
  },
  {
    id: 'audience-targeting',
    name: 'Audience Targeting',
    description: 'Define your target audience',
    icon: Target,
    subSteps: [
      { name: 'Define demographics', status: 'pending' },
      { name: 'Define interests', status: 'pending' },
      { name: 'Define behaviors', status: 'pending' }
    ],
    type: 'audience-targeting'
  },
  {
    id: 'budget-allocation',
    name: 'Budget Allocation',
    description: 'Allocate your budget across platforms',
    icon: DollarSign,
    subSteps: [
      { name: 'Set total budget', status: 'pending' },
      { name: 'Allocate budget by platform', status: 'pending' },
      { name: 'Set bid strategy', status: 'pending' }
    ],
    type: 'budget-allocation'
  },
  {
    id: 'scheduling',
    name: 'Scheduling',
    description: 'Schedule your campaign',
    icon: Calendar,
    subSteps: [
      { name: 'Set start date', status: 'pending' },
      { name: 'Set end date', status: 'pending' },
      { name: 'Set dayparting', status: 'pending' }
    ],
    type: 'scheduling'
  },
  {
    id: 'creative-upload',
    name: 'Creative Upload',
    description: 'Upload creative assets',
    icon: Upload,
    subSteps: [
      { name: 'Upload images', status: 'pending' },
      { name: 'Upload videos', status: 'pending' },
      { name: 'Review assets', status: 'pending' }
    ],
    type: 'creative-upload'
  },
  {
    id: 'performance-analysis',
    name: 'Performance Analysis',
    description: 'Analyze campaign performance',
    icon: LineChart,
    subSteps: [
      { name: 'Review metrics', status: 'pending' },
      { name: 'Identify top performers', status: 'pending' },
      { name: 'Generate insights', status: 'pending' }
    ],
    type: 'performance-analysis'
  },
  {
    id: 'optimization',
    name: 'Optimization',
    description: 'Optimize your campaign',
    icon: Settings,
    subSteps: [
      { name: 'Adjust bids', status: 'pending' },
      { name: 'Refine targeting', status: 'pending' },
      { name: 'Update creatives', status: 'pending' }
    ],
    type: 'optimization'
  }
];

export const defaultSteps: WorkflowStep[] = [
  {
    name: 'Campaign Planning',
    status: 'pending',
    subSteps: [
      { name: 'Naming your ad campaign', status: 'pending' },
      { name: 'Defining brand persona', status: 'pending' },
      { name: 'Configuring target demographic', status: 'pending' },
      { name: 'Selecting relevant ad platforms', status: 'pending' },
      { name: 'Allocating total budget', status: 'pending' },
      { name: 'Distributing budget between ad platforms', status: 'pending' },
      { name: 'Determining campaign start and end date', status: 'pending' }
    ],
    type: 'campaign-planning'
  },
  {
    name: 'Creative Selection',
    status: 'pending',
    subSteps: [
      { name: 'Uploading creative assets', status: 'pending' },
      { name: 'Selecting primary creative', status: 'pending' },
      { name: 'Selecting secondary creatives', status: 'pending' }
    ],
    type: 'creative-selection'
  },
  {
    name: 'Ad Copy Generation',
    status: 'pending',
    subSteps: [
      { name: 'Generating headlines', status: 'pending' },
      { name: 'Generating descriptions', status: 'pending' },
      { name: 'Generating captions', status: 'pending' }
    ],
    type: 'ad-copy'
  },
  {
    name: 'User Review',
    status: 'pending',
    subSteps: [
      { name: 'Review campaign settings', status: 'pending' },
      { name: 'Review creative assets', status: 'pending' },
      { name: 'Review ad copy', status: 'pending' },
      { name: 'Final approval', status: 'pending' }
    ],
    type: 'user-review'
  }
];

export const mockCreativeAssets: CreativeAsset[] = [
  {
    url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
    aspectRatio: '16:9',
    type: 'image',
    name: 'product-showcase-1.jpg',
    size: '1.2 MB',
    dimensions: '1920x1080'
  },
  {
    url: 'https://images.unsplash.com/photo-1611162616305-c69b3396004b',
    aspectRatio: '1:1',
    type: 'image',
    name: 'lifestyle-shot-1.jpg',
    size: '0.9 MB',
    dimensions: '1080x1080'
  },
  {
    url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb',
    aspectRatio: '4:5',
    type: 'image',
    name: 'product-detail-1.jpg',
    size: '1.1 MB',
    dimensions: '1080x1350'
  }
];

export const mockGeneratedContent: GeneratedContent = {
  headlines: [
    'Transform Your Digital Experience Today',
    'Unlock New Possibilities With Our Platform',
    'Elevate Your Workflow With Intelligent Solutions'
  ],
  descriptions: [
    'Our cutting-edge platform combines AI-powered insights with intuitive design to streamline your workflow and boost productivity by up to 40%.',
    'Join thousands of satisfied customers who have revolutionized their digital experience with our award-winning solution.',
    'Designed for modern teams, our platform integrates seamlessly with your existing tools while providing powerful new capabilities.'
  ],
  captions: [
    'Experience the future of digital productivity #WorkSmarter',
    'Seamless integration, powerful results #DigitalTransformation',
    'Built for teams that demand excellence #TeamProductivity'
  ]
};
