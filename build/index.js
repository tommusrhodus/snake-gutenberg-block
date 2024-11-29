(()=>{"use strict";const e=window.wp.blocks,o=window.wp.blockEditor,t=window.wp.element,s=window.wp.i18n,a=window.wp.components,r=window.ReactJSXRuntime,i=({backgroundColor:e,snakeColor:t,appleColor:i,refreshRate:n,setAttributes:l})=>(0,r.jsx)(o.InspectorControls,{children:(0,r.jsxs)(a.PanelBody,{title:(0,s.__)("Game Settings","snake-game-block"),initialOpen:!0,children:[(0,r.jsx)(o.ColorPaletteControl,{value:e,onChange:e=>l({backgroundColor:e}),label:(0,s.__)("Background Color","snake-game-block")}),(0,r.jsx)(o.ColorPaletteControl,{value:t,onChange:e=>l({snakeColor:e}),label:(0,s.__)("Snake Color","snake-game-block")}),(0,r.jsx)(o.ColorPaletteControl,{value:i,onChange:e=>l({appleColor:e}),label:(0,s.__)("Apple Color","snake-game-block")}),(0,r.jsx)(a.RangeControl,{label:(0,s.__)("Game Speed(ms)","snake-game-block"),value:n,onChange:e=>l({refreshRate:e}),min:20,max:200,step:10})]})}),n=({onReset:e})=>(0,r.jsx)("div",{id:"GameOver",children:(0,r.jsx)("div",{id:"PressSpaceText",children:(0,r.jsx)(a.Button,{variant:"primary",onClick:e,text:"Start Game"})})}),l=({snake:e,blockWidth:o,blockHeight:t,apple:a,isSelected:i})=>(0,r.jsxs)(r.Fragment,{children:[e.map(((e,s)=>(0,r.jsx)("div",{className:"snake",style:{width:o,height:t,left:e.Xpos,top:e.Ypos}},s))),(0,r.jsx)("div",{className:"apple",style:{width:o,height:t,left:a.Xpos,top:a.Ypos}}),!i&&(0,r.jsx)("div",{id:"paused",children:(0,s.__)("Paused","snake-game-block")})]}),c=({width:e,height:o,snakeColor:t,appleColor:s,backgroundColor:a,isGameOver:i,resetGame:c,snake:p,blockWidth:h,blockHeight:d,apple:k,isSelected:g})=>(0,r.jsx)("div",{id:"GameBoard",style:{"--game-width":e+"px","--game-height":o+"px","--snake-color":t,"--apple-color":s,"--background-color":a},children:i?(0,r.jsx)(n,{onReset:c}):(0,r.jsx)(l,{snake:p,blockWidth:h,blockHeight:d,apple:k,isSelected:g})}),p=({score:e,highScore:o,isSelected:t})=>t?(0,r.jsxs)("div",{id:"score",children:[(0,r.jsxs)("span",{children:[(0,s.__)("High Score","snake-game-block"),": ",o]}),(0,r.jsxs)("span",{children:[(0,s.__)("Score","snake-game-block"),": ",e]})]}):null,h=JSON.parse('{"UU":"tommusrhodus/snake-game-block"}');(0,e.registerBlockType)(h.UU,{edit:function({attributes:e,setAttributes:s,isSelected:a}){const{snakeColor:n,appleColor:l,startSnakeSize:h,refreshRate:d,backgroundColor:k,highScore:g}=e,[m]=(0,o.useSettings)("layout.contentSize")||"800px",u=parseInt(m.replace("px","")),[b,w]=(0,t.useState)({width:0,height:0,blockWidth:0,blockHeight:0,gameLoopTimeout:d,timeoutId:0,snake:[],apple:{},direction:"right",directionChanged:!1,isGameOver:!0,score:0,highScore:g}),[C,f]=(0,t.useState)(0);(0,t.useEffect)((()=>{S()}),[]),(0,t.useEffect)((()=>{x()}),[C]),(0,t.useEffect)((()=>{a?(window.removeEventListener("keydown",G),window.addEventListener("keydown",G),x()):(window.removeEventListener("keydown",G),clearTimeout(b.timeoutId))}),[a]);const S=()=>{const e=u,o=e/3*2,t=e/30,s=t,a=[];let r=e/2;const i=o/2,n={Xpos:e/2,Ypos:o/2};a.push(n);for(let e=1;e<h;e++){r-=t;const e={Xpos:r,Ypos:i};a.push(e)}const l=Math.floor(Math.random()*((e-t)/t+1))*t;let c=Math.floor(Math.random()*((o-s)/s+1))*s;for(;c===a[0].Ypos;)c=Math.floor(Math.random()*((o-s)/s+1))*s;w((r=>({...r,width:e,height:o,blockWidth:t,blockHeight:s,startSnakeSize:h,snake:a,apple:{Xpos:l,Ypos:c},direction:"right",directionChanged:!1,isGameOver:!1,gameLoopTimeout:d,score:0})))},x=()=>{const e=setTimeout((()=>{!b.isGameOver&&b.snake.length>0&&(v(),Y(),X(),w((e=>({...e,directionChanged:!1})))),f(C+1)}),b.gameLoopTimeout);w((o=>({...o,timeoutId:e})))},v=()=>{const e=[...b.snake];let o=b.snake[0].Xpos,t=b.snake[0].Ypos,s=o,a=t;_();for(let r=1;r<e.length;r++)s=e[r].Xpos,a=e[r].Ypos,e[r].Xpos=o,e[r].Ypos=t,o=s,t=a;w((o=>({...o,snake:e})))},X=()=>{const e=b.snake,o=b.apple;if(e[0].Xpos===o.Xpos&&e[0].Ypos===o.Ypos){const t=b.width,a=b.height,r=b.blockWidth,i=b.blockHeight;let n=b.highScore,l=b.gameLoopTimeout;for(e.push({Xpos:o.Xpos,Ypos:o.Ypos}),o.Xpos=Math.floor(Math.random()*((t-r)/r+1))*r,o.Ypos=Math.floor(Math.random()*((a-i)/i+1))*i;j(o.Xpos,o.Ypos);)o.Xpos=Math.floor(Math.random()*((t-r)/r+1))*r,o.Ypos=Math.floor(Math.random()*((a-i)/i+1))*i;b.score===n&&(n++,s({highScore:n})),l>25&&(l-=.5),w((t=>({...t,snake:e,apple:o,score:b.score+1,highScore:n,gameLoopTimeout:l})))}},Y=()=>{const e=b.snake;for(let o=1;o<e.length;o++)e[0].Xpos===e[o].Xpos&&e[0].Ypos===e[o].Ypos&&w((e=>({...e,isGameOver:!0})))},j=(e,o)=>{const t=b.snake;for(let s=0;s<t.length;s++)if(e===t[s].Xpos&&o===t[s].Ypos)return!0;return!1},_=()=>{const e=b.snake,o=b.width,t=b.height,s=b.blockWidth,a=b.blockHeight;switch(b.direction){case"left":e[0].Xpos=e[0].Xpos<=0?o-s:e[0].Xpos-s;break;case"up":e[0].Ypos=e[0].Ypos<=0?t-a:e[0].Ypos-a;break;case"right":e[0].Xpos=e[0].Xpos>=o-s?0:e[0].Xpos+s;break;default:e[0].Ypos=e[0].Ypos>=t-a?0:e[0].Ypos+a}w((o=>({...o,snake:e})))},G=e=>{b.directionChanged||w((o=>{let t=o.direction;switch(e.keyCode){case 65:"right"!==o.direction&&(t="left");break;case 87:"down"!==o.direction&&(t="up");break;case 68:"left"!==o.direction&&(t="right");break;case 83:"up"!==o.direction&&(t="down");break;default:return o}return{...o,direction:t,directionChanged:!0}}))};return(0,r.jsxs)("div",{...(0,o.useBlockProps)(),children:[(0,r.jsx)(i,{backgroundColor:k,snakeColor:n,appleColor:l,refreshRate:d,setAttributes:s}),(0,r.jsx)(c,{width:b.width,height:b.height,snakeColor:n,appleColor:l,backgroundColor:k,isGameOver:b.isGameOver,resetGame:S,snake:b.snake,blockWidth:b.blockWidth,blockHeight:b.blockHeight,apple:b.apple,isSelected:a}),(0,r.jsx)(p,{score:b.score,highScore:b.highScore,isSelected:a})]})}})})();