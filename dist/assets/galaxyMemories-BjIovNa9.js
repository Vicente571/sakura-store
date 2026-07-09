import{a as l,b as f}from"./index-pzllFItH.js";const i="sk_galaxy_memories",n="sk_galaxy_intro",o="Para mi niña, mi universo entero 🩷";function r(a,e){const t=`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <radialGradient id="g" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${e}" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g)" />
    </svg>`;return`data:image/svg+xml;base64,${btoa(t)}`}const s=[{id:"demo-1",image:r("#ffd7ec","#7a2f66"),phrase:"Mi niña, contigo hasta las estrellas se ven mas bonitas 🩷"},{id:"demo-2",image:r("#e5c9ff","#4a2472"),phrase:"Mi vida, eres la luz que ilumina toda mi galaxia 😍"},{id:"demo-3",image:r("#c9e3ff","#2a3a72"),phrase:"Mi cielo, gracias por existir y por ser mi persona favorita 🩶"}];function m(){try{const a=localStorage.getItem(i);if(a){const e=JSON.parse(a);if(Array.isArray(e)&&e.length>0)return e}}catch{}return s}function g(a){localStorage.setItem(i,JSON.stringify(a))}function d(){const a=localStorage.getItem(n);return a&&a.trim()?a:o}function u(a){localStorage.setItem(n,a)}function c({intro:a,memories:e}){u(a&&a.trim()?a:o),g(e&&e.length>0?e:s)}async function h(){try{const a=await l("getGalaxy");if(a&&!a.error&&Array.isArray(a.memories))return c(a),{intro:a.intro||o,memories:a.memories.length>0?a.memories:s,synced:!0}}catch{}return{intro:d(),memories:m(),synced:!1}}async function p({intro:a,memories:e}){c({intro:a,memories:e});try{const t=await f("saveGalaxy",{intro:a,memories:e});return!(t!=null&&t.error)}catch{return!1}}export{m as a,h as f,d as l,p as s};
