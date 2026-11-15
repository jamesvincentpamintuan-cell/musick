// [title, artist, genre] — edit this list to change songs. Samples only.
const S=[["So Sick","Ne-Yo","R&B"],["Because of You","Ne-Yo","R&B"],["Best Part","Daniel Caesar","R&B"],["Kill Bill","SZA","R&B"],["Heartbreak Anniversary","Giveon","R&B"],["Nights Like This","Kehlani","R&B"],
["Lose Yourself","Eminem","Hip Hop"],["Without Me","Eminem","Hip Hop"],["Go Crazy","Chris Brown","Hip Hop"],["City Girls","Chris Brown","Hip Hop"],
["Ocean Eyes","Billie Eilish","Ballad"],["We Don't Talk Anymore","Charlie Puth","Ballad"],["Take You Down","Chris Brown","Ballad"],
["Locked Out of Heaven","Bruno Mars","Acoustic Covers"],["7 rings","Ariana Grande","Acoustic Covers"],["Attention","Charlie Puth","Acoustic Covers"],
["Uptown Funk","Bruno Mars","Pop Music"],["Billie Jean","Michael Jackson","Pop Music"],["Beat It","Michael Jackson","Pop Music"],["bad guy","Billie Eilish","Pop Music"],["thank u, next","Ariana Grande","Pop Music"],
["Loyal","Chris Brown","Soul Trap"],["Wet the Bed","Chris Brown","Soul Trap"],["Don't","Bryson Tiller","Soul Trap"],["Exchange","Bryson Tiller","Soul Trap"],["Under the Influence","Chris Brown","Soul Trap"]];
const G=[...new Set(S.map(s=>s[2]))],A=[...new Set(S.map(s=>s[1]))].sort();
const $=id=>document.getElementById(id);
let genre=G[0],list=S.filter(s=>s[2]==genre),i=0,playing=false,radio=false,sec=0,hist=[],tm;
const hue=t=>[...t].reduce((a,c)=>a*31+c.charCodeAt(0),7)%360;
const cv=(t,cls='')=>`<span class="cv ${cls}" style="background:linear-gradient(135deg,hsl(${hue(t)},65%,48%),hsl(${(hue(t)+50)%360},60%,30%))">${t.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</span>`;
const store=(k,v)=>{try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){}};
document.documentElement.dataset.theme=store('theme')||'light';

$('enter').onclick=()=>{$('splash').hidden=true;$('app').hidden=false;scrollTo(0,0)};

function drawGenres(){$('genres').innerHTML=G.map(g=>`<li data-g="${g}" ${g==genre?'aria-current="true"':''}>${cv(g)}<strong>${g}</strong><button class="play" aria-label="Play ${g}">${g==genre&&playing?'❚❚':'▶'}</button></li>`).join('')}
$('genres').onclick=e=>{const li=e.target.closest('li');if(!li)return;const g=li.dataset.g;
  if(g==genre&&e.target.closest('.play')){toggle();return}
  genre=g;list=S.filter(s=>s[2]==g);i=0;start()};
function drawCar(){const n=list.length,at=k=>list[(i+k+n)%n];
  $('car').innerHTML=[-1,0,1].map(k=>cv(at(k)[0],k?'':'on')).join('');
  $('npt').textContent=`${list[i][0]} — ${list[i][1]}`;drawGenres();drawSongs()}
function start(){const s=list[i];hist=[s,...hist.filter(h=>h!=s)].slice(0,20);sec=0;playing=true;drawCar();clearInterval(tm);tm=setInterval(tick,1000)}
function toggle(){if(!playing&&!sec){start();return}playing=!playing;drawGenres()}
function tick(){if(!playing)return;sec++;$('fill').style.width=sec/30*100+'%';if(sec>=30)step(1)}
function step(d){if(radio&&d>0){const s=S[Math.random()*S.length|0];genre=s[2];list=S.filter(x=>x[2]==genre);i=list.indexOf(s)}else i=(i+d+list.length)%list.length;start()}
$('next').onclick=()=>step(1);$('prev').onclick=()=>step(-1);
$('radio').onclick=e=>{radio=!radio;e.currentTarget.setAttribute('aria-pressed',radio);if(radio)step(1)};

let artist=null;
$('artists').innerHTML=A.map(a=>`<button class="ar" data-a="${a}" aria-pressed="false">${cv(a)}${a}</button>`).join('');
$('artists').onclick=e=>{const b=e.target.closest('.ar');if(!b)return;artist=b.dataset.a;$('q').value='';
  document.querySelectorAll('.ar').forEach(x=>x.setAttribute('aria-pressed',x==b));drawSongs()};
function drawSongs(){const q=$('q').value.trim().toLowerCase();
  const r=q?S.filter(s=>(s[0]+s[1]).toLowerCase().includes(q)):artist?S.filter(s=>s[1]==artist):null;
  if(!r){$('songs').innerHTML='<p class="hint">Click an artist to see their songs.</p>';return}
  $('songs').innerHTML=r.length?r.map(s=>`<button class="sg ${list[i]==s&&playing?'now':''}" data-t="${S.indexOf(s)}">${cv(s[0])}<span>${s[0]}<small>${s[1]} · ${s[2]}</small></span></button>`).join(''):'<p class="hint">No songs found. Try another name.</p>'}
$('songs').onclick=e=>{const b=e.target.closest('.sg');if(!b)return;const s=S[b.dataset.t];genre=s[2];list=S.filter(x=>x[2]==genre);i=list.indexOf(s);start()};
$('q').oninput=()=>{if($('q').value)document.querySelectorAll('.ar').forEach(x=>x.setAttribute('aria-pressed',false));drawSongs()};

const dlg=$('dlg'),show=h=>{$('dbody').innerHTML=h;dlg.showModal()};$('close').onclick=()=>dlg.close();
$('hist').onclick=()=>show('<h2>History</h2>'+(hist.length?'<ol>'+hist.map(s=>`<li>${s[0]} — ${s[1]}</li>`).join('')+'</ol>':'<p>Nothing played yet. Pick a genre and press play.</p>'));
$('set').onclick=()=>{show(`<h2>Settings</h2><p>Preferred color</p><button data-th="light">Light</button><button data-th="dark">Dark</button>`)};
dlg.onclick=e=>{const t=e.target.dataset.th;if(t){document.documentElement.dataset.theme=t;store('theme',t)}};
$('help').onclick=()=>show(`<h2>Help</h2><p>If the app crashes or shows an error:</p><ol><li>Refresh the page (Ctrl+R).</li><li>Clear the site data, then open it again.</li><li>Try another browser.</li><li>Still stuck? Send me a message in the contact form below.</li></ol><h2>About</h2><p>MUSICK is a student project by James Vincent. Pick a genre, choose an artist, or turn on radio mode (blue circle) to keep songs playing.</p>`);
$('msg').onsubmit=e=>{e.preventDefault();location.href=`mailto:jamesvincentpamintuan@pcb.edu.ph?subject=${encodeURIComponent('MUSICK feedback from '+$('un').value)}&body=${encodeURIComponent($('tx').value)}`};
drawCar();playing=false;
