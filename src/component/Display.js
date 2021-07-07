import React, {useEffect} from "react";
import PropTypes from "prop-types";

import "./Display.css";

const Display = (props) => {
  
  console.log('VAL',props.value);
 
  return (
    <div className="component-display">
      <div>{props.value}</div>
    </div>
  );

    
}

Display.propTypes = {
  value: PropTypes.any
};

export default Display;