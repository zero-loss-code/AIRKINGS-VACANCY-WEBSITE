import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, LogOut, Globe, Upload, X, Save, ArrowLeft, GripVertical } from 'lucide-react';
import { supabase, JobPosting } from '../lib/supabase';

// Include optional focal point
type MediaItem = { type: 'image' | 'video'; url: string; alt?: string; focalX?: number; focalY?: number; focalScale?: number };

interface AdminDashboardProps {
  onLogout: () => void;
  onViewWebsite: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onViewWebsite }) => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    status: 'now_recruiting' as 'urgent' | 'now_recruiting' | 'closing_soon' | 'expired',
    description: '',
    requirements: [''],
    benefits: [''],
    whatsapp_number: '94775253543'
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  // DnD helpers
  const dragIndexRef = useRef<number | null>(null);
  // NEW: track drag-over index for visual feedback
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchJobs();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    } else {
      // User is not authenticated, logout
      onLogout();
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      if (err instanceof Error) {
        if (/JWT|auth/i.test(err.message)) onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const uploadMedia = async (files: File[]): Promise<MediaItem[]> => {
    const uploadedMedia: MediaItem[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `airkings-job-media/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('airkings-media')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('airkings-media')
          .getPublicUrl(filePath);

        uploadedMedia.push({
          type: file.type.startsWith('video/') ? 'video' : 'image',
          url: publicUrl,
          alt: file.name
        } as MediaItem);
      } catch (err) {
        console.error('Media upload failed:', err);
      }
    }

    return uploadedMedia;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let media: MediaItem[] = [];
      if (mediaFiles.length > 0) {
        media = await uploadMedia(mediaFiles);
      }

      const allMedia: MediaItem[] = [...existingMedia, ...media];

      const filteredRequirements = formData.requirements.filter(req => req.trim() !== '');
      const filteredBenefits = formData.benefits.filter(benefit => benefit.trim() !== '');

      // Determine next sort order (append to end)
      let nextSortOrder = 0;
      try {
        const { data: maxRows } = await supabase
          .from('job_postings')
          .select('sort_order')
          .order('sort_order', { ascending: false, nullsFirst: false })
          .limit(1)
          .returns<{ sort_order: number }[]>(); // typed rows
        nextSortOrder = ((maxRows?.[0]?.sort_order ?? -1) + 1);
      } catch {
        nextSortOrder = jobs.length; // fallback
      }

      // Insert/Update payload
      type NewJobPayload = Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'sort_order'> & { sort_order?: number };

      const jobData: NewJobPayload = {
        ...formData,
        requirements: filteredRequirements,
        benefits: filteredBenefits,
        media: allMedia,
        ...(editingJob ? {} : { sort_order: nextSortOrder })
      };

      if (editingJob) {
        const { error } = await supabase
          .from('job_postings')
          .update(jobData as unknown as never)
          .eq('id', editingJob.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('job_postings')
          .insert([jobData] as unknown as never[]);
        if (error) throw error;
      }

      await fetchJobs();
      resetForm();
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Error saving job posting');
    } finally {
      setUploading(false);
    }
  };

  // Persist new order to Supabase
  const persistOrder = async (ordered: JobPosting[]) => {
    setSavingOrder(true);
    try {
      // Per-row updates to avoid UPSERT conflicts
      for (let i = 0; i < ordered.length; i++) {
        const j = ordered[i];
        const { error } = await supabase
          .from('job_postings')
          .update({ sort_order: i } as unknown as never)
          .eq('id', j.id);
        if (error) {
          console.error('Update sort_order failed for id', j.id, error);
          throw error;
        }
      }
      setJobs(ordered.map((j, i) => ({ ...j, sort_order: i })));
    } catch (e: any) {
      console.error('Failed to save order:', e);
      alert(`Failed to save new order: ${e?.message || e}`);
    } finally {
      setSavingOrder(false);
    }
  };

  // DnD handlers
  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
    setDragOverIndex(index);
  };

  // NEW: allow drop and set visual state
  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  // UPDATED: accept event, prevent default, clear visual state, persist
  const handleDropOn = async (dropIndex: number, e?: React.DragEvent) => {
    if (e) e.preventDefault();
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    setDragOverIndex(null);
    if (from === null || from === dropIndex) return;

    const updated = [...jobs];
    const [moved] = updated.splice(from, 1);
    updated.splice(dropIndex, 0, moved);

    // Re-index locally before persisting
    const normalized = updated.map((j, i) => ({ ...j, sort_order: i }));
    setJobs(normalized);
    await persistOrder(normalized);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Error deleting job posting');
    }
  };

  const handleEdit = (job: JobPosting) => {
    setEditingJob(job);
    setExistingMedia(Array.isArray(job.media) ? (job.media as MediaItem[]) : []);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      status: job.status,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      whatsapp_number: job.whatsapp_number
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      salary: '',
      type: 'Full-time',
      status: 'now_recruiting',
      description: '',
      requirements: [''],
      benefits: [''],
      whatsapp_number: '94775253543'
    });
    setMediaFiles([]);
    setExistingMedia([]);
    setEditingJob(null);
    setShowForm(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'urgent':
        return { label: 'URGENT', bgColor: 'bg-red-600', textColor: 'text-white' };
      case 'now_recruiting':
        return { label: 'NOW RECRUITING', bgColor: 'bg-green-600', textColor: 'text-white' };
      case 'closing_soon':
        return { label: 'CLOSING SOON', bgColor: 'bg-orange-600', textColor: 'text-white' };
      case 'expired':
        return { label: 'EXPIRED', bgColor: 'bg-gray-500', textColor: 'text-white' };
      default:
        return { label: 'NOW RECRUITING', bgColor: 'bg-green-600', textColor: 'text-white' };
    }
  };

  const addRequirement = () => {
    if (formData.requirements.length < 10) {
      setFormData({ ...formData, requirements: [...formData.requirements, ''] });
    }
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData({ ...formData, requirements: newRequirements });
    }
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addBenefit = () => {
    if (formData.benefits.length < 10) {
      setFormData({ ...formData, benefits: [...formData.benefits, ''] });
    }
  };

  const removeBenefit = (index: number) => {
    if (formData.benefits.length > 1) {
      const newBenefits = formData.benefits.filter((_, i) => i !== index);
      setFormData({ ...formData, benefits: newBenefits });
    }
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const removeExistingMedia = (index: number) => {
    const newMedia = existingMedia.filter((_, i) => i !== index);
    setExistingMedia(newMedia);
  };

// Add: click to set focal point for image thumbnails
  const setFocalPoint = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const m = existingMedia[index];
    if (!m || m.type !== 'image') return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    setExistingMedia(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], focalX: x, focalY: y };
      return copy;
    });
  };

// NEW: set zoom/scale for an image (1x to 3x)
  const setFocalScale = (index: number, value: number) => {
    setExistingMedia(prev => {
      const copy = [...prev];
      const clamped = Math.max(1, Math.min(3, value));
      copy[index] = { ...copy[index], focalScale: clamped };
      return copy;
    });
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingJob ? 'Edit Job Posting' : 'Add New Job Posting'}
              </h2>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary (SAR)</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g., 80,000 - 120,000 SAR"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'urgent' | 'now_recruiting' | 'closing_soon' | 'expired' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="now_recruiting">Now Recruiting</option>
                    <option value="closing_soon">Closing Soon</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Files (Images/Videos)</label>
                {/* Existing Media */}
                {existingMedia.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Media: (click an image to set its focus point; adjust zoom below)</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingMedia.map((media, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden border border-gray-200 p-0.5"
                          onClick={(e) => setFocalPoint(index, e)}
                          title={media.type === 'image' ? 'Click to set focus point' : undefined}
                          style={{ cursor: media.type === 'image' ? 'crosshair' as const : 'default' }}
                        >
                          {media.type === 'image' ? (
                            <>
                              <div className="relative w-full h-24 overflow-hidden">
                                <img
                                  src={media.url}
                                  alt={media.alt || 'Job media'}
                                  className="w-full h-full object-cover select-none"
                                  style={{
                                    objectPosition: `${((media.focalX ?? 0.5) * 100).toFixed(2)}% ${((media.focalY ?? 0.5) * 100).toFixed(2)}%`,
                                    transformOrigin: `${((media.focalX ?? 0.5) * 100).toFixed(2)}% ${((media.focalY ?? 0.5) * 100).toFixed(2)}%`,
                                    transform: `scale(${media.focalScale ?? 1})`,
                                    transition: 'transform 150ms ease'
                                  }}
                                  draggable={false}
                                />
                                {/* Focal indicator */}
                                <span
                                  className="absolute w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-white/80 pointer-events-none"
                                  style={{
                                    left: `${((media.focalX ?? 0.5) * 100).toFixed(2)}%`,
                                    top: `${((media.focalY ?? 0.5) * 100).toFixed(2)}%`,
                                    transform: 'translate(-50%, -50%)'
                                  }}
                                />
                              </div>
                              {/* Zoom slider */}
                              <div className="mt-1 px-1">
                                <input
                                  type="range"
                                  min={1}
                                  max={3}
                                  step={0.01}
                                  value={media.focalScale ?? 1}
                                  onChange={(e) => setFocalScale(index, parseFloat(e.target.value))}
                                  className="w-full accent-cyan-500 cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex justify-between text-[10px] text-gray-400">
                                  <span>1x</span>
                                  <span>{(media.focalScale ?? 1).toFixed(2)}x</span>
                                  <span>3x</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <video
                              src={media.url}
                              className="w-full h-24 object-cover"
                              muted
                            />
                          )}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeExistingMedia(index); }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Upload additional images or videos for this job posting</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter requirement"
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Requirement
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter benefit"
                    />
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBenefit}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Benefit
                </button>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {uploading ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Saving order toast */}
      {savingOrder && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow z-50">
          Saving new order...
        </div>
      )}

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AirKings Admin Dashboard</h1>
              {user && <p className="text-sm text-gray-600">Welcome, {user.email}</p>}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onViewWebsite}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
                View Website
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Job Postings ({jobs.length})</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New Job
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading job postings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No job postings yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Create Your First Job Posting
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                // Make entire card draggable with drop handlers
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(index, e)}
                onDrop={(e) => handleDropOn(index, e)}
                onDragEnd={() => setDragOverIndex(null)}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  dragOverIndex === index ? 'ring-2 ring-blue-500' : ''
                }`}
                title="Drag this card to reorder"
              >
                {/* REMOVE old small drag handle button */}
                <div className="relative h-48">
                  <img
                    src={job.media && job.media[0] ? job.media[0].url : 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={job.title}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: `${((((job.media as any)?.[0]?.focalX ?? 0.5) as number) * 100).toFixed(2)}% ${((((job.media as any)?.[0]?.focalY ?? 0.5) as number) * 100).toFixed(2)}%`,
                      transformOrigin: `${((((job.media as any)?.[0]?.focalX ?? 0.5) as number) * 100).toFixed(2)}% ${((((job.media as any)?.[0]?.focalY ?? 0.5) as number) * 100).toFixed(2)}%`,
                      transform: `scale(${(((job.media as any)?.[0]?.focalScale ?? 1) as number)})`
                    }}
                  />
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <span className={`${getStatusConfig(job.status).bgColor} ${getStatusConfig(job.status).textColor} px-3 py-1 rounded-full text-xs font-bold inline-flex w-auto`}>
                      {getStatusConfig(job.status).label}
                    </span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold inline-flex w-auto">
                      {job.type}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                    <span className="text-xs text-gray-400">#{job.sort_order}</span>
                  </div>
                  <p className="text-gray-600 font-semibold mb-2">{job.company}</p>
                  <p className="text-gray-500 text-sm mb-4">{job.location}</p>
                  <p className="text-green-600 font-bold mb-4">﷼ {job.salary}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(job)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;