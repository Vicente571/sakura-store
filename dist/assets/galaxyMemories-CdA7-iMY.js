const o="sk_galaxy_memories",r="sk_galaxy_intro",i="Para mi niña, mi universo entero 🩷";function t(a,e){const s=`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <radialGradient id="g" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${e}" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g)" />
    </svg>`;return`data:image/svg+xml;base64,${btoa(s)}`}const n=[{id:"demo-1",image:t("#ffd7ec","#7a2f66"),phrase:"Mi niña, contigo hasta las estrellas se ven mas bonitas 🩷"},{id:"demo-2",image:t("#e5c9ff","#4a2472"),phrase:"Mi vida, eres la luz que ilumina toda mi galaxia 😍"},{id:"demo-3",image:t("#c9e3ff","#2a3a72"),phrase:"Mi cielo, gracias por existir y por ser mi persona favorita 🩶"}];function l(){try{const a=localStorage.getItem(o);if(a){const e=JSON.parse(a);if(Array.isArray(e)&&e.length>0)return e}}catch{}return n}function c(a){localStorage.setItem(o,JSON.stringify(a))}function g(){const a=localStorage.getItem(r);return a&&a.trim()?a:i}function d(a){localStorage.setItem(r,a)}export{l as a,c as b,g as l,d as s};
