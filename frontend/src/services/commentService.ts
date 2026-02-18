import api from './api';

export interface Comment {
  _id: string;
  task: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  parentComment?: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  parentComment?: string;
}

export interface UpdateCommentData {
  content: string;
}

class CommentService {
  /**
   * Get all comments for a task
   */
  async getComments(taskId: string): Promise<Comment[]> {
    const response = await api.get<{ success: boolean; comments: Comment[] }>(
      `/tasks/${taskId}/comments`
    );
    return response.data.comments;
  }

  /**
   * Create a new comment
   */
  async createComment(taskId: string, data: CreateCommentData): Promise<Comment> {
    const response = await api.post<{ success: boolean; comment: Comment }>(
      `/tasks/${taskId}/comments`,
      data
    );
    return response.data.comment;
  }

  /**
   * Update a comment
   */
  async updateComment(
    taskId: string,
    commentId: string,
    data: UpdateCommentData
  ): Promise<Comment> {
    const response = await api.put<{ success: boolean; comment: Comment }>(
      `/tasks/${taskId}/comments/${commentId}`,
      data
    );
    return response.data.comment;
  }

  /**
   * Delete a comment
   */
  async deleteComment(taskId: string, commentId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
  }
}

export default new CommentService();
