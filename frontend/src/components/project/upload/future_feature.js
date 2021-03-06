import React, { Component } from 'react';
import { Typography, InputBase } from '@material-ui/core';

class FutureFeature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: this.props.idx,
      title: this.props.futureFeature.title || '',
      description: this.props.futureFeature.description || '',
    };
  }

  handleInput(field) {
    return (e) => {
      this.setState(
        {
          [field]: e.currentTarget.value,
        },
        () => this.props.addFutureFeatureToState(this.state)
      );
    };
  }

  render() {
    return (
      <div className="step-inner-third future">
        <label className="step-input-label med upper">
          <Typography>{`Future Feature ${this.props.idx + 1}`}</Typography>
        </label>
        <label className="step-input-label">
          <Typography>
            Feature Title <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputBase
            className="step-input"
            value={this.state.title || ''}
            onChange={this.handleInput('title')}
          />
        </label>
        <label className="step-input-label">
          <Typography>
            Feature Description <span style={{ color: 'red' }}>*</span>
          </Typography>
          <InputBase
            multiline={true}
            rows={7}
            style={{ padding: '0', marginBottom: '0' }}
            className="step-input"
            value={this.state.description || ''}
            onChange={this.handleInput('description')}
          />
        </label>
      </div>
    );
  }
}

export default FutureFeature;
