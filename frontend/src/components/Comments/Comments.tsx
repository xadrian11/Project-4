import React, { useEffect, useState } from 'react';
import styles from './Comments.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getUserById } from '../../services/users-service';

function SingleComment({ comment }) {
  const { author, content } = comment;
  const [authorUser, setAuthorUser] = useState(null);

  useEffect(() => {
    getUserById(author)
      .then((user) => setAuthorUser(user))
      .catch(() => setAuthorUser(null));
  }, [author]);

  if (!authorUser) {
    return null;
  }

  return (
    <div className={styles.comment}>
      <img src={authorUser.avatarURL} className={styles.userImg} />
      <p className={styles.commentValue}>
        <Link to={`/users/${author}`} className={styles.userName}>
          {authorUser.name} {authorUser.lastname}:
        </Link>
        {content}
      </p>
    </div>
  );
}

SingleComment.propTypes = {
  comment: PropTypes.shape({
    author: PropTypes.string,
    content: PropTypes.string,
  }),
};

function Comments({ comments, isLoading, onAddComment }) {
  const [content, setContent] = useState('');

  return (
    <>
      <div className={styles.commentContainer}>
        {comments?.map((comment) => {
          return <SingleComment key={comment._id} comment={comment} />;
        })}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.input}
          placeholder="Add new comment..."
        />
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          onClick={() => onAddComment(content)}
          className={styles.btn}
        >
          Post
        </button>
      </div>
    </>
  );
}

export default Comments;

Comments.propTypes = {
  comments: PropTypes.array,
  isLoading: PropTypes.bool,
  onAddComment: PropTypes.func,
};
