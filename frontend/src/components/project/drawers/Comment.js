import * as COLORS from '../../../colors';
import React, { useState, useEffect } from 'react';
import TimeAgo from 'react-timeago';
import {
  fade,
  withStyles,
  InputBase,
  makeStyles,
  Avatar,
  Typography,
  Button,
  Divider,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { createComment } from '../../../actions/comment_actions';

const useStyles = makeStyles((theme) => ({
  root: {
    float: 'right',
    padding: 40,
    minWidth: 400,
    maxWidth: 700,
  },

  feedback: {
    marginTop: '2rem',
    paddingLeft: '2rem',
  },
  comments: {
    marginLeft: '1rem',
    marginTop: '1rem',
  },
  commentBox: {
    display: 'flex',
    marginBottom: '1.3rem',
  },
}));
const BootstrapInput = withStyles((theme) => ({
  root: {
    width: '80%',
    marginTop: -20,
  },
  input: {
    borderRadius: 4,
    backgroundColor: '#f1f1f1',
    border: '1px solid #ced4da',
    fontSize: 16,
    height: '10px',
    padding: '10px 12px',
    marginBottom: 10,
    placeholder: 'Share your thoughts...',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: `${fade(COLORS.DEVBLUE, 0.25)} 0 0 0 0.2rem`,
      borderColor: COLORS.DEVBLUE,
    },
  },
}))(InputBase);

const CommentItem = ({ comment }) => {
  const cmt = {
    commenterAvatarUrl: comment.user.imageUrl,
    commenter: comment.userName,
    body: comment.body,
    createdAt: comment.createdAt,
  };

  const classes = useStyles();
  return (
    <div className={classes.commentBox}>
      <Avatar
        src={
          cmt.commenterAvatarUrl ||
          'http://res.cloudinary.com/willwang/image/upload/v1609729496/li5qk7claehau3n3hfmf.png'
        }
        style={{ marginRight: '1rem', border: `1px solid ${COLORS.DEVBLUE}` }}
      />
      <div>
        <Typography variant="body2" style={{ fontWeight: 400 }}>
          {cmt.commenter}
        </Typography>
        <Typography variant="body2" style={{ fontWeight: 100 }}>
          {cmt.body}
        </Typography>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginTop: '0.3rem',
          }}
        >
          <Typography
            variant="caption"
            style={{ fontWeight: '100', color: '#8f8f8f', marginRight: '1rem' }}
          >
            about <TimeAgo date={cmt.createdAt} />
          </Typography>
        </div>
      </div>
    </div>
  );
};

function Feedback({ comments, userId, project, createComment }) {
  useEffect(() => {}, []);
  const classes = useStyles();
  const [height, setHeight] = useState(1);
  const [newComment, setNewComment] = useState('');

  const submitComment = () => {
    const commentData = {
      body: newComment,
      project: project._id,
    };
    setNewComment('');
    createComment(commentData);
  };

  const renderCommentItems = () => {
    if (!comments) return null;
    return comments.map((cmnt, i) => (
      <React.Fragment key={i}>
        <CommentItem comment={cmnt} />
        <Divider style={{ marginBottom: 20 }} />
      </React.Fragment>
    ));
  };

  return (
    <div className={classes.root}>
      <div className={classes.feedback}>
        <label>
          <Typography variant="h6" style={{ marginBottom: 20 }}>
            Comments
          </Typography>
          <div style={{ position: 'relative' }}>
            <BootstrapInput
              placeholder="share your thoughts"
              style={{ fontWeight: '100' }}
              className={classes.inputField}
              multiline
              rows={height}
              rowsMax={5}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setHeight(5)}
              onBlur={() => setHeight(1)}
            />
            <Button
              onMouseDown={submitComment}
              variant="contained"
              color="secondary"
              disabled={!newComment}
              style={{
                zIndex: 999,
                display: height === 1 ? 'none' : '',
                position: 'absolute',
                bottom: 30,
                left: 15,
                fontSize: 10,
                height: 20,
                width: 10,
                backgroundColor: COLORS.DEVBLUE,
                color: 'white',
                fontWeight: 800,
              }}
            >
              Post
            </Button>
          </div>
        </label>
      </div>
      <div className={classes.comments}>
        {/* <CommentItem key={1} comment={{}} />
        <Divider style={{ marginBottom: 20 }} />
        <CommentItem key={2} comment={{}} />
        <Divider style={{ marginBottom: 20 }} />
        <CommentItem key={3} comment={{}} />
        <Divider style={{ marginBottom: 20 }} />
        <CommentItem key={4} comment={{}} />
        <Divider style={{ marginBottom: 20 }} />
        <CommentItem key={5} comment={{}} />
        <Divider style={{ marginBottom: 20 }} />
        <CommentItem key={6} comment={{}} /> */}
        {renderCommentItems()}
      </div>
    </div>
  );
}

export default connect(
  (state, ownProps) => ({
    userId: state.session.user?.id,
    toggleDrawer: ownProps.toggleDrawer,
    comments: Object.values(state.entities.comments),
    project: ownProps.project,
    // comments: ownProps.comments,
  }),
  (dispatch) => ({
    createComment: (comment) => dispatch(createComment(comment)),
  })
)(Feedback);
