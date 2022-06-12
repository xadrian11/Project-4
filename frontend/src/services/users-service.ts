/* eslint-disable no-unused-vars */
import { Config } from '../config';
export interface User {
  _id: string;
  email: string;
  name: string;
  lastname: string;
  following: string[];
  avatarURL: string;
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('UsersService.getUserById', error.message);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/users/me');
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  } catch (error) {
    if (Config.isDev) {
      console.error('UsersService.getCurrentUser', error.message);
    }
    return null;
  }
}

export async function getFollowing(id: string): Promise<User['following']> {
  try {
    const res = await fetch(`/api/users/${id}/following`);
    const followers = await res.json();
    return followers;
  } catch (error) {
    if (Config.isDev) {
      console.error('UsersService.getFollowing', error.message);
    }
    return null;
  }
}

export async function followUser(userId: string): Promise<User> {
  try {
    const following = await getFollowing('me');
    const updatedFollowing: string[] = following.includes(userId)
      ? following.filter((id) => id !== userId)
      : following.concat(userId);

    const res = await fetch('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify({
        following: updatedFollowing,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  } catch (error) {
    if (Config.isDev) {
      console.error('UsersService.followUser', error.message);
    }
    return null;
  }
}

type updateCurrentUserSchema = {
  name: string;
  lastname: string;
  imgFile?: null;
};

export async function updateCurrentUser({
  name,
  lastname,
  imgFile,
}: {
  name?: string;
  lastname?: string;
  imgFile?: null | File;
}): Promise<updateCurrentUserSchema | null> {
  try {
    const formData = new FormData();
    name && formData.append('name', name);
    lastname && formData.append('lastname', lastname);
    imgFile && formData.append('imgFile', imgFile);

    const response = await fetch('/api/users/me', {
      method: 'PATCH',
      body: formData,
    });
    if (response.ok) {
      await response.json();
    }
  } catch (err) {
    console.error('UsersService.updateCurrentUser', err.message);
    return;
  }
}
