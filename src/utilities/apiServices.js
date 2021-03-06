import config from '../configs';
import backendCommonClient from './backendCommonClient';

const apiServices = {
    plus: (x,y) => {
        var formdata = new FormData();
        formdata.append("a", x);
        formdata.append("b", y);

        return backendCommonClient.makeRESTCall(
            `${config.APISERVICES.ADD_SERVICE}/sum`,
            {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            }
        );
    },
    minus: (x,y) => {
        var formdata = new FormData();
        formdata.append("a", x);
        formdata.append("b", y);
        return backendCommonClient.makeRESTCall(
            `${config.APISERVICES.SUBTRACT_SERVICE}/subtract`,
            {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            }
        );
    },
    divide: (x,y) => {
        var formdata = new FormData();
        formdata.append("a", x);
        formdata.append("b", y);
        return backendCommonClient.makeRESTCall(
            `${config.APISERVICES.DIVISION_SERVICE}/divide`,
            {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            }
        );
    },
};

export default apiServices;