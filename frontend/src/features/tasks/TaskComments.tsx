import React, { useState, useEffect } from 'react';
import { Send, Edit2, Trash, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import commentService, { Comment } from '@/services/commentService';
import { formatTimeAgo } from '@/lib/dateUtils';

interface TaskCommentsProps {
    taskId: string;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [posting, setPosting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const { user } = useAuth();
    const toast = useToast();

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await commentService.getComments(taskId);
            setComments(data);
        } catch (error: any) {
            console.error('Failed to fetch comments:', error);
            toast.error(error.response?.data?.message || 'Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async () => {
        if (!newComment.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            setPosting(true);
            const created = await commentService.createComment(taskId, { content: newComment });
            setComments([created, ...comments]);
            setNewComment('');
            toast.success('Comment posted successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to post comment');
        } finally {
            setPosting(false);
        }
    };

    const handleUpdate = async (commentId: string) => {
        if (!editContent.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            const updated = await commentService.updateComment(taskId, commentId, {
                content: editContent
            });
            setComments(comments.map(c => c._id === commentId ? updated : c));
            setEditingId(null);
            toast.success('Comment updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update comment');
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await commentService.deleteComment(taskId, commentId);
            setComments(comments.filter(c => c._id !== commentId));
            toast.success('Comment deleted successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete comment');
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading comments...</div>;
    }

    return (
        <div className="space-y-4">
            {/* New Comment Form */}
            <div className="space-y-2">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:border-amber-500 focus:outline-none focus:border-amber-500"
                />
                <div className="flex justify-end">
                    <Button
                        onClick={handlePost}
                        disabled={posting || !newComment.trim()}
                    >
                        <Send className="h-4 w-4 mr-2" />
                        {posting ? 'Posting...' : 'Post Comment'}
                    </Button>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="p-4 rounded-xl border border-border bg-muted/40"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-medium">
                                        {comment.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{comment.user.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatTimeAgo(comment.createdAt)}
                                            {comment.isEdited && ' (edited)'}
                                        </p>
                                    </div>
                                </div>

                                {user?._id === comment.user._id && editingId !== comment._id && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => {
                                                setEditingId(comment._id);
                                                setEditContent(comment.content);
                                            }}
                                            className="p-1 rounded hover:bg-muted transition-colors"
                                        >
                                            <Edit2 className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment._id)}
                                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                        >
                                            <Trash className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {editingId === comment._id ? (
                                <div className="space-y-2 mt-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:border-amber-500"
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleUpdate(comment._id)}>
                                            <Check className="h-4 w-4 mr-1" />
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingId(null)}
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-foreground/80 whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskComments;
