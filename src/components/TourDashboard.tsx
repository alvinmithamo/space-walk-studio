import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Eye, 
  Share2, 
  MoreHorizontal, 
  Calendar,
  Camera,
  Users,
  Download,
  Edit3,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TourProject {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  status: 'draft' | 'processing' | 'published';
  views: number;
  totalImages: number;
  processedImages: number;
  shareUrl?: string;
}

interface TourDashboardProps {
  projects: TourProject[];
  onCreateNew: () => void;
  onViewTour: (project: TourProject) => void;
  onEditTour: (project: TourProject) => void;
  onDeleteTour: (project: TourProject) => void;
  onShareTour: (project: TourProject) => void;
}

const TourCard: React.FC<{
  project: TourProject;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}> = ({ project, onView, onEdit, onDelete, onShare }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'processing': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const processingProgress = project.totalImages > 0 
    ? (project.processedImages / project.totalImages) * 100 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="h-full transition-smooth hover:shadow-elegant bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{project.title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {project.description}
              </CardDescription>
            </div>
            <Badge 
              className={`ml-2 shrink-0 ${getStatusColor(project.status)} border`}
              variant="outline"
            >
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Thumbnail */}
          <div 
            className="aspect-video bg-muted rounded-lg bg-cover bg-center relative overflow-hidden cursor-pointer group"
            style={{ backgroundImage: `url(${project.thumbnail})` }}
            onClick={onView}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-smooth flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="hero" size="sm" className="shadow-glow">
                  <Eye className="h-4 w-4" />
                  View Tour
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Processing Progress */}
          {project.status === 'processing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing images...</span>
                <span className="text-muted-foreground">
                  {project.processedImages}/{project.totalImages}
                </span>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Camera className="h-4 w-4" />
                <span>{project.totalImages}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{project.views}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onView}
              className="flex-1"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onShare}
              disabled={project.status !== 'published'}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const TourDashboard: React.FC<TourDashboardProps> = ({
  projects,
  onCreateNew,
  onViewTour,
  onEditTour,
  onDeleteTour,
  onShareTour,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    processing: projects.filter(p => p.status === 'processing').length,
    totalViews: projects.reduce((sum, p) => sum + p.views, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My Virtual Tours
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your 360° virtual tour experiences
          </p>
        </div>
        <Button 
          variant="hero" 
          size="lg" 
          onClick={onCreateNew}
          className="shadow-glow"
        >
          <Plus className="h-5 w-5" />
          Create New Tour
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tours</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Camera className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{stats.processing}</p>
              </div>
              <Download className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tours Grid */}
      {filteredProjects.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TourCard
                project={project}
                onView={() => onViewTour(project)}
                onEdit={() => onEditTour(project)}
                onDelete={() => onDeleteTour(project)}
                onShare={() => onShareTour(project)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-12"
        >
          <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No tours yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get started by creating your first virtual tour. Upload 360° images and let users explore your spaces.
          </p>
          <Button variant="hero" size="lg" onClick={onCreateNew}>
            <Plus className="h-5 w-5" />
            Create Your First Tour
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default TourDashboard;