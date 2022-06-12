/* eslint-disable no-unused-vars */

import { Config } from '../config';

type User = {
  name: string;
  lastname: string;
  email: string;
  password: string;
};

export async function signUp({
  email,
  password,
  name,
  lastname,
}: User): Promise<void> {
  const formInfo = {
    email,
    password,
    name,
    lastname,
  };

  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formInfo),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

interface SignInCredencials {
  email: string;
  password: string;
  grantType?: 'cookie' | 'token';
}

export async function signIn({
  email,
  password,
}: SignInCredencials): Promise<void> {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      password: password,
      grantType: 'cookie',
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

export async function signOut(): Promise<void> {
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
