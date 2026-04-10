// Main feed page displaying user profile, project posts, and celebration wall
import "./Feed-page.css";
import { useEffect, useState } from "react";
import { getProjects, addProject} from "../services/project-api";
import { addComment, updateComment, deleteComment} from "../services/comment-api";
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

    const [openComments, setOpenComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [visibleComments, setVisibleComments] = useState({});
    const [editingComment, setEditingComment] = useState({}); // { commentId: true/false }
    const [editInputs, setEditInputs] = useState({});         // { commentId: "text" }

    const completedProjects = projects.filter(item => item.status ==="COMPLETE");
    const activeProjects = projects.filter(item => item.status ==="ACTIVE");
 

    // comment handlers
    async function toggleComments(projectId) {
        setOpenComments( prev => ({ ...prev, [projectId]: !prev[projectId] }) );
    }

    async function handleCommentInput(projectId, value) {
        setCommentInputs( prev => ({ ...prev, [projectId]: value }) );
    }

    async function handlePostComment(projectId) {
        const text = commentInputs[projectId]?.trim();
        if (!text) return;
        await addComment( projectId ,userProfile.userId, text)
        console.log("Posting comment for", projectId, ":", text);
        setCommentInputs(prev => ({ ...prev, [projectId]: "" }));

        setProjects(prev => prev.map(p => {
            if (p.projectId !== projectId) return p;
            const newComment = {
                commentId: Date.now(), // temp id
                body: text,
                users: { username: userProfile.username }
            };
            return { ...p, comments: [...(p.comments || []), newComment] };
        }));
    }

    function loadMoreComments(projectId) {
        setVisibleComments(prev => ({ ...prev, [projectId]: (prev[projectId] || 5) + 5 }));
    }

    function startEditComment(commentId, currentBody) {
        setEditingComment(prev => ({ ...prev, [commentId]: true }));
        setEditInputs(prev => ({ ...prev, [commentId]: currentBody }));
    }

    function cancelEditComment(commentId) {
        setEditingComment(prev => ({ ...prev, [commentId]: false }));
        setEditInputs(prev => ({ ...prev, [commentId]: "" }));
    }

    async function handleEditComment(projectId, commentId) {
        const text = editInputs[commentId]?.trim();
        if (!text) return;
        await updateComment(commentId, text)
        setProjects(prev => prev.map(p => {
            if (p.projectId !== projectId) return p;
            return {
                ...p,
                comments: p.comments.map(c =>
                    c.commentId === commentId ? { ...c, body: text } : c
                )
            };
        }));
        cancelEditComment(commentId);
    }

    async function handleDeleteComment(projectId, commentId) {
        await deleteComment(commentId)
        setProjects(prev => prev.map(p => {
            if (p.projectId !== projectId) return p;
            return { ...p, comments: p.comments.filter(c => c.commentId !== commentId) };
        }));
    }
    

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
                console.log(response);
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
                                            <button 
                                                className={`action-btn${openComments[item.projectId] ? " active" : ""}`}
                                                onClick={() => toggleComments(item.projectId)}
                                                    >Comment</button>
                                            <button className="action-btn collab">Collaborate</button>
                                        </div>

                                        {openComments[item.projectId] && (
                                            <div className="comment-section">
                                                <div className="comment-input-row">
                                                    <div className="avatar sm">{avatarHelper(userProfile?.username)}</div>
                                                    <input
                                                        className="comment-input"
                                                        type="text"
                                                        placeholder="Add a comment…"
                                                        value={commentInputs[item.projectId] || ""}
                                                        onChange={e => handleCommentInput(item.projectId, e.target.value)}
                                                        onKeyDown={e => e.key === "Enter" && handlePostComment(item.projectId)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="comment-actions-row">
                                                    <button
                                                        className="btn btn-primary comment-post-btn"
                                                        disabled={!commentInputs[item.projectId]?.trim()}
                                                        onClick={() => handlePostComment(item.projectId)}
                                                    >
                                                        Post
                                                    </button>
                                                </div>

                                                {/* Comment list */}
                                                {(item.comments?.length > 0) && (() => {
                                                    const limit = visibleComments[item.projectId] || 5;
                                                    const displayed = item.comments.slice(0, limit);
                                                    return (
                                                        <div className="comment-list">
                                                            {displayed.map(comment => (
                                                                <div className="comment-item" key={comment.commentId}>
                                                                <div className="avatar sm">{avatarHelper(comment.users?.username)}</div>
                                                                <div className="comment-bubble">
                                                                    <div className="comment-author">{comment.users?.username}</div>

                                                                    {editingComment[comment.commentId] ? (
                                                                        <div className="comment-edit-row">
                                                                            <input
                                                                                className="comment-input"
                                                                                type="text"
                                                                                value={editInputs[comment.commentId] || ""}
                                                                                onChange={e => setEditInputs(prev => ({ ...prev, [comment.commentId]: e.target.value }))}
                                                                                onKeyDown={e => e.key === "Enter" && handleEditComment(item.projectId, comment.commentId)}
                                                                                autoFocus
                                                                            />
                                                                            <div className="comment-edit-actions">
                                                                                <button
                                                                                    className="btn btn-primary comment-post-btn"
                                                                                    disabled={!editInputs[comment.commentId]?.trim()}
                                                                                    onClick={() => handleEditComment(item.projectId, comment.commentId)}
                                                                                >Save</button>
                                                                                <button
                                                                                    className="load-more-btn"
                                                                                    onClick={() => cancelEditComment(comment.commentId)}
                                                                                >Cancel</button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <div className="comment-text">{comment.body}</div>
                                                                            {comment.users?.username === userProfile?.username && (
                                                                                <div className="comment-controls">
                                                                                    <button className="comment-control-btn" onClick={() => startEditComment(comment.commentId, comment.body)}>Edit</button>
                                                                                    <span className="comment-control-divider">·</span>
                                                                                    <button className="comment-control-btn danger" onClick={() => handleDeleteComment(item.projectId, comment.commentId)}>Delete</button>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            ))}
                                                            {item.comments.length > limit && (
                                                                <button className="load-more-btn" onClick={() => loadMoreComments(item.projectId)}>
                                                                    Load more comments ({item.comments.length - limit} remaining)
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })()}


                                            </div>
                                        )}
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