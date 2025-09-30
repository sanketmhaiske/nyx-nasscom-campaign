import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Heart, 
  Image, 
  Video, 
  ArrowUpDown, 
  SortAsc, 
  SortDesc, 
  MoreVertical, 
  Download, 
  Share2, 
  Edit, 
  Trash, 
  ExternalLink, 
  FolderOpen, 
  Check,
  Eye,
  Pencil,
  CheckCircle,
  Share
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

// Mock data for assets
const mockAssets = [
  {
    id: 1,
    name: 'Product Showcase',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    updatedAt: '2025-02-20T10:30:00Z',
    updatedBy: 'Vinay Gupta',
    size: '2.4 MB',
    isFavorite: false
  },
  {
    id: 2,
    name: 'Company Introduction',
    type: 'video',
    url: 'https://example.com/video1.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
    updatedAt: '2025-02-22T14:15:00Z',
    updatedBy: 'Sarah Johnson',
    size: '14.8 MB',
    isFavorite: true
  },
  {
    id: 3,
    name: 'Marketing Banner',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    updatedAt: '2025-02-24T09:45:00Z',
    updatedBy: 'Vinay Gupta',
    size: '1.7 MB',
    isFavorite: false
  },
  {
    id: 4,
    name: 'Product Demo',
    type: 'video',
    url: 'https://example.com/video2.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279',
    updatedAt: '2025-02-25T16:20:00Z',
    updatedBy: 'Michael Chen',
    size: '22.5 MB',
    isFavorite: true
  },
  {
    id: 5,
    name: 'Team Photo',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    updatedAt: '2025-02-26T11:10:00Z',
    updatedBy: 'Sarah Johnson',
    size: '3.2 MB',
    isFavorite: false
  },
  {
    id: 6,
    name: 'Customer Testimonial',
    type: 'video',
    url: 'https://example.com/video3.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
    updatedAt: '2025-02-26T13:40:00Z',
    updatedBy: 'Vinay Gupta',
    size: '18.9 MB',
    isFavorite: false
  },
  {
    id: 7,
    name: 'Product Catalog',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    updatedAt: '2025-02-18T09:15:00Z',
    updatedBy: 'Michael Chen',
    size: '4.1 MB',
    isFavorite: true
  },
  {
    id: 8,
    name: 'Office Tour',
    type: 'video',
    url: 'https://example.com/video4.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
    updatedAt: '2025-02-19T14:30:00Z',
    updatedBy: 'Sarah Johnson',
    size: '26.7 MB',
    isFavorite: false
  },
  {
    id: 9,
    name: 'Conference Poster',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    updatedAt: '2025-02-21T10:45:00Z',
    updatedBy: 'Vinay Gupta',
    size: '1.9 MB',
    isFavorite: false
  },
  {
    id: 10,
    name: 'Product Unboxing',
    type: 'video',
    url: 'https://example.com/video5.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    updatedAt: '2025-02-23T16:50:00Z',
    updatedBy: 'Michael Chen',
    size: '19.2 MB',
    isFavorite: true
  },
  {
    id: 11,
    name: 'Brand Guidelines',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1558655146-d09347e92766',
    updatedAt: '2025-02-24T11:20:00Z',
    updatedBy: 'Sarah Johnson',
    size: '2.8 MB',
    isFavorite: false
  },
  {
    id: 12,
    name: 'Feature Walkthrough',
    type: 'video',
    url: 'https://example.com/video6.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9',
    updatedAt: '2025-02-25T09:30:00Z',
    updatedBy: 'Vinay Gupta',
    size: '15.6 MB',
    isFavorite: false
  },
  {
    id: 13,
    name: 'Logo Collection',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb',
    updatedAt: '2025-02-17T14:40:00Z',
    updatedBy: 'Michael Chen',
    size: '1.5 MB',
    isFavorite: true
  },
  {
    id: 14,
    name: 'Annual Report',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    updatedAt: '2025-02-18T10:55:00Z',
    updatedBy: 'Sarah Johnson',
    size: '3.7 MB',
    isFavorite: false
  },
  {
    id: 15,
    name: 'User Tutorial',
    type: 'video',
    url: 'https://example.com/video7.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    updatedAt: '2025-02-19T15:10:00Z',
    updatedBy: 'Vinay Gupta',
    size: '24.3 MB',
    isFavorite: false
  }
];

const ContentLibrary = () => {
  const { theme } = useTheme();
  const [assets, setAssets] = useState(mockAssets);
  const [filteredAssets, setFilteredAssets] = useState(mockAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const assetsPerPage = 10;
  const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);

  // Handle toggling favorite status
  const toggleFavorite = (id: number) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, isFavorite: !asset.isFavorite } : asset
    ));
  };

  // Filter and sort assets based on current filters
  useEffect(() => {
    let result = [...assets];
    
    // Filter by type
    if (activeTab === 'images') {
      result = result.filter(asset => asset.type === 'image');
    } else if (activeTab === 'videos') {
      result = result.filter(asset => asset.type === 'video');
    } else if (activeTab === 'favorites') {
      result = result.filter(asset => asset.isFavorite);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(asset => 
        asset.name.toLowerCase().includes(query)
      );
    }
    
    // Sort assets
    switch (sortBy) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'size-asc':
        result.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
        break;
      case 'size-desc':
        result.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
        break;
      default:
        break;
    }
    
    setFilteredAssets(result);
  }, [assets, searchQuery, activeTab, sortBy]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle action on asset
  const handleAction = (action: string, id: number, event?: React.MouseEvent | React.KeyboardEvent) => {
    switch (action) {
      case 'open':
        console.log(`Opening asset ${id}`);
        break;
      case 'open-with':
        console.log(`Opening asset ${id} with...`);
        break;
      case 'rename':
        console.log(`Renaming asset ${id}`);
        break;
      case 'delete':
        console.log(`Deleting asset ${id}`);
        setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
        break;
      case 'download':
        console.log(`Downloading asset ${id}`);
        break;
      case 'select':
        toggleSelection(id, event);
        break;
      case 'share':
        console.log(`Sharing asset ${id}`);
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  // Toggle selection with support for Shift and Ctrl keys
  const toggleSelection = (id: number, event?: React.MouseEvent | React.KeyboardEvent) => {
    // Handle single selection
    if (!event || (!event.shiftKey && !event.ctrlKey && !event.metaKey)) {
      if (selectedAssets.includes(id)) {
        setSelectedAssets(selectedAssets.filter(assetId => assetId !== id));
      } else {
        setSelectedAssets([...selectedAssets, id]);
      }
      setLastSelectedId(id);
      return;
    }
    
    // Handle Ctrl/Cmd key (toggle selection)
    if (event.ctrlKey || event.metaKey) {
      if (selectedAssets.includes(id)) {
        setSelectedAssets(selectedAssets.filter(assetId => assetId !== id));
      } else {
        setSelectedAssets([...selectedAssets, id]);
      }
      setLastSelectedId(id);
      return;
    }
    
    // Handle Shift key (range selection)
    if (event.shiftKey && lastSelectedId !== null) {
      const currentAssets = getActiveAssets();
      const currentIds = currentAssets.map(asset => asset.id);
      
      const startIdx = currentIds.indexOf(lastSelectedId);
      const endIdx = currentIds.indexOf(id);
      
      if (startIdx !== -1 && endIdx !== -1) {
        const start = Math.min(startIdx, endIdx);
        const end = Math.max(startIdx, endIdx);
        
        const rangeIds = currentIds.slice(start, end + 1);
        
        // Add the range to existing selection
        const newSelection = [...new Set([...selectedAssets, ...rangeIds])];
        setSelectedAssets(newSelection);
      }
    }
  };

  // Pagination logic
  const indexOfLastAsset = currentPage * assetsPerPage;
  const indexOfFirstAsset = indexOfLastAsset - assetsPerPage;
  
  // Get current assets for each tab
  const getCurrentAssets = (assets: any[]) => {
    return assets.slice(indexOfFirstAsset, indexOfLastAsset);
  };

  // Get filtered assets for each tab
  const imageAssets = filteredAssets.filter(asset => asset.type === 'image');
  const videoAssets = filteredAssets.filter(asset => asset.type === 'video');
  const favoriteAssets = filteredAssets.filter(asset => asset.isFavorite);
  
  // Calculate total pages for the active tab
  const getActiveAssets = () => {
    switch (activeTab) {
      case 'images':
        return imageAssets;
      case 'videos':
        return videoAssets;
      case 'favorites':
        return favoriteAssets;
      default:
        return filteredAssets;
    }
  };
  
  const totalPages = Math.ceil(getActiveAssets().length / assetsPerPage);
  
  // Reset to page 1 when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, sortBy]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle select all assets
  const handleSelectAll = () => {
    const currentAssets = getActiveAssets();
    
    if (selectedAssets.length === currentAssets.length) {
      // If all assets are selected, deselect all
      setSelectedAssets([]);
    } else {
      // Otherwise, select all assets in the current tab
      setSelectedAssets(currentAssets.map(asset => asset.id));
    }
  };
  
  // Handle delete selected assets
  const handleDeleteSelected = () => {
    // In a real app, this would make an API call to delete the assets
    console.log(`Deleting assets with IDs: ${selectedAssets.join(', ')}`);
    
    // Filter out the deleted assets
    setAssets(prevAssets => 
      prevAssets.filter(asset => !selectedAssets.includes(asset.id))
    );
    
    // Clear selection
    setSelectedAssets([]);
  };

  return (
    <div className={cn(
      "p-8 min-h-screen",
      theme === 'dark' 
        ? "bg-gradient-to-b from-[#0F0720] via-[#1A0B2E] to-[#0F0720] text-purple-200" 
        : "bg-gray-50 text-gray-800"
    )}>
      <div className="mb-8">
        <h1 className={cn(
          "text-2xl font-bold mb-2",
          theme === 'dark' ? "text-purple-200" : "text-gray-900"
        )}>
          Content Library
        </h1>
        <p className={cn(
          "text-sm",
          theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
        )}>
          Manage your images, videos, and other media assets
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
              theme === 'dark' ? "text-purple-400/50" : "text-gray-500"
            )} />
            <Input
              placeholder="Search assets by name..."
              className={cn(
                "pl-10",
                theme === 'dark' 
                  ? "bg-[#150923] border-purple-900 text-purple-200 placeholder:text-purple-400/50" 
                  : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={cn(
                "w-full md:w-[180px]",
                theme === 'dark' 
                  ? "bg-[#150923] border-purple-900 text-purple-200" 
                  : "bg-white border-gray-300 text-gray-900"
              )}>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className={cn(
                theme === 'dark' 
                  ? "bg-[#1A0B2E] border-purple-900/50" 
                  : "bg-white border-gray-300 text-gray-900"
              )}>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="size-asc">Size (Smallest)</SelectItem>
                <SelectItem value="size-desc">Size (Largest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selection Controls */}
        {selectedAssets.length > 0 && (
          <div className={cn(
            "flex items-center justify-between p-3 rounded-md",
            theme === 'dark' 
              ? "bg-[#2D1B69]/40 border border-purple-900/50" 
              : "bg-gray-100 border border-gray-200"
          )}>
            <div className="flex items-center gap-2">
              <span className={theme === 'dark' ? "text-purple-200" : "text-gray-700"}>
                {selectedAssets.length} {selectedAssets.length === 1 ? 'asset' : 'assets'} selected
              </span>
            </div>
            <div className="flex gap-2">
              {/* Only show Select All button if at least one item is selected */}
              {selectedAssets.length > 0 && selectedAssets.length < getActiveAssets().length && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                  className={cn(
                    theme === 'dark' 
                      ? "bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border-purple-500/20" 
                      : "bg-white text-gray-700 border-gray-300"
                  )}
                >
                  Select All
                </Button>
              )}
              
              {/* Show Deselect All button if all items are selected */}
              {selectedAssets.length === getActiveAssets().length && getActiveAssets().length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedAssets([])}
                  className={cn(
                    theme === 'dark' 
                      ? "bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border-purple-500/20" 
                      : "bg-white text-gray-700 border-gray-300"
                  )}
                >
                  Deselect All
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedAssets([])}
                className={cn(
                  theme === 'dark' 
                    ? "bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border-purple-500/20" 
                    : "bg-white text-gray-700 border-gray-300"
                )}
              >
                Clear Selection
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteSelected}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        {/* Tabs for filtering */}
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className={cn(
            "mb-6",
            theme === 'dark' ? "bg-[#150923] border border-purple-900/50" : "bg-gray-100"
          )}>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {getCurrentAssets(filteredAssets).map(asset => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  toggleFavorite={toggleFavorite}
                  formatDate={formatDate}
                  handleAction={handleAction}
                  selectedAssets={selectedAssets}
                  setSelectedAssets={setSelectedAssets}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {getCurrentAssets(imageAssets).map(asset => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  toggleFavorite={toggleFavorite}
                  formatDate={formatDate}
                  handleAction={handleAction}
                  selectedAssets={selectedAssets}
                  setSelectedAssets={setSelectedAssets}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {getCurrentAssets(videoAssets).map(asset => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  toggleFavorite={toggleFavorite}
                  formatDate={formatDate}
                  handleAction={handleAction}
                  selectedAssets={selectedAssets}
                  setSelectedAssets={setSelectedAssets}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {getCurrentAssets(favoriteAssets).map(asset => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  toggleFavorite={toggleFavorite}
                  formatDate={formatDate}
                  handleAction={handleAction}
                  selectedAssets={selectedAssets}
                  setSelectedAssets={setSelectedAssets}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={cn(
                  "px-3",
                  theme === 'dark' 
                    ? "bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border-purple-500/20 disabled:opacity-50" 
                    : "bg-white text-gray-700 border-gray-300 disabled:opacity-50"
                )}
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button 
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "w-8 h-8 p-0",
                      currentPage === page
                        ? theme === 'dark' 
                          ? "bg-purple-600 text-white" 
                          : "bg-purple-600 text-white"
                        : theme === 'dark' 
                          ? "bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border-purple-500/20" 
                          : "bg-white text-gray-700 border-gray-300"
                    )}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={cn(
                  "px-3",
                  theme === 'dark' 
                    ? "bg-[#2D1B69]/30 hover:bg-[#2D1B69] text-purple-200 border-purple-500/20 disabled:opacity-50" 
                    : "bg-white text-gray-700 border-gray-300 disabled:opacity-50"
                )}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Asset Card Component
interface AssetCardProps {
  asset: {
    id: number;
    name: string;
    type: string;
    url: string;
    thumbnail?: string;
    updatedAt: string;
    updatedBy: string;
    size: string;
    isFavorite: boolean;
  };
  toggleFavorite: (id: number) => void;
  formatDate: (dateString: string) => string;
  handleAction: (action: string, id: number, event?: React.MouseEvent | React.KeyboardEvent) => void;
  selectedAssets: number[];
  setSelectedAssets: (assets: number[]) => void;
}

const AssetCard = ({ asset, toggleFavorite, formatDate, handleAction, selectedAssets, setSelectedAssets }: AssetCardProps) => {
  const { theme } = useTheme();
  const isSelected = selectedAssets.includes(asset.id);
  
  // Toggle selection when clicking on the card
  const toggleSelection = (e: React.MouseEvent) => {
    // Prevent triggering when clicking on buttons or links
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('a')) {
      return;
    }
    
    handleAction('select', asset.id, e);
  };
  
  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full h-full">
        <Card 
          className={cn(
            "overflow-hidden flex flex-col transition-all hover:shadow-md cursor-pointer",
            isSelected && "ring-2 ring-purple-500",
            theme === 'dark' 
              ? "bg-[#1A0B2E] border-purple-900 shadow-purple-900/20 hover:shadow-purple-900/30" 
              : "bg-white border-gray-200 hover:border-purple-500/30"
          )}
          onClick={toggleSelection}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAction('select', asset.id, e);
            }
          }}
          tabIndex={0}
        >
          <div className="relative aspect-video w-full overflow-hidden">
            {asset.type === 'image' ? (
              <img 
                src={asset.url} 
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <img 
                  src={asset.thumbnail} 
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-3 cursor-pointer">
                      <div className="w-0 h-0 ml-1 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isSelected && (
              <div className="absolute top-3 left-3 z-10 bg-purple-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            
            <button 
              onClick={() => toggleFavorite(asset.id)}
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full transition-colors",
                asset.isFavorite 
                  ? "bg-red-500/90 text-white" 
                  : theme === 'dark' 
                    ? "bg-[#2D1B69] text-purple-200 hover:bg-[#2D1B69]/80" 
                    : "bg-gray-100/70 text-gray-600 hover:bg-gray-200/80"
              )}
            >
              <Heart className={cn(
                "h-4 w-4",
                asset.isFavorite ? "fill-current" : ""
              )} />
            </button>
            
            <Badge className={cn(
              "absolute top-3 left-3",
              isSelected && "left-12",
              asset.type === 'image' 
                ? "bg-blue-500" 
                : "bg-purple-500"
            )}>
              {asset.type === 'image' ? 'Image' : 'Video'}
            </Badge>
          </div>
          
          <div className="p-3 flex flex-col flex-grow">
            <h3 className={cn(
              "font-medium mb-1 truncate text-sm",
              theme === 'dark' ? "text-purple-200" : "text-gray-900"
            )}>
              {asset.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-1">
              <Calendar className={cn(
                "h-3 w-3",
                theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
              )} />
              <span className={cn(
                "text-xs",
                theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
              )}>
                {formatDate(asset.updatedAt)}
              </span>
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              <User className={cn(
                "h-3 w-3",
                theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
              )} />
              <span className={cn(
                "text-xs",
                theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
              )}>
                {asset.updatedBy}
              </span>
            </div>
            
            <div className="mt-auto pt-2 border-t flex justify-between items-center">
              <span className={cn(
                "text-xs",
                theme === 'dark' ? "text-purple-300/70 border-purple-900/50" : "text-gray-500 border-gray-200"
              )}>
                {asset.size}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={cn(
                      "h-6 w-6 p-0",
                      theme === 'dark' 
                        ? "text-purple-200 hover:text-purple-300 hover:bg-[#2D1B69]/40" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={cn(
                  "w-48",
                  theme === 'dark' 
                    ? "bg-[#1A0B2E] border-purple-900/50 text-purple-200" 
                    : "bg-white border-gray-200 text-gray-800"
                )}>
                  <DropdownMenuItem 
                    onClick={() => handleAction('open', asset.id)}
                    className={theme === 'dark' ? "hover:bg-[#2D1B69]/40 focus:bg-[#2D1B69]/40" : ""}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleAction('open-with', asset.id)}
                    className={theme === 'dark' ? "hover:bg-[#2D1B69]/40 focus:bg-[#2D1B69]/40" : ""}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Open with
                  </DropdownMenuItem>
                  <DropdownMenuSeparator 
                    className={theme === 'dark' ? "bg-purple-900/50" : ""}
                  />
                  <DropdownMenuItem 
                    onClick={() => handleAction('rename', asset.id)}
                    className={theme === 'dark' ? "hover:bg-[#2D1B69]/40 focus:bg-[#2D1B69]/40" : ""}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleAction('delete', asset.id)}
                    className={theme === 'dark' ? "hover:bg-[#2D1B69]/40 focus:bg-[#2D1B69]/40" : ""}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator 
                    className={theme === 'dark' ? "bg-purple-900/50" : ""}
                  />
                  <DropdownMenuItem 
                    onClick={() => handleAction('download', asset.id)}
                    className={theme === 'dark' ? "hover:bg-[#2D1B69]/40 focus:bg-[#2D1B69]/40" : ""}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleAction('select', asset.id)}
                    className={theme === 'dark' ? "hover:bg-[#2D1B69]/40 focus:bg-[#2D1B69]/40" : ""}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Select
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleAction('share', asset.id)}
                    className={theme === 'dark' ? "hover:bg-[#2D1B69]/40 focus:bg-[#2D1B69]/40" : ""}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className={cn(
        "w-48",
        theme === 'dark' 
          ? "bg-[#1A0B2E] border-purple-900/50 text-purple-200" 
          : "bg-white border-gray-200 text-gray-800"
      )}>
        <ContextMenuItem 
          className={cn(
            theme === 'dark' ? "hover:bg-[#2D1B69] focus:bg-[#2D1B69]" : "hover:bg-gray-100 focus:bg-gray-100"
          )}
          onClick={() => handleAction('open', asset.id)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Open
        </ContextMenuItem>
        <ContextMenuItem 
          className={cn(
            theme === 'dark' ? "hover:bg-[#2D1B69] focus:bg-[#2D1B69]" : "hover:bg-gray-100 focus:bg-gray-100"
          )}
          onClick={() => handleAction('open-with', asset.id)}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open with
        </ContextMenuItem>
        <ContextMenuSeparator 
          className={theme === 'dark' ? "bg-purple-900/50" : "bg-gray-200"}
        />
        <ContextMenuItem 
          className={cn(
            theme === 'dark' ? "hover:bg-[#2D1B69] focus:bg-[#2D1B69]" : "hover:bg-gray-100 focus:bg-gray-100"
          )}
          onClick={() => handleAction('rename', asset.id)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem 
          className={cn(
            "text-red-600",
            theme === 'dark' ? "hover:bg-[#2D1B69] focus:bg-[#2D1B69]" : "hover:bg-gray-100 focus:bg-gray-100"
          )}
          onClick={() => handleAction('delete', asset.id)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
        <ContextMenuSeparator 
          className={theme === 'dark' ? "bg-purple-900/50" : "bg-gray-200"}
        />
        <ContextMenuItem 
          className={cn(
            theme === 'dark' ? "hover:bg-[#2D1B69] focus:bg-[#2D1B69]" : "hover:bg-gray-100 focus:bg-gray-100"
          )}
          onClick={() => handleAction('download', asset.id)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </ContextMenuItem>
        <ContextMenuItem 
          className={cn(
            theme === 'dark' ? "hover:bg-[#2D1B69] focus:bg-[#2D1B69]" : "hover:bg-gray-100 focus:bg-gray-100"
          )}
          onClick={(e) => handleAction('select', asset.id, e)}
        >
          <CheckCircle className={cn("mr-2 h-4 w-4", isSelected ? "text-purple-500" : "")} />
          {isSelected ? "Deselect" : "Select"}
        </ContextMenuItem>
        <ContextMenuItem 
          className={cn(
            theme === 'dark' ? "hover:bg-[#2D1B69] focus:bg-[#2D1B69]" : "hover:bg-gray-100 focus:bg-gray-100"
          )}
          onClick={() => handleAction('share', asset.id)}
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ContentLibrary;
