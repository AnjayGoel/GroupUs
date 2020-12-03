import React from "react";
import validator from "validator";
import { Alert } from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import {
  Paper,
  Button,
  Box,
  List,
  ListItem,
  Grid,
  TextField,
} from "@material-ui/core";
class InitForm extends React.Component {
  constructor() {
    super();
    this.state = { isLoading: false, isError: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let name = event.target.name;
    let val = event.target.value;
    if (name === "member_emails") {
      this.setState({ member_emails: val.trim().split(/\r?\n/) });
    } else if (name === "member_names") {
      this.setState({ member_names: val.trim().split(/\r?\n/) });
    } else if (name === "deadline") {
      this.setState({ deadline: Date.parse(val) / 1000 });
    } else if (name === "grpSize") {
      this.setState({ grpSize: parseInt(val) });
    } else {
      this.setState({ [name]: val });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });

    for (const i of this.state["member_emails"]) {
      if (!validator.isEmail(i.trim())) {
        alert(
          "Please Check Member Emails For Error (Invalid Email-Id,Empty Rows etc)"
        );
        return;
      }
    }
    for (const i of this.state["member_names"]) {
      if (i === "") {
        alert("Please Check Member Names For Error (Empty Rows etc)");
        return;
      }
    }
    if (
      this.state.member_emails.length === 0 ||
      this.state.member_names.length === 0
    ) {
      alert("Please Fill All Fields");
      return;
    }
    if (this.state.member_emails.length !== this.state.member_names.length) {
      alert("Different Number Of Names And Email");
      return;
    }
    let payload = { ...this.state };
    delete payload["isError"];
    delete payload["isLoading"];
    console.log(payload);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    fetch("https://silverbug.eastus.cloudapp.azure.com/create", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ isLoading: false });
        if (data["status"] === 0) {
          this.setState({ isError: true });
          return;
        }
        this.props.history.push("/Done");
      })
      .catch(function (err) {
        this.setState({ isLoading: false, isError: true });
        console.info(err + "------err------");
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div style={{ justifyContent: "center", display: "flex" }}>
          <CircularProgress style={{ margin: "20px" }} />
        </div>
      );
    } else if (this.state.isError) {
      return (
        <div>
          <Alert
            severity="error"
            style={{ display: "flex", justifyContent: "center" }}
          >
            Error! Something Happened. Please Try Again.
          </Alert>
        </div>
      );
    }

    return (
      <Box id="main">
        <Paper
          elevation={3}
          style={{
            borderRadius: "10px",
            margin: "10px",
            padding: "10px",
            paddingTop: "30px",
          }}
        >
          <ul>
            <li>
              <b>Whats this app about?</b>
              <ul>
                <li>
                  It automates group formation for
                  projects/presentations/assignments etc.
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>But why not just ask people instead?</b>
                <br />
                <ul>
                  <li>
                    Its really annoying to ask tens of people to see if they are
                    available.
                  </li>
                  <li>
                    Its even more difficult when most people are matched but
                    some groups have vacancies.
                  </li>
                  <li>
                    You might feel that you could have been better off with some
                    other choice.
                  </li>
                  <li>
                    By letting an app do the matching, you also avoid all those
                    awkward moments where you have to reject someone or get
                    rejected.
                  </li>
                </ul>
              </p>
            </li>

            <li>
              <b>How to use?</b>
              <br />
              <ul>
                <li>Fill out this form.</li>
                <li>
                  The app will send a form to all the participants, asking them
                  to assign a preference (on a scale of 1 to 10) to people they
                  would like to be paired with.
                </li>
                <li>
                  Once the preferences are collected (or deadline is reached),
                  the app will form optimal groups and send emails (to you and
                  all members), informing them of their groups.
                </li>
              </ul>
              <br />
            </li>
            <li>
              <b>How does it work?</b>
              <ul>
                <li>
                  See &nbsp;
                  <a href="https://github.com/AnjayGoel/Stable-Roommate-Generalised">
                    this.
                  </a>
                  &nbsp; Suggestions, PR are welcomed.
                </li>
              </ul>
            </li>
          </ul>
        </Paper>
        <br />
        <Paper
          elevation={3}
          style={{
            borderRadius: "10px",
            margin: "10px",
            padding: "10px",
          }}
        >
          <Grid
            container
            spacing={0}
            direction="column"
            style={{
              padding: "40px",
            }}
          >
            <form id="mainForm" onSubmit={this.handleSubmit}>
              <p>Your Name</p>
              <TextField
                name="owner_name"
                type="text"
                required={true}
                data-parse="uppercase"
                onChange={this.handleChange}
              />
              <p>Your Email</p>
              <TextField
                name="owner_email"
                type="email"
                required={true}
                onChange={this.handleChange}
              />
              <p>Title of Project</p>
              <TextField
                name="title"
                type="text"
                required={true}
                onChange={this.handleChange}
              />
              <p>Group Size</p>
              <TextField
                name="grpSize"
                type="number"
                InputProps={{ inputProps: { min: 2 } }}
                required={true}
                onChange={this.handleChange}
              />
              <p>The Deadline for Group Formation</p>
              <TextField
                name="deadline"
                type="date"
                required={true}
                onChange={this.handleChange}
              />
              <div style={{ display: "flex" }}>
                <span style={{ margin: "20px", marginLeft: "0px" }}>
                  <p>Names of Participants (Seperated by a new line)</p>
                  <TextField
                    multiline={true}
                    required={true}
                    rows={5}
                    rowsMax={10}
                    onChange={this.handleChange}
                    label="Participant Names"
                    variant="outlined"
                    name="member_names"
                  />
                </span>
                <span style={{ margin: "20px" }}>
                  <p>Emails of Participant (In same order as names)</p>
                  <TextField
                    multiline={true}
                    required={true}
                    rows={5}
                    rowsMax={10}
                    onChange={this.handleChange}
                    label="Participant Emails"
                    variant="outlined"
                    name="member_emails"
                  />
                </span>
                <p />
              </div>
              <Button type="Submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </Grid>
        </Paper>
      </Box>
    );
  }
}

export default InitForm;