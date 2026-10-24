'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

const VIDEO = '/images/brand/cosmogonia/master-scroll-720.mp4';
const POSTER = '/images/brand/cosmogonia/poster-final.jpg';
const chapters = [
  { text:'Tudo começa como possibilidade.', end:0.148 },
  { text:'Até uma ideia encontrar direção.', end:0.293 },
  { text:'E ganhar dimensão.', end:0.435 },
  { text:'O invisível encontra matéria.', end:0.577 },
  { text:'Uma forma. Uma intenção.', end:0.720 },
  { text:'Uma razão para escolher.', end:0.857 },
  { text:'Objetos com personalidade.', end:1 },
] as const;
const gates = ['(max-width:767px)','(orientation:portrait) and (max-width:1024px)','(pointer:coarse) and (max-height:650px)','(prefers-reduced-motion:reduce)'];
const clamp=(n:number)=>Math.max(0,Math.min(1,n));

export default function SobreScroll(){
  const rootRef=useRef<HTMLElement>(null);
  const videoRef=useRef<HTMLVideoElement>(null);
  const bandRefs=useRef<Array<HTMLDivElement|null>>([]);
  const railRef=useRef<HTMLSpanElement>(null);
  const [failure,setFailure]=useState(false);
  useEffect(()=>{
    const root=rootRef.current, video=videoRef.current;
    if(!root||!video)return;
    let enabled=false, near=false, disposed=false, ready=false, loading=false, busy=false;
    let pending:number|null=null, url:string|null=null, controller:AbortController|null=null;
    let target=0,shown=0,frame=0,last=0;
    const queries=gates.map(query=>matchMedia(query));
    const saveData=Boolean((navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData);
    const progress=()=>clamp(-root.getBoundingClientRect().top/Math.max(1,root.offsetHeight-innerHeight));
    const seek=(time:number)=>{
      if(!ready||!Number.isFinite(video.duration)||video.duration<=0)return;
      const next=Math.max(0,Math.min(video.duration-.025,time));
      if(busy){pending=next;return;}
      if(Math.abs(video.currentTime-next)<.035)return;
      busy=true;
      try{video.currentTime=next;}catch{busy=false;}
    };
    const caption=(n:number)=>{
      let begin=0;
      chapters.forEach((chapter,i)=>{
        const el=bandRefs.current[i];
        if(el){
          const fade=.018;
          const enter=i===0?1:clamp((n-begin)/fade);
          const leave=i===chapters.length-1?1:clamp((chapter.end-n)/fade);
          const opacity=Math.min(enter,leave);
          el.style.opacity=String(opacity);
          el.style.transform=`translate3d(0,${((1-opacity)*24).toFixed(1)}px,0)`;
        }
        begin=chapter.end;
      });
      if(railRef.current)railRef.current.style.transform=`scaleY(${n})`;
    };
    const tick=(now:number)=>{
      frame=0;
      if(!enabled||!near)return;
      const delta=Math.min(90,now-(last||now));
      last=now;
      shown+=(target-shown)*(1-Math.pow(.82,delta/16.667));
      if(Math.abs(target-shown)<.0004)shown=target;
      caption(shown);
      seek(shown*(video.duration||0));
      if(shown!==target)frame=requestAnimationFrame(tick);else last=0;
    };
    const queue=()=>{
      if(!enabled)return;
      target=progress();
      if(!frame)frame=requestAnimationFrame(tick);
    };
    const reset=()=>{
      ready=false;
      root.removeAttribute('data-about-film-ready');
      root.removeAttribute('data-about-film-eligible');
    };
    const load=async()=>{
      if(!enabled||!near||loading||disposed)return;
      loading=true;controller=new AbortController();
      try{
        const response=await fetch(VIDEO,{signal:controller.signal,cache:'force-cache'});
        if(!response.ok||!(response.headers.get('content-type')||'').includes('video'))throw new Error('unavailable');
        const blob=await response.blob();
        if(disposed||!enabled)return;
        url=URL.createObjectURL(blob);
        video.src=url;
        video.load();
      }catch{
        if(controller?.signal.aborted){loading=false;return;}
        reset();
        if(!disposed)setFailure(true);
      }
    };
    const onLoaded=()=>{
      if(!enabled||disposed)return;
      ready=true;
      root.setAttribute('data-about-film-ready','true');
      queue();
    };
    const onSeeked=()=>{
      busy=false;
      if(pending!==null){const t=pending;pending=null;seek(t);}
    };
    const onError=()=>{
      busy=false;pending=null;reset();if(!disposed)setFailure(true);
    };
    const disable=()=>{
      enabled=false;
      if(frame)cancelAnimationFrame(frame);
      frame=0;last=0;
      controller?.abort();
      if(url){video.removeAttribute('src');video.load();URL.revokeObjectURL(url);url=null;}
      loading=false;busy=false;pending=null;reset();
    };
    const check=()=>{
      if(saveData||queries.some(q=>q.matches)){if(enabled)disable();return;}
      enabled=true;
      root.setAttribute('data-about-film-eligible','true');
      target=shown=progress();
      caption(shown);
      if(near){void load();queue();}
    };
    const observer='IntersectionObserver'in window?new IntersectionObserver(([entry])=>{
      near=entry.isIntersecting;
      if(near){void load();queue();}
      else if(frame){cancelAnimationFrame(frame);frame=0;}
    },{rootMargin:'80% 0px 80% 0px'}):null;
    observer?.observe(root);
    if(!observer)near=true;
    video.addEventListener('loadeddata',onLoaded);
    video.addEventListener('seeked',onSeeked);
    video.addEventListener('error',onError);
    window.addEventListener('scroll',queue,{passive:true});
    window.addEventListener('resize',queue);
    queries.forEach(q=>q.addEventListener('change',check));
    check();
    return()=>{
      disposed=true;disable();observer?.disconnect();
      video.removeEventListener('loadeddata',onLoaded);
      video.removeEventListener('seeked',onSeeked);
      video.removeEventListener('error',onError);
      window.removeEventListener('scroll',queue);
      window.removeEventListener('resize',queue);
      queries.forEach(q=>q.removeEventListener('change',check));
    };
  },[]);
  return <section ref={rootRef} className="about-hero" aria-labelledby="about-main-title">
    <h1 id="about-main-title" className="about-sr-only">Vektua XYZ. Objetos com personalidade. Do achado à peça só sua.</h1>
    <div className="about-stage">
      <div className="about-film" aria-hidden="true">
        <div className="about-film-poster" style={{backgroundImage:`url('${POSTER}')`}} />
        <video className="about-film-video" ref={videoRef} preload="none" playsInline muted tabIndex={-1} aria-hidden="true"/>
        <div className="about-film-scrim"/>
        <div className="about-captions">
          {chapters.map((c,i)=><div key={c.text} className={`about-caption ${i===6?'about-caption-final':''}`} ref={el=>{bandRefs.current[i]=el;}}>
            {i===6?<><img src="/brand/vektua-wordmark-negative.svg" alt="" width="220" height="56"/><strong>{c.text}</strong><small>Do achado à peça só sua.</small></>:<strong>{c.text}</strong>}
          </div>)}
        </div>
        <div className="about-progress" aria-hidden="true"><span><span ref={railRef}/></span><small>IDEIA</small><small>MATÉRIA</small></div>
        <div className="about-scroll-cue"><ArrowDown size={17} aria-hidden="true"/> Role para revelar</div>
      </div>
      <div className="about-static">
        <div className="about-static-art" aria-hidden="true"/>
        <div className="about-static-copy">
          <p>Há um universo inteiro antes de uma peça existir.</p>
          <strong>Objetos com<br/><em>personalidade.</em></strong>
          <span>Ideias, histórias e referências ganhando forma no mundo real.</span>
          <Link href="#manifesto">Descubra nossa essência <ArrowUpRight size={18} aria-hidden="true"/></Link>
        </div>
        <div className="about-static-signature">VEKTUA XYZ · DO ACHADO À PEÇA SÓ SUA</div>
      </div>
      <span className="about-sr-only" role="status">{failure?'O vídeo não está disponível; a apresentação alternativa continua acessível.':''}</span>
    </div>
  </section>;
}
