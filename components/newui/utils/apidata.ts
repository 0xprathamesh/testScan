import axios from 'axios';


const xdcscanApi = axios.create({
    baseURL: 'https://api.xdcscan.io/api',
});


export const getBlockDetails = async (blockNumber: number) => {
    try {
        const response = await xdcscanApi.get('/', {
            params: {
                module: 'block',
                action: 'getblockreward',
                blockno: blockNumber,
                apikey: 'test'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching block details:', error);
        throw error;
    }
};


getBlockDetails(80187653).then(data => {
    console.log('Block Data:', data);
}).catch(err => {
    console.error(err);
});
