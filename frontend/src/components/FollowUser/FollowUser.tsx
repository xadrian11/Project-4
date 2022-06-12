import React, { useState } from 'react';
import { followUser } from '../../services/users-service';
import useAuth from '../../hooks/useAuth';
import styles from './FollowUser.module.css';
import PropTypes from 'prop-types';

function FollowUser({ userId, onFollow }) {
  const { user } = useAuth();
  const [buttonText, setButtonText] = useState(() =>
    user.following.includes(userId) ? 'Unfollow' : 'Follow',
  );
  const [isLoading, setLoading] = useState(false);
  async function handleClick() {
    try {
      setLoading(true);
      const { following } = await followUser(userId);
      setButtonText(buttonText === 'Unfollow' ? 'Follow' : 'Unfollow');

      onFollow(following);
    } finally {
      setLoading(false);
    }
  }
  if (userId === user._id) {
    return null;
  }
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={styles.followButton}
    >
      {buttonText}
    </button>
  );
}
FollowUser.propTypes = {
  userId: PropTypes.string,
  onFollow: PropTypes.func,
};
export default FollowUser;
