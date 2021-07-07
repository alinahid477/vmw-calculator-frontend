import React, {useEffect, useState} from "react";
import Display from "./Display";
import ButtonPanel from "./ButtonPanel";
import calculate from "../logic/calculate";
import "./App.css";

export default class App extends React.Component {
  state = {
    total: null,
    next: null,
    operation: null,
  };

  handleClick = buttonName => {
    var ret = calculate(this.state, buttonName);
    console.log('ret',ret);
    
    if(ret instanceof Promise) {
      console.log('fetching..');
      this.setState({total:'fetching...',next:null,operation:null});
      ret.then(data=>{
        console.log(data);
        this.setState({total:data,next:null,operation:null})
      }).catch(err=>this.setState({total:'err',next:null,operation:null}));
    } else if(ret instanceof Object){
      console.log('object');
      this.setState(ret);
    } else {
      console.log('value');
      this.setState({total:ret,next:null,operation:null});
    }
    
  };

  render() {
    return (
      <div className="component-app">
        <Display value={this.state.next || this.state.total || "0"} />
        <ButtonPanel clickHandler={this.handleClick} />
      </div>
    );
  }
}
