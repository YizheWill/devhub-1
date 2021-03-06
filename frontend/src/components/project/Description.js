import React from 'react';
import { Typography } from '@material-ui/core';

function Description({ description }) {
  return (
    <div className="overview-description">
      <Typography
        style={{
          margin: '2rem',
          lineHeight: '1.8em',
          fontSize: 20,
          fontWeight: 100,
          maxWidth: '50%',
        }}
      >
        {description}
      </Typography>
    </div>
  );
}

export default Description;
