const fs = require('fs');
const code = `
  const fs = require('fs');
  const THREE = require('./three.min.js');
  global.THREE = THREE;
  global.window = global;
  global.document = { createElement: () => ({ getContext: () => ({ fillRect:()=>{}, fillText:()=>{}, createRadialGradient:()=>{return {addColorStop:()=>{}}}, createLinearGradient:()=>{return {addColorStop:()=>{}}}, beginPath:()=>{}, arc:()=>{}, fill:()=>{}, ellipse:()=>{}, moveTo:()=>{}, lineTo:()=>{}, strokeRect:()=>{}, stroke:()=>{}, setLineDash:()=>{}, measureText:()=>({width:10}) }), width: 100, height: 100 }) };
  global.Museum = { roomPositions: { biodiversity: {x:0,y:0,z:0}, recycling: {x:0,y:0,z:0} } };
  global.Controls = { addInteractable: () => {} };
  
  eval(fs.readFileSync('js/utils.js', 'utf8'));
  global.EcoUtils = EcoUtils;
  
  try {
      eval(fs.readFileSync('js/rooms/room-biodiversity.js', 'utf8'));
      RoomBiodiversity.build(new THREE.Scene());
      console.log('Biodiversity OK');
  } catch(e) {
      console.error('Biodiversity ERROR:', e);
  }
  
  try {
      eval(fs.readFileSync('js/rooms/room-recycling.js', 'utf8'));
      RoomRecycling.build(new THREE.Scene());
      console.log('Recycling OK');
  } catch(e) {
      console.error('Recycling ERROR:', e);
  }
`;
fs.writeFileSync('test.js', code);
require('child_process').execSync('node test.js', {stdio: 'inherit'});
