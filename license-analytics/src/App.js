import React, { Component } from 'react';
import './App.css';
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

const client = Stitch.initializeDefaultAppClient('license-analytics-jpmyw');
Stitch.defaultAppClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
  console.log(`Logged in as anonymous user with id: ${user.id}`);
}).catch(console.error);
const mdb = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas');

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
    event.preventDefault()
    this.data = this.state.field_data;
    this.setState({field_data: ""})
    let res = this.data.match(/%(\w{2})([^^]*)\^([^$]*)\$([^$]*)\$([^$]*)\$\^([^^]*)\^\?;(\d{6})(\d*)=(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})\?\+10(\d{9}) {2}(\w) (\w) {13}(\d)(\d)(\d{2})(\d{3})(\w{3})(\w{3})/)
    
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
    console.log(split_data);
    //client.callFunction("addNewLicense", split_data).then(res => console.log(res)).catch(e => console.log(e))
    const collection = mdb.db('license-data').collection('main');
    collection.insertOne(split_data).then(res => console.log(res)).catch(e => console.log(e));
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({field_data: event.target.value})
  }

  render() {
    return (
      <div className="App">
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
