import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import styles from './NavBar.module.css';

const NavBar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className={styles.navBar}>
      <Link to="/" className={styles.link}>
        <img className={styles.logo} src="/images/logo-desktop.svg" />
      </Link>
      <div className={styles.navlinks}>
        {user && (
          <>
            <Link className={styles.navlink} to="/">
              Home
            </Link>
            <Link className={styles.navlink} to="/profile">
              Profile
            </Link>
            <button className={styles.signoutbtn} onClick={signOut}>
              Sign out
            </button>
          </>
        )}
        {!user && (
          <>
            <Link className={styles.navlink} to="/signin">
              Sign in
            </Link>
            <Link className={styles.navlink} to="/signup">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
