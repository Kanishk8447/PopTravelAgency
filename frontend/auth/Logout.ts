//logout.js

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userConfig');
  window.location.href = '/logout';
};

export default logout;
