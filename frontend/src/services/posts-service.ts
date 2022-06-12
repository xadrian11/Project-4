/* eslint-disable no-unused-vars */
import { Config } from '../config';

type createPostTypes = {
  description: string;
  imgFile: File;
};

export async function createPost({
  description,
  imgFile,
}: createPostTypes): Promise<createPostTypes | null> {
  try {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('imgFile', imgFile);
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      await response.json();
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    if (Config.isDev) {
      console.error('PostService. createPost', error.message);
    }
    return null;
  }
}

interface PostComment {
  author: string;
  comment: string;
}

export interface Post {
  _id: string;
  description: string;
  likes?: string[];
  comments?: PostComment[];
  author: string;
  imgFile: File;
  date: string;
}

export async function getPostById(postId): Promise<Post> {
  try {
    const response = await fetch(`/api/posts/${postId}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export async function getUserPosts(authorId: string): Promise<Post[]> {
  try {
    const response = await fetch(`/api/posts/author/${authorId}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export async function getTimelinePosts(): Promise<Post[]> {
  try {
    const resp = await fetch(`api/posts/timeline`);
    if (resp.ok) {
      return await resp.json();
    } else {
      throw new Error(`${resp.status} ${resp.statusText}`);
    }
  } catch (error) {
    if (Config.isDev) {
      console.error(error.message);
    }
    return null;
  }
}

export async function likePost(
  postId: string,
  hasLiked: boolean,
): Promise<[] | string[]> {
  try {
    if (!hasLiked) {
      const res = await fetch(`api/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const likes = await res.json();
        return likes;
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    } else {
      const res = await fetch(`api/posts/${postId}/likes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const likes = await res.json();
        return likes;
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    }
  } catch (error) {
    if (Config.isDev) {
      console.error(error.message);
    }
    return null;
  }
}

interface CommentPost {
  postId: string;
  content: string;
}

export async function commentPost({
  postId,
  content,
}: CommentPost): Promise<Post[] | null> {
  try {
    const formData = new FormData();
    formData.append('content', content);
    const resp = await fetch(`api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (resp.ok) {
      return await resp.json();
    } else {
      throw new Error(`${resp.status} ${resp.statusText}`);
    }
  } catch (error) {
    if (Config.isDev) {
      console.error('PostService. createPost', error.message);
    }
    return null;
  }
}
