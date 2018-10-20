import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    const regex = /%(\w{2})([^\^]*)\^([^\$]*)\$([^\$]*)\$([^\$]*)\$\^([^\^]*)\^\?\;(\d{6})(\d*)\=(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})\?\+10(\d{9})  (\w) (\w)             (\d)(\d)(\d{2})(\d{3})(\w{3})(\w{3})/
  
    this.state = {
      field_data: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    this.data = this.state.field_data;
    console.log(this.data);
    this.setState({field_data: ""})
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
