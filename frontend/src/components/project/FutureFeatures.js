import { Typography } from '@material-ui/core';
import { disconnect } from 'mongoose';
import React from 'react';

function FutureFeatures({ features, project }) {
  const futureFeatures = features.map((ftr, idx) => (
    <div className="future-feature-bucket">
      <Typography
        style={{
          lineHeight: '1.4em',
          fontSize: 24,
          fontWeight: 100,
        }}
      >
        {ftr.title}
      </Typography>
      <Typography style={{ fontSize: 18 }}>{ftr.description}</Typography>
    </div>
  ));

  // let reverseFeatures = '';
  // if (project.features.length % 2 == 0) {
  //   reverseFeatures = "reverse-features"
  // }

  return (
    <div
      id="future-features"
      className={`future-features-grid ${
        project.features.length % 2 == 0 ? 'reverse-features' : ''
      }`}
    >
      <img
        className="future-features-image"
        src="https://res.cloudinary.com/willwang/image/upload/v1609721698/FutureFeatures_ig8hzf.png"
      ></img>
      <div className="future-features-desc">
        <Typography
          style={{
            lineHeight: '1.8em',
            fontSize: 30,
            fontWeight: 100,
          }}
        >
          Future Features
        </Typography>
        <div className="future-features-container">{futureFeatures}</div>
      </div>
    </div>
  );
}

export default FutureFeatures;
