import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import PropTypes from 'prop-types';
import styles from './PostComponent.module.css';
import { commentPost, likePost } from '../../services/posts-service';
import { HeartIcon, ChatIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconfilled } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal';
import Comments from '../Comments';
import clsx from 'clsx';
import { getUserById } from '../../services/users-service';

function PostComponent(props) {
  const { author, postImage, description, _id } = props;

  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likes, setLikes] = useState(props.likes);
  const [comments, setComments] = useState(props.comments);
  const hasLiked = user && likes.includes(user.email);
  const [authorUser, setAuthorUser] = useState(null);

  useEffect(() => {
    getUserById(author)
      .then((user) => setAuthorUser(user))
      .catch(() => setAuthorUser(null));
  }, [author]);

  async function handleToggleLike() {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const updatedLikes = await likePost(_id, hasLiked);
      setLikes(updatedLikes);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddComment(content) {
    try {
      setIsLoading(true);
      const updatedComments = await commentPost({ postId: _id, content });
      setComments(updatedComments);
    } finally {
      setIsLoading(false);
    }
  }

  if (!authorUser) {
    return null;
  }

  const authorElement = (
    <Link className={styles.link} to={`/users/${author}`}>
      {authorUser.name} {authorUser.lastname}
    </Link>
  );

  const headerElement = (
    <div className={styles.header}>
      <img
        className={styles.userImg}
        src={authorUser.avatarURL || '/images/avatar-icon.png'}
      />
      <p className={styles.userName}>{authorElement}</p>
    </div>
  );

  const imgElement = (
    <img
      onClick={() => setIsOpen(true)}
      className={styles.postImg}
      src={postImage}
      alt="Picture"
    />
  );

  const buttonsAndDescriptionElement = (
    <>
      <div>
        <div className={styles.btnContainer}>
          <div className={styles.likesCommentsContainer}>
            {hasLiked ? (
              <HeartIconfilled
                onClick={handleToggleLike}
                className={clsx(
                  styles.btnFilled,
                  isLoading && styles.btnDisabled,
                )}
              />
            ) : (
              <HeartIcon
                onClick={handleToggleLike}
                className={clsx(styles.btn, isLoading && styles.btnDisabled)}
              />
            )}
            {likes.length > 0 && (
              <p className={styles.likes}>
                {likes.length} {likes.length === 1 ? 'like' : 'likes'}
              </p>
            )}
          </div>
          <div className={styles.likesCommentsContainer}>
            <ChatIcon onClick={() => setIsOpen(true)} className={styles.btn} />
            {comments?.length > 0 && (
              <p className={styles.comments}>
                {comments.length}{' '}
                {comments.length === 1 ? 'comment' : 'comments'}
              </p>
            )}
          </div>
        </div>
      </div>
      <p className={styles.description}>
        <span className={styles.userNameDesc}>{authorElement}</span>
        {description}
      </p>
    </>
  );

  return (
    <>
      <div className={styles.postContainer} data-testid="post">
        {/* Header */}
        {headerElement}
        {/* Picture */}
        {imgElement}
        {/* Buttons */}
        {buttonsAndDescriptionElement}
        {/* Descrption */}
      </div>
      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className={styles.modalContainer} data-testid="modal">
          <div
            onClick={() => setIsOpen(true)}
            className={styles.modalImg}
            style={{ backgroundImage: `url(${postImage})` }}
          />
          <div className={styles.commentSection}>
            {headerElement}
            {buttonsAndDescriptionElement}
            <Comments
              comments={comments}
              isLoading={isLoading}
              onAddComment={handleAddComment}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PostComponent;

PostComponent.propTypes = {
  author: PropTypes.any,
  postImage: PropTypes.string,
  description: PropTypes.string,
  likes: PropTypes.array,
  _id: PropTypes.string,
  comments: PropTypes.array,
};
