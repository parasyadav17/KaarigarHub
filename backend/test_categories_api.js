const http = require('http');

const url = 'http://localhost:4000/api/v1/job/showAllCategories';

http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsedData = JSON.parse(data);
            console.log("Status Code:", res.statusCode);
            console.log("Response Body:", JSON.stringify(parsedData, null, 2));
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
            console.log("Raw Data:", data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
