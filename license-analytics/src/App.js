import React, { Component } from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import Plot from 'react-plotly.js';
import { string } from 'postcss-selector-parser';

class App extends Component {
  constructor(props) {
    super(props)
    this.licenseInput = React.createRef();
    this.state = {
      field_data: "",
      valid_id: "", // options are "fake", "of age", "not of age"
      showAnalytics: false,
      data: []
    }

    this.handleBlur = this.handleBlur.bind(this);
    this.client = Stitch.initializeDefaultAppClient('license-analytics-jpmyw');
    Stitch.defaultAppClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`Logged in as anonymous user with id: ${user.id}`);
    }).catch(console.error);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAnalytics = this.handleAnalytics.bind(this);
    this.backHome = this.backHome.bind(this);
  }

  componentDidMount() {
    this.client.callFunction("getLicenseData").then(res => this.setState({data:res}));
  }

  handleSubmit(event) {
    event.preventDefault()
    this.data = this.state.field_data;
    this.setState({ field_data: "" })

    let res = this.data.match(/%(\w{2})([^^]*)\^([^$]*)\$([^$]*)\$([^$]*)\$\^([^^]*)\^\?;(\d{6})(\d*)=(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})\?\+10(\d{9}) {2}(\w) (\w) {13}(\d)(\d)(\d{2})(\d{3})(\w{3})(\w{3})/)
    if (res === null) {
      console.log("big oof");
      this.setState({ valid_id: "fake" })
      setTimeout(() => {
        this.setState({valid_id: ""})
      }, 5000);
      return;
    }

    let split_data = {
      "state": res[1],
      "city": res[2],
      "last_name": res[3],
      "first_name": res[4],
      "middle_name": res[5],
      "address": res[6],
      "iin": res[7],
      "license_number": res[8],
      "expiration_year": res[9],
      "expiration_month": res[10],
      "dob_year": res[11],
      "dob_month": res[12],
      "dob_day": res[13],
      "zip_code": res[14],
      "license_class": res[15],
      "license_restriction": res[16],
      "gender": res[17],
      "height_ft": res[18],
      "height_in": res[19],
      "weight": res[20],
      "hair_color": res[21],
      "eye_color": res[22],
      "swipe_time": Date.now()
    }

    let today = new Date();
    if (today.getFullYear() - parseInt(split_data.dob_month) >= 21 &&
      today.getMonth() + 1 >= parseInt(split_data.dob_month) &&
      today.getDate() >= parseInt(split_data.dob_day)) {
      this.setState({ valid_id: "of age" })
    }
    else {
      this.setState({ valid_id: "not of age" })
    }
    setTimeout(() => {
      this.setState({valid_id: ""})
    }, 5000);

    this.client.callFunction("addNewLicense", [split_data]).then(res => console.log(res)).catch(e => console.log(e))
  }

  handleChange(event) {
    this.setState({ field_data: event.target.value })
  }

  handleBlur(event) {
    this.licenseInput.current.focus();
  }

  handleAnalytics() {
    this.setState({showAnalytics: true});
    console.log("big data baby");
  }

  backHome() {
    this.setState({showAnalytics: false});  
  }


  render() {
    let banner = null;
    switch (this.state.valid_id) {
      case "of age":
        banner = (<Paper
          elevation={9}
          style={{
            backgroundColor: '#00FF00'
          }}>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            gutterBottom>
            OVER 21
          </Typography>
        </Paper>);
        break;
      case "not of age":
        banner = (<Paper
          elevation={9}
          style={{
            backgroundColor: '#FF0000'
          }}>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            gutterBottom>
            NOT OVER 21
          </Typography>
        </Paper>);
        break;
      case "fake":
        banner = (<Paper
          elevation={9}
          style={{
            backgroundColor: '#000000'
          }}>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            color="error"
            gutterBottom>
            POTENTIAL FAKE ID
          </Typography>
        </Paper>);
        break;
        default:
        banner = (<Paper
          elevation={9}>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            gutterBottom>
            Please Swipe License
          </Typography>
        </Paper>);
        break;
    }
                  
    if(this.state.showAnalytics) {
      let male = 0;
      let female = 0;
      let maleBirthdays = [];
      let femaleBirthdays = [];
      let zipCodes = new Map();
      let zips = [];
      let freqs = [];

      this.state.data.forEach(element => {
        if(zipCodes.get(element.zip_code) === undefined) {
          zipCodes.set(element.zip_code, 1);
        } else {
          zipCodes.set(element.zip_code, zipCodes.get(element.zip_code) + 1);
        }

        var today = new Date();
        console.log(today.getDate());
        console.log(today.getMonth());
        var year = today.getFullYear();
        var yearsDiff = year - element.dob_year - 1;
        if(today.getMonth() + 1 > element.dob_month) {
          yearsDiff++;
        } else {
          if(today.getMonth() + 1 == element.dob_month) {
            if(today.getDate() >= element.dob_day) {
              yearsDiff++;
            }
          }
        }
        
        if(element.gender === '1') {
          maleBirthdays.push(yearsDiff);
          male++;
        } else {
          femaleBirthdays.push(yearsDiff);
          female++;
        }
      });

      zipCodes.forEach(addElement);

      console.log(zips);
      console.log(freqs);

      function addElement(value, key, map) {
        zips.push(key.toString());
        freqs.push(value);
      }

      return (
        <div className = "App">
        <Grid
         container
         spacing={8}
         direction="column"
         alignItems="center"
         justify="center"
         style={{minHeight:'100vh',
                 maxWidth: '100vw',
                 margin: 'auto',
                 background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', 
                 boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .30)',}}> 
        <Grid item xs={6}>
         <Typography
            component="h1"
            variant="h1"
            gutterBottom>
            License Analytics
         </Typography>
        </Grid>
         <Grid
           container
           item xs
           spacing={8}
           direction="row"
           alignItems="center"
           justify="center"
           style={{maxWidth: '100vw', margin: 'auto'}}>
          
           <Grid item xs>
             <Plot
               data = {[{values: [male, female], labels: ['Males', 'Females'], type: 'pie'}]}
               layout = { {width:400, height:400, title: 'Gender Breakdown' } }
             />
           </Grid>
           <Grid item xs>
             <Plot
               data = {[{x: maleBirthdays, name: 'Males', type: 'histogram'}, {x: femaleBirthdays, name: 'Females', type: 'histogram'}]}
               layout = { { width: 400, height: 400, barmode: 'stack', title: 'Histogram of Birth Years' } }
             />
           </Grid>
           <Grid item xs>
            <Plot 
              data = {[{x: zips, y: freqs, type: 'bar'}]}
              layout = { { width: 400, height: 400, title: 'Postal Code Frequencies', xaxis: { type: "category" } } }
            />
           </Grid>
         </Grid>
         <Grid item xs>
           <Button style= {{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
             boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
             borderRadius: 3,
             border: 0,
             color: 'white',
             height: 48,
             padding: '0 30px',}}
             onClick = {this.backHome}>
             Go Back
           </Button>
         </Grid>
        </Grid>

        </div>
      );

    } else {
      return (
        <div className="App">
        <Grid
         container
         spacing={16}
         direction="column"
         alignItems="center"
         justify="center"
         onClick={this.handleBlur}
         style={{minHeight:'100vh',
                 maxWidth: '100vw',
                 margin: 'auto',
                 background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', 
                 boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .30)',}}>
         <Typography
            component="h1"
            variant="h1"
            gutterBottom>
            License Analytics
         </Typography>
         <Grid item xs={9}>
          {banner}
         </Grid>
         <Grid item xs={7}>
           <form 
            onSubmit={this.handleSubmit}>
             <TextField
               id="licenseData"
               label="License Data"
               InputProps={{
                 color: "#ffffff"
               }}
               variant="outlined"
               inputRef={this.licenseInput}
               type={this.state.showPassword ? 'text': 'password'}
               name = "data"
               autoFocus
               value={this.state.field_data}
               onChange={this.handleChange}
             />
            </form>
          </Grid>
          <Grid item xs={3}>
            <Button
             style={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                borderRadius: 3,
               border: 0,
               color: 'white',
               height: 48,
               padding: '0 30px',}}
          variant = "contained"
          onClick={this.handleAnalytics}>
          View Analytics
            </Button>
          </Grid>
        </Grid>
        </div>
      );
    }  
   }
  }
export default App;
