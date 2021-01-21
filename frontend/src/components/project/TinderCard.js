import TinderCard from 'react-tinder-card';
import * as COLORS from '../../colors';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import './TinderCard.css';
import { makeStyles } from '@material-ui/core';
import { fetchFeaturedProjects } from '../../actions/project_actions';
import { addFavorite } from '../../actions/project_actions';
import { Zoom } from '@material-ui/core';
function TinderCards({ featured, fetchProjects, addFavorite }) {
  const history = useHistory();
  const [hint, setHint] = useState('flex');
  const [featuredProjects, setFeatured] = useState(featured);
  const [showImage, setShowImage] = useState(false);
  const [dispImage, setDispImage] = useState('none');
  const [display, setDisplay] = useState('');
  let counter = Object.keys(featuredProjects).length;
  useEffect(() => {
    fetchProjects();
  }, []);
  useEffect(() => {
    setFeatured(featured);
  }, [featured]);
  const imageUrl =
    'https://res.cloudinary.com/willwang/image/upload/v1609722148/LandingTop_jat0ue.png';
  const useStyles = makeStyles((theme) => ({
    root: {
      display: display,
    },
    hint: {
      display: hint,
    },
    card: {
      '&:hover .hint': {
        display: 'none',
      },
    },
  }));
  const classes = useStyles();
  const outOfFrame = (imagesId) => {};
  const showHint = () => {
    setHint('flex');
  };
  const hideHint = () => {
    setHint('none');
  };

  const swiped = (direction, projectId) => {
    counter--;
    console.log('counter', counter);
    if (counter <= 0) {
      setDisplay('none');
      setShowImage(true);
      setDispImage('');
    }
    console.log('counter', counter);
    if (direction === 'right') {
      addFavorite(projectId);
    }
  };
  console.log('featuredProjects', featuredProjects);
  return (
    <div>
      <Zoom
        in={showImage}
        timeout={{ enter: 4500 }}
        style={{ diplay: dispImage }}
      >
        <img
          src={imageUrl}
          style={{
            display: dispImage,
            maxWidth: '100%',
          }}
        />
      </Zoom>
      <div className={clsx('tinderCards', classes.root)}>
        <div className="tinderCards__cardContainer">
          {Object.values(featuredProjects)
            .reverse()
            .map((project) => (
              <TinderCard
                className="swipe"
                key={Math.random()}
                preventSwipe={['up, down']}
                onSwipe={(dir) => {
                  swiped(dir, project._id);
                  // setHint('none');
                }}
                onCardLeftScreen={() => outOfFrame(project._id)}
              >
                <div
                  className="card"
                  style={{
                    backgroundImage: `url(${project.images.hero})`,
                    position: 'relative',
                  }}

                  // onClick={() => {
                  //   setFirst('none');
                  // }}
                >
                  <div
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      display: 'inline-block',
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: 30,
                        fontWeight: 800,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        transition: 'opacity 0.2s',
                        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                      }}
                      onClick={() => {
                        history.push(`/projects/${project._id}`);
                      }}
                    >
                      {project.title.toUpperCase()}
                    </Typography>
                  </div>
                  <div
                    className="hint"
                    style={{
                      // display: 'none',
                      display: hint,
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                      left: 0,
                      top: '80%',
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255, 0.9)',
                      height: '20%',
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0 3%',
                      }}
                    >
                      <Typography
                        style={{ fontWeight: 800, color: COLORS.DEVBLUE }}
                      >
                        Drag left to see the next
                      </Typography>
                      <Typography
                        style={{ fontWeight: 800, color: COLORS.DEVBLUE }}
                      >
                        Drag right to favorite
                      </Typography>
                    </div>
                  </div>
                </div>
              </TinderCard>
            ))}
        </div>
      </div>
    </div>
  );
}

export default connect(
  (state) => ({ featured: state.entities.featured }),
  (dispatch) => ({
    fetchProjects: () => dispatch(fetchFeaturedProjects()),
    addFavorite: (projectId) => dispatch(addFavorite(projectId)),
  })
)(TinderCards);
