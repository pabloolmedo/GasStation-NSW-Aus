export class API {

    encodeAPIKey_SecretKey() {
        const APIKey = 'K4ghiRBkmkred1f85YZTs1apYGRQQqnY';
        const secretKey = 'x4LZGgA4IbRfZiUa';
        const base64 = btoa(`${APIKey}:${secretKey}`);
        return base64;
    }

    async getToken_Id_Timestamp() {

        const encodedAPIKey_SecretKey = this.encodeAPIKey_SecretKey();

        const uri = new URL('https://api.onegov.nsw.gov.au/oauth/client_credential/accesstoken');
        const param = {
            grant_type: 'client_credentials'
        };
        uri.search = new URLSearchParams(param).toString();

        const header = new Headers();
        header.append('authorization', encodedAPIKey_SecretKey);

        const req = new Request(uri, {
            method: 'GET',
            headers: header,
            mode: 'cors'
        });
        const getBearerToken = await fetch(req);
        const responseJSON = await getBearerToken.json();
        
        return {
            responseJSON
        }
    }

    async getFuelStation() {
        let data = await this.getToken_Id_Timestamp()
            .then(data => {
                const token = data.responseJSON.access_token;
                const transactionid = data.responseJSON.application_name;
                const requestTimestamp = data.responseJSON.issued_at;
                const dateUTC = this.unixTimestampToDate(requestTimestamp);
                return {
                    token,
                    transactionid,
                    dateUTC
                }

            })
            .catch(error => {
                console.log(error)
            });

        const uri = 'https://api.onegov.nsw.gov.au/FuelPriceCheck/v1/fuel/prices';
        let header = new Headers();
        header.append('apikey', 'K4ghiRBkmkred1f85YZTs1apYGRQQqnY');
        header.append('transactionid', data.transactionid);
        header.append('requesttimestamp', data.dateUTC);
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Bearer' + ' ' + data.token);

        let req = new Request(uri, {
            method: 'GET',
            headers: header,
            mode: 'cors',
        });

        const gasStations = await fetch(req);
        const responseJSON = await gasStations.json();

        

        return {
            responseJSON
        }
    }

    unixTimestampToDate(timestamp) {
        let date = new Date(timestamp * 1).toLocaleDateString('en-GB');
        let time = new Date(timestamp * 1).toLocaleTimeString();
        let dateUTC = date + ' ' + time; 
        
        return dateUTC;
    }
}