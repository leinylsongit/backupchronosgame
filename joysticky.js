const knob = document.querySelector('.knob')
const hit = document.querySelector('.hit')

gsap.set('.highlight, .shadow', {transformOrigin:'50% 0'})
moveStick({x:innerWidth/2, y:0}, 0.5)
gsap.delayedCall(0.6, resetStick)

hit.onpointermove = moveStick
hit.onpointerleave = resetStick

function moveStick(e,d=0.3){ 
  const domPt = new DOMPoint(e.x, e.y)
  e = domPt.matrixTransform( knob.getScreenCTM().inverse() )
  e.x = Math.max(e.x,-40) // bounds for mobile dragging
  e.x = Math.min(e.x,40)
  e.y = Math.max(e.y,-35)
  e.y = Math.min(e.y,50)  
  gsap.timeline({defaults:{duration:d, ease:'power3'}})
    .set('.outputV', {
      innerHTML:'V: '+gsap.utils.clamp(-1,1,gsap.utils.mapRange(-35,35,-1,1,e.y)).toFixed(1)
    })
    .set('.outputH', {
      innerHTML:'H: '+gsap.utils.clamp(-1,1,gsap.utils.mapRange(-35,35,-1,1,e.x)).toFixed(1)
    })
    .to('.hit', {x:e.x/7, y:e.y/7}, 0)
    .to('.highlight', {
      x:gsap.utils.mapRange(-50,50,1,-1,e.x),
      scaleX:gsap.utils.mapRange(-50,50,0.7,1,e.y),
      scaleY:gsap.utils.mapRange(-50,50,0.3,1,e.y)
    }, 0)
    .to('.shadow', {
      scaleY:gsap.utils.mapRange(-50,50,0.92,1.2,e.y)
    }, 0)
    .to('.stick', {attr:{d:'M0,9 L'+(e.x/2)+','+(e.y/2)}}, 0)
    .to('.ball', {x:(i)=>e.x/[4,2][i], y:(i)=>e.y/[3,2][i]}, 0)
}

function resetStick(e){
  gsap.timeline({defaults:{duration:0.3, ease:'elastic.out(0.8)'}})
    .set('.output', {innerHTML:(i)=>['V','H'][i]+': 0.0'})
    .to('.stick', {attr:{d:'M0,9 L0,0'}}, 0)
    .to('.highlight', {scaleX:0.89, scaleY:0.64, ease:'power2'}, 0)
    .to('.hit, .ball', {duration:0.7, x:0, y:0}, 0)
}