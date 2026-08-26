import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  Sparkles, 
  UserPlus, 
  Briefcase,
  MessageSquare,
  UserCheck,
  UserX,
  FolderPlus
} from 'lucide-react';
import { calculateProjectCompatibility } from '../utils/matchingAlgorithm';

export default function ProjectCollaborator({ 
  projects, 
  currentUser, 
  onApplyToRole, 
  onAddNewProject, 
  onOpenChat,
  onAcceptApplicant,
  onRejectApplicant
}) {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState('All');

  // Form state for new project
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'IoT & Full-Stack',
    deadline: 'Major Capstone Project',
    description: '',
    roles: 'React Developer, ML Engineer',
    tags: 'React, Node.js, AI'
  });

  const categories = ['All', 'IoT & Full-Stack', 'Deep Learning & HealthTech', 'Developer Tools & WebSockets'];

  const filteredProjects = projects.filter(p => activeTabFilter === 'All' || p.category === activeTabFilter);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;

    const parsedRoles = newProject.roles.split(',').map(r => ({
      role: r.trim(),
      status: 'Open',
      skills: [r.trim()]
    }));

    const parsedTags = newProject.tags.split(',').map(t => t.trim());

    onAddNewProject({
      id: `proj-${Date.now()}`,
      title: newProject.title,
      category: newProject.category,
      leadName: `${currentUser.name} (You)`,
      leadAvatar: currentUser.avatar,
      deadline: newProject.deadline,
      description: newProject.description,
      rolesNeeded: parsedRoles,
      applicants: [],
      tags: parsedTags,
      teamSize: `1 / ${parsedRoles.length + 1} Members`,
      matchScore: 98
    });

    setIsNewProjectModalOpen(false);
    setNewProject({
      title: '',
      category: 'IoT & Full-Stack',
      deadline: 'Major Capstone Project',
      description: '',
      roles: 'React Developer, ML Engineer',
      tags: 'React, Node.js, AI'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <Users className="h-3.5 w-3.5 text-purple-400" />
            Capstone & Hackathon Collaborator Hub
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Recruit Teammates & Build Capstones</h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
            Post project vacancies or apply for specialized engineering roles. Automatic compatibility scoring calculates tech stack overlap!
          </p>
        </div>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-purple-600/30 transition transform hover:-translate-y-0.5 whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Project
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTabFilter(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeTabFilter === cat 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="h-16 w-16 rounded-2xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-purple-400">
            <FolderPlus className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No Capstone Projects Listed Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Clean database ready! Post your capstone or hackathon project to start recruiting peer teammates.
          </p>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create First Capstone Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProjects.map((project) => {
            const matchResult = calculateProjectCompatibility(currentUser, project);
            const isLead = project.leadName.includes("You") || project.leadName.includes(currentUser.name);
            
            return (
              <div
                key={project.id}
                className="bg-slate-900/90 border border-slate-800/90 hover:border-purple-500/40 rounded-3xl p-6 shadow-xl backdrop-blur-md transition space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={project.leadAvatar}
                      alt={project.leadName}
                      className="h-12 w-12 rounded-2xl border border-purple-500/30 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-100">{project.title}</h2>
                        <span className="text-[11px] bg-slate-950 text-slate-300 px-2.5 py-0.5 rounded-full font-medium border border-slate-800">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Led by <strong className="text-slate-200">{project.leadName}</strong> • Target: {project.deadline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!isLead && (
                      <button
                        onClick={() => onOpenChat({ name: project.leadName, avatar: project.leadAvatar, year: 'Project Lead' })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-purple-300 border border-slate-800"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
                        Chat Lead
                      </button>
                    )}

                    <div className="flex items-center gap-3 bg-purple-950/60 border border-purple-500/30 px-4 py-2 rounded-2xl">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-purple-300">Teammate Match</div>
                        <div className="text-lg font-black text-purple-400">{matchResult.finalScore}%</div>
                      </div>
                      <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-950 text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-800 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Roles Needed Section */}
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <Briefcase className="h-4 w-4 text-purple-400" />
                      Open Roles & Required Skill Sets
                    </span>
                    <span>{project.teamSize}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {project.rolesNeeded.map((roleObj, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex flex-col justify-between space-y-2 ${
                          roleObj.status === 'Filled'
                            ? 'bg-slate-900/40 border-slate-800/50 text-slate-500 opacity-75'
                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span>{roleObj.role}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              roleObj.status === 'Filled' ? 'bg-slate-800 text-slate-500' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {roleObj.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Required: {roleObj.skills.join(', ')}
                          </div>
                        </div>

                        {roleObj.status === 'Open' && !isLead && (
                          <button
                            onClick={() => onApplyToRole(project, roleObj.role)}
                            className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition shadow-md"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            Apply for Role
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applicants Management (For Project Leads) */}
                {project.applicants && project.applicants.length > 0 && (
                  <div className="bg-purple-950/20 border border-purple-500/20 p-4 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      Pending Candidate Applicants ({project.applicants.length})
                    </div>
                    <div className="space-y-2">
                      {project.applicants.map((app) => (
                        <div key={app.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white">{app.studentName}</span>
                            <span className="text-slate-400 text-[11px]"> applied for </span>
                            <span className="text-purple-300 font-semibold">{app.roleApplied}</span>
                            <div className="text-[10px] text-slate-400 mt-0.5">Skills: {app.skills.join(', ')}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onAcceptApplicant(project.id, app)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1"
                              title="Accept Applicant"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              Accept
                            </button>

                            <button
                              onClick={() => onRejectApplicant(project.id, app.id)}
                              className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 font-bold rounded-lg flex items-center gap-1 border border-red-500/30"
                              title="Decline Applicant"
                            >
                              <UserX className="h-3.5 w-3.5" />
                              Decline
                            </button>

                            <button
                              onClick={() => onOpenChat({ name: app.studentName, year: 'Applicant Student' })}
                              className="p-1.5 bg-slate-900 text-purple-300 hover:bg-slate-800 rounded-lg border border-slate-800"
                              title="Chat Applicant"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Create New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateProject} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-purple-400" />
              Create a Capstone / Hackathon Project
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Campus Energy Monitor, Medical Vision Classifier"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. IoT & Full-Stack"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deadline / Target</label>
                  <input
                    type="text"
                    placeholder="e.g. Major Project (Sem 8)"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Abstract & Goals</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Briefly describe what your project aims to accomplish..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Open Roles Needed (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React Frontend Developer, PyTorch Researcher, Backend Dev"
                  value={newProject.roles}
                  onChange={(e) => setNewProject({ ...newProject, roles: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md"
              >
                Publish Project
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
