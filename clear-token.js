// Clear the bad JWT token
sessionStorage.removeItem('token');
localStorage.removeItem('token');
console.log('Bad token cleared! Please refresh the page.');