import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from '@/hooks/use-toast'

export interface TourProject {
  id: string
  title: string
  description: string | null
  status: 'draft' | 'processing' | 'published'
  viewCount: number
  thumbnailUrl: string | null
  shareToken: string | null
  createdAt: string
  updatedAt: string
  images?: TourImage[]
}

export interface TourImage {
  id: string
  tourId: string
  imageUrl: string
  orderIndex: number
  title: string | null
  hotspots: any | null
}

export function useTours() {
  const [tours, setTours] = useState<TourProject[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchTours = async () => {
    if (!user) {
      setTours([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('tours')
        .select(`
          *,
          tour_images (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedTours: TourProject[] = data.map(tour => ({
        id: tour.id,
        title: tour.title,
        description: tour.description,
        status: tour.status,
        viewCount: tour.view_count,
        thumbnailUrl: tour.thumbnail_url,
        shareToken: tour.share_token,
        createdAt: tour.created_at,
        updatedAt: tour.updated_at,
        images: tour.tour_images?.map((img: any) => ({
          id: img.id,
          tourId: img.tour_id,
          imageUrl: img.image_url,
          orderIndex: img.order_index,
          title: img.title,
          hotspots: img.hotspots
        })) || []
      }))

      setTours(formattedTours)
    } catch (error: any) {
      console.error('Error fetching tours:', error)
      toast({
        title: "Error",
        description: "Failed to load tours",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createTour = async (title: string, description?: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('tours')
        .insert({
          user_id: user.id,
          title,
          description,
          status: 'draft',
          view_count: 0,
          share_token: crypto.randomUUID()
        })
        .select()
        .single()

      if (error) throw error

      const newTour: TourProject = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        viewCount: data.view_count,
        thumbnailUrl: data.thumbnail_url,
        shareToken: data.share_token,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        images: []
      }

      setTours(prev => [newTour, ...prev])
      
      toast({
        title: "Tour created",
        description: "Your new tour has been created successfully.",
      })

      return newTour
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const updateTour = async (id: string, updates: Partial<TourProject>) => {
    try {
      const { error } = await supabase
        .from('tours')
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          thumbnail_url: updates.thumbnailUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setTours(prev => prev.map(tour => 
        tour.id === id ? { ...tour, ...updates } : tour
      ))

      toast({
        title: "Tour updated",
        description: "Your tour has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteTour = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTours(prev => prev.filter(tour => tour.id !== id))

      toast({
        title: "Tour deleted",
        description: "Your tour has been deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const uploadImage = async (tourId: string, file: File, orderIndex: number) => {
    try {
      // Upload to Supabase Storage
      const fileName = `${tourId}/${crypto.randomUUID()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(fileName)

      // Save to database
      const { data, error } = await supabase
        .from('tour_images')
        .insert({
          tour_id: tourId,
          image_url: publicUrl,
          order_index: orderIndex,
          title: `Room ${orderIndex + 1}`
        })
        .select()
        .single()

      if (error) throw error

      // Update tour status to processing if it's the first image
      await supabase
        .from('tours')
        .update({
          status: 'processing',
          thumbnail_url: orderIndex === 0 ? publicUrl : undefined
        })
        .eq('id', tourId)

      // Refresh tours
      fetchTours()

      return data
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchTours()
  }, [user])

  return {
    tours,
    loading,
    createTour,
    updateTour,
    deleteTour,
    uploadImage,
    refreshTours: fetchTours
  }
}