// Main feed page displaying user profile, project posts, and celebration wall
import "./Feed-page.css";
import { useEffect, useState } from "react";
import { getProjects, addProject} from "../services/project-api";
import {findUserProfile, getCurrentUser} from "../services/user-api";
import OnboardingModal from "../components/OnBoardingModal";
import NewProjectModal from "../components/NewProjectModal";
import { useUser } from "../context/UserContext";
 
 
export default function FeedPage() {
    const [projects, setProjects] = useState([]);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [checking, setChecking] = useState(true);
    const { userProfile, loadingProfile, refreshProfile } = useUser();

    const completedProjects = projects.filter(item => item.status ==="COMPLETE");
    const activeProjects = projects.filter(item => item.status ==="ACTIVE");
 
    // Check if user needs onboarding on mount
    useEffect(() => {
        async function checkOnboarding() {
            try {
                const { userId } = await getCurrentUser();
                if (!userId) return;
 
                await findUserProfile(userId);
                setNeedsOnboarding(false);
            } catch {
                setNeedsOnboarding(true);
            } finally {
                setChecking(false);
            }
        }
        checkOnboarding();
    }, []);
 
    // Handler for when onboarding is complete - refreshes profile data to update UI
    async function handleOnboardingComplete() {
        await refreshProfile(); // ← updates context, navbar and all pages re-render
        setNeedsOnboarding(false);
    }
 
    async function handleNewProject(form) {
        try {
            console.log(" feed-page-level: ",form.title, userProfile.userId, form.description, form.support, form.stack, form.stage, form.visibility, form.status);
            await addProject(userProfile.userId ,form.title, form.description, form.support, form.stack, form.stage, form.visibility, form.status);
            const updatedProjects = await getProjects();
            setProjects(updatedProjects);
        } catch(error) {
            console.error("Error adding project:", error);
        }
    }
    
    // Load projects for feed display
    useEffect(() => {
        async function loadProjects() {
            try{
                const response = await getProjects();
                
                setProjects(response);
            }
            catch(error){
                console.error("Error fetching projects:", error);
            }
        }
        loadProjects();
    }, []);
 
    // Show nothing while checking onboarding status or loading profile to prevent UI flash
    if (checking || loadingProfile) return null;
    return (  
        <>
        {showNewProjectModal && 
            // FIX: prop renamed from handleNewProject to onSubmit to match NewProjectModal's expected prop
            <NewProjectModal onClose={() => setShowNewProjectModal(false)} onSubmit={handleNewProject}/>}
        {needsOnboarding && (
            <OnboardingModal onComplete={handleOnboardingComplete} />
        )}
            {/* main page*/}        
            <div className="feed-page">
                <div className="feed-grid">
 
                    {/* LEFT –  sticky user profile card */}
                    <aside className="panel-left">
                        <div className="profile-card">
                            <div className="profile-top">
                                <div className="avatar">{avatarHelper(userProfile?.username)}</div>
                                <div>
                                    <div className="profile-username">{userProfile?.username}</div>
                                </div>
                            </div>
                            <hr className="divider" />
                            <div className="profile-bio">{userProfile?.bio}</div>
                            <hr className="divider" />
                        </div>
                    </aside>
 
                    <main className="panel-mid">
                        {/* New Project bar */}
                        <div className="new-project-card">
                            <div className="avatar sm">{avatarHelper(userProfile?.username)}</div>
                            <div className="new-project-input">
                                Start a new project…
                            </div>
                            <button 
                                className="btn btn-primary new-btn"
                                onClick={() => setShowNewProjectModal(true)}
                                >New Project
                            </button>
                        </div>
 
                        {/* Post cards */}
                        {activeProjects.map(
                            (item, i)=>  
                                (
                                    <div className="post-card" key={item.projectId} style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                                        <div className="post-header">
                                            <div className="avatar sm">{avatarHelper(item.users.username)}</div>
                                            <div className="post-meta">
                                                <div className="post-user">{item.users.username}</div>
                                            </div>
                                        </div>
                                        <hr className="divider" />
                                        <div className="post-title">{item.title}</div>
                                        <div className="post-desc">{item.description}</div>
                                        <div className="stack-row"> stack: {item.techStack} </div>
                                        <div className="support-row"> support: {item.support ?? 'None'}</div>
                                        <hr className="divider" />
                                        <div className="post-actions">
                                            <button className="action-btn">Comment</button>
                                            <button className="action-btn collab">Collaborate</button>
                                        </div>
                                    </div>
                                )       
                        )}
                    </main>
 
                    {/* RIGHT – sticky celebration wall */}
                    <aside className="panel-right">
                        <div className="celebration-card">
                            <div className="celebration-title">Celebration Wall</div>
                            <hr className="divider" />
                            {completedProjects.map((item, i) => (
                                <div className="celebration-item" key={item.projectId} style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                                    <div className="cel-avatar">{avatarHelper(item.users.username)}</div>
                                    <div className="cel-info">
                                        <div className="cel-name">{item.users.username}</div>
                                        <div className="cel-project">{item.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
 
function avatarHelper(str) {
  return str ? str[0] : "";
}