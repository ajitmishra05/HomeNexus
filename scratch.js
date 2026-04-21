const http = require('http');

const data = JSON.stringify({
  email: 'testprov99@example.com',
  name: 'Test Prov',
  role: 'serviceProvider',
  firebaseUid: 'testprov123'
});

const req = http.request('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  console.log('Auth status:', res.statusCode);
  console.log('Auth headers:', res.headers);
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const user = JSON.parse(body);
    console.log('User:', user);
    
    // Create service
    const serviceData = JSON.stringify({
      category: 'laundry',
      description: 'Test',
      price: '50'
    });
    
    const sreq = http.request('http://localhost:5000/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(serviceData),
        'Authorization': `Bearer ${user.token}`
      }
    }, (sres) => {
      let sbody = '';
      sres.on('data', d => sbody += d);
      sres.on('end', () => {
        console.log('Service:', sbody);
      });
    });
    sreq.write(serviceData);
    sreq.end();
  });
});
req.write(data);
req.end();
