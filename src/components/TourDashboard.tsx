import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Share2, 
  Play,
  Calendar,
  Image as ImageIcon,
  Loader2
} from 'lucide-react'
import { TourProject } from '@/hooks/useTours'

interface TourDashboardProps {
  projects: TourProject[]
  loading?: boolean
  onCreateNew: () => void
  onViewTour: (tour: TourProject) => void
  onEditTour: (tour: TourProject) => void
  onDeleteTour: (tour: TourProject) => void
  onShareTour: (tour: TourProject) => void
}

const TourCard: React.FC<{ 
  project: TourProject; 
  onView: () => void; 
  onEdit: () => void; 
  onDelete: () => void; 
  onShare: () => void; 
}> = ({ project, onView, onEdit, onDelete, onShare }) => {
  
  const getStatusColor = (status: TourProject['status']) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'processing': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'draft': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const totalImages = project.images?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group"
    >
      <Card className="overflow-hidden glass-effect border-border/50 hover:shadow-elegant transition-smooth">
        <div className="aspect-video relative overflow-hidden bg-muted">
          {project.thumbnailUrl ? (
            <img 
              src={project.thumbnailUrl} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <Badge className={`${getStatusColor(project.status)} capitalize font-medium`}>
              {project.status}
            </Badge>
          </div>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
              onClick={onView}
            >
              <Play className="h-8 w-8 ml-1" />
            </Button>
          </div>
        </div>

        <CardHeader className="space-y-3">
          <CardTitle className="text-lg leading-6 group-hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </CardTitle>
          
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{project.viewCount} views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              <span>{totalImages} images</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(project.createdAt)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onShare} disabled={project.status !== 'published'}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const TourDashboard: React.FC<TourDashboardProps> = ({
  projects,
  loading = false,
  onCreateNew,
  onViewTour,
  onEditTour,
  onDeleteTour,
  onShareTour,
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Virtual Tours
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and share your immersive 360° experiences
          </p>
        </div>
        
        <Button onClick={onCreateNew} className="shadow-glow hover:scale-105 transition-smooth group" variant="hero" size="lg">
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
          Create New Tour
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No tours yet</h3>
          <p className="text-muted-foreground mb-6">Create your first virtual tour to get started.</p>
          <Button onClick={onCreateNew} variant="hero" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Tour
          </Button>
        </div>
      ) : (
        <>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <TourCard
                key={project.id}
                project={project}
                onView={() => onViewTour(project)}
                onEdit={() => onEditTour(project)}
                onDelete={() => onDeleteTour(project)}
                onShare={() => onShareTour(project)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}