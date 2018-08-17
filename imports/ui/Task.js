import React, { Component } from 'react';

import { Tasks } from '../api/tasks.js';

import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export default class Task extends Component {
  toggleChecked = () => {
    Tasks.update(this.props.task._id, {
      $set: { checked: !this.props.task.checked },
    });
  }

  render() {

    const taskClassName = this.props.task.checked ? 'checked' : '';

    return(
      <ListItem
        onClick={this.toggleChecked}
        dense
        button
        disableRipple
      >
        <Checkbox
          checked={this.props.task.checked === true}
          tabIndex={-1}
          color="primary"
        />
        <ListItemText>
          <Typography variant="title">
            {this.props.task.text}
          </Typography>
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton onClick={() => this.props.delete(this.props.task._id)}>
            <DeleteForeverIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}
