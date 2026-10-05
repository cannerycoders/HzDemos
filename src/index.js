const App = window._app = {
  isTouchDevice: window.matchMedia("(pointer: coarse)").matches,
};

document.body.classList.toggle("touch", App.isTouchDevice);
if(!App.isTouchDevice)
  document.body.classList.remove("loading");