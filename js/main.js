(function(){
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var hasLib=window.gsap&&window.ScrollTrigger&&window.Lenis;
if(!hasLib){document.querySelectorAll('h1 .c').forEach(function(c){c.style.transform='none'});return;}
gsap.registerPlugin(ScrollTrigger);

// Lenis smooth scroll, driven by GSAP's ticker
var lenis=new Lenis({duration:1.2,smoothWheel:!reduce});
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(function(t){lenis.raf(t*1000)});
gsap.ticker.lagSmoothing(0);
document.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();lenis.scrollTo(a.getAttribute('href'))})});

gsap.from('.portrait',{opacity:0,y:60,scale:.94,duration:1.4,ease:'expo.out',delay:.3});
if(!reduce)gsap.to('.portrait img',{yPercent:8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
// Progress bar
gsap.to('#bar',{scaleX:1,ease:'none',scrollTrigger:{scrub:0.2,start:0,end:'max'}});

// Typewriter name reveal
var chars=[];
document.querySelectorAll('.split').forEach(function(el){
  var txt=el.textContent;el.textContent='';
  var w=document.createElement('span');w.className='w';
  txt.split('').forEach(function(ch){var s=document.createElement('span');s.className='c';s.textContent=ch;w.appendChild(s);chars.push(s)});
  el.appendChild(w);
});
var caret=document.createElement('span');caret.className='caret';caret.setAttribute('aria-hidden','true');
if(!reduce&&chars.length){
  chars.forEach(function(c){c.style.visibility='hidden'});
  chars[0].parentNode.insertBefore(caret,chars[0]);
  var tl=gsap.timeline({delay:.5});
  chars.forEach(function(c,i){tl.call(function(){c.style.visibility='visible';c.after(caret)},null,i*0.11+(i>=8?0.4:0))});
}

// Marquee that speeds up with scroll velocity
var m=document.getElementById('m1');m.innerHTML+=m.innerHTML;
var x=0,dir=-1;
gsap.ticker.add(function(){
  if(reduce)return;
  var v=Math.abs(lenis.velocity||0);
  x+=dir*(0.6+v*0.35);
  var half=m.scrollWidth/2;
  if(x<=-half)x+=half;
  gsap.set(m,{x:x});
});

// Scrubbed word-by-word text reveal
var r=document.getElementById('reveal');
r.innerHTML=r.textContent.split(' ').map(function(w){return '<span class="t">'+w+'</span>'}).join(' ');
gsap.to('#reveal .t',{color:'#eceef5',stagger:.1,ease:'none',scrollTrigger:{trigger:'#reveal',start:'top 80%',end:'bottom 45%',scrub:true}});

// CountUp
document.querySelectorAll('[data-n]').forEach(function(el){
  var end=+el.dataset.n,o={v:0};
  ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:function(){
    gsap.to(o,{v:end,duration:1.6,ease:'power2.out',onUpdate:function(){el.textContent=Math.round(o.v)}});
  }});
});

// Horizontal scroll for projects (desktop)
ScrollTrigger.matchMedia({
  '(min-width:761px)':function(){
    var tr=document.getElementById('track');
    var dist=function(){return tr.scrollWidth-window.innerWidth};
    gsap.to(tr,{x:function(){return -dist()},ease:'none',scrollTrigger:{trigger:'#work',start:'top top',end:function(){return '+='+dist()},pin:true,scrub:1,invalidateOnRefresh:true}});
  }
});

// Experience rows rise in once
gsap.utils.toArray('.row').forEach(function(row){
  gsap.from(row,{opacity:0,y:40,duration:.9,ease:'power3.out',scrollTrigger:{trigger:row,start:'top 85%',once:true}});
});

// Spotlight hover (React Bits SpotlightCard pattern)
document.querySelectorAll('.spot').forEach(function(c){
  c.addEventListener('pointermove',function(e){
    var b=c.getBoundingClientRect();
    c.style.setProperty('--x',(e.clientX-b.left)+'px');
    c.style.setProperty('--y',(e.clientY-b.top)+'px');
  });
});

// Magnetic button
document.querySelectorAll('[data-magnet]').forEach(function(b){
  b.addEventListener('pointermove',function(e){
    var r=b.getBoundingClientRect();
    gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.4,duration:.3});
  });
  b.addEventListener('pointerleave',function(){gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'})});
});

// Aurora parallax
if(!reduce){
  gsap.to('.aurora i:nth-child(1)',{y:300,scrollTrigger:{scrub:1,start:0,end:'max'}});
  gsap.to('.aurora i:nth-child(2)',{y:-300,scrollTrigger:{scrub:1,start:0,end:'max'}});
}
})();