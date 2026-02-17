const https = require('https');

const url = 'https://res.cloudinary.com/dfos72c3g/image/upload/v1771162496/hostel/students/profile/qdb64ovrmnh2jeivy7d0.jpg';

https.get(url, (res) => {
    console.log('Status Code:', res.statusCode);
    if (res.statusCode === 200) {
        console.log('Image exists!');
    } else {
        console.log('Image does not exist (or error).');
    }
}).on('error', (e) => {
    console.error(e);
});
