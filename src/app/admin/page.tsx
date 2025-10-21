'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getProjects, getSocialLinks, getCreatorTools, getDevTools, addProject, addSocialLink, updateProject, updateSocialLink, deleteProject, deleteSocialLink, deleteCreatorTool, deleteDevTool, getCreatorToolId, getDevToolId, Project, SocialLink } from '@/lib/services/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { seedData } from '@/lib/data/seed-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, Edit2, X, Image as ImageIcon, FolderOpen, Link, Wrench, Gamepad2, BarChart3, Settings, Menu } from 'lucide-react';
import { ImageManager } from '@/components/admin/image-manager';

type Section = 'projects' | 'social' | 'tools' | 'images' | 'analytics';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [creatorTools, setCreatorTools] = useState<string[]>([]);
  const [devTools, setDevTools] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<Section>('projects');

  // Edit states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddSocialLink, setShowAddSocialLink] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form states
  const [projectForm, setProjectForm] = useState({ title: '', description: '', github: '', demo: '', image: '' });
  const [socialLinkForm, setSocialLinkForm] = useState({ title: '', description: '', demo: '', icon: '', image: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [projectsData, socialLinksData, creatorToolsData, devToolsData] = await Promise.all([
        getProjects(),
        getSocialLinks(),
        getCreatorTools(),
        getDevTools(),
      ]);
      setProjects(projectsData);
      setSocialLinks(socialLinksData);
      setCreatorTools(creatorToolsData);
      setDevTools(devToolsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProjects([]);
      setSocialLinks([]);
      setCreatorTools([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  const handleDeleteTool = async (toolName: string, type: 'creator' | 'dev') => {
    try {
      if (type === 'creator') {
        const toolId = await getCreatorToolId(toolName);
        if (toolId) {
          await deleteCreatorTool(toolId);
          setCreatorTools(creatorTools.filter(tool => tool !== toolName));
        }
      } else {
        const toolId = await getDevToolId(toolName);
        if (toolId) {
          await deleteDevTool(toolId);
          setDevTools(devTools.filter(tool => tool !== toolName));
        }
      }
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };


  // Project handlers
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      github: project.github || '',
      demo: project.demo || '',
      image: project.image || '',
    });
  };

  const handleSaveProject = async () => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectForm);
        setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...projectForm } : p));
        setEditingProject(null);
      } else {
        await addProject(projectForm);
        await loadData(); // Reload to get the new project with ID
      }
      setProjectForm({ title: '', description: '', github: '', demo: '', image: '' });
      setShowAddProject(false);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Social Link handlers
  const handleEditSocialLink = (link: SocialLink) => {
    setEditingSocialLink(link);
    setSocialLinkForm({
      title: link.title,
      description: link.description,
      demo: link.demo,
      icon: link.icon,
      image: link.image || '',
    });
  };

  const handleSaveSocialLink = async () => {
    try {
      if (editingSocialLink) {
        await updateSocialLink(editingSocialLink.id, socialLinkForm);
        setSocialLinks(socialLinks.map(l => l.id === editingSocialLink.id ? { ...l, ...socialLinkForm } : l));
        setEditingSocialLink(null);
      } else {
        await addSocialLink(socialLinkForm);
        await loadData(); // Reload to get the new link with ID
      }
      setSocialLinkForm({ title: '', description: '', demo: '', icon: '', image: '' });
      setShowAddSocialLink(false);
    } catch (error) {
      console.error('Error saving social link:', error);
    }
  };

  const handleDeleteSocialLink = async (linkId: string) => {
    try {
      await deleteSocialLink(linkId);
      setSocialLinks(socialLinks.filter(l => l.id !== linkId));
    } catch (error) {
      console.error('Error deleting social link:', error);
    }
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setEditingSocialLink(null);
    setShowAddProject(false);
    setShowAddSocialLink(false);
    setProjectForm({ title: '', description: '', github: '', demo: '', image: '' });
    setSocialLinkForm({ title: '', description: '', demo: '', icon: '', image: '' });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background similar to the main site */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20" />
        <div className="absolute inset-0 bg-black/70" />

        {/* Wireframe overlay for consistency */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-md">
            {/* Animated logo/name */}
            <div className="text-center mb-8">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-2 tracking-tight hover:text-primary transition-colors duration-300">
                Milumon
              </h1>
              <p className="text-xl text-slate-300 mb-4">Admin Access</p>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
            </div>

            {/* Login card with glassmorphism effect */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg shadow-2xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
                <p className="text-slate-300 text-sm">Sign in to manage your portfolio</p>
              </CardHeader>
              <CardContent className="pt-4">
                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.3),inset_0_0_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_12px_rgba(255,255,255,0.4),inset_0_0_12px_rgba(255,255,255,0.2)] hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-400">
                    Secure access for portfolio management
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'projects' as Section, label: 'Projects', icon: FolderOpen, description: 'Dev portfolio projects' },
    { id: 'social' as Section, label: 'Social Links', icon: Link, description: 'Social media links' },
    { id: 'tools' as Section, label: 'Tools & Technologies', icon: Settings, description: 'Dev and creator tools' },
    { id: 'images' as Section, label: 'Image Manager', icon: ImageIcon, description: 'Upload and manage images' },
    { id: 'analytics' as Section, label: 'Analytics', icon: BarChart3, description: 'Site statistics' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background consistent with the main site */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20" />
      <div className="absolute inset-0 bg-black/70" />

      {/* Wireframe overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white/5 border-r border-white/10 backdrop-blur-lg flex flex-col hidden md:flex">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Milumon</h2>
                <p className="text-slate-400 text-sm">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/20 border border-primary/30 text-primary'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-white/20 text-white bg-transparent backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden h-16 bg-white/5 border-b border-white/10 backdrop-blur-lg flex items-center justify-between px-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <div></div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="w-80 h-full bg-white/5 border-r border-white/10 backdrop-blur-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Mobile Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">Milumon</h2>
                      <p className="text-slate-400 text-sm">Admin Panel</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4">
                  <div className="space-y-2">
                    {sidebarItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-primary/20 border border-primary/30 text-primary'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <div className="text-left">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs opacity-70">{item.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </nav>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-white/10 space-y-2">
                  <Button
                    onClick={seedData}
                    variant="outline"
                    className="w-full border-white/20 text-white bg-transparent backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  >
                    Seed Data
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full border-white/20 text-white bg-transparent backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Top Bar - Desktop */}
          <div className="hidden md:flex h-16 bg-white/5 border-b border-white/10 backdrop-blur-lg items-center justify-between px-6">
            <div>
              <h1 className="text-xl font-bold text-white">
                {sidebarItems.find(item => item.id === activeSection)?.label}
              </h1>
              <p className="text-slate-400 text-sm">
                {sidebarItems.find(item => item.id === activeSection)?.description}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={seedData}
                variant="outline"
                size="sm"
                className="border-white/20 text-white bg-transparent backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                Seed Data
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl">
              {/* Content based on active section */}
              {activeSection === 'projects' && (
                <div className={`transition-all duration-300 ${editingProject || showAddProject ? 'space-y-0' : 'space-y-6'}`}>
                  {/* Projects List - Hidden when editing */}
                  {!(editingProject || showAddProject) && (
                    <Card className="bg-white/5 border-white/10 backdrop-blur-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                          <span>Projects</span>
                          <Button
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => setShowAddProject(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Project
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {projects.map((project) => (
                            <div
                              key={project.id}
                              className="border border-white/10 rounded-lg p-4 bg-white/5 hover:border-white/30 transition-all duration-200 cursor-pointer"
                              onClick={() => handleEditProject(project)}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-white text-sm line-clamp-1">{project.title}</h3>
                                <div className="flex gap-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditProject(project);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProject(project.id);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-slate-300 mb-3 line-clamp-3">{project.description}</p>
                              <div className="flex gap-1 flex-wrap">
                                {project.github && <Badge variant="outline" className="border-white/20 text-white text-xs px-2 py-0">GitHub</Badge>}
                                {project.demo && <Badge variant="outline" className="border-white/20 text-white text-xs px-2 py-0">Demo</Badge>}
                              </div>
                            </div>
                          ))}

                          {projects.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-400">
                              <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p className="text-base font-medium mb-2">No projects yet</p>
                              <p className="text-sm">Click &ldquo;Add Project&rdquo; to create your first one</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Edit Form - Full width when editing */}
                  {(editingProject || showAddProject) && (
                    <Card className="bg-white/5 border-white/10 backdrop-blur-lg transition-all duration-300">
                      <CardHeader className="pb-6">
                        <CardTitle className="text-white flex items-center justify-between">
                          <span className="text-xl">
                            {editingProject ? 'Edit Project' : 'Add Project'}
                          </span>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            <X className="w-5 h-5" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Form Fields */}
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <Label className="text-white text-base font-medium">Project Title</Label>
                              <Input
                                placeholder="Enter an engaging project title"
                                value={projectForm.title}
                                onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 transition-colors h-12 text-base"
                              />
                            </div>

                            <div className="space-y-3">
                              <Label className="text-white text-base font-medium">Description</Label>
                              <Textarea
                                placeholder="Describe your project, its features, technologies used, and what makes it special..."
                                value={projectForm.description}
                                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 transition-colors resize-none text-base"
                                rows={6}
                              />
                            </div>

                            <div className="space-y-3">
                              <Label className="text-white text-base font-medium">GitHub URL <span className="text-slate-400">(optional)</span></Label>
                              <Input
                                placeholder="https://github.com/username/project-repo"
                                value={projectForm.github}
                                onChange={(e) => setProjectForm({...projectForm, github: e.target.value})}
                                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 transition-colors h-12 text-base"
                              />
                            </div>

                            <div className="space-y-3">
                              <Label className="text-white text-base font-medium">Demo URL <span className="text-slate-400">(optional)</span></Label>
                              <Input
                                placeholder="https://project-demo.vercel.app"
                                value={projectForm.demo}
                                onChange={(e) => setProjectForm({...projectForm, demo: e.target.value})}
                                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 transition-colors h-12 text-base"
                              />
                            </div>
                          </div>

                          {/* Project Image */}
                          <div className="space-y-3">
                            <Label className="text-white text-base font-medium">Project Image</Label>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-fit">
                              <ImageManager
                                onImageSelect={(url) => setProjectForm({...projectForm, image: url})}
                                selectedImageUrl={projectForm.image}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            onClick={handleSaveProject}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 h-12 px-8 text-base font-medium"
                          >
                            <Save className="w-5 h-5 mr-2" />
                            {editingProject ? 'Save Changes' : 'Create Project'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeSection === 'social' && (
                <div className={`transition-all duration-300 ${editingSocialLink || showAddSocialLink ? 'space-y-0' : 'space-y-6'}`}>
                  {/* Social Links List - Hidden when editing */}
                  {!(editingSocialLink || showAddSocialLink) && (
                    <Card className="bg-white/5 border-white/10 backdrop-blur-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                          <span>Social Links</span>
                          <Button
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => setShowAddSocialLink(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Link
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {socialLinks.map((link) => (
                            <div
                              key={link.id}
                              className="border border-white/10 rounded-lg p-4 bg-white/5 hover:border-white/30 transition-all duration-200 cursor-pointer"
                              onClick={() => handleEditSocialLink(link)}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-white text-sm">{link.title}</h3>
                                <div className="flex gap-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditSocialLink(link);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteSocialLink(link.id);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-slate-300 mb-3 line-clamp-2">{link.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-white/20 text-white text-xs">
                                  {link.icon}
                                </Badge>
                              </div>
                            </div>
                          ))}

                          {socialLinks.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-400">
                              <Link className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p className="text-base font-medium mb-2">No social links yet</p>
                              <p className="text-sm">Add your social media profiles</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Edit Form - Full width when editing */}
                  {(editingSocialLink || showAddSocialLink) && (
                    <Card className="bg-white/5 border-white/10 backdrop-blur-lg transition-all duration-300">
                      <CardHeader className="pb-6">
                        <CardTitle className="text-white flex items-center justify-between">
                          <span className="text-xl">
                            {editingSocialLink ? 'Edit Social Link' : 'Add Social Link'}
                          </span>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            <X className="w-5 h-5" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Form Fields */}
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <Label className="text-white text-base font-medium">Platform Name</Label>
                              <Input
                                placeholder="e.g., Instagram, Twitter, YouTube"
                                value={socialLinkForm.title}
                                onChange={(e) => setSocialLinkForm({...socialLinkForm, title: e.target.value})}
                                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 transition-colors h-12 text-base"
                              />
                            </div>

                            <div className="space-y-3">
                              <Label className="text-white text-base font-medium">Description</Label>
                              <Textarea
                                placeholder="Brief description of this social platform"
                                value={socialLinkForm.description}
                                onChange={(e) => setSocialLinkForm({...socialLinkForm, description: e.target.value})}
                                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 transition-colors resize-none text-base"
                                rows={4}
                              />
                            </div>

                            <div className="space-y-3">
                              <Label className="text-white text-base font-medium">Profile URL</Label>
                              <Input
                                placeholder="https://instagram.com/username"
                                value={socialLinkForm.demo}
                                onChange={(e) => setSocialLinkForm({...socialLinkForm, demo: e.target.value})}
                                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 transition-colors h-12 text-base"
                              />
                            </div>

                            <div className="space-y-3">
                              <Label className="text-white text-base font-medium">Icon Name</Label>
                              <Input
                                placeholder="e.g., Instagram, Youtube, Twitter"
                                value={socialLinkForm.icon}
                                onChange={(e) => setSocialLinkForm({...socialLinkForm, icon: e.target.value})}
                                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 transition-colors h-12 text-base"
                              />
                              <p className="text-xs text-slate-400">Use the component name from lucide-react or your custom icons</p>
                            </div>
                          </div>

                          {/* Social Link Image */}
                          <div className="space-y-3">
                            <Label className="text-white text-base font-medium">Social Link Image</Label>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-fit">
                              <ImageManager
                                onImageSelect={(url) => setSocialLinkForm({...socialLinkForm, image: url})}
                                selectedImageUrl={socialLinkForm.image}
                              />
                            </div>
                            <p className="text-xs text-slate-400">
                              Upload an image that represents this social platform
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            onClick={handleSaveSocialLink}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 h-12 px-8 text-base font-medium"
                          >
                            <Save className="w-5 h-5 mr-2" />
                            {editingSocialLink ? 'Save Changes' : 'Add Social Link'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeSection === 'tools' && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white">
                      <span>Tools & Technologies</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="dev-tools" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
                        <TabsTrigger value="dev-tools" className="text-white data-[state=active]:bg-white/20">
                          <Wrench className="w-4 h-4 mr-2" />
                          Dev Tools
                        </TabsTrigger>
                        <TabsTrigger value="creator-tools" className="text-white data-[state=active]:bg-white/20">
                          <Gamepad2 className="w-4 h-4 mr-2" />
                          Creator Tools
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="dev-tools" className="mt-6">
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {devTools.map((tool, index) => (
                              <Badge key={index} variant="outline" className="border-white/20 text-white bg-white/10 flex items-center gap-1">
                                {tool}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => handleDeleteTool(tool, 'dev')}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add new dev tool"
                              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                            />
                            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="creator-tools" className="mt-6">
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {creatorTools.map((tool, index) => (
                              <Badge key={index} variant="outline" className="border-white/20 text-white bg-white/10 flex items-center gap-1">
                                {tool}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => handleDeleteTool(tool, 'creator')}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add new creator tool"
                              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                            />
                            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'images' && (
                <ImageManager />
              )}

              {activeSection === 'analytics' && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white">Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">Analytics dashboard coming soon...</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}