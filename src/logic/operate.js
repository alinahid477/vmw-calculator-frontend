import Big from "big.js";

import apiServices from '../utilities/apiServices';

export default function operate(numberOne, numberTwo, operation) {
  const one = Big(numberOne || "0");
  const two = Big(numberTwo || (operation === "÷" || operation === 'x' ? "1": "0")); //If dividing or multiplying, then 1 maintains current value in cases of null
  if (operation === "+") {
    return apiServices.plus(one.toPrecision(10),two.toPrecision(10)).then((data) => {
      if (!data.success) {
          // handle not success here.
          console.log(data);
      } else {
          console.log(data);
          return data.message;
      }
    }).catch((errorData) => {
        console.log(errorData);
        return errorData;
    });
    //return 'one.plus(two).toString()....';
  }
  if (operation === "-") {
    return apiServices.minus(one.toPrecision(10),two.toPrecision(10)).then((data) => {
      if (!data.success) {
          // handle not success here.
          console.log(data);
      } else {
          console.log(data);
          return data.message;
      }
    }).catch((errorData) => {
        console.log(errorData);
    });
    //return one.minus(two).toString();
  }
  if (operation === "x") {
    return one.times(two).toString();
  }
  if (operation === "÷") {
    return apiServices.divide(one.toPrecision(10),two.toPrecision(10)).then((data) => {
      if (!data.success) {
          // handle not success here.
          console.log(data);
      } else {
          console.log(data);
          return data.message;
      }
    }).catch((errorData) => {
        console.log(errorData);
    });
    // if (two === "0") {
    //   alert("Divide by 0 error");
    //   return "0";
    // } else {
    //   return one.div(two).toString();
    // }
  }
  throw Error(`Unknown operation '${operation}'`);
}
