import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';

import Task from './Task.js';

import Badge             from '@material-ui/core/Badge';
import Button            from '@material-ui/core/Button';
import Checkbox          from '@material-ui/core/Checkbox';
import Dialog            from '@material-ui/core/Dialog';
import DialogTitle       from '@material-ui/core/DialogTitle';
import DialogContent     from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions     from '@material-ui/core/DialogActions';
import FormControlLabel  from '@material-ui/core/FormControlLabel';
import FormGroup         from '@material-ui/core/FormGroup';
import List              from '@material-ui/core/List';
import Typography        from '@material-ui/core/Typography';
import TextField         from '@material-ui/core/TextField';
import InputAdornment    from '@material-ui/core/InputAdornment';
import IconButton        from '@material-ui/core/IconButton';
import Snackbar          from '@material-ui/core/Snackbar';

import CreateIcon from '@material-ui/icons/Create';
import CloseIcon  from '@material-ui/icons/Close';

class App extends Component {
  state = {
    textInput: '',
    statusMessage: '',
    selectedTaskId: '',
    hideCompleted: false,
    showDialog: false,
    showSnackbar: false,
  }

  handleChange = (event) => {
    this.setState({ textInput: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const text = this.state.textInput;

    if (text.length > 0) {
      Tasks.insert({
        text,
        createdAt: new Date(),
      });

      this.setState({
        textInput: '',
        statusMessage: 'Task created',
        showSnackbar: true,
      });
    }
  }

  deleteTask = () => {
    Tasks.remove(this.state.selectedTaskId);
    this.setState({
      statusMessage: 'Task deleted',
      showDialog: false,
      showSnackbar: true,
    });
  }

  handleOpenDialog = (id) => {
    this.setState({
      selectedTaskId: id,
      showDialog: true,
    });
  }

  handleCloseDialog = () => {
    this.setState({ showDialog: false });
  }

  handleCloseSnackbar = () => {
    this.setState({ showSnackbar: false });
  }


  toggleHideCompleted = () => {
    this.setState({ hideCompleted: !this.state.hideCompleted });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;

    if (this.state.hideCompleted === true) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }

    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} delete={this.handleOpenDialog} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <Badge color="primary" badgeContent={this.props.incompleteCount}>
            <Typography variant="display1" style={{paddingRight: "10px"}} gutterBottom>
              Todo List
            </Typography>
          </Badge>

          <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.hideCompleted === true}
                onClick={() => this.toggleHideCompleted()}
                value="checkedA"
              />
            }
            label="Hide Completed"
           />
          </FormGroup>

          <form onSubmit={this.handleSubmit}>
            <TextField
              label="New Task"
              placeholder="Enter a new task"
              value={this.state.textInput}
              onChange={this.handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreateIcon />
                  </InputAdornment>
                )
              }}
            />
            <Button
              color="primary"
              type="submit"
              style={{marginLeft: "1em", marginBottom: "16px"}}
            >
              Create
            </Button>
          </form>
        </header>

        <Dialog
          open={this.state.showDialog}
          onClose={this.handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Task?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to permanently delete this task?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteTask} color="primary">
              Yes
            </Button>
            <Button onClick={this.handleCloseDialog} color="primary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>

        <List style={{maxWidth: "500px"}}>
          {this.renderTasks()}
        </List>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.showSnackbar}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackbar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.statusMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleCloseSnackbar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
  };
})(App);
