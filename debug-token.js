// Debug script to check JWT token
const token = sessionStorage.getItem('token');
if (token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT Payload:', payload);
        console.log('User ID (uid):', payload.uid);
        console.log('Email:', payload.email || payload.sub);
        console.log('Role:', payload.role);
    } catch (error) {
        console.error('Error parsing token:', error);
    }
} else {
    console.log('No token found');
}