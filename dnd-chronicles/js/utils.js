// js/utils.js — Базовые функции и утилиты

let state = { characters:[], worlds:[], gods:[], notes:[], initiative:{combatants:[],currentTurn:0,round:1} };
let searchQuery = { characters:'', worlds:'', gods:'', notes:'' };
let rollHistory = [];
let pendingInventory = [];
let pendingGold = 0;
let currentEditMode = false;
const STORAGE_KEY = 'dnd_chronicles_v1';

function load(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const p=JSON.parse(raw);state={characters:[],worlds:[],gods:[],notes:[],initiative:{combatants:[],currentTurn:0,round:1},...p};state.characters=state.characters.map(normalizeCharacter);if(!state.initiative)state.initiative={combatants:[],currentTurn:0,round:1};if(!Array.isArray(state.initiative.combatants))state.initiative.combatants=[]}}catch(e){console.error(e)}}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch(e){console.error(e)}}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function num(v,d){const n=parseInt(v,10);return isNaN(n)?d:n}
function mod(v){const m=Math.floor((num(v,10)-10)/2);return(m>=0?'+':'')+m}
function modNum(v){return Math.floor((num(v,10)-10)/2)}
function worldName(id){const w=state.worlds.find(x=>x.id===id);return w?w.name:''}
function profBonus(l){return 2+Math.floor((Math.max(1,num(l,1))-1)/4)}
function fmt(n){return(n>=0?'+':'')+n}
function getClassDef(k){return CLASSES.find(x=>x.key===k)}
function getClassDie(k){const d=getClassDef(k);return d?d.hitDie:8}
function getClassName(c){if(c.key==='custom')return c.name||'Свой';const d=getClassDef(c.key);return d?d.name:c.key}
function formatClasses(c){if(!c.classes||!c.classes.length)return'—';return c.classes.map(cl=>getClassName(cl)+' '+cl.level).join(' / ')}
function calcMaxHP(r,conMod){let hp=0;r.forEach(x=>{hp+=Math.max(1,x.roll+conMod)});return Math.max(1,hp)}
function getFighterLevel(c){if(!c||!c.classes)return 0;return c.classes.reduce((s,cl)=>{var k=(cl.key||'').toLowerCase().trim();var n=(cl.name||'').toLowerCase().trim();var isF=(k==='fighter')||(n==='воин');return s+(isF?(cl.level||0):0)},0)}
function getFighterAttacks(c){const fl=getFighterLevel(c);if(fl>=20)return 4;if(fl>=11)return 3;if(fl>=5)return 2;return 1}
function getMaxManeuvers(fLevel){if(fLevel>=15)return 9;if(fLevel>=10)return 7;if(fLevel>=7)return 5;if(fLevel>=3)return 3;return 0}
function getSuperiorityDiceCount(fLevel){if(fLevel>=15)return 6;if(fLevel>=7)return 5;if(fLevel>=3)return 4;return 0}
function getSuperiorityDieSize(fLevel){if(fLevel>=18)return 12;if(fLevel>=10)return 10;return 8}
function getManeuverSaveDC(c){if(!c)return 8;return 8+profBonus(c.level)+Math.max(modNum(c.str),modNum(c.dex))}
function getFighterASILevels(fl){return [4,6,8,12,14,16,19].filter(function(l){return l<=fl})}

function calcModWithProf(c,stat,hasProf,skillKey){
  if(!c)return 0;
  var base=modNum(c[stat]);
  var pb=profBonus(c.level);
  var fl=getFighterLevel(c);
  var arch=(c.fighterArchetype||'').toLowerCase().trim();
  var isChamp=(arch==='champion'||arch==='чемпион'||arch.indexOf('champion')>=0||arch.indexOf('чемпион')>=0);
  var isAth=isChamp&&fl>=7&&(stat==='str'||stat==='dex'||stat==='con');
  var m = base;
  if(hasProf) m += pb;
  if(isAth) m += Math.ceil(pb/2);
  
  // Компетентность (удвоение) для Убеждения Рыцаря Пурпурного Дракона
  var isPD=(arch==='purple_dragon');
  if(isPD && fl>=7 && skillKey==='persuasion' && hasProf){
      m += pb;
  }
  return m;
}
function calcModWithProfForm(formEl,stat,hasProf,skillKey){
  if(!formEl)return 0;
  var pb=profBonus(computeTotalLevel(formEl));
  var fl=getFighterLevelInForm(formEl);
  var archSel=formEl.querySelector('[name=fighterArchetype]');
  var arch=(archSel?archSel.value:'').toLowerCase().trim();
  var isChamp=(arch==='champion'||arch==='чемпион'||arch.indexOf('champion')>=0||arch.indexOf('чемпион')>=0);
  var isAth=isChamp&&fl>=7&&(stat==='str'||stat==='dex'||stat==='con');
  var base=modNum(num(formEl.querySelector('[name='+stat+']').value,10));
  var m = base;
  if(hasProf) m += pb;
  if(isAth) m += Math.ceil(pb/2);
  
  var isPD=(arch==='purple_dragon');
  if(isPD && fl>=7 && skillKey==='persuasion' && hasProf){
      m += pb;
  }
  return m;
}
function showToast(msg,type){const cont=document.getElementById('toast-container');const t=document.createElement('div');t.className='toast '+(type||'');t.textContent=msg;cont.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(()=>t.remove(),300)},3400)}

function detectItemType(n){if(!n)return'item';if(n==='Щит')return'shield';if(A_DB[n])return'armor';if(W_DB[n])return'weapon';if(PACKS_DB[n])return'pack';if(n.indexOf('Стрел')>=0||n.indexOf('Болт')>=0)return'ammo';if(TOOLS_DB[n])return'tool';return'item'}
function isEquippable(n){const t=detectItemType(n);return t==='armor'||t==='shield'||t==='weapon'}
function buildItemFromName(name,qty,cw,cn){
  qty=qty||1;
  const t=detectItemType(name);
  const item={name,qty,weight:0,note:cn||'',itemType:t,equipped:false,hpMax:0,hpCur:0,broken:false};
  if(t==='armor'){
    const a=A_DB[name];
    item.ac=a.ac;item.acType=a.type;item.strReq=a.str;item.weight=a.w;item.stealthDis=!!a.stealth;item.equipped=true;
    if(a.type==='light'){item.hpMax=10;item.hpCur=10}
    else if(a.type==='medium'){item.hpMax=18;item.hpCur=18}
    else if(a.type==='heavy'){item.hpMax=27;item.hpCur=27}
  }
  else if(t==='shield'){item.ac=2;item.weight=6;item.equipped=true;item.hpMax=10;item.hpCur=10}
  else if(t==='weapon'){
    const w=W_DB[name];
    item.damage=w.dmg;item.damageType=w.dtype;item.weight=w.w;item.properties=w.props;item.equipped=true;
    const m = w.dmg && w.dmg.match(/к(\d+)/i);
    const dieSize = m ? parseInt(m[1], 10) : 6;
    if(dieSize <= 4){item.hpMax=5;item.hpCur=5}
    else if(dieSize <= 6){item.hpMax=10;item.hpCur=10}
    else{item.hpMax=18;item.hpCur=18}
  }
  else if(t==='pack'){item.weight=0;item.note=cn||'Набор'}
  else if(t==='ammo'){item.weight=cw!=null?cw:0.05}
  else if(TOOLS_DB[name]){item.weight=TOOLS_DB[name].w;item.toolCat=TOOLS_DB[name].cat}
  else if(ITEMS_DB[name]){item.weight=ITEMS_DB[name].w}
  else if(cw!=null){item.weight=cw}
  return item
}
function expandPack(name,base){const p=PACKS_DB[name];if(!p)return[];return p.items.map(it=>{const b=buildItemFromName(it.name,it.qty||1);if(base)b.fromClass=base;return b})}
function calcCarryCapacity(c){const mult={tiny:0.5,small:0.5,medium:1,large:2,huge:4,gargantuan:8};return c.str*15*(mult[c.size||'medium']||1)}
function getEncumbrance(c){const weight=(c.inventory||[]).reduce((s,i)=>s+i.qty*i.weight,0);const cap=calcCarryCapacity(c);const r={weight,cap,status:'normal',speedPenalty:0,speedOverride:null,disadvantage:false,loseDexAC:false};if(weight>cap){r.status='over';r.speedOverride=0;r.disadvantage=true;r.loseDexAC=true}return r}
function getEffectiveSpeed(c){const e=getEncumbrance(c);if(e.speedOverride!==null)return e.speedOverride;return Math.max(0,num(c.speed,30)-e.speedPenalty)}
function calcAC(c){const enc=getEncumbrance(c);const dexMod=enc.loseDexAC?0:modNum(c.dex);let armorAC=10+dexMod;let shieldBonus=0;
  (c.inventory||[]).forEach(item=>{if(!item.equipped)return;if(item.itemType==='armor'){if(item.acType==='light')armorAC=Math.max(armorAC,item.ac+dexMod);else if(item.acType==='medium')armorAC=Math.max(armorAC,item.ac+Math.min(dexMod,2));else if(item.acType==='heavy')armorAC=Math.max(armorAC,item.ac)}if(item.itemType==='shield')shieldBonus=2});
  if(c.fightingStyle==='defense_ac')armorAC+=1;
  if(c.fightingStyle2==='defense_ac')armorAC+=1;
  return armorAC+shieldBonus}
function findChar(id){return state.characters.find(x=>x.id===id)}

function rollDice(sides,modVal,label){modVal=modVal||0;const r=Math.floor(Math.random()*sides)+1;const total=r+modVal;let type='';if(sides===20&&r===20)type='crit-success';else if(sides===20&&r===1)type='crit-fail';const modStr=modVal?(modVal>0?' + '+modVal:' − '+Math.abs(modVal)):'';const text=label?label+': d'+sides+' = '+r+modStr+' = '+total:'d'+sides+' = '+r+modStr+' = '+total;showToast(text,type);rollHistory.unshift({label:label||'',text,result:total,type,time:new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})});if(rollHistory.length>30)rollHistory.length=30;const l=document.getElementById('dice-log-list');if(l)l.innerHTML=renderDiceLog();return total}
function rollCheck(charId,stat){const c=findChar(charId);if(!c)return;var fl=getFighterLevel(c);var arch=(c.fighterArchetype||'').toLowerCase();var isChamp=(arch.indexOf('champion')>=0||arch.indexOf('чемпион')>=0);var isAth=isChamp&&fl>=7&&(stat==='str'||stat==='dex'||stat==='con');const m=calcModWithProf(c,stat,false);rollDice(20,m,c.name+': '+STAT_NAMES[stat]+(isAth?' (Атлет)':''))}
function rollSkillCheck(charId,key){const c=findChar(charId);if(!c)return;const s=SKILLS.find(function(x){return x.key===key});if(!s)return;var fl=getFighterLevel(c);var arch=(c.fighterArchetype||'').toLowerCase();var isChamp=(arch.indexOf('champion')>=0||arch.indexOf('чемпион')>=0);var isAth=isChamp&&fl>=7&&!c.skillProf[key]&&(s.stat==='str'||s.stat==='dex'||s.stat==='con');const m=calcModWithProf(c,s.stat,!!c.skillProf[key],s.key);rollDice(20,m,c.name+': '+s.name+(isAth?' (Атлет)':''))}
function rollSaveCheck(charId,stat){const c=findChar(charId);if(!c)return;const m=calcModWithProf(c,stat,!!c.saveProf[stat]);rollDice(20,m,c.name+': спас '+STAT_NAMES[stat])}
function renderDiceLog(){if(!rollHistory.length)return'<div style="text-align:center;padding:20px;color:var(--text-dim);font-style:italic;font-size:14px">Пока пусто</div>';return rollHistory.map(r=>'<div class="dice-log-item '+(r.type||'')+'"><span class="log-time">'+r.time+'</span><span class="log-label">'+esc(r.text)+'</span><span class="log-result">'+r.result+'</span></div>').join('')}
function openDiceModal(){const body='<div class="dice-mod-row"><label>Модификатор: <input type="number" id="dice-mod" value="0"></label></div><div class="dice-grid">'+[4,6,8,10,12,20,100].map(n=>'<button class="dice-btn" onclick="rollDice('+n+', num(document.getElementById(\'dice-mod\').value,0))">d'+n+'</button>').join('')+'</div><div class="dice-log"><h4>История</h4><div class="dice-log-list" id="dice-log-list">'+renderDiceLog()+'</div></div>';openModal('Кубики',body,null,{noForm:true})}

function avatarHTML(c,size){const st=size?'style="width:'+size+'px;height:'+size+'px;font-size:'+Math.round(size/2.4)+'px"':'';if(!c.avatar){const l=(c.name||'?').trim().charAt(0).toUpperCase();return'<div class="avatar" '+st+'><span class="avatar-fallback">'+esc(l)+'</span></div>'}if(c.avatar.startsWith('data:image'))return'<div class="avatar" '+st+'><img src="'+c.avatar+'" alt=""></div>';return'<div class="avatar" '+st+'>'+esc(c.avatar)+'</div>'}
function renderAvatarPreview(v){const el=document.getElementById('avatar-preview');if(!el)return;if(!v)el.innerHTML='<span style="color:var(--text-dim);font-size:12px">НЕТ</span>';else if(v.startsWith('data:image'))el.innerHTML='<img src="'+v+'" alt="">';else el.innerHTML=esc(v)}
function initAvatarForm(){const h=document.getElementById('avatar-value');const f=document.getElementById('avatar-file');if(!h)return;renderAvatarPreview(h.value);if(f){f.addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const d=await resizeImage(file,160);h.value=d;renderAvatarPreview(d)}catch(err){alert('Ошибка')}e.target.value=''})}}
function clearAvatar(){const h=document.getElementById('avatar-value');if(h)h.value='';renderAvatarPreview('')}
function resizeImage(file,maxSize){return new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>{const img=new Image();img.onload=()=>{const s=Math.min(maxSize/img.width,maxSize/img.height,1);const w=Math.max(1,Math.round(img.width*s));const h=Math.max(1,Math.round(img.height*s));const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);res(c.toDataURL('image/jpeg',0.82))};img.onerror=rej;img.src=e.target.result};r.onerror=rej;r.readAsDataURL(file)})}