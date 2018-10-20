import React, { Component } from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import Plot from 'react-plotly.js';

class App extends Component {
  constructor(props) {
    super(props)
    this.licenseInput = React.createRef();
    this.state = {
      field_data: "",
      showAnalytics: false,
      data: []
    }

    this.handleBlur = this.handleBlur.bind(this);
    this.client = Stitch.initializeDefaultAppClient('license-analytics-jpmyw');
    Stitch.defaultAppClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`Logged in as anonymous user with id: ${user.id}`);
      this.client.callFunction("getLicenseData").then(res => console.log(res)).catch(e => console.log(e))
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
    if(this.state.showAnalytics) {
      let male = 0;
      let female = 0;
      let maleBirthdays = [];
      let femaleBirthdays = [];
      this.state.data.forEach(element => {
        if(element.gender === '1') {
          maleBirthdays.push(parseInt(element.dob_year));
          male++;
        } else {
          femaleBirthdays.push(parseInt(element.dob_year));
          female++;
        }
      });



      return (
        <div className = "App">
        <Button onClick = {this.backHome}>Go Back</Button>
        <Plot
          data = {[{
            values: [male, female],
            labels: ['Males', 'Females'],
            type: 'pie'
          }]}

          layout = { {width:500, height:400, title: 'Gender Breakdown' } }
        />
        <Plot
          data = {[{
            x: maleBirthdays,
            type: 'histogram'
          },
          {
            x: femaleBirthdays,
            type: 'histogram'
          } 
          ]}
         
          layout = { { width: 500, height: 400, barmode: 'stack', title: 'Histogram of Birth Years' } }
        />
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
         <Grid item xs={9}>
           <Paper 
             elevation={9}>
              <Typography 
                component="h1" 
                variant="h1"
              align="center"
                gutterBottom>
                Please Swipe License
               </Typography>
           </Paper>
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
