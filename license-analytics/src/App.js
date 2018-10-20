import React, { Component } from 'react';
import './App.css';
import { Stitch } from 'mongodb-stitch-browser-sdk';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper';

const client = Stitch.initializeDefaultAppClient('license-analytics-jpmyw');

class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      field_data: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    this.data = this.state.field_data;
    this.setState({field_data: ""})
    let res = this.data.match(/%(\w{2})([^\^]*)\^([^\$]*)\$([^\$]*)\$([^\$]*)\$\^([^\^]*)\^\?\;(\d{6})(\d*)\=(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})\?\+10(\d{9})  (\w) (\w)             (\d)(\d)(\d{2})(\d{3})(\w{3})(\w{3})/)
    
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
      "eye_color": res[22]
    }
  }

  handleChange(event) {
    this.setState({field_data: event.target.value})
  }



  render() {
    return (
      <div className="App">
      <Grid
       container
       spacing={0}
       direction="column"
       alignItems="center"
       justify="center"
       style={{minHeight:'100vh',background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}>
       <Grid item xs={3}>
      	 <Paper 
       	  elevation={6}>
      	    <Typography 
       	     component="h1" 
       	     variant="h1"
       		 align="center"
       	     gutterBottom>
       	     Please Swipe License
      	     </Typography>
         </Paper>
       </Grid>
      </Grid>
        <form onSubmit={this.handleSubmit}>
          <label>
            Swipe License:
            <input type="text" name="data" value={this.state.field_data} onChange={this.handleChange} />
          </label>
        </form>
        <p id="dataField">{this.data}</p>
      </div>
    );
  }
}

export default App;
