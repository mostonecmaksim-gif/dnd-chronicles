// js/characters.js — Логика персонажей

function normalizeCharacter(c){
  if(!c||typeof c!=='object')c={};
  if(!Array.isArray(c.inventory))c.inventory=[];
    c.inventory=c.inventory.map(i=>{
    if(!i.name)return null;
    if(typeof i.itemType==='undefined'){return buildItemFromName(i.name,num(i.qty,1),parseFloat(i.weight)||0,i.note||'')}
    return {name:i.name,qty:num(i.qty,1),weight:parseFloat(i.weight)||0,note:i.note||'',itemType:i.itemType||'item',equipped:!!i.equipped,ac:num(i.ac,0),acType:i.acType||'',strReq:num(i.strReq,0),stealthDis:!!i.stealthDis,damage:i.damage||'',damageType:i.damageType||'',properties:i.properties||'',contents:i.contents||'',toolCat:i.toolCat||'',bonded:!!i.bonded,hpMax:num(i.hpMax,0),hpCur:num(i.hpCur,i.hpMax||0),broken:!!i.broken}
  }).filter(Boolean);
  if(!c.coins)c.coins={};['gp','sp','cp','pp','ep'].forEach(k=>{c.coins[k]=num(c.coins[k],0)});
  if(!c.saveProf)c.saveProf={};['str','dex','con','int','wis','cha'].forEach(k=>{c.saveProf[k]=!!c.saveProf[k]});
  if(typeof c.purpleDragonSkill!=='string')c.purpleDragonSkill='';
  if(!c.skillProf)c.skillProf={};SKILLS.forEach(s=>{c.skillProf[s.key]=!!c.skillProf[s.key]});
  if(!c.spellSlots)c.spellSlots={};for(let i=1;i<=9;i++){if(!c.spellSlots[i])c.spellSlots[i]={max:0,used:0};else{c.spellSlots[i]={max:num(c.spellSlots[i].max,0),used:num(c.spellSlots[i].used,0)};if(c.spellSlots[i].used>c.spellSlots[i].max)c.spellSlots[i].used=c.spellSlots[i].max}}
  if(!Array.isArray(c.resources))c.resources=[];
  c.resources=c.resources.map(r=>({name:r.name||'',max:num(r.max,0),used:Math.min(num(r.used,0),num(r.max,0)),resetOn:(r.resetOn==='short'||r.resetOn==='long')?r.resetOn:'long'}));
  if(!c.avatar)c.avatar='';['languages','proficiencies','traits'].forEach(k=>{if(!c[k])c[k]=''});
  if(typeof c.inspiration!=='boolean')c.inspiration=false;
  if(!c.deathSaves)c.deathSaves={successes:0,failures:0};
  c.deathSaves.successes=Math.min(3,Math.max(0,num(c.deathSaves.successes,0)));
  c.deathSaves.failures=Math.min(3,Math.max(0,num(c.deathSaves.failures,0)));
  if(typeof c.xp!=='number')c.xp=num(c.xp,0);
  if(typeof c.hpTemp!=='number')c.hpTemp=num(c.hpTemp,0);c.hpTemp=Math.max(0,c.hpTemp);
  if(!c.size)c.size='medium';
  if(typeof c.lastLongRest!=='number')c.lastLongRest=0;
  if(typeof c.fightingStyle!=='string')c.fightingStyle='';
  if(typeof c.fightingStyle2!=='string')c.fightingStyle2='';
  if(c.fightingStyle2 === c.fightingStyle) c.fightingStyle2 = '';
  if(typeof c.fighterArchetype!=='string')c.fighterArchetype='';
  if(!Array.isArray(c.fighterASIHistory))c.fighterASIHistory=[];
  if(typeof c.versatilityDone!=='boolean')c.versatilityDone=false;
  if(!Array.isArray(c.maneuvers))c.maneuvers=[];
  if(!Array.isArray(c.spells))c.spells=[];
  if(typeof c.warMagicReady!=='boolean')c.warMagicReady=false;
  if(typeof c.eldritchStrikeActive!=='boolean')c.eldritchStrikeActive=false;
  c.spells=c.spells.map(function(s){return{id:(s&&s.id)||uid(),name:(s&&s.name)||'Заклинание',level:Math.max(0,Math.min(9,num(s&&s.level,0))),school:(s&&s.school)||'',description:(s&&s.description)||''}}).filter(function(s){return s.name});
  if(typeof c.toolProf!=='string')c.toolProf='';
  if(!c.backgroundChoices||typeof c.backgroundChoices!=='object')c.backgroundChoices={};
  if(!Array.isArray(c.property))c.property=[];
  if(!Array.isArray(c.servants))c.servants=[];
  if(!Array.isArray(c.transports))c.transports=[];
  if(typeof c._merchantTransportsInit!=='boolean')c._merchantTransportsInit=false;
  if(typeof c._knightServantsInit!=='boolean')c._knightServantsInit=false;
  c.inventory.forEach(function(it){if(it.itemType==='item'&&it.weight===0&&it.note&&it.note.indexOf('Предыстория')>=0&&!/Стрел|Болт|Свеч|Колокол|Противояд|Шлямбур|Письмо|Перо|Бутылочк/i.test(it.name))it.weight=1});
  if(c.backgroundChoices.instrument && !c.backgroundChoices.instrumentItem){c.backgroundChoices.instrumentItem=c.backgroundChoices.instrument;}
  if(!Array.isArray(c.classes)){c.classes=[];if(c.classKey&&c.classKey!=='custom'&&c.classKey!==''){c.classes=[{key:c.classKey,level:num(c.level,1)}]}else if(c.class&&c.class.trim()){c.classes=[{key:'custom',name:c.class.trim(),level:num(c.level,1)}]}}
  c.classes=c.classes.map(cl=>({key:cl.key||'custom',name:cl.key==='custom'?(cl.name||'Свой'):undefined,level:Math.max(1,Math.min(20,num(cl.level,1)))}));
  if(c.classes.length===0)c.classes=[{key:'',level:1}];
  c.level=c.classes.reduce((s,cl)=>s+cl.level,0);if(c.level>20)c.level=20;
  if(!Array.isArray(c.hpRolls)||c.hpRolls.length===0){c.hpRolls=[];let first=true;for(const cl of c.classes){const die=getClassDie(cl.key);for(let lvl=1;lvl<=cl.level;lvl++){if(first){c.hpRolls.push({die,roll:die,isMax:true});first=false}else{c.hpRolls.push({die,roll:Math.floor(die/2)+1})}}}const conMod=modNum(c.con);c.hpMax=calcMaxHP(c.hpRolls,conMod);if(typeof c.hpCur!=='number'||c.hpCur>c.hpMax)c.hpCur=c.hpMax}
  c.hpRolls=c.hpRolls.map(r=>({die:num(r.die,8),roll:Math.max(1,num(r.roll,1)),isMax:!!r.isMax}));
  if(typeof c.hitDiceSpent==='number'){const old=c.hitDiceSpent;c.hitDiceSpent={};if(c.classes.length>0)c.hitDiceSpent[c.classes[0].key]=old}
  if(!c.hitDiceSpent||typeof c.hitDiceSpent!=='object')c.hitDiceSpent={};
  const vk=new Set(c.classes.map(cl=>cl.key));
  Object.keys(c.hitDiceSpent).forEach(k=>{if(!vk.has(k))delete c.hitDiceSpent[k]});
  c.classes.forEach(cl=>{const t=cl.level;const s=num(c.hitDiceSpent[cl.key],0);c.hitDiceSpent[cl.key]=Math.max(0,Math.min(t,s))});
  if(typeof syncFighterResources==='function')syncFighterResources(c);
  if(typeof c.cavalierProf!=='string')c.cavalierProf='';
  if(typeof c.cavalierMarkActive!=='boolean')c.cavalierMarkActive=false;
  return c
}

// --- ФУНКЦИИ ПРЕДЫСТОРИЙ ---
function hasBgChoices(bgName){const bg=BACKGROUNDS_DB[bgName];if(!bg)return false;return((bg.toolChoices&&bg.toolChoices.length)||(bg.equipmentChoices&&bg.equipmentChoices.length)||(bg.variants&&bg.variants.length)||bg.languageCount)>0}
function renderBgChoiceField(choice,currentVal){if(!choice)return '';const val=currentVal||'';if(choice.type==='select'){const isCustom=val&&choice.options.indexOf(val)===-1;let h='<div class="form-grid" style="margin-bottom:10px"><label>'+esc(choice.label)+'<select data-bg-choice="'+choice.key+'">';h+='<option value="">— выберите —</option>';choice.options.forEach(function(o){h+='<option value="'+esc(o)+'" '+(val===o?'selected':'')+'>'+esc(o)+'</option>'});if(choice.allowCustom)h+='<option value="__custom__" '+(isCustom?'selected':'')+'>Свой</option>';h+='</select></label>';if(choice.allowCustom){h+='<label data-bg-custom-wrap="'+choice.key+'" style="display:'+(isCustom?'flex':'none')+'">Своё название<input type="text" data-bg-custom="'+choice.key+'" value="'+(isCustom?esc(val):'')+'" placeholder="Введите"></label>'}h+='</div>';return h}if(choice.type==='text'){return '<div class="form-grid" style="margin-bottom:10px"><label>'+esc(choice.label)+'<input type="text" data-bg-choice="'+choice.key+'" value="'+esc(val)+'" placeholder="'+esc(choice.placeholder||'')+'"></label></div>'}return ''}
function renderBackgroundChoicesHTML(bgName,choices){const bg=BACKGROUNDS_DB[bgName];if(!bg)return '';choices=choices||{};const vKey=choices.variant||'standard';const v=bg.variants?bg.variants.find(function(x){return x.key===vKey}):null;const isMerchant=bgName==='Гильдейский ремесленник'&&vKey==='merchant';if(!hasBgChoices(bgName)&&!(bg.languageCount>0)&&!isMerchant)return '';let h='<h4 class="form-h">Настройка предыстории</h4>';
if(bg.variants&&bg.variants.length>0){let vOpts=bg.variants.map(function(vv){return '<option value="'+vv.key+'" '+(vKey===vv.key?'selected':'')+'>'+vv.name+'</option>'}).join('');h+='<div class="form-grid" style="margin-bottom:10px"><label>Разновидность<select data-bg-choice="variant">'+vOpts+'</select></label></div>'}
if(isMerchant){let curL=choices.language||'';let lOpts='<option value="">— выберите —</option>'+LANGUAGES_DB.map(function(l){return '<option value="'+esc(l)+'" '+(curL===l?'selected':'')+'>'+l+'</option>'}).join('')+'<option value="__custom__" '+(curL&&LANGUAGES_DB.indexOf(curL)===-1?'selected':'')+'>Свой</option>';const isCL=curL&&LANGUAGES_DB.indexOf(curL)===-1;h+='<div class="form-grid" style="margin-bottom:10px"><label>Язык (на выбор)<select data-bg-choice="language">'+lOpts+'</select></label><label data-bg-custom-wrap="language" style="display:'+(isCL?'flex':'none')+'">Свой язык<input type="text" data-bg-custom="language" value="'+(isCL?esc(curL):'')+'" placeholder="Введите"></label></div>';
  const mp=choices.merchantProf||'navigator';h+='<div class="form-grid" style="margin-bottom:10px"><label>Владение (вместо инструментов)<select data-bg-choice="merchantProf"><option value="navigator" '+(mp==='navigator'?'selected':'')+'>Инструменты навигатора</option><option value="language" '+(mp==='language'?'selected':'')+'>Дополнительный язык</option></select></label></div>';
  if(mp==='language'){let curL2=choices.bonusLanguage||'';let lOpts2='<option value="">— выберите —</option>'+LANGUAGES_DB.map(function(l){return '<option value="'+esc(l)+'" '+(curL2===l?'selected':'')+'>'+l+'</option>'}).join('')+'<option value="__custom__" '+(curL2&&LANGUAGES_DB.indexOf(curL2)===-1?'selected':'')+'>Свой</option>';const isCL2=curL2&&LANGUAGES_DB.indexOf(curL2)===-1;h+='<div class="form-grid" style="margin-bottom:10px"><label>Дополнительный язык<select data-bg-choice="bonusLanguage">'+lOpts2+'</select></label><label data-bg-custom-wrap="bonusLanguage" style="display:'+(isCL2?'flex':'none')+'">Свой язык<input type="text" data-bg-custom="bonusLanguage" value="'+(isCL2?esc(curL2):'')+'" placeholder="Введите"></label></div>'}
  h+='<div class="class-hint" style="font-style:normal;color:var(--gold-bright)">📦 При старте выдаётся: Мул, Телега (в разделе 🐴 Транспорт)</div>';return h}
const toolBase=bg.toolChoices||[];const toolVar=(v&&v.toolChoices)?v.toolChoices:[];const toolKeys=new Set(toolVar.map(function(cc){return cc.key}));const toolAll=toolVar.concat(toolBase.filter(function(cc){return !toolKeys.has(cc.key)}));const eqBase=bg.equipmentChoices||[];const eqVar=(v&&v.equipmentChoices)?v.equipmentChoices:[];const eqKeys=new Set(eqVar.map(function(cc){return cc.key}));const eqAll=eqVar.concat(eqBase.filter(function(cc){return !eqKeys.has(cc.key)}));const seen={};toolAll.concat(eqAll).forEach(function(ch){if(seen[ch.key])return;seen[ch.key]=true;h+=renderBgChoiceField(ch,choices[ch.key]||'')});if(bg.languageCount>0){for(var li=0;li<bg.languageCount;li++){var lk=li===0?'language':'language'+(li+1);var lbl=bg.languageCount>1?'Язык '+(li+1)+' (на выбор)':'Язык (на выбор)';var curL3=choices[lk]||'';var lOpts3='<option value="">— выберите —</option>'+LANGUAGES_DB.map(function(l){return '<option value="'+esc(l)+'" '+(curL3===l?'selected':'')+'>'+l+'</option>'}).join('')+'<option value="__custom__" '+(curL3&&LANGUAGES_DB.indexOf(curL3)===-1?'selected':'')+'>Свой</option>';var isCL3=curL3&&LANGUAGES_DB.indexOf(curL3)===-1;h+='<div class="form-grid" style="margin-bottom:10px"><label>'+lbl+'<select data-bg-choice="'+lk+'">'+lOpts3+'</select></label><label data-bg-custom-wrap="'+lk+'" style="display:'+(isCL3?'flex':'none')+'">Свой язык<input type="text" data-bg-custom="'+lk+'" value="'+(isCL3?esc(curL3):'')+'" placeholder="Введите"></label></div>'}}return h}
function onVariantChange(sel){const form=sel.form||sel.closest('form');if(!form)return;const bgS=form.querySelector('[name=background]');const bgName=bgS?bgS.value:'';const bg=BACKGROUNDS_DB[bgName];if(!bg||!bg.variants)return;const variant=bg.variants.find(function(v){return v.key===sel.value});if(variant){applyBackgroundProficiencies(form,bgName)}}
function collectBackgroundChoices(formEl){const r={};if(!formEl)return r;formEl.querySelectorAll('[data-bg-choice]').forEach(function(el){const k=el.getAttribute('data-bg-choice');let v=el.value||'';if(v==='__custom__'){const cu=formEl.querySelector('[data-bg-custom="'+k+'"]');if(cu)v=cu.value||''}r[k]=v});return r}
function attachBgChoiceHandlers(formEl,bgName){if(!formEl)return;formEl.querySelectorAll('[data-bg-choice]').forEach(function(el){el.onchange=function(){const k=el.getAttribute('data-bg-choice');const cw=formEl.querySelector('[data-bg-custom-wrap="'+k+'"]');if(cw)cw.style.display=el.value==='__custom__'?'flex':'none';if(k==='variant'||k==='merchantProf'){const bgS=formEl.querySelector('[name=background]');const bn=bgS?bgS.value:bgName;const curChoices=collectBackgroundChoices(formEl);const bgWrap=formEl.querySelector('#bg-choices-wrap');if(bgWrap){const html=renderBackgroundChoicesHTML(bn,curChoices);if(html){bgWrap.innerHTML=html;bgWrap.style.display='block';attachBgChoiceHandlers(formEl,bn)}else{bgWrap.innerHTML='';bgWrap.style.display='none'}}applyBackgroundProficiencies(formEl,bn);return}applyBackgroundProficiencies(formEl,bgName)}})}
function applyBackgroundChoicesToInventory(char,oldChar){const bg=BACKGROUNDS_DB[char.background];if(!bg)return;const newC=char.backgroundChoices||{};const oldC=oldChar?(oldChar.backgroundChoices||{}):{};const oldBgName=oldChar?oldChar.background:'';const oldVariant=oldC.variant||'standard';const newVariant=newC.variant||'standard';const bgChanged=oldBgName!==char.background;const variantChanged=oldVariant!==newVariant;const isMerchant=char.background==='Гильдейский ремесленник'&&newVariant==='merchant';const isKnight=char.background==='Благородный'&&newVariant==='knight';
const oldItems=[];if(!bgChanged&&oldChar){Object.keys(oldC).forEach(function(k){if(oldC[k]&&k!=='variant'&&k!=='merchantProf'&&k!=='bonusLanguage')oldItems.push(oldC[k])});(bg.equipmentFixed||[]).forEach(function(f){oldItems.push(f.name)});const oldV=bg.variants?bg.variants.find(function(v){return v.key===oldVariant}):null;if(oldV&&oldV.equipmentChoices)Object.keys(oldC).forEach(function(k){if(oldC[k]&&oldV.equipmentChoices.some(function(ec){return ec.key===k}))oldItems.push(oldC[k])})}
const newItems=[];(bg.equipmentFixed||[]).forEach(function(f){newItems.push(f.name)});if(isMerchant){if(newC.talisman)newItems.push(newC.talisman);char.inventory=char.inventory.filter(function(it){return !(typeof TOOLS_DB!=='undefined'&&TOOLS_DB[it.name]&&TOOLS_DB[it.name].cat==='artisan')&&it.name!=='Мул'&&it.name!=='Телега'})}else{if(bg.equipmentChoices)bg.equipmentChoices.forEach(function(ch){const v=newC[ch.key];if(v)newItems.push(v)});const v0=bg.variants?bg.variants.find(function(vv){return vv.key===newVariant}):null;if(v0&&v0.equipmentChoices)v0.equipmentChoices.forEach(function(ch){const v=newC[ch.key];if(v)newItems.push(v)})}
oldItems.forEach(function(n){const i=char.inventory.findIndex(function(it){return it.name===n});if(i>=0)char.inventory.splice(i,1)});newItems.forEach(function(n){const ex=char.inventory.find(function(it){return it.name===n});if(ex)return;const b=buildItemFromName(n,1,1,'Предыстория');if(b)char.inventory.push(b)});
if(!Array.isArray(char.transports))char.transports=[];
if(!char._merchantTransportsInit||bgChanged||variantChanged){char.transports=char.transports.filter(function(t){return !(t.notes&&t.notes.indexOf('Из предыстории (Купец)')>=0)});if(isMerchant){char.transports.push({id:uid(),name:'Осёл или мул',category:'mount',speed:'40 фт',capacity:420,cargo:[],notes:'Из предыстории (Купец)'});char.transports.push({id:uid(),name:'Телега',category:'vehicle',speed:'—',capacity:200,cargo:[],notes:'Из предыстории (Купец)'})}char._merchantTransportsInit=true}else if(!isMerchant){char.transports=char.transports.filter(function(t){return !(t.notes&&t.notes.indexOf('Из предыстории (Купец)')>=0)})}
if(!Array.isArray(char.servants))char.servants=[];
if(!char._knightServantsInit||bgChanged||variantChanged){if(isKnight&&char.servants.length===0){char.servants=[{name:'Слуга 1',desc:'Дворецкий'},{name:'Слуга 2',desc:'Сквайр'},{name:'Слуга 3',desc:'Конюх'}]}char._knightServantsInit=true}}
function markBackgroundSkills(formEl,bgName){if(!formEl)return;const bg=BACKGROUNDS_DB[bgName];if(!bg||!bg.skills)return;bg.skills.forEach(function(key){const cb=formEl.querySelector('[name=skill-'+key+']');if(cb&&cb.checked){cb.setAttribute('data-from-bg','true');const r=cb.closest('.skill-item');if(r)r.classList.add('bg-skill')}})}
function applyBackgroundSkills(formEl,bgName,notify){if(!formEl)return[];const bg=BACKGROUNDS_DB[bgName];formEl.querySelectorAll('[data-from-bg="true"]').forEach(function(cb){if(!bg||(bg.skills||[]).indexOf(cb.value)===-1){cb.checked=false;cb.removeAttribute('data-from-bg');const r=cb.closest('.skill-item');if(r)r.classList.remove('bg-skill');cb.dispatchEvent(new Event('change',{bubbles:true}))}});if(!bg||!bg.skills)return[];const conflicts=[];bg.skills.forEach(function(key){const cb=formEl.querySelector('[name=skill-'+key+']');if(!cb)return;const wasChecked=cb.checked&&!cb.hasAttribute('data-from-bg');cb.checked=true;cb.setAttribute('data-from-bg','true');const r=cb.closest('.skill-item');if(r)r.classList.add('bg-skill');if(wasChecked)conflicts.push(key);cb.dispatchEvent(new Event('change',{bubbles:true}))});if(notify&&conflicts.length){const names=conflicts.map(function(k){const s=SKILLS.find(function(x){return x.key===k});return s?s.name:k}).join(', ');showToast('Навык(и) '+names+' уже выбраны классом. По правилам выберите другой навык взамен.','fail')}return conflicts}
function applyBackgroundProficiencies(formEl,bgName){if(!formEl)return;const bg=BACKGROUNDS_DB[bgName];const choices=collectBackgroundChoices(formEl);const isMerchant=bgName==='Гильдейский ремесленник'&&choices.variant==='merchant';const ta=formEl.querySelector('[name=proficiencies]');if(ta){const lines=ta.value.split('\n').filter(function(l){return l.indexOf('Предыстория:')!==0});if(bg){let toolsText='';if(isMerchant){const mp=choices.merchantProf||'navigator';if(mp==='navigator')toolsText='Инструменты навигатора'}else{toolsText=(bg.toolsText||'').replace(/\{(\w+)\}/g,function(m,k){return choices[k]||'(на выбор)'})}if(toolsText)lines.push('Предыстория: '+bgName+' — '+toolsText)}ta.value=lines.join('\n').trim()}
const taL=formEl.querySelector('[name=languages]');if(taL){const linesL=taL.value.split('\n').filter(function(l){return l.indexOf('Предыстория:')!==0});const langArr=[];if(isMerchant){if(choices.language)langArr.push(choices.language);if(choices.merchantProf==='language'&&choices.bonusLanguage)langArr.push(choices.bonusLanguage)}else if(bg&&bg.languageCount>0){for(var li=0;li<bg.languageCount;li++){var lk=li===0?'language':'language'+(li+1);if(choices[lk])langArr.push(choices[lk])}}langArr.forEach(function(lang){linesL.push('Предыстория: '+lang)});taL.value=linesL.join('\n').trim()}}
function onBackgroundChange(sel){const form=sel.form||sel.closest('form');if(!form)return;const wrap=form.querySelector('#background-custom-wrap');if(wrap)wrap.style.display=sel.value==='__custom__'?'flex':'none';const bgName=sel.value==='__custom__'?((form.querySelector('[name=backgroundCustom]')||{}).value||''):sel.value;applyBackgroundSkills(form,bgName,true);const bgWrap=form.querySelector('#bg-choices-wrap');if(bgWrap){const html=renderBackgroundChoicesHTML(bgName,{});if(html){bgWrap.innerHTML=html;bgWrap.style.display='block';attachBgChoiceHandlers(form,bgName)}else{bgWrap.innerHTML='';bgWrap.style.display='none'}}applyBackgroundProficiencies(form,bgName)}
function getPropertySectionHTML(c){if(!c.property||!c.property.length)return'';return'<div class="view-section"><h3>Имущество</h3>'+c.property.map(function(it){return'<div class="view-row"><span class="key">'+esc(it.name)+'</span><span class="val">'+esc(it.desc||'—')+'</span></div>'}).join('')+'</div>'}
function getServantsSectionHTML(c){if(!c.servants||!c.servants.length)return'<div class="view-section"><h3>Свита (Слуги)</h3><div class="view-text" style="font-style:italic;color:var(--text-dim)">Слуг нет. <button class="btn btn-ghost" style="padding:2px 8px;font-size:10px" onclick="event.stopPropagation();addServant(\''+c.id+'\')">+ Добавить слугу</button></div></div>';return'<div class="view-section"><h3>Свита (Слуги)</h3>'+c.servants.map(function(s,i){return'<div class="view-row" style="align-items:center"><span class="key"><b style="color:var(--gold-bright)">'+esc(s.name||'Слуга')+'</b> — '+esc(s.desc||'—')+'</span><span style="display:flex;gap:4px"><button class="icon-btn" style="width:24px;height:24px;font-size:12px" onclick="event.stopPropagation();editServant(\''+c.id+'\','+i+')">✎</button><button class="icon-btn danger" style="width:24px;height:24px;font-size:12px" onclick="event.stopPropagation();delServant(\''+c.id+'\','+i+')">✕</button></span></div>'}).join('')+'<button class="btn btn-ghost" style="padding:3px 10px;font-size:10px;margin-top:6px" onclick="event.stopPropagation();addServant(\''+c.id+'\')">+ Добавить слугу</button></div>'}
function addServant(charId){const c=findChar(charId);if(!c)return;if(!Array.isArray(c.servants))c.servants=[];const name=prompt('Имя слуги?','Слуга');if(name===null)return;const desc=prompt('Описание (роль)?','Помощник')||'';c.servants.push({name:name.trim()||'Слуга',desc:desc.trim()});save();renderAll();showToast('Слуга добавлен','success');setTimeout(function(){openCharView(charId)},100)}
function editServant(charId,idx){const c=findChar(charId);if(!c||!c.servants[idx])return;const s=c.servants[idx];const name=prompt('Имя слуги?',s.name||'');if(name===null)return;const desc=prompt('Описание (роль)?',s.desc||'');if(desc===null)return;s.name=name.trim()||'Слуга';s.desc=desc.trim();save();renderAll();setTimeout(function(){openCharView(charId)},100)}
function delServant(charId,idx){const c=findChar(charId);if(!c||!c.servants[idx])return;if(!confirm('Удалить «'+c.servants[idx].name+'»?'))return;c.servants.splice(idx,1);save();renderAll();setTimeout(function(){openCharView(charId)},100)}
function getBackgroundSectionHTML(c){if(!c||!c.background)return'';const bg=BACKGROUNDS_DB[c.background];if(!bg)return'<div class="view-section"><h3>Предыстория</h3><div class="view-text">'+esc(c.background)+'</div></div>';const skillNames=(bg.skills||[]).map(function(k){const s=SKILLS.find(function(x){return x.key===k});return s?s.name:k}).join(', ');const choices=c.backgroundChoices||{};const isMerchant=c.background==='Гильдейский ремесленник'&&choices.variant==='merchant';let v=null;if(bg.variants&&bg.variants.length>0){const vKey=choices.variant||'standard';v=bg.variants.find(function(x){return x.key===vKey})||bg.variants[0]}
let toolsText='';if(isMerchant){const mp=choices.merchantProf||'navigator';if(mp==='navigator')toolsText='Инструменты навигатора'}else{toolsText=(bg.toolsText||'').replace(/\{(\w+)\}/g,function(m,k){return choices[k]||'(на выбор)'})}
const langArr=[];if(isMerchant){if(choices.language)langArr.push(choices.language);if(choices.merchantProf==='language'&&choices.bonusLanguage)langArr.push(choices.bonusLanguage)}else if(bg.languageCount>0){for(var li=0;li<bg.languageCount;li++){var lk=li===0?'language':'language'+(li+1);if(choices[lk])langArr.push(choices[lk])}}
const langText=langArr.length?'<div class="view-row"><span class="key">Языки</span><span class="val">'+esc(langArr.join(', '))+'</span></div>':'';
let fName=bg.feature||'';let fDesc=bg.featureDesc||'';if(v){fName=v.feature;fDesc=v.desc}const eqText=(v&&v.equipmentText)||bg.equipmentText;return'<div class="view-section"><h3>Предыстория: '+esc(c.background)+'</h3><div class="view-text" style="margin-bottom:10px">'+esc(bg.desc||'')+'</div>'+(skillNames?'<div class="view-row"><span class="key">Владение навыками</span><span class="val">'+esc(skillNames)+'</span></div>':'')+(toolsText?'<div class="view-row"><span class="key">Владение инструментами</span><span class="val">'+esc(toolsText)+'</span></div>':'')+langText+(eqText?'<div class="view-row"><span class="key">Снаряжение</span><span class="val">'+esc(eqText)+'</span></div>':'')+(fName?'<div class="view-section" style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border-soft)"><h4 style="font-family:Cinzel,serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:8px">Умение: '+esc(fName)+'</h4><div class="view-text">'+esc(fDesc)+'</div></div>':'')+'</div>'}

// --- КЛАССЫ И УРОВНИ В ФОРМЕ ---
function classRowHTML(cl){cl=cl||{key:'',level:1};const opts='<option value="" '+(cl.key===''?'selected':'')+'>— Не выбран —</option>'+CLASSES.map(d=>'<option value="'+d.key+'" '+(cl.key===d.key?'selected':'')+'>'+d.name+' (d'+d.hitDie+')</option>').join('');const cDisp=cl.key==='custom'?'block':'none';return'<div class="class-row" data-class-row><select data-field="key" onchange="onClassRowChange(this)">'+opts+'</select><input type="text" data-field="name" placeholder="Свой" value="'+(cl.key==='custom'?esc(cl.name||''):'')+'" style="display:'+cDisp+'"><input type="number" data-field="level" min="1" max="20" value="'+cl.level+'" oninput="updateTotalLevel(this.closest(\'form\'))"><button type="button" onclick="removeClassRow(this)">✕</button></div>'}
function onClassRowChange(sel){const row=sel.closest('.class-row');const ni=row.querySelector('[data-field="name"]');if(sel.value==='custom')ni.style.display='block';else ni.style.display='none';const form=sel.closest('form');let oldClasses=[];try{oldClasses=JSON.parse(form.dataset.classesSnapshot||'[]')}catch(e){}
  syncClassSaves(form,oldClasses);form.dataset.classesSnapshot=JSON.stringify(collectClasses(form));updateHPHint(form);
  const wrap=form.querySelector('#fighter-equipment-wrapper');if(wrap){if(hasClass(form,'fighter')){if(!wrap.querySelector('.starting-equipment'))wrap.innerHTML=renderFighterEquipmentHTML()}else wrap.innerHTML=''}
  applyFighterDefaults(form);highlightClassSkills(form);updateSlotVisibility(form);updateFighterWeaponDisplay(form);updateFighterMulticlassHint(form);updateFightingStyleVisibility(form);updateFighterArchetypeVisibility(form);updateFighterArchetypeDesc(form);updateFighterToolVisibility(form);updateASIStatus(form);updateManeuversSection(form);
  if(!currentEditMode)rebuildFighterStartingEquipment(form)}
function removeClassRow(btn){const form=btn.closest('form');const rows=form.querySelectorAll('[data-class-row]');if(rows.length<=1){showToast('Нужен хотя бы один класс','fail');return}btn.closest('.class-row').remove();updateTotalLevel(form);const wrap=form.querySelector('#fighter-equipment-wrapper');if(wrap){if(hasClass(form,'fighter')){if(!wrap.querySelector('.starting-equipment'))wrap.innerHTML=renderFighterEquipmentHTML()}else wrap.innerHTML=''}
  applyFighterDefaults(form);highlightClassSkills(form);updateSlotVisibility(form);updateFighterMulticlassHint(form);updateFightingStyleVisibility(form);updateFighterArchetypeVisibility(form);updateFighterToolVisibility(form);updateASIStatus(form);updateManeuversSection(form);if(!currentEditMode)rebuildFighterStartingEquipment(form)}
function addClassRow(){const form=document.getElementById('modal-form');const list=form.querySelector('#classes-rows');list.insertAdjacentHTML('beforeend',classRowHTML({key:'',level:1}));updateTotalLevel(form);applyFighterDefaults(form);highlightClassSkills(form);updateSlotVisibility(form);updateFighterMulticlassHint(form);updateFightingStyleVisibility(form);updateFighterArchetypeVisibility(form);updateFighterToolVisibility(form);updateASIStatus(form);updateManeuversSection(form)}
function updateTotalLevel(form){if(!form)return;const total=computeTotalLevel(form);const el=form.querySelector('#class-total');if(el){el.innerHTML='Общий уровень: <b>'+total+'</b> / 20';el.classList.toggle('over',total>20||total<1)}updateHPHint(form);if(typeof updateFighterArchetypeVisibility==='function')updateFighterArchetypeVisibility(form);if(typeof updateFighterToolVisibility==='function')updateFighterToolVisibility(form);if(typeof updateASIStatus==='function')updateASIStatus(form);if(typeof updateManeuversSection==='function')updateManeuversSection(form)}
function computeTotalLevel(form){let t=0;form.querySelectorAll('[data-class-row]').forEach(row=>{t+=Math.max(0,num(row.querySelector('[data-field="level"]').value,0))});return t}
function collectClasses(form){const classes=[];form.querySelectorAll('[data-class-row]').forEach(row=>{const key=row.querySelector('[data-field="key"]').value;const name=(row.querySelector('[data-field="name"]').value||'').trim();const level=num(row.querySelector('[data-field="level"]').value,0);if(level<1)return;if(key==='custom'){if(!name)return;classes.push({key:'custom',name,level})}else if(key){classes.push({key,level})}});return classes}
function collectManeuvers(formEl){if(!formEl)return[];const archSel=formEl.querySelector('[name=fighterArchetype]');if(!archSel||archSel.value!=='battlemaster')return[];const arr=[];formEl.querySelectorAll('[data-maneuver-cb]').forEach(cb=>{if(cb.checked)arr.push(cb.value)});return arr}
function updateManeuversSection(formEl){if(!formEl)return;const wrap=formEl.querySelector('#fighter-maneuvers-wrap');if(!wrap)return;const fLvl=getFighterLevelInForm(formEl);const archSel=formEl.querySelector('[name=fighterArchetype]');const isBM=archSel&&archSel.value==='battlemaster';if(!isBM||fLvl<3){wrap.style.display='none';return}wrap.style.display='block';const max=getMaxManeuvers(fLvl);const sel=formEl.querySelectorAll('[data-maneuver-cb]:checked').length;const cnt=formEl.querySelector('#fighter-maneuvers-count');if(cnt)cnt.innerHTML='Макс. приёмов: '+max+'. Выбрано: <b>'+sel+' / '+max+'</b>'+(sel>max?' <span class="hint-warn">(превышено)</span>':'');const dcEl=formEl.querySelector('#fighter-maneuvers-dc');if(dcEl){const totalLvl=computeTotalLevel(formEl);const pb=profBonus(totalLvl);const str=num(formEl.querySelector('[name=str]').value,10);const dex=num(formEl.querySelector('[name=dex]').value,10);const dc=8+pb+Math.max(modNum(str),modNum(dex));dcEl.innerHTML='Сл спасброска приёмов: <b>'+dc+'</b> · Костей превосходства: <b>'+getSuperiorityDiceCount(fLvl)+'к'+getSuperiorityDieSize(fLvl)+'</b>'}}
function hasClass(formEl,key){if(!formEl)return false;let f=false;formEl.querySelectorAll('[data-class-row]').forEach(row=>{if(row.querySelector('[data-field="key"]').value===key)f=true});return f}
function getFighterLevelInForm(formEl){if(!formEl)return 0;let lvl=0;formEl.querySelectorAll("[data-class-row]").forEach(function(row){var k=(row.querySelector("[data-field=key]").value||"").toLowerCase().trim();var n=(row.querySelector("[data-field=name]").value||"").toLowerCase().trim();var lv=num(row.querySelector("[data-field=level]").value,0);if(k==="fighter"||n==="воин")lvl+=lv});return lvl}
function applyFighterDefaults(formEl){if(!formEl||!hasClass(formEl,'fighter'))return;const prof=formEl.querySelector('[name=proficiencies]');if(prof){const line='Воин: Все доспехи, щиты; простое оружие, воинское оружие';if(!prof.value.includes(line)){prof.value=prof.value.trim()?prof.value.trim()+'\n'+line:line}}}
function syncClassSaves(formEl,oldClasses){if(!formEl)return;const newClasses=collectClasses(formEl);const oldK=new Set();const newK=new Set();(oldClasses||[]).forEach(cl=>{const s=CLASS_SAVES[cl.key];if(s)s.forEach(k=>oldK.add(k))});newClasses.forEach(cl=>{const s=CLASS_SAVES[cl.key];if(s)s.forEach(k=>newK.add(k))});
  oldK.forEach(k=>{if(!newK.has(k)){const cb=formEl.querySelector('[name=save-'+k+']');if(cb&&cb.checked){cb.checked=false;cb.dispatchEvent(new Event('change',{bubbles:true}))}}});
  newK.forEach(k=>{const cb=formEl.querySelector('[name=save-'+k+']');if(cb&&!cb.checked){cb.checked=true;cb.dispatchEvent(new Event('change',{bubbles:true}))}})}
function highlightClassSkills(formEl){if(!formEl)return;const keys=new Set();formEl.querySelectorAll('[data-class-row]').forEach(row=>{const k=row.querySelector('[data-field="key"]').value;const s=CLASS_SKILLS[k];if(s)s.forEach(x=>keys.add(x))});
  SKILLS.forEach(sk=>{const cb=formEl.querySelector('[name=skill-'+sk.key+']');if(!cb)return;const row=cb.closest('.skill-item');if(!row)return;if(keys.has(sk.key))row.classList.add('class-skill');else row.classList.remove('class-skill')});updateSkillHint(formEl)}
function updateSkillHint(formEl){if(!formEl)return;const hintEl=formEl.querySelector('#skill-hint');if(!hintEl)return;const parts=[];
  formEl.querySelectorAll('[data-class-row]').forEach(row=>{const k=row.querySelector('[data-field="key"]').value;if(k==='fighter'){const names=CLASS_SKILLS['fighter'].map(x=>{const s=SKILLS.find(y=>y.key===x);return s?s.name:x}).join(', ');let sel=0;CLASS_SKILLS['fighter'].forEach(x=>{const cb=formEl.querySelector('[name=skill-'+x+']');if(cb&&cb.checked&&!cb.hasAttribute('data-from-bg'))sel++});const over=sel>2;parts.push('<b>Воин:</b> выберите 2 из: '+names+'. Выбрано: '+sel+' / 2'+(over?' <span class="hint-warn">(превышен лимит)</span>':''))}});
  const bgSel=formEl.querySelector('[name=background]');let bgName=bgSel?bgSel.value:'';if(bgName==='__custom__'){const cu=formEl.querySelector('[name=backgroundCustom]');bgName=cu?cu.value:''}const bg=BACKGROUNDS_DB[bgName];if(bg&&bg.skills&&bg.skills.length){const bgNames=bg.skills.map(function(k){const s=SKILLS.find(function(y){return y.key===k});return s?s.name:k}).join(', ');parts.push('<b>Предыстория ('+esc(bgName)+'):</b> '+bgNames+' <span class="hint-warn">(автоматически)</span>')}
  if(!parts.length){hintEl.style.display='none';return}hintEl.style.display='block';hintEl.innerHTML=parts.join('<br>')}
function updateSlotVisibility(formEl){if(!formEl)return;const wrap=formEl.querySelector('#slots-wrapper');if(!wrap)return;let has=false;formEl.querySelectorAll('[data-class-row]').forEach(row=>{const k=row.querySelector('[data-field="key"]').value;if(SLOT_CLASSES.indexOf(k)!==-1)has=true});wrap.style.display=has?'block':'none'}
function updateHPHint(formEl){if(!formEl)return;const hint=formEl.querySelector('#hp-hint');if(!hint)return;const con=num(formEl.querySelector('[name=con]').value,10);const conMod=modNum(con);const conSign=conMod>=0?'+'+conMod:''+conMod;const classes=collectClasses(formEl);
  if(!classes.length){hint.innerHTML='Выберите класс для расчёта ХП.';return}
  let totalMin=0,totalMax=0;const parts=[];let first=true;
  for(const cl of classes){const die=getClassDie(cl.key);const name=cl.key==='custom'?(cl.name||'Свой'):(getClassDef(cl.key)||{}).name||cl.key;
    if(first){const hp1=Math.max(1,die+conMod);parts.push('1 ур '+name+': макс d'+die+'('+die+') '+conSign+' = '+hp1);totalMin+=hp1;totalMax+=hp1;for(let lvl=2;lvl<=cl.level;lvl++){parts.push('ур '+name+': d'+die+' '+conSign);totalMin+=Math.max(1,1+conMod);totalMax+=Math.max(1,die+conMod)}first=false}
    else{for(let lvl=1;lvl<=cl.level;lvl++){parts.push('ур '+name+': d'+die+' '+conSign);totalMin+=Math.max(1,1+conMod);totalMax+=Math.max(1,die+conMod)}}}
  hint.innerHTML=parts.join(', ')+'. <b>Диапазон: '+totalMin+'–'+totalMax+' ХП</b>.'}

// --- ВОИН (СНАРЯЖЕНИЕ, АРХЕТИПЫ, МАНЕВРЫ) ---
function updateFighterWeaponDisplay(formEl){if(!formEl)return;const w1Sel=formEl.querySelector('input[name="fighter_weapon1"]:checked');const single=formEl.querySelector('[data-weapon-single]');const double=formEl.querySelector('[data-weapon-double]');if(!single||!double)return;if(w1Sel&&w1Sel.value==='martial_shield'){single.style.display='block';double.style.display='none'}else{single.style.display='none';double.style.display='grid'}}
function onFighterEquipChange(el){const form=el.form||el.closest('form');if(!form)return;updateFighterWeaponDisplay(form);rebuildFighterStartingEquipment(form)}
function updateFightingStyleVisibility(formEl){if(!formEl)return;const wrap=formEl.querySelector('#fighter-fighting-style-wrap');if(!wrap)return;if(hasClass(formEl,'fighter'))wrap.style.display='block';else wrap.style.display='none'}
function updateFightingStyleDesc(formEl){if(!formEl)return;const sel=formEl.querySelector('[name=fightingStyle]');const desc=formEl.querySelector('#fighting-style-desc');if(!sel||!desc)return;const fs=FIGHTING_STYLES.find(x=>x.key===sel.value);desc.innerHTML=fs&&fs.desc?'<b>'+esc(fs.name)+':</b> '+esc(fs.desc):''}
function updateFighterArchetypeVisibility(formEl){if(!formEl)return;const wrap=formEl.querySelector('#fighter-archetype-wrap');if(!wrap)return;const fl=getFighterLevelInForm(formEl);wrap.style.display=fl>=3?'block':'none'}
function updateFighterArchetypeDesc(formEl){if(!formEl)return;const sel=formEl.querySelector('[name=fighterArchetype]');const desc=formEl.querySelector('#fighter-archetype-desc');if(!sel||!desc)return;const a=FIGHTER_ARCHETYPES.find(x=>x.key===sel.value);desc.innerHTML=a&&a.desc?'<b>'+esc(a.name)+':</b> '+esc(a.desc):'';if(typeof updateFighterToolVisibility==='function')updateFighterToolVisibility(formEl);if(typeof updateManeuversSection==='function')updateManeuversSection(formEl)}
function updateFighterToolVisibility(formEl){if(!formEl)return;const wrap=formEl.querySelector('#fighter-tool-wrap');if(!wrap)return;const fLvl=getFighterLevelInForm(formEl);const archSel=formEl.querySelector('[name=fighterArchetype]');const isBM=archSel&&archSel.value==='battlemaster';wrap.style.display=(isBM&&fLvl>=3)?'block':'none'}
function updateFighterMulticlassHint(formEl){if(!formEl)return;const wrap=formEl.querySelector('#fighter-multiclass-hint');if(!wrap)return;
  const rows=Array.from(formEl.querySelectorAll('[data-class-row]'));const filled=rows.filter(row=>{const k=row.querySelector('[data-field="key"]').value;return k&&k!==''});
  let hasF=false;filled.forEach(row=>{if(row.querySelector('[data-field="key"]').value==='fighter')hasF=true});
  if(!hasF||filled.length<2){wrap.innerHTML='';wrap.style.display='none';return}
  const str=num(formEl.querySelector('[name=str]').value,10);const dex=num(formEl.querySelector('[name=dex]').value,10);const ok=str>=13||dex>=13;
  const reqLine=ok?'<span class="mc-ok">✓ Требование выполнено (СИЛ '+str+' / ЛОВ '+dex+')</span>':'<span class="mc-warn">⚠ Не выполнено: СИЛ или ЛОВ должны быть ≥ 13 (у вас СИЛ '+str+' / ЛОВ '+dex+').</span>';
  wrap.style.display='block';wrap.innerHTML='<div class="mc-hint"><h5>Мультиклассирование и Воин</h5><ul><li><b>Минимум:</b> СИЛ или ЛОВ не ниже 13.</li><li><b>Владения:</b> лёгкие/средние доспехи, щиты, простое и воинское оружие.</li><li><b>Мистический рыцарь:</b> треть уровней Воина к ячейкам.</li></ul>'+reqLine+'</div>'}

function updateASIStatus(formEl){if(!formEl)return;const wrap=formEl.querySelector('#fighter-asi-wrap');if(!wrap)return;const fl=getFighterLevelInForm(formEl);const levels=getFighterASILevels(fl);const total=levels.length;const applied=(formEl._asiHistory||[]).length;const available=Math.max(0,total-applied);if(total===0){wrap.style.display='none';return}wrap.style.display='block';
  const status=formEl.querySelector('#fighter-asi-status');if(status){status.innerHTML='Уровни с ASI: '+(levels.join(', ')||'—')+'. Доступно: <b>'+available+'</b> из '+total+(available>0?' <span class="hint-warn">(примените)</span>':' ✓')}
  const btn=formEl.querySelector('#fighter-asi-btn');if(btn) btn.disabled=available<=0;
  const hist=formEl.querySelector('#fighter-asi-history-list');if(hist){if(formEl._asiHistory&&formEl._asiHistory.length){hist.innerHTML='<b style="color:var(--gold)">История:</b> '+formEl._asiHistory.map(h=>{if(h.type==='single')return h.level+' ур: +'+h.amount+' '+STAT_NAMES[h.stat];if(h.type==='double')return h.level+' ур: +'+h.amounts[0]+' '+STAT_NAMES[h.stats[0]]+', +'+h.amounts[1]+' '+STAT_NAMES[h.stats[1]];return''}).filter(Boolean).join('; ')}else hist.innerHTML=''}}
function openASIModal(){const formEl=document.getElementById('modal-form');if(!formEl)return;const fl=getFighterLevelInForm(formEl);const total=getFighterASILevels(fl).length;const applied=(formEl._asiHistory||[]).length;const available=total-applied;if(available<=0){showToast('Нет доступных повышений','fail');return}
  const cur={};['str','dex','con','int','wis','cha'].forEach(k=>{cur[k]=num(formEl.querySelector('[name='+k+']').value,10)});
  const opts=['str','dex','con','int','wis','cha'].map(k=>{const dis=cur[k]>=20?'disabled':'';return'<option value="'+k+'" '+dis+'>'+STAT_NAMES[k]+' ('+cur[k]+')</option>'}).join('');
  let overlay=document.getElementById('asi-overlay');if(!overlay){overlay=document.createElement('div');overlay.id='asi-overlay';overlay.className='modal-overlay';overlay.style.zIndex='200';document.body.appendChild(overlay)}
  const lvls=getFighterASILevels(fl).join(', ');
  overlay.innerHTML='<div class="modal"><div class="modal-header"><h2>Увеличение характеристик</h2><button type="button" class="modal-close" onclick="closeASIModal()">X</button></div><form id="asi-form"><div class="modal-body"><p style="margin-bottom:16px;color:var(--text-dim);font-size:14px">Доступно: <b style="color:var(--gold-bright)">'+available+'</b> из '+total+' (уровни: '+lvls+')</p><div style="margin-bottom:16px;display:flex;flex-direction:column;gap:8px"><label style="flex-direction:row;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-family:EB Garamond,serif;font-size:15px"><input type="radio" name="asiType" value="single" checked onchange="onASIChange()"><span>+2 к одной</span></label><label style="flex-direction:row;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-family:EB Garamond,serif;font-size:15px"><input type="radio" name="asiType" value="double" onchange="onASIChange()"><span>+1 к двум</span></label></div><div id="asi-single-fields"><label>Характеристика<select name="asiSingleStat">'+opts+'</select></label></div><div id="asi-double-fields" style="display:none"><label>Первая<select name="asiStat1">'+opts+'</select></label><label style="margin-top:10px">Вторая<select name="asiStat2">'+opts+'</select></label></div></div><div class="modal-footer"><button type="button" class="btn btn-ghost" onclick="closeASIModal()">Отмена</button><button type="submit" class="btn btn-gold">Применить</button></div></form></div>';
  overlay.classList.add('active');
  document.getElementById('asi-form').addEventListener('submit',function(e){e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());if(applyASI(formEl,data,fl)){const newApplied=(formEl._asiHistory||[]).length;closeASIModal();if(newApplied<total){setTimeout(()=>openASIModal(),150)}}})}
function closeASIModal(){const o=document.getElementById('asi-overlay');if(o){o.classList.remove('active');o.innerHTML=''}}
function onASIChange(){const form=document.getElementById('asi-form');if(!form)return;const type=form.querySelector('[name=asiType]:checked').value;form.querySelector('#asi-single-fields').style.display=type==='single'?'block':'none';form.querySelector('#asi-double-fields').style.display=type==='double'?'block':'none'}
function applyASI(formEl,data,fl){if(!formEl)return false;const cur={};['str','dex','con','int','wis','cha'].forEach(k=>{cur[k]=num(formEl.querySelector('[name='+k+']').value,10)});
  if(data.asiType==='single'){const stat=data.asiSingleStat;if(!stat){showToast('Выберите характеристику','fail');return false}if(cur[stat]>=20){showToast(STAT_NAMES[stat]+' уже 20','fail');return false}const gain=Math.min(2,20-cur[stat]);formEl.querySelector('[name='+stat+']').value=cur[stat]+gain;if(!formEl._asiHistory)formEl._asiHistory=[];formEl._asiHistory.push({level:fl,type:'single',stat:stat,amount:gain});updateStatMods(formEl);updateHPHint(formEl);updateASIStatus(formEl);showToast(STAT_NAMES[stat]+' +'+gain,'success');return true}
  else{const s1=data.asiStat1,s2=data.asiStat2;if(!s1||!s2){showToast('Выберите обе','fail');return false}if(s1===s2){showToast('Разные','fail');return false}const c1=cur[s1],c2=cur[s2];if(c1>=20&&c2>=20){showToast('Обе уже 20','fail');return false}const g1=Math.min(1,20-c1);const g2=Math.min(1,20-c2);if(g1>0)formEl.querySelector('[name='+s1+']').value=c1+g1;if(g2>0)formEl.querySelector('[name='+s2+']').value=c2+g2;if(!formEl._asiHistory)formEl._asiHistory=[];formEl._asiHistory.push({level:fl,type:'double',stats:[s1,s2],amounts:[g1,g2]});updateStatMods(formEl);updateHPHint(formEl);updateASIStatus(formEl);showToast(STAT_NAMES[s1]+' +'+g1+', '+STAT_NAMES[s2]+' +'+g2,'success');return true}}

function renderFighterEquipmentHTML(){const weaponOpts=MARTIAL_WEAPONS.map(k=>'<option value="'+esc(k)+'">'+esc(k)+'</option>').join('');
  let html='<details class="starting-equipment" open><summary>Стартовое снаряжение Воина</summary><div class="equip-body">';
  html+='<div class="equip-group"><span class="equip-group-label">Доспех</span>';
  html+='<label class="equip-option"><input type="radio" name="fighter_armor" value="chainmail" checked onchange="onFighterEquipChange(this)"><span>Кольчуга</span></label>';
  html+='<label class="equip-option"><input type="radio" name="fighter_armor" value="leather_bow" onchange="onFighterEquipChange(this)"><span>Кожаный доспех, длинный лук и 20 стрел</span></label></div>';
  html+='<div class="equip-group"><span class="equip-group-label">Оружие</span>';
  html+='<label class="equip-option"><input type="radio" name="fighter_weapon1" value="martial_shield" checked onchange="onFighterEquipChange(this)"><span>Воинское оружие и щит</span></label>';
  html+='<div data-weapon-single style="margin:6px 0 8px 20px"><select name="fighter_w1a" onchange="onFighterEquipChange(this)">'+weaponOpts+'</select></div>';
  html+='<label class="equip-option"><input type="radio" name="fighter_weapon1" value="two_martial" onchange="onFighterEquipChange(this)"><span>Два воинских оружия</span></label>';
  html+='<div data-weapon-double style="margin:6px 0 8px 20px;display:none;grid-template-columns:1fr 1fr;gap:6px"><select name="fighter_w1b" onchange="onFighterEquipChange(this)">'+weaponOpts+'</select><select name="fighter_w1c" onchange="onFighterEquipChange(this)">'+weaponOpts+'</select></div></div>';
  html+='<div class="equip-group"><span class="equip-group-label">Доп. оружие</span>';
  html+='<label class="equip-option"><input type="radio" name="fighter_weapon2" value="crossbow" checked onchange="onFighterEquipChange(this)"><span>Лёгкий арбалет и 20 болтов</span></label>';
  html+='<label class="equip-option"><input type="radio" name="fighter_weapon2" value="handaxes" onchange="onFighterEquipChange(this)"><span>Два ручных топора</span></label></div>';
  const dun=PACKS_DB['Набор исследователя подземелий'].items.map(i=>i.name+(i.qty?' ×'+i.qty:'')).join(', ');
  const expl=PACKS_DB['Набор путешественника'].items.map(i=>i.name+(i.qty?' ×'+i.qty:'')).join(', ');
  html+='<div class="equip-group"><span class="equip-group-label">Набор</span>';
  html+='<label class="equip-option"><input type="radio" name="fighter_pack" value="dungeoneer" checked onchange="onFighterEquipChange(this)"><span>Набор исследователя подземелий</span></label>';
  html+='<div class="pack-contents">Включает: '+esc(dun)+'</div>';
  html+='<label class="equip-option"><input type="radio" name="fighter_pack" value="explorer" onchange="onFighterEquipChange(this)"><span>Набор путешественника</span></label>';
  html+='<div class="pack-contents">Включает: '+esc(expl)+'</div></div>';
  html+='<label class="equip-option gold-opt"><input type="checkbox" id="fighter_gold_alt" onchange="onFighterEquipChange(this)"><span>Взять 5к4 × 10 зм вместо снаряжения</span></label>';
  html+='<div style="margin-top:12px;font-size:12px;color:var(--text-dim);font-style:italic">Снаряжение добавится автоматически при сохранении.</div>';
  html+='</div></details>';
  return html}
function collectFighterStartingItems(formEl){if(!formEl||!hasClass(formEl,'fighter'))return[];const gold=formEl.querySelector('#fighter_gold_alt');if(gold&&gold.checked)return[];const items=[];
  const armor=formEl.querySelector('input[name="fighter_armor"]:checked');if(armor){if(armor.value==='chainmail')items.push({name:'Кольчуга'});else{items.push({name:'Кожаный доспех'});items.push({name:'Длинный лук'});items.push({name:'Стрелы',qty:20})}}
  const w1=formEl.querySelector('input[name="fighter_weapon1"]:checked');if(w1){if(w1.value==='martial_shield'){const w=formEl.querySelector('select[name="fighter_w1a"]');if(w&&w.value)items.push({name:w.value});items.push({name:'Щит'})}else if(w1.value==='two_martial'){const wb=formEl.querySelector('select[name="fighter_w1b"]');const wc=formEl.querySelector('select[name="fighter_w1c"]');if(wb&&wb.value)items.push({name:wb.value});if(wc&&wc.value)items.push({name:wc.value})}}
  const w2=formEl.querySelector('input[name="fighter_weapon2"]:checked');if(w2){if(w2.value==='crossbow'){items.push({name:'Арбалет, лёгкий'});items.push({name:'Болты',qty:20})}else{items.push({name:'Ручной топор'});items.push({name:'Ручной топор'})}}
  const pack=formEl.querySelector('input[name="fighter_pack"]:checked');if(pack){const pn=pack.value==='dungeoneer'?'Набор исследователя подземелий':'Набор путешественника';expandPack(pn).forEach(p=>items.push({name:p.name,qty:p.qty||1}))}
  return items}
function rebuildFighterStartingEquipment(formEl){if(!formEl)return;pendingInventory=pendingInventory.filter(it=>it.fromClass!=='fighter');pendingGold=0;if(!hasClass(formEl,'fighter')){renderPendingInventoryPreview();return}
  const gold=formEl.querySelector('#fighter_gold_alt');if(gold&&gold.checked){let t=0;for(let i=0;i<5;i++)t+=Math.floor(Math.random()*4)+1;pendingGold=t*10;renderPendingInventoryPreview();return}
  const items=collectFighterStartingItems(formEl);items.forEach(it=>{const b=buildItemFromName(it.name,it.qty||1,null,it.note||'');b.fromClass='fighter';pendingInventory.push(b)});renderPendingInventoryPreview()}
function renderPendingInventoryPreview(){const el=document.getElementById('pending-inv-preview');if(!el)return;if(!pendingInventory.length&&!pendingGold){el.innerHTML='';return}
  let html='<div style="margin-top:12px;padding:10px 14px;background:rgba(0,0,0,.22);border:1px solid var(--border-soft);border-radius:8px">';
  html+='<div style="font-family:Cinzel,serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:8px">Будет добавлено'+(pendingGold?' (+'+pendingGold+' зм)':'')+'</div>';
  if(pendingGold)html+='<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px"><span>💰 Золото</span><span style="color:var(--gold-bright)">'+pendingGold+' зм</span></div>';
  html+=pendingInventory.map((it,i)=>{const w=(it.qty*it.weight).toFixed(1);return'<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;border-bottom:1px solid rgba(255,255,255,.04)"><span>'+esc(it.name)+(it.qty>1?' × '+it.qty:'')+' <span style="color:var(--text-dim);font-size:11px">('+w+' фнт)</span></span><button type="button" style="background:transparent;border:none;color:var(--text-dim);cursor:pointer;font-size:12px" onclick="pendingInventory.splice('+i+',1);renderPendingInventoryPreview()">✕</button></div>'}).join('');
  html+='</div>';el.innerHTML=html}

function characterForm(c){c=normalizeCharacter(c);const worldOpts=state.worlds.map(w=>'<option value="'+w.id+'" '+(c.worldId===w.id?'selected':'')+'>'+esc(w.name)+'</option>').join('');
  const classRows=c.classes.map(cl=>classRowHTML(cl)).join('');
  const stats=[['str','СИЛ'],['dex','ЛОВ'],['con','ТЕЛ'],['int','ИНТ'],['wis','МДР'],['cha','ХАР']];
  const resRows=(c.resources.length?c.resources:[]).map(r=>resEditRowHTML(r)).join('');
  const slotFields=Array.from({length:9},(_,i)=>{const lvl=i+1;const s=c.spellSlots[lvl]||{max:0};return'<div class="slot-field"><span>'+lvl+'</span><input type="number" min="0" name="slot-'+lvl+'" value="'+(s.max||0)+'"></div>'}).join('');
  const saveHTML=['str','dex','con','int','wis','cha'].map(k=>{const m=calcModWithProf(c,k,!!c.saveProf[k]);return'<label class="save-item '+(c.saveProf[k]?'owned':'')+'"><input type="checkbox" name="save-'+k+'" '+(c.saveProf[k]?'checked':'')+'><span class="nm">'+STAT_NAMES[k]+'</span><span class="mod-val">'+fmt(m)+'</span></label>'}).join('');
  const skillHTML=SKILLS.map(s=>{const m=calcModWithProf(c,s.stat,!!c.skillProf[s.key],s.key);return'<label class="skill-item '+(c.skillProf[s.key]?'owned':'')+'" data-skill-row="'+s.key+'"><input type="checkbox" name="skill-'+s.key+'" '+(c.skillProf[s.key]?'checked':'')+' onchange="setTimeout(function(){window._forceUpdateSkillHint&&window._forceUpdateSkillHint()},10)"><span class="nm">'+s.name+' <span class="st">('+STAT_SHORT[s.stat]+')</span></span><span class="mod-val">'+fmt(m)+'</span></label>'}).join('');
  const isCustomBg=c.background&&BACKGROUNDS.indexOf(c.background)===-1;

  return '<h4 class="form-h">Основное</h4><div class="form-grid">'+
    '<div class="avatar-edit"><div class="avatar-preview" id="avatar-preview"></div><div class="avatar-controls"><button type="button" class="avatar-upload-btn" onclick="document.getElementById(\'avatar-file\').click()">Загрузить</button><button type="button" class="avatar-upload-btn remove" onclick="clearAvatar()">Убрать</button><input type="file" id="avatar-file" accept="image/*" hidden><input type="hidden" name="avatar" id="avatar-value" value="'+esc(c.avatar)+'"></div></div>'+
    '<label>Имя<input name="name" required autofocus value="'+esc(c.name)+'" placeholder="Имя"></label>'+
    '<label>Мир<select name="worldId"><option value="">— Не привязан —</option>'+worldOpts+'</select></label>'+
    '<label>Раса<input name="race" value="'+esc(c.race)+'" placeholder="Раса"></label>'+
    '<label>Мировоззрение<input name="alignment" value="'+esc(c.alignment)+'" placeholder="Мировоззрение"></label>'+
    '<label>Предыстория<select name="background" onchange="onBackgroundChange(this)"><option value="">— Не выбрано —</option>'+BACKGROUNDS.map(b=>'<option value="'+b+'" '+(c.background===b?'selected':'')+'>'+b+'</option>').join('')+'<option value="__custom__" '+(isCustomBg?'selected':'')+'>Свой</option></select></label>'+
    '<label id="background-custom-wrap" style="display:'+(isCustomBg?'flex':'none')+'">Своя предыстория<input name="backgroundCustom" value="'+(isCustomBg?esc(c.background):'')+'" placeholder="Название"></label>'+
    '<div id="bg-choices-wrap" style="display:'+(hasBgChoices(c.background)?'block':'none')+'">'+renderBackgroundChoicesHTML(c.background,c.backgroundChoices)+'</div>'+
    '<label>Опыт<input type="number" name="xp" min="0" value="'+c.xp+'"></label>'+
    '<label class="full" style="flex-direction:row;align-items:center;gap:10px;text-transform:none;letter-spacing:0;font-family:\'EB Garamond\',serif;font-size:15px;color:var(--text)"><input type="checkbox" name="inspiration" '+(c.inspiration?'checked':'')+' style="width:auto;accent-color:var(--gold);cursor:pointer"><span>✨ Вдохновение</span></label></div>'+

    '<h4 class="form-h">Классы и уровни</h4><div id="classes-rows">'+classRows+'</div><button type="button" class="add-row-btn" onclick="addClassRow()">+ Добавить класс</button><div class="class-total" id="class-total"></div><div id="fighter-multiclass-hint" style="display:none"></div>'+
    '<div id="fighter-fighting-style-wrap" style="display:none"><h4 class="form-h">Боевой стиль (Воин 1 ур.)</h4><div class="form-grid"><label class="full">Выберите стиль<select name="fightingStyle">'+FIGHTING_STYLES.map(fs=>'<option value="'+fs.key+'" '+((c.fightingStyle||'')===fs.key?'selected':'')+'>'+fs.name+'</option>').join('')+'</select></label></div><div class="fighting-style-info" id="fighting-style-desc"></div></div>'+
    '<div id="fighter-archetype-wrap" style="display:none"><h4 class="form-h">Воинский архетип (Воин 3 ур.)</h4><div class="form-grid"><label class="full">Выберите архетип<select name="fighterArchetype" onchange="updateFighterArchetypeDesc(this.form);updateManeuversSection(this.form)">'+FIGHTER_ARCHETYPES.map(a=>'<option value="'+a.key+'" '+((c.fighterArchetype||'')===a.key?'selected':'')+'>'+a.name+'</option>').join('')+'</select></label></div><div class="fighting-style-info" id="fighter-archetype-desc"></div></div>'+
    '<div id="fighter-tool-wrap" style="display:none"><h4 class="form-h">Ученик войны (Мастер боевых искусств 3 ур.)</h4><div class="class-hint" style="font-style:normal">Вы осваиваете владение одним ремесленным инструментом на ваш выбор.</div><div class="form-grid"><label class="full">Ремесленный инструмент<select name="fighterTool"><option value="">— не выбран —</option>'+ARTISAN_TOOLS.map(t=>'<option value="'+t+'" '+(c.toolProf===t?'selected':'')+'>'+t+'</option>').join('')+'</select></label></div></div>'+
    '<input type="hidden" name="fighterASIHistoryData" value="'+esc(JSON.stringify(c.fighterASIHistory||[]))+'">'+
    '<div id="fighter-asi-wrap" style="display:none"><h4 class="form-h">Увеличение характеристик (Воин)</h4><div class="class-hint" id="fighter-asi-status"></div><button type="button" class="btn btn-gold" id="fighter-asi-btn" onclick="openASIModal()">Применить повышение</button><div id="fighter-asi-history-list" style="margin-top:10px;font-size:13px;color:var(--text-dim)"></div></div>'+
    '<div id="fighter-maneuvers-wrap" style="display:none"><h4 class="form-h">Приёмы (Мастер боевых искусств)</h4><div class="class-hint" id="fighter-maneuvers-count"></div><div class="class-hint" id="fighter-maneuvers-dc"></div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-bottom:10px">'+MANEUVERS.map(m=>'<label class="skill-item" data-maneuver-row="'+m.key+'"><input type="checkbox" data-maneuver-cb value="'+m.key+'" '+(c.maneuvers&&c.maneuvers.indexOf(m.key)!==-1?'checked':'')+' onchange="updateManeuversSection(this.form)"><span class="nm">'+m.name+'</span></label>').join('')+'</div></div>'+

    '<h4 class="form-h">Характеристики</h4><div class="stats-grid">'+stats.map(([k,l])=>'<label class="stat-field"><span>'+l+'</span><input type="number" name="'+k+'" min="1" max="30" value="'+(c[k]||10)+'" oninput="updateStatMods(this.form)"><small class="stat-mod" data-mod-for="'+k+'">'+mod(c[k]||10)+'</small></label>').join('')+'</div>'+
    '<h4 class="form-h">Спасброски</h4><div class="save-grid">'+saveHTML+'</div>'+
    '<h4 class="form-h">Навыки</h4><div class="class-hint" id="skill-hint" style="display:none"></div><div class="skill-grid">'+skillHTML+'</div>'+
    '<h4 class="form-h">ХП и защита</h4><div class="hp-hint" id="hp-hint"></div><div class="form-grid" style="margin-top:12px"><label>Скорость (фт)<input type="number" name="speed" value="'+(c.speed||30)+'"></label></div>'+
    '<div id="slots-wrapper"><h4 class="form-h">Ячейки заклинаний (макс.)</h4><div class="slots-grid">'+slotFields+'</div></div>'+
    '<h4 class="form-h">Классовые ресурсы</h4><div id="res-rows">'+resRows+'</div><button type="button" class="add-row-btn" onclick="addResRow()">+ Ресурс</button>'+
    '<h4 class="form-h">Монеты</h4><div class="coins-grid"><div class="coin-field"><span>ЗМ</span><input type="number" name="coins_gp" min="0" value="'+c.coins.gp+'"></div><div class="coin-field"><span>СМ</span><input type="number" name="coins_sp" min="0" value="'+c.coins.sp+'"></div><div class="coin-field"><span>ММ</span><input type="number" name="coins_cp" min="0" value="'+c.coins.cp+'"></div><div class="coin-field"><span>ПМ</span><input type="number" name="coins_pp" min="0" value="'+c.coins.pp+'"></div><div class="coin-field"><span>ЭМ</span><input type="number" name="coins_ep" min="0" value="'+c.coins.ep+'"></div></div>'+
    '<div id="fighter-equipment-wrapper"></div><div id="pending-inv-preview"></div>'+
    '<h4 class="form-h">Умения и особенности</h4><div class="form-grid"><label class="full">Умения<textarea name="features" rows="3">'+esc(c.features)+'</textarea></label><label class="full">Черты<textarea name="traits" rows="2">'+esc(c.traits)+'</textarea></label><label class="full">Владения<textarea name="proficiencies" rows="2">'+esc(c.proficiencies)+'</textarea></label><label class="full">Языки<textarea name="languages" rows="2">'+esc(c.languages)+'</textarea></label></div>'+
    '<h4 class="form-h">Внешность и заметки</h4><div class="form-grid"><label class="full">Внешность<textarea name="appearance" rows="2">'+esc(c.appearance)+'</textarea></label><label class="full">Заметки<textarea name="notes" rows="3">'+esc(c.notes)+'</textarea></label></div>'}

function resEditRowHTML(r){r=r||{name:'',max:0,resetOn:'long'};return'<div class="res-edit-row" data-res-row><input type="text" name="res-name" placeholder="Название" value="'+esc(r.name)+'"><input type="number" name="res-max" min="0" value="'+r.max+'"><select name="res-reset"><option value="long" '+(r.resetOn==='long'?'selected':'')+'>Долгий</option><option value="short" '+(r.resetOn==='short'?'selected':'')+'>Короткий</option></select><button type="button" onclick="this.parentElement.remove()">✕</button></div>'}
function addResRow(){document.getElementById('res-rows').insertAdjacentHTML('beforeend',resEditRowHTML())}
function collectResources(formEl,base){const rows=formEl.querySelectorAll('[data-res-row]');const items=[];rows.forEach(row=>{const name=(row.querySelector('[name=res-name]').value||'').trim();if(!name)return;const max=num(row.querySelector('[name=res-max]').value,0);const resetOn=row.querySelector('[name=res-reset]').value;let used=0;if(base&&Array.isArray(base.resources)){const old=base.resources.find(r=>r.name===name);if(old)used=Math.min(num(old.used,0),max)}items.push({name,max,used,resetOn})});return items}
function collectSlots(formEl,base){const slots={};for(let lvl=1;lvl<=9;lvl++){const max=num(formEl.querySelector('[name=slot-'+lvl+']').value,0);let used=0;if(base&&base.spellSlots&&base.spellSlots[lvl])used=Math.min(num(base.spellSlots[lvl].used,0),max);slots[lvl]={max,used}}return slots}

function newCharacter(){currentEditMode=false;pendingInventory=[];pendingGold=0;openModal('Новый персонаж',characterForm({}),(data,formEl)=>saveCharacter(data,null,formEl),{wide:true,onOpen:characterFormOnOpen})}
function editCharacter(id){const c=state.characters.find(x=>x.id===id);if(!c)return;currentEditMode=true;pendingInventory=[];pendingGold=0;openModal('Редактировать персонажа',characterForm(c),(data,formEl)=>saveCharacter(data,id,formEl),{wide:true,onOpen:characterFormOnOpen})}

function saveCharacter(data,id,formEl){const base=id?state.characters.find(x=>x.id===id):null;
  const saveProf={};['str','dex','con','int','wis','cha'].forEach(k=>{saveProf[k]=data['save-'+k]==='on'});
  const skillProf={};SKILLS.forEach(s=>{skillProf[s.key]=data['skill-'+s.key]==='on'});
  const classes=collectClasses(formEl);const totalLevel=classes.reduce((s,cl)=>s+cl.level,0);
  if(classes.length===0||totalLevel<1){showToast('Нужен класс с уровнем ≥ 1','fail');return false}
  if(totalLevel>20){showToast('Общий уровень ≤ 20','fail');return false}
  const hasFighterMC=classes.length>1&&classes.some(cl=>cl.key==='fighter');
  if(hasFighterMC){const mcStr=num(data.str,10);const mcDex=num(data.dex,10);if(mcStr<13&&mcDex<13){if(!confirm('Мультикласс с Воином требует СИЛ или ЛОВ ≥ 13.\n\nВсё равно сохранить?'))return false}}
  const oldRolls=base?(base.hpRolls||[]):[];const hpRolls=[];let rIdx=0;let first=true;
  for(const cl of classes){const die=getClassDie(cl.key);for(let lvl=1;lvl<=cl.level;lvl++){const ex=oldRolls[rIdx];if(ex&&rIdx<oldRolls.length){if(ex.die===die)hpRolls.push({die,roll:ex.roll,isMax:first});else hpRolls.push({die,roll:Math.floor(Math.random()*die)+1,isMax:first})}else{if(first)hpRolls.push({die,roll:die,isMax:true});else hpRolls.push({die,roll:Math.floor(Math.random()*die)+1,isMax:false})}rIdx++;first=false}}
  const conMod=modNum(num(data.con,10));const newMaxHP=calcMaxHP(hpRolls,conMod);
  let hpCur;if(!base)hpCur=newMaxHP;else{const oldMax=num(base.hpMax,newMaxHP);const diff=newMaxHP-oldMax;let cur=num(base.hpCur,newMaxHP);if(cur>0)cur=Math.min(newMaxHP,cur+Math.max(0,diff));if(cur<-newMaxHP)cur=-newMaxHP;hpCur=cur}
  const oldSpent=base?(base.hitDiceSpent||{}):{};const hitDiceSpent={};classes.forEach(cl=>{hitDiceSpent[cl.key]=Math.max(0,Math.min(cl.level,num(oldSpent[cl.key],0)))});
  let deathSaves=base&&base.deathSaves?base.deathSaves:{successes:0,failures:0};if(hpCur>0)deathSaves={successes:0,failures:0};
  const className=classes.map(cl=>getClassName(cl)).join(' / ');
  let bgName=(data.background||'').trim();if(bgName==='__custom__')bgName=(data.backgroundCustom||'').trim();
  const char=normalizeCharacter({
    id:id||uid(),name:(data.name||'').trim()||'Безымянный',worldId:data.worldId||'',race:(data.race||'').trim(),class:className,classes,hpRolls,level:totalLevel,
    alignment:(data.alignment||'').trim(),background:bgName,backgroundChoices:collectBackgroundChoices(formEl),avatar:data.avatar||'',speed:num(data.speed,30),ac:10,hpMax:newMaxHP,hpCur,hpTemp:base?num(base.hpTemp,0):0,
    str:num(data.str,10),dex:num(data.dex,10),con:num(data.con,10),int:num(data.int,10),wis:num(data.wis,10),cha:num(data.cha,10),
    saveProf,skillProf,inventory:id?(base&&base.inventory?base.inventory.map(function(x){return Object.assign({},x)}):[]):pendingInventory.slice(),
    coins:{gp:num(data.coins_gp,0)+(id?0:pendingGold),sp:num(data.coins_sp,0),cp:num(data.coins_cp,0),pp:num(data.coins_pp,0),ep:num(data.coins_ep,0)},
    property:(base?base.property:[]),
    servants:(base?base.servants:[]),
    transports:(base&&Array.isArray(base.transports)?base.transports:[]),
    _merchantTransportsInit:(base?base._merchantTransportsInit:false),
    _knightServantsInit:(base?base._knightServantsInit:false),
    features:(data.features||'').trim(),traits:(data.traits||'').trim(),proficiencies:(data.proficiencies||'').trim(),languages:(data.languages||'').trim(),
    appearance:(data.appearance||'').trim(),notes:(data.notes||'').trim(),spellSlots:collectSlots(formEl,base),resources:collectResources(formEl,base),
    inspiration:data.inspiration==='on',fightingStyle:data.fightingStyle||'',fightingStyle2:(base?base.fightingStyle2||'':''),fighterArchetype:data.fighterArchetype||'',fighterASIHistory:(formEl&&formEl._asiHistory)?formEl._asiHistory:[],maneuvers:collectManeuvers(formEl),toolProf:data.fighterTool||'',versatilityDone:base?(base.versatilityDone||false):false,deathSaves,hitDiceSpent,xp:num(data.xp,0)
  });
  syncFighterResources(char);
  applyBackgroundChoicesToInventory(char,base);
  if(!base){const bgDef=BACKGROUNDS_DB[char.background];if(bgDef&&bgDef.coins&&bgDef.coins.gp)char.coins.gp+=bgDef.coins.gp}
  if(id){const i=state.characters.findIndex(x=>x.id===id);if(i>-1)state.characters[i]=char}else state.characters.push(char);
  save();renderAll();return true}

function characterFormOnOpen(formEl){initAvatarForm();attachSkillLiveUpdate(formEl);attachHPHintUpdate(formEl);attachMulticlassHintUpdate(formEl);updateStatMods(formEl);formEl.dataset.classesSnapshot=JSON.stringify(collectClasses(formEl));
  try{const hd=formEl.querySelector('[name=fighterASIHistoryData]');formEl._asiHistory=hd?JSON.parse(hd.value||'[]'):[]}catch(e){formEl._asiHistory=[]}
  const wrap=formEl.querySelector('#fighter-equipment-wrapper');if(wrap&&hasClass(formEl,'fighter')&&!currentEditMode)wrap.innerHTML=renderFighterEquipmentHTML();
  applyFighterDefaults(formEl);highlightClassSkills(formEl);if(hasClass(formEl,'fighter'))syncClassSaves(formEl,[]);
  updateSlotVisibility(formEl);updateFighterWeaponDisplay(formEl);updateFighterMulticlassHint(formEl);updateFightingStyleVisibility(formEl);updateFightingStyleDesc(formEl);updateFighterArchetypeVisibility(formEl);updateFighterArchetypeDesc(formEl);updateFighterToolVisibility(formEl);updateASIStatus(formEl);updateManeuversSection(formEl);
  const fsSel=formEl.querySelector('[name=fightingStyle]');if(fsSel){fsSel.addEventListener('change',function(){updateFightingStyleDesc(formEl)})}
  if(!currentEditMode&&hasClass(formEl,'fighter'))rebuildFighterStartingEquipment(formEl);
  const bgS=formEl.querySelector('[name=background]');const bgN=bgS?bgS.value:'';markBackgroundSkills(formEl,bgN);attachBgChoiceHandlers(formEl,bgN);
  if(bgN){applyBackgroundProficiencies(formEl,bgN);updateSkillHint(formEl)}}

function updateStatMods(formEl){if(!formEl)return;['str','dex','con','int','wis','cha'].forEach(k=>{const inp=formEl.querySelector('[name="'+k+'"]');const el=formEl.querySelector('[data-mod-for="'+k+'"]');if(inp&&el)el.textContent=mod(num(inp.value,10))});if(typeof updateHPHint==='function')updateHPHint(formEl);if(typeof updateManeuversSection==='function')updateManeuversSection(formEl)}
function attachSkillLiveUpdate(formEl){function update(){SKILLS.forEach(function(s){const cb=formEl.querySelector('[name=skill-'+s.key+']');if(!cb)return;const row=cb.closest('.skill-item');const valEl=row.querySelector('.mod-val');const m=calcModWithProfForm(formEl,s.stat,cb.checked,s.key);if(valEl)valEl.textContent=fmt(m);row.classList.toggle('owned',cb.checked)});['str','dex','con','int','wis','cha'].forEach(function(k){const cb=formEl.querySelector('[name=save-'+k+']');if(!cb)return;const row=cb.closest('.save-item');const valEl=row.querySelector('.mod-val');const m=calcModWithProfForm(formEl,k,cb.checked);if(valEl)valEl.textContent=fmt(m);row.classList.toggle('owned',cb.checked)});if(typeof updateSkillHint==='function')updateSkillHint(formEl)}formEl.addEventListener('input',update);formEl.addEventListener('change',update);update()}
function attachHPHintUpdate(formEl){['level','con'].forEach(name=>{const el=formEl.querySelector('[name='+name+']');if(el){el.addEventListener('input',()=>updateHPHint(formEl));el.addEventListener('change',()=>updateHPHint(formEl))}});updateHPHint(formEl);updateTotalLevel(formEl)}
function attachMulticlassHintUpdate(formEl){if(!formEl)return;['str','dex'].forEach(k=>{const inp=formEl.querySelector('[name='+k+']');if(inp)inp.addEventListener('input',()=>updateFighterMulticlassHint(formEl))})}
window._forceUpdateSkillHint=function(){const form=document.getElementById('modal-form');if(form)updateSkillHint(form)}

function openCharView(id){const c=findChar(id);if(!c)return;const _isBattlemasterView=(c.fighterArchetype==='battlemaster');const wn=worldName(c.worldId);const pb=profBonus(c.level);
  const savesHTML=['str','dex','con','int','wis','cha'].map(k=>{const m=calcModWithProf(c,k,!!c.saveProf[k]);return'<div class="view-list-item" onclick="rollSaveCheck(\''+c.id+'\',\''+k+'\')"><span class="nm '+(c.saveProf[k]?'owned':'')+'">'+STAT_NAMES[k]+'</span><span class="val">'+fmt(m)+'</span></div>'}).join('');
  const skillsHTML=SKILLS.map(s=>{const m=calcModWithProf(c,s.stat,!!c.skillProf[s.key],s.key);return'<div class="view-list-item" onclick="rollSkillCheck(\''+c.id+'\',\''+s.key+'\')"><span class="nm '+(c.skillProf[s.key]?'owned':'')+'">'+s.name+' ('+STAT_SHORT[s.stat]+')</span><span class="val">'+fmt(m)+'</span></div>'}).join('');
  const _isChampionView=(c.fighterArchetype||'').toLowerCase().indexOf('champion')>=0||(c.fighterArchetype||'').toLowerCase().indexOf('чемпион')>=0;
  const _flView=getFighterLevel(c);
  const statsHTML=['str','dex','con','int','wis','cha'].map(k=>{
    const isAth=_isChampionView&&_flView>=7&&(k==='str'||k==='dex'||k==='con');
    const halfPB=Math.ceil(profBonus(c.level)/2);
    return '<div class="view-stat" onclick="rollCheck(\''+c.id+'\',\''+k+'\')"><div class="lbl">'+STAT_NAMES[k]+'</div><div class="val">'+c[k]+'</div><div class="mod">'+mod(c[k])+(isAth?' <span style="color:var(--success);font-size:10px;font-weight:600" title="Выдающийся атлет: +'+halfPB+' к проверкам без владения">(+'+halfPB+')</span>':'')+'</div></div>';
  }).join('');
  const classesHTML=c.classes.map(cl=>{const def=getClassDef(cl.key);const die=def?def.hitDie:8;const spent=Math.min(cl.level,num(c.hitDiceSpent[cl.key],0));const avail=cl.level-spent;return'<div class="view-row"><span class="key">'+esc(getClassName(cl))+' '+cl.level+'</span><span class="val">'+avail+'/'+cl.level+' × d'+die+'</span></div>'}).join('');
  const hdHTML='<div class="view-section"><h3>Классы и кости хитов</h3>'+classesHTML+'</div>';
  const xpNext=nextLevelXp(c.level);const xpCur=xpForLevel(c.level);const xpProg=xpNext?Math.min(100,Math.max(0,((c.xp-xpCur)/(xpNext-xpCur))*100)):100;
  const xpHTML='<div class="view-section"><h3>Опыт</h3><div class="xp-row"><span>'+c.xp+' опыта'+(xpNext?' / '+xpNext:'')+'</span><span>Уровень '+c.level+'</span></div><div class="xp-bar"><div class="xp-fill" style="width:'+xpProg+'%"></div></div></div>';
  const invHTML=c.inventory.length?'<details class="view-section" open><summary style="font-family:Cinzel,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid var(--border-soft);cursor:pointer;list-style:none">🎒 Инвентарь ('+c.inventory.length+')</summary>'+c.inventory.map(i=>'<div class="view-row"><span class="key">'+esc(i.name)+(i.qty>1?' × '+i.qty:'')+(i.equipped&&(i.itemType==='armor'||i.itemType==='shield'||i.itemType==='weapon')?' [надет]':'')+'</span><span class="val">'+(i.qty*i.weight).toFixed(1)+' фнт</span></div>').join('')+'<div class="view-row" style="border-top:1px solid var(--border-soft);margin-top:6px;padding-top:8px"><span class="key">Вес / грузоподъёмность</span><span class="val">'+c.inventory.reduce((s,i)=>s+i.qty*i.weight,0).toFixed(1)+' / '+c.str*15+' фнт</span></div></details>':'';
  const coins=[];if(c.coins.gp)coins.push('ЗМ '+c.coins.gp);if(c.coins.sp)coins.push('СМ '+c.coins.sp);if(c.coins.cp)coins.push('ММ '+c.coins.cp);
  const fs=(c.fightingStyle?FIGHTING_STYLES.find(x=>x.key===c.fightingStyle):null);
  const fs2=(c.fightingStyle2?FIGHTING_STYLES.find(x=>x.key===c.fightingStyle2):null);
  const arch=(c.fighterArchetype?FIGHTER_ARCHETYPES.find(x=>x.key===c.fighterArchetype):null);
  const atkCount=getFighterAttacks(c);
  
  // Блок для Мистического рыцаря
  const _isEK = c.fighterArchetype === 'eldritch';
  const _ekLvl = getFighterLevel(c);
  const ekHTML = _isEK && _ekLvl >= 3 && typeof ELDRITCH_KNIGHT_TABLE !== 'undefined' ? (function() {
        const row = ELDRITCH_KNIGHT_TABLE[_ekLvl];
        if (!row) return '';
        return '<div class="view-section"><h3>Магия Мистического рыцаря</h3>' +
            '<div class="view-row"><span class="key">Заговоры (известно)</span><span class="val">' + row.cantrips + '</span></div>' +
            '<div class="view-row"><span class="key">Заклинания (известно)</span><span class="val">' + row.spells + '</span></div>' +
            '<div class="view-row"><span class="key">Баз. характеристика</span><span class="val">ИНТ</span></div>' +
            '<div class="view-text" style="margin-top:8px;font-size:13px;font-style:italic">Ячейки заклинаний настраиваются автоматически (до 4 уровня).</div>' +
            '</div>';
    })() : '';

  const body='<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:20px">'+avatarHTML(c,72)+'<div style="flex:1"><h3 style="font-family:Cinzel,serif;font-size:22px;color:var(--gold-bright);letter-spacing:1px;margin-bottom:4px">'+esc(c.name)+(c.inspiration?' ✨':'')+'</h3><div style="font-style:italic;color:var(--text-dim);font-size:15px">'+esc(c.race||'—')+' · '+formatClasses(c)+' · '+c.level+' ур.</div>'+(wn?'<div class="tag" style="margin-top:8px">'+esc(wn)+'</div>':'')+'</div></div>'+
    '<div class="view-section" style="display:flex;gap:14px;flex-wrap:wrap"><div><b style="color:var(--gold)">КД</b> '+calcAC(c)+'</div><div><b style="color:var(--gold)">ХП</b> '+c.hpCur+'/'+c.hpMax+(c.hpTemp>0?' (+'+c.hpTemp+')':'')+'</div><div><b style="color:var(--gold)">Скорость</b> '+getEffectiveSpeed(c)+' фт</div><div><b style="color:var(--gold)">БМ</b> '+fmt(pb)+'</div><div><b style="color:var(--gold)">Инициатива</b> '+fmt(modNum(c.dex))+'</div>'+(atkCount>1?'<div><b style="color:var(--gold)">Атак за действие</b> '+atkCount+'</div>':'')+'</div>'+
    getBackgroundSectionHTML(c)+
    getPropertySectionHTML(c)+
    getServantsSectionHTML(c)+
    getTransportsSectionHTML(c)+
    '<div class="view-section"><h3>Характеристики (клик — бросок)</h3><div class="view-stats">'+statsHTML+'</div></div>'+
    '<div class="view-section"><h3>Спасброски</h3><div class="view-list">'+savesHTML+'</div></div>'+
    '<div class="view-section"><h3>Навыки</h3><div class="view-list">'+skillsHTML+'</div></div>'+
        hdHTML+xpHTML+
    ekHTML+
    renderEldritchKnightSpellsBlockInner(c)+
    (((fs&&fs.name)||(fs2&&fs2.name))?'<div class="view-section"><h3>Боевой стиль</h3>'+((fs&&fs.name)?'<div style="font-family:Cinzel,serif;color:var(--gold-bright);font-size:14px;margin-bottom:6px">'+esc(fs.name)+'</div><div class="view-text" style="margin-bottom:12px">'+esc(fs.desc||'')+'</div>':'')+((fs2&&fs2.name)?'<div style="font-family:Cinzel,serif;color:var(--gold-bright);font-size:14px;margin-bottom:6px">'+esc(fs2.name)+'</div><div class="view-text">'+esc(fs2.desc||'')+'</div>':'')+'</div>':'')+
    (_isBattlemasterView&&getFighterLevel(c)>=7?'<div class="view-section"><h3>Познай своего врага</h3><div class="view-text">7-й уровень: 1 минута изучения существа вне боя — Мастер сообщает, равняется ли оно, превосходит или уступает вам в двух характеристиках на ваш выбор.</div></div>':'')+
    (c.toolProf?'<div class="view-section"><h3>Ученик войны</h3><div style="font-family:Cinzel,serif;color:var(--gold-bright);font-size:14px">Владение: '+esc(c.toolProf)+'</div></div>':'')+
    (arch&&arch.name&&arch.key!==''?'<div class="view-section"><h3>Воинский архетип</h3><div style="font-family:Cinzel,serif;color:var(--gold-bright);font-size:14px;margin-bottom:6px">'+esc(arch.name)+'</div><div class="view-text">'+esc(arch.desc||'')+'</div></div>':'')+
    invHTML+
    (coins.length?'<div class="view-section"><h3>Монеты</h3><div>'+coins.join(' · ')+'</div></div>':'')+
    (c.features?'<div class="view-section"><h3>Умения</h3><div class="view-text">'+esc(c.features)+'</div></div>':'')+
    (c.notes?'<div class="view-section"><h3>Заметки</h3><div class="view-text">'+esc(c.notes)+'</div></div>':'');
  openModal(c.name,body,null,{noForm:true,wide:true,onOpen:()=>{const m=overlay.querySelector('.modal');if(m){const f=document.createElement('div');f.className='modal-footer';f.innerHTML='<button class="btn btn-ghost" onclick="closeModal()">Закрыть</button><button class="btn btn-ghost" onclick="addCharToInitiativeFromView(\''+c.id+'\')">⚔ В инициативу</button><button class="btn btn-gold" onclick="closeModal();editCharacter(\''+c.id+'\')">Редактировать</button>';m.appendChild(f)}}})}

// --- ИНВЕНТАРЬ ---
function toggleEquipped(charId,idx){const c=findChar(charId);if(!c)return;const it=c.inventory[idx];if(!it)return;if(!isEquippable(it.name))return;it.equipped=!it.equipped;if(it.itemType==='armor'&&it.equipped){c.inventory.forEach((x,i)=>{if(i!==idx&&x.itemType==='armor')x.equipped=false})}save();renderAll()}
function openInventoryModal(id){
  const c=findChar(id);if(!c)return;
  const totalW=c.inventory.reduce((s,i)=>s+i.qty*i.weight,0);
  const cap=calcCarryCapacity(c);
  
  let listHTML = '';
  if (c.inventory.length) {
    listHTML = c.inventory.map((it, idx) => {
      const eq = it.equipped && (it.itemType === 'armor' || it.itemType === 'shield' || it.itemType === 'weapon');
      const equippable = it.itemType === 'armor' || it.itemType === 'shield' || it.itemType === 'weapon';
      
      let info = '';
      if (it.itemType === 'armor') {
        info = 'КД ' + it.ac + (it.acType === 'light' ? ' + ЛОВ' : it.acType === 'medium' ? ' + ЛОВ (макс 2)' : '');
      } else if (it.itemType === 'shield') {
        info = '+2 КД';
      } else if (it.itemType === 'weapon' && it.damage) {
        info = it.damage + ' ' + (it.damageType || '');
      }
      
      if (it.broken) {
        info = '💔 СЛОМАНО · ' + info;
      } else if (it.hpMax > 0 && it.hpCur < it.hpMax) {
        info += ' · Прочность ' + it.hpCur + '/' + it.hpMax;
      }

      return '<div style="display:grid;grid-template-columns:auto 1fr auto auto auto;gap:8px;align-items:center;padding:10px 12px;background:rgba(0,0,0,.22);border:1px solid ' + (eq ? 'var(--gold-dim)' : 'var(--border-soft)') + ';border-radius:6px;margin-bottom:6px"><button class="icon-btn" style="width:30px;height:30px;font-size:16px;' + (equippable ? 'color:' + (eq ? 'var(--gold-bright)' : 'var(--text-dim)') : 'opacity:.3;cursor:not-allowed') + '" onclick="event.stopPropagation();' + (equippable ? 'toggleEquippedAndRefresh(\'' + c.id + '\',' + idx + ')' : '') + '" ' + (equippable ? '' : 'disabled') + '>' + (eq ? '✓' : '○') + '</button><div><div style="font-family:Cinzel,serif;color:var(--gold-bright);font-size:14px">' + esc(it.name) + (it.qty > 1 ? ' × ' + it.qty : '') + '</div>' + (info ? '<div style="font-size:12px;color:var(--text-dim);font-style:italic;margin-top:2px">' + esc(info) + '</div>' : '') + '</div><div style="font-family:Cinzel,serif;font-size:12px;color:var(--text-dim);white-space:nowrap">' + (it.qty * it.weight).toFixed(1) + ' фнт</div>' + (it.qty > 1 ? '<button class="icon-btn" onclick="event.stopPropagation();changeItemQty(\'' + c.id + '\',' + idx + ',-1)" title="−1">−1</button>' : '<span></span>') + '<button class="icon-btn danger" onclick="event.stopPropagation();removeInvItemAndRefresh(\'' + c.id + '\',' + idx + ')">✕</button></div>';
    }).join('');
  } else {
    listHTML = '<div class="empty">Инвентарь пуст</div>';
  }

  const body = '<div style="margin-bottom:16px;padding:10px 14px;background:' + (totalW > cap ? 'rgba(176,74,58,.15)' : 'rgba(201,162,39,.08)') + ';border:1px solid ' + (totalW > cap ? 'var(--danger)' : 'var(--gold-dim)') + ';border-radius:8px;font-family:Cinzel,serif;font-size:13px;color:var(--text-dim);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><span>Вес: <b style="color:' + (totalW > cap ? 'var(--danger-bright)' : 'var(--gold-bright)') + ';font-size:16px">' + totalW.toFixed(1) + '</b> / ' + cap.toFixed(0) + ' фнт' + (totalW > cap ? ' ⚠' : '') + '</span><span>Предметов: <b style="color:var(--gold-bright);font-size:16px">' + c.inventory.length + '</b></span></div>' +
    '<div id="inv-modal-list">' + listHTML + '</div>' +
    '<div style="margin-top:20px;padding:16px;background:rgba(0,0,0,.22);border:1px solid var(--gold-dim);border-radius:8px"><h4 style="font-family:Cinzel,serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:12px">Добавить предмет</h4>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px"><label style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim)">Категория<select id="inv-category" style="margin-top:4px"><option value="weapon">Оружие</option><option value="armor">Броня и щиты</option><option value="consumable">Расходники</option><option value="magic">Магические</option><option value="pack">Наборы</option><option value="tools">Инструменты</option><option value="custom">Свой предмет</option></select></label><label id="inv-item-select-wrap" style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim)">Предмет<select id="inv-item-select" style="margin-top:4px"></select></label></div>' +
    '<div id="inv-custom-fields" style="display:none;grid-template-columns:1fr 100px 100px;gap:8px;margin-bottom:10px"><label style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim)">Название<input type="text" id="inv-custom-name" placeholder="Свой предмет" style="margin-top:4px"></label><label style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim)">Вес<input type="number" id="inv-custom-weight" value="0" min="0" step="0.01" style="margin-top:4px"></label><label style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim)">Кол-во<input type="number" id="inv-custom-qty" value="1" min="1" style="margin-top:4px"></label></div>' +
    '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label id="inv-qty-wrap" style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim);display:flex;align-items:center;gap:6px">Кол-во: <input type="number" id="inv-add-qty" value="1" min="1" style="width:70px"></label><button class="btn btn-gold" onclick="addItemToInventory(\'' + c.id + '\')">+ Добавить</button></div></div>';

  openModal('🎒 Инвентарь — ' + c.name, body, null, {
    noForm: true,
    wide: true,
    onOpen: function() {
      updateInvCategoryList();
      const s = document.getElementById('inv-category');
      if (s) s.addEventListener('change', updateInvCategoryList);
    }
  });
}
const INV_CATS={consumable:['Стрелы','Болты','Снаряды для пращи','Зелье лечения','Противоядие','Алхимический огонь','Кислота','Святая вода','Рационы (1 день)','Факел','Масло (фляга)','Свеча','Бурдюк','Мешок','Верёвка пеньковая (50 футов)'],magic:['Волшебная палочка','Жезл','Кристалл','Посох','Сфера','Книга заклинаний']};
function updateInvCategoryList(){const cat=document.getElementById('inv-category').value;const sel=document.getElementById('inv-item-select');const wrap=document.getElementById('inv-item-select-wrap');const cf=document.getElementById('inv-custom-fields');const qw=document.getElementById('inv-qty-wrap');if(!sel)return;
  if(cat==='custom'){wrap.style.display='none';cf.style.display='grid';if(qw)qw.style.display='none';return}
  wrap.style.display='block';cf.style.display='none';if(qw)qw.style.display='flex';
  let items=[];if(cat==='weapon')items=Object.keys(W_DB).sort();else if(cat==='armor')items=Object.keys(A_DB).sort().concat(['Щит']);else if(cat==='consumable')items=INV_CATS.consumable;else if(cat==='magic')items=INV_CATS.magic;else if(cat==='pack')items=Object.keys(PACKS_DB);else if(cat==='tools')items=Object.keys(TOOLS_DB).sort();
  sel.innerHTML=items.map(i=>'<option value="'+esc(i)+'">'+esc(i)+'</option>').join('')}
function addItemToInventory(charId){const c=findChar(charId);if(!c)return;const cat=document.getElementById('inv-category').value;let itemsToAdd=[];
  if(cat==='custom'){const n=(document.getElementById('inv-custom-name').value||'').trim();if(!n){showToast('Введите название','fail');return}const w=parseFloat(document.getElementById('inv-custom-weight').value)||0;const q=num(document.getElementById('inv-custom-qty').value,1);itemsToAdd.push(buildItemFromName(n,q,w))}
  else{const name=document.getElementById('inv-item-select').value;if(!name)return;const q=num(document.getElementById('inv-add-qty').value,1);if(cat==='pack'){expandPack(name).forEach(e=>{e.qty=(e.qty||1)*q;itemsToAdd.push(e)})}else{itemsToAdd.push(buildItemFromName(name,q))}}
  itemsToAdd.forEach(it=>c.inventory.push(it));save();renderAll();showToast('Добавлено: '+itemsToAdd.length,'success');setTimeout(()=>openInventoryModal(charId),50)}
function changeItemQty(charId,idx,delta){const c=findChar(charId);if(!c)return;const it=c.inventory[idx];if(!it)return;it.qty=Math.max(0,it.qty+delta);if(it.qty<=0)c.inventory.splice(idx,1);save();renderAll();setTimeout(()=>openInventoryModal(charId),50)}
function removeInvItemAndRefresh(charId,idx){const c=findChar(charId);if(!c)return;if(!confirm('Удалить «'+c.inventory[idx].name+'»?'))return;c.inventory.splice(idx,1);save();renderAll();setTimeout(()=>openInventoryModal(charId),50)}
function toggleEquippedAndRefresh(charId,idx){toggleEquipped(charId,idx);setTimeout(()=>openInventoryModal(charId),50)}

// --- КОМБАТ, ХП, ОТДЫХ ---
function renderHPInner(c){
  const neg=c.hpCur<0;
  const isChamp = (c.fighterArchetype||'').toLowerCase().indexOf('champion')>=0;
  const fl = getFighterLevel(c);
  const canSurv = isChamp && fl >= 18 && c.hpCur > 0 && c.hpCur <= Math.floor(c.hpMax / 2);
  const survAmt = 5 + modNum(c.con);
  const survBtn = canSurv ? '<button class="hp-btn heal" style="background:rgba(126,200,126,.2);border-color:var(--success)" onclick="event.stopPropagation();useSurvivor(\''+c.id+'\')">🩹 Уцелевший (+'+survAmt+')</button>' : '';
  return'<div class="hp-line"><span class="hp-cur '+(neg?'negative':'')+'">'+c.hpCur+'</span><span class="hp-max">/ '+c.hpMax+'</span><button class="hp-btn dmg" onclick="event.stopPropagation();applyDamage(\''+c.id+'\',5)">−5</button><button class="hp-btn dmg" onclick="event.stopPropagation();applyDamage(\''+c.id+'\',1)">−1</button><button class="hp-btn heal" onclick="event.stopPropagation();applyHeal(\''+c.id+'\',1)">+1</button><button class="hp-btn heal" onclick="event.stopPropagation();applyHeal(\''+c.id+'\',5)">+5</button><button class="hp-btn" onclick="event.stopPropagation();promptDamage(\''+c.id+'\')">Урон</button><button class="hp-btn" onclick="event.stopPropagation();promptHeal(\''+c.id+'\')">Лечить</button><button class="hp-btn utility" onclick="event.stopPropagation();setTempHP(\''+c.id+'\')">ВрХП</button>'+survBtn+'</div>'+(c.hpTemp>0?'<div class="temp-hp">🛡 Временные ХП: '+c.hpTemp+'</div>':'')
}
function applyDamage(id,amount){const c=findChar(id);if(!c||amount<=0)return;let rem=amount;let msg='';if(c.hpTemp>0){const abs=Math.min(c.hpTemp,rem);c.hpTemp-=abs;rem-=abs}
  if(rem>0){c.hpCur-=rem;if(c.hpCur<=-c.hpMax){c.hpCur=-c.hpMax;c.deathSaves={successes:0,failures:3};msg=c.name+' МГНОВЕННО УМИРАЕТ!'}else if(c.hpCur<0){msg=c.name+': '+amount+' урона. ХП = '+c.hpCur+'/'+c.hpMax}else if(c.hpCur===0){msg=c.name+': '+amount+' урона. ХП = 0 — спасброски'}else{msg=c.name+': '+amount+' урона. ХП = '+c.hpCur+'/'+c.hpMax}}else{msg=c.name+': '+amount+' урона (поглощено временными)'}
  save();renderAll();showToast(msg,c.hpCur<=-c.hpMax?'crit-fail':(rem>0&&c.hpCur<=0?'fail':''))}
function applyHeal(id,amount){const c=findChar(id);if(!c||amount<=0)return;const wasZero=c.hpCur<=0;c.hpCur=Math.min(c.hpMax,c.hpCur+amount);if(c.hpCur>0&&wasZero){c.deathSaves={successes:0,failures:0};showToast(c.name+': +'+amount+' ХП. Очнулся','success')}else{showToast(c.name+': +'+amount+' ХП','success')}save();renderAll()}
function promptDamage(id){const a=prompt('Урон?','10');if(a===null)return;const n=parseInt(a,10);if(isNaN(n)||n<=0)return;applyDamage(id,n)}
function promptHeal(id){const a=prompt('Лечение?','10');if(a===null)return;const n=parseInt(a,10);if(isNaN(n)||n<=0)return;applyHeal(id,n)}
function setTempHP(id){const c=findChar(id);if(!c)return;const a=prompt('Временные ХП? (0 — убрать)',c.hpTemp||0);if(a===null)return;const n=parseInt(a,10);if(isNaN(n)||n<0)return;c.hpTemp=n;save();renderAll();showToast(c.name+': временные ХП = '+n,'success')}
function changeDeathSave(id,type,delta){const c=findChar(id);if(!c)return;c.deathSaves[type]=Math.max(0,Math.min(3,c.deathSaves[type]+delta));save();renderAll()}
function rollDeathSave(id){const c=findChar(id);if(!c)return;const r=Math.floor(Math.random()*20)+1;if(r===20){c.deathSaves.successes=Math.min(3,c.deathSaves.successes+2);showToast(c.name+': 20! Два успеха','crit-success')}else if(r===1){c.deathSaves.failures=Math.min(3,c.deathSaves.failures+2);showToast(c.name+': 1 — двойной провал','crit-fail')}else if(r>=10){c.deathSaves.successes=Math.min(3,c.deathSaves.successes+1);showToast(c.name+': '+r+' — успех','success')}else{c.deathSaves.failures=Math.min(3,c.deathSaves.failures+1);showToast(c.name+': '+r+' — провал','fail')}
  if(c.deathSaves.failures>=3)showToast(c.name+' умирает','crit-fail');else if(c.deathSaves.successes>=3)showToast(c.name+' стабилизирован','success');save();renderAll()}
function toggleInspiration(id){const c=findChar(id);if(!c)return;c.inspiration=!c.inspiration;save();renderAll();showToast(c.name+': вдохновение '+(c.inspiration?'получено':'потрачено'),c.inspiration?'success':'')}

function openShortRest(id){const c=findChar(id);if(!c)return;c.resources.forEach(r=>{if(r.resetOn==='short')r.used=0});save();const conMod=modNum(c.con);const conSign=conMod>=0?'+'+conMod:''+conMod;
  const diceList=c.classes.map(cl=>{const die=getClassDie(cl.key);const spent=Math.min(cl.level,num(c.hitDiceSpent[cl.key],0));const avail=cl.level-spent;return{die,total:cl.level,spent,avail,name:getClassName(cl),key:cl.key}});
  const body='<div class="short-rest-info"><div class="sub">Короткий отдых (1 час)</div><div class="hp-line-big">ХП: <b>'+c.hpCur+'</b> / '+c.hpMax+'</div>'+diceList.map(d=>'<div class="dice-choice"><div class="dc-name">'+esc(d.name)+' — d'+d.die+'</div><div class="dc-count">Доступно: <b>'+d.avail+'</b> / '+d.total+'</div><button class="btn btn-gold" onclick="shortRestSpendDie(\''+c.id+'\',\''+d.key+'\')" '+(d.avail<=0?'disabled':'')+'>Потратить d'+d.die+' '+conSign+'</button></div>').join('')+'</div>';
  openModal('Короткий отдых',body,null,{noForm:true})}
function shortRestSpendDie(id,classKey){const c=findChar(id);if(!c)return;const cl=c.classes.find(x=>x.key===classKey);if(!cl){showToast('Класс не найден','fail');return}const spent=num(c.hitDiceSpent[classKey],0);if(spent>=cl.level){showToast('Нет костей','fail');return}const die=getClassDie(classKey);const roll=Math.floor(Math.random()*die)+1;const conMod=modNum(c.con);const heal=Math.max(1,roll+conMod);const before=c.hpCur;c.hpCur=Math.min(c.hpMax,c.hpCur+heal);const healed=c.hpCur-before;c.hitDiceSpent[classKey]=spent+1;if(c.hpCur>0&&c.deathSaves&&(c.deathSaves.successes||c.deathSaves.failures))c.deathSaves={successes:0,failures:0};const conSign=conMod>=0?'+'+conMod:''+conMod;showToast(c.name+': d'+die+'('+roll+') '+conSign+' = +'+healed+' ХП','success');save();renderAll();openShortRest(id)}
function getLongRestStatus(c){const H=60*60*1000;const now=Date.now();const last=num(c.lastLongRest,0);if(!last)return{available:true,label:'Отдых'};const e=now-last;if(e>=24*H)return{available:true,label:'Отдых'};const r=24*H-e;const h=Math.floor(r/H);const m=Math.floor((r%H)/60000);return{available:false,label:'Отдых через '+h+'ч '+m+'м'}}
function openLongRest(id){const c=findChar(id);if(!c)return;const H=60*60*1000;const now=Date.now();const last=num(c.lastLongRest,0);
  if(last>0&&(now-last)<24*H){const r=24*H-(now-last);const h=Math.floor(r/H);const m=Math.floor((r%H)/60000);if(!confirm(c.name+': нельзя получить преимущества от второго долгого отдыха в течение 24 часов.\nОсталось '+h+'ч '+m+'мин.\n\nМастер, разрешить отдых?'))return}
  let totalRec=0;const parts=[];c.classes.forEach(cl=>{const spent=Math.min(cl.level,num(c.hitDiceSpent[cl.key],0));const rec=Math.max(1,Math.floor(cl.level/2));const act=Math.min(rec,spent);totalRec+=act;if(act>0)parts.push(getClassName(cl)+': +'+act)});
  if(!confirm(c.name+': долгий отдых\n\n— ХП до '+c.hpMax+'\n— Все ресурсы и ячейки восстановятся\n— Костей: '+totalRec+(parts.length?'\n  '+parts.join(', '):'')+'\n\nПродолжить?'))return;
  c.hpCur=c.hpMax;c.hpTemp=0;c.deathSaves={successes:0,failures:0};c.resources.forEach(r=>r.used=0);Object.values(c.spellSlots).forEach(s=>s.used=0);
  c.classes.forEach(cl=>{const spent=Math.min(cl.level,num(c.hitDiceSpent[cl.key],0));const rec=Math.max(1,Math.floor(cl.level/2));c.hitDiceSpent[cl.key]=Math.max(0,spent-rec)});
  c.lastLongRest=now;save();renderAll();showToast(c.name+': долгий отдых. Всё восстановлено','success')}

// --- РЕСУРСЫ, ЯЧЕЙКИ, КОСТИ, ОПЫТ ---
function changeSlot(id,lvl,delta){const c=findChar(id);if(!c)return;const s=c.spellSlots[lvl];if(!s)return;s.used=Math.max(0,Math.min(s.max,s.used+delta));save();renderAll()}
function changeResource(id,idx,delta){const c=findChar(id);if(!c)return;const r=c.resources[idx];if(!r)return;r.used=Math.max(0,Math.min(r.max,r.used+delta));save();renderAll()}
function renderSlotsCompactInner(c){
  const groups=[];
  for(let lvl=1;lvl<=9;lvl++){
    const s=c.spellSlots[lvl];
    if(!s||s.max<=0)continue;
    const cur=s.max-s.used;
    let pips='';
    for(let i=0;i<s.max;i++){
      const filled=i<cur;
      pips+='<span class="slot-pip '+(filled?'filled':'')+'" onclick="event.stopPropagation();toggleSlotPip(\''+c.id+'\','+lvl+','+i+','+cur+')"></span>';
    }
    groups.push('<div class="slot-group"><span class="slot-lvl">'+lvl+'</span>'+pips+'</div>');
  }
  if(!groups.length)return'';
  return '<div class="slots-compact" onclick="event.stopPropagation()"><span class="slots-label">🔮 Ячейки</span>'+groups.join('')+'</div>';
}
function toggleSlotPip(charId,lvl,idx,cur){
  const c=findChar(charId);if(!c)return;
  if(idx<cur){ changeSlot(charId,lvl,1); } else { changeSlot(charId,lvl,-1); }
}
function renderResourcesInner(c){
  let html='';
  c.resources.forEach((r,idx)=>{
    if(!r.name||r.max<=0)return;
    const cur=r.max-r.used;
    const nm=(r.name||'').toLowerCase();
    let btn='';
    if(nm==='второе дыхание'){btn='<button class="sw-btn" onclick="event.stopPropagation();useSecondWind(\''+c.id+'\')" '+(cur<=0?'disabled':'')+'>💨 Использовать</button>'}
    else if(nm==='всплеск действий'){btn='<button class="sw-btn" onclick="event.stopPropagation();useActionSurge(\''+c.id+'\')" '+(cur<=0?'disabled':'')+'>⚡ Использовать</button>'}
    else if(nm==='упорный'){btn='<button class="sw-btn" onclick="event.stopPropagation();useIndomitable(\''+c.id+'\')" '+(cur<=0?'disabled':'')+'>🛡 Использовать</button>'}
    else if(nm==='кости превосходства'){btn='<button class="sw-btn" onclick="event.stopPropagation();openManeuverModal(\''+c.id+'\')" '+(cur<=0?'disabled':'')+'>⚔ Использовать</button>'}
    else if(nm==='спец. атака (метка)'){btn='<button class="sw-btn" onclick="event.stopPropagation();useCavalierMarkAttackCard(\''+c.id+'\')" '+(cur<=0?'disabled':'')+'>🎯 Атака</button>'}
    else if(nm==='защитный маневр'){btn='<button class="sw-btn" onclick="event.stopPropagation();useWardingManeuverCard(\''+c.id+'\')" '+(cur<=0?'disabled':'')+'>🛡 Маневр</button>'}
    
    // ИСПРАВЛЕНИЕ: теперь "−" ТРАТИТ заряд (used+1), а "+" ВОЗВРАЩАЕТ (used-1)
    html+='<div class="res-row"><span class="res-name">'+esc(r.name)+'</span>'+btn+'<button class="res-btn" onclick="event.stopPropagation();changeResource(\''+c.id+'\','+idx+',1)" title="Потратить">−</button><span class="res-val '+(cur===r.max?'full':(cur<=0?'empty':''))+'">'+cur+'/'+r.max+'</span><button class="res-btn" onclick="event.stopPropagation();changeResource(\''+c.id+'\','+idx+',-1)" title="Восстановить">+</button></div>'
  });
  
  // Добавляем кнопку Волшебного рывка для EK 15+ под остальными ресурсами
  if(c.fighterArchetype==='eldritch' && getFighterLevel(c)>=15){
    html+='<div class="res-row" style="margin-top:6px;border-top:1px dashed var(--border-soft);padding-top:8px"><span class="res-name" style="color:var(--gold-bright);width:100px">Рывок (15 ур.)</span><button class="sw-btn" style="width:100%" onclick="event.stopPropagation();showToast(\'Волшебный рывок: при использовании Всплеска действий вы можете телепортироваться на 30 футов.\',\'success\')">⚡ Телепорт (30 фт)</button></div>';
  }
  
  return html;
}
function renderDeathSavesInner(c){if(c.hpCur>0)return'';const ds=c.deathSaves;const succ=[0,1,2].map(i=>'<span class="ds-dot '+(i<ds.successes?'filled':'')+'">'+(i<ds.successes?'●':'○')+'</span>').join('');const fail=[0,1,2].map(i=>'<span class="ds-dot '+(i<ds.failures?'filled fail':'')+'">'+(i<ds.failures?'●':'○')+'</span>').join('');let status='';if(ds.failures>=3)status='<span style="color:var(--danger-bright);font-family:Cinzel,serif;font-size:12px;letter-spacing:2px">МЁРТВ</span>';else if(ds.successes>=3)status='<span style="color:var(--success);font-family:Cinzel,serif;font-size:12px;letter-spacing:2px">СТАБИЛЕН</span>';
  return'<div class="death-block" onclick="event.stopPropagation()"><div class="ds-row"><span>Успехи</span>'+succ+'<button class="res-btn" onclick="changeDeathSave(\''+c.id+'\',\'successes\',1)">+</button><button class="res-btn" onclick="changeDeathSave(\''+c.id+'\',\'successes\',-1)">−</button></div><div class="ds-row"><span>Провалы</span>'+fail+'<button class="res-btn" onclick="changeDeathSave(\''+c.id+'\',\'failures\',1)">+</button><button class="res-btn" onclick="changeDeathSave(\''+c.id+'\',\'failures\',-1)">−</button></div><button class="rest-btn" onclick="event.stopPropagation();rollDeathSave(\''+c.id+'\')">Бросок спасброска от смерти</button>'+(status?'<div style="text-align:center;margin-top:4px">'+status+'</div>':'')+'</div>'}
function renderHitDiceInner(c){const items=c.classes.map(cl=>{const die=getClassDie(cl.key);const spent=Math.min(cl.level,num(c.hitDiceSpent[cl.key],0));const avail=cl.level-spent;return'<div class="hd-item"><span class="hd-name">'+esc(getClassName(cl))+'</span> <span class="hd-val '+(avail===0?'empty':'')+'">'+avail+'/'+cl.level+'</span> <span class="hd-type">d'+die+'</span></div>'}).join('');const totalAvail=c.classes.reduce((s,cl)=>s+(cl.level-Math.min(cl.level,num(c.hitDiceSpent[cl.key],0))),0);
  return'<div class="hd-block" onclick="event.stopPropagation()"><div class="hd-header"><span class="hd-label">Кости хитов</span><span class="hd-hint">только на коротком отдыхе</span><button class="hd-btn" onclick="event.stopPropagation();openShortRest(\''+c.id+'\')" '+(totalAvail<=0?'disabled':'')+'>Короткий отдых</button></div><div class="hd-list">'+items+'</div></div>'}
function xpForLevel(l){return XP_THRESHOLDS[Math.max(0,Math.min(19,num(l,1)-1))]}
function nextLevelXp(l){const lv=num(l,1);return lv>=20?null:XP_THRESHOLDS[lv]}
function renderXPInner(c){const xpNext=nextLevelXp(c.level);const xpCur=xpForLevel(c.level);if(!xpNext)return'<div class="xp-row"><span><b>'+c.xp+'</b> опыта</span><span>Максимум</span></div><div class="xp-bar"><div class="xp-fill" style="width:100%"></div></div>';const prog=Math.min(100,Math.max(0,((c.xp-xpCur)/(xpNext-xpCur))*100));return'<div class="xp-row"><span><b>'+c.xp+'</b> / '+xpNext+' опыта</span><button class="xp-btn" onclick="event.stopPropagation();addXP(\''+c.id+'\')">+Опыт</button></div><div class="xp-bar"><div class="xp-fill" style="width:'+prog+'%"></div></div>'}
function addXP(id){const c=findChar(id);if(!c)return;const amt=prompt('Сколько опыта?','50');if(amt===null)return;const n=parseInt(amt,10);if(isNaN(n)||n===0)return;c.xp=Math.max(0,c.xp+n);save();renderAll();showToast(c.name+': '+(n>0?'+':'')+n+' опыта')}
function canLevelUp(c){if(!c||c.level>=20)return false;const t=nextLevelXp(c.level);return t!==null&&c.xp>=t}
function levelUpCharacter(id){const c=findChar(id);if(!c)return;if(!canLevelUp(c)){showToast('Недостаточно опыта','fail');return}const conMod=modNum(c.con);let chosen;if(c.classes.length===1){chosen=c.classes[0]}else{const opts=c.classes.map((cl,i)=>(i+1)+'. '+getClassName(cl)+' ('+cl.level+')').join('\n');const ans=prompt('Какой класс повысить?\n'+opts+'\n\nНомер:','1');if(ans===null)return;const idx=parseInt(ans,10)-1;if(isNaN(idx)||idx<0||idx>=c.classes.length){showToast('Неверный выбор','fail');return}chosen=c.classes[idx]}
  const die=getClassDie(chosen.key)||8;const roll=Math.floor(Math.random()*die)+1;const hpGain=Math.max(1,roll+conMod);c.hpRolls.push({die,roll,isMax:false});chosen.level+=1;c.level=c.classes.reduce((s,cl)=>s+cl.level,0);c.hpMax=calcMaxHP(c.hpRolls,conMod);c.hpCur=Math.min(c.hpMax,c.hpCur+hpGain);syncFighterResources(c);save();renderAll();const conStr=conMod>=0?'+'+conMod:''+conMod;showToast(c.name+': '+getClassName(chosen)+' → '+chosen.level+' ур. d'+die+'('+roll+') '+conStr+' = +'+hpGain+' ХП','success')}

// --- ВОИН (МАНЕВРЫ, АРХЕТИПЫ, РЕСУРСЫ) ---
function syncFighterResources(c){if(!c||!Array.isArray(c.resources))return;const fLvl=getFighterLevel(c);const findRes=function(name){return c.resources.find(r=>(r.name||'').toLowerCase()===name.toLowerCase())};
  const sw=findRes('Второе дыхание');if(fLvl>=1){if(sw){sw.max=1;sw.used=Math.min(sw.used||0,1);sw.resetOn='short'}else c.resources.push({name:'Второе дыхание',max:1,used:0,resetOn:'short'})}else if(sw){c.resources=c.resources.filter(r=>r!==sw)}
  const as=findRes('Всплеск действий');if(fLvl>=2){const maxAS=fLvl>=17?2:1;if(as){as.max=maxAS;as.used=Math.min(as.used||0,maxAS);as.resetOn='short'}else c.resources.push({name:'Всплеск действий',max:maxAS,used:0,resetOn:'short'})}else if(as){c.resources=c.resources.filter(r=>r!==as)}
  const ind=findRes('Упорный');if(fLvl>=9){const maxInd=fLvl>=17?3:(fLvl>=13?2:1);if(ind){ind.max=maxInd;ind.used=Math.min(ind.used||0,maxInd);ind.resetOn='long'}else c.resources.push({name:'Упорный',max:maxInd,used:0,resetOn:'long'})}else if(ind){c.resources=c.resources.filter(r=>r!==ind)}
  
  syncBattlemasterResources(c);
  syncEldritchKnightResources(c); // <--- ВОТ СЮДА
   // Кавалерист: Ресурсы
  const cavMark = c.resources.find(r=>(r.name||'').toLowerCase()==='спец. атака (метка)');
  if (c.fighterArchetype === 'cavalier' && fLvl >= 3) {
      const maxUses = Math.max(1, modNum(c.str));
      if (cavMark) { 
          cavMark.max = maxUses; 
          cavMark.used = Math.min(cavMark.used || 0, maxUses); 
          cavMark.resetOn = 'long'; 
      } else {
          c.resources.push({ name: 'Спец. атака (Метка)', max: maxUses, used: 0, resetOn: 'long' });
      }
  } else if (cavMark) {
      c.resources = c.resources.filter(r => r !== cavMark);
  }

  // Защитный маневр (7+)
  const warding = c.resources.find(r=>(r.name||'').toLowerCase()==='защитный маневр');
  if (c.fighterArchetype === 'cavalier' && fLvl >= 7) {
      const maxWarding = Math.max(1, modNum(c.con));
      if (warding) {
          warding.max = maxWarding;
          warding.used = Math.min(warding.used || 0, maxWarding);
          warding.resetOn = 'long';
      } else {
          c.resources.push({ name: 'Защитный маневр', max: maxWarding, used: 0, resetOn: 'long' });
      }
  } else if (warding) {
      c.resources = c.resources.filter(r => r !== warding);
  }
}
function syncBattlemasterResources(c){if(!c||!Array.isArray(c.resources))return;const fLvl=getFighterLevel(c);const isBM=c.fighterArchetype==='battlemaster';const findRes=function(name){return c.resources.find(r=>(r.name||'').toLowerCase()===name.toLowerCase())};const sd=findRes('Кости превосходства');if(isBM&&fLvl>=3){const maxSD=getSuperiorityDiceCount(fLvl);if(sd){sd.max=maxSD;sd.used=Math.min(sd.used||0,maxSD);sd.resetOn='short'}else c.resources.push({name:'Кости превосходства',max:maxSD,used:0,resetOn:'short'})}else if(sd){c.resources=c.resources.filter(r=>r!==sd)}}
function syncEldritchKnightResources(c) {
    if (!c || !Array.isArray(c.resources)) return;
    const fLvl = getFighterLevel(c);
    const isEK = c.fighterArchetype === 'eldritch';
    
    if (isEK && fLvl >= 3 && typeof ELDRITCH_KNIGHT_TABLE !== 'undefined') {
        const row = ELDRITCH_KNIGHT_TABLE[fLvl];
        if (row) {
            for (let i = 1; i <= 4; i++) {
                if (!c.spellSlots[i]) c.spellSlots[i] = { max: 0, used: 0 };
                c.spellSlots[i].max = row.slots[i - 1];
                if (c.spellSlots[i].used > c.spellSlots[i].max) {
                    c.spellSlots[i].used = c.spellSlots[i].max;
                }
            }
        }
    }
}
function useSecondWind(id){
  const c=findChar(id);if(!c)return;
  const sw=(c.resources||[]).find(r=>(r.name||'').toLowerCase()==='второе дыхание');
  if(!sw){showToast('Нет Второго дыхания','fail');return}
  if(sw.used>=sw.max){showToast('Уже использовано','fail');return}
  
  const fl=getFighterLevel(c);if(fl===0){showToast('Нет уровней Воина','fail');return}
  
  const roll=Math.floor(Math.random()*10)+1;
  const heal=Math.max(1,roll+fl);
  const before=c.hpCur;
  c.hpCur=Math.min(c.hpMax,c.hpCur+heal);
  const healed=c.hpCur-before;
  sw.used=sw.max;
  
  if(c.hpCur>0&&c.deathSaves&&(c.deathSaves.successes||c.deathSaves.failures))c.deathSaves={successes:0,failures:0};
  
  save();
  renderAll();
  
  let msg = c.name+': Второе дыхание! 1к10('+roll+') + '+fl+' = +'+healed+' ХП';
  
  // --- Сплочающий крик (Рыцарь Пурпурного Дракона) ---
  if(c.fighterArchetype === 'purple_dragon' && fl >= 3) {
    msg += ' | 📢 СПЛОЧАЮЩИЙ КРИК АКТИВЕН!';
    showToast(msg,'success');
    // Показываем второй тост для союзников, чтобы он точно бросился в глаза
    setTimeout(function() {
        showToast('📢 Сплочающий крик! Выберите до 3 союзников в 60 фт: каждый лечится на ' + fl + ' ХП.', 'success');
    }, 500);
  } else {
    showToast(msg,'success');
  }
}
function useActionSurge(id){
  var c=findChar(id);if(!c)return;
  var as=(c.resources||[]).find(r=>(r.name||'').toLowerCase()==='всплеск действий');
  if(!as){showToast('Нет Всплеска действий','fail');return}
  if(as.used>=as.max){showToast('Уже использовано — нужен отдых','fail');return}
  as.used+=1;
  
  var fl = getFighterLevel(c);
  var msg = c.name+': ⚡ Всплеск действий! Доп. действие. Осталось: '+(as.max-as.used)+'/'+as.max;
  
  // 15-й уровень: Волшебный рывок (Мистический рыцарь)
  if(c.fighterArchetype==='eldritch' && fl>=15){
    msg += ' (Доступен Волшебный рывок: телепорт на 30 фт!)';
  }
  
  save(); renderAll();
  showToast(msg,'success');

  // 10-й и 18-й уровень: Вдохновляющий всплеск (Рыцарь Пурпурного дракона)
  if(c.fighterArchetype==='purple_dragon' && fl>=10){
    var allyText = fl >= 18 ? 'двух союзников' : 'одного союзника';
    setTimeout(function() {
        showToast('📢 Вдохновляющий всплеск! Выберите ' + allyText + ' в 60 фт: они могут атаковать оружием реакцией.', 'success');
    }, 500); // Показываем чуть позже, чтобы не перекрывать первый тост
  }
}
function useIndomitable(id){
  var c=findChar(id);if(!c)return;
  var ind=(c.resources||[]).find(r=>(r.name||'').toLowerCase()==='упорный');
  if(!ind){showToast('Нет Упорного','fail');return}
  if(ind.used>=ind.max){showToast('Упорный уже использован','fail');return}
  
  var fl=getFighterLevel(c);
  var isPD=c.fighterArchetype==='purple_dragon';

  if(isPD && fl>=15){
    // Рыцарю Пурпурного дракона 15+ нужно выбрать спасбросок, чтобы проверить Оплот
    var html='<p style="margin-bottom:16px;color:var(--text-dim);font-size:15px">Какой спасбросок вы перебрасываете с помощью <b>Упорного</b>?</p>';
    html+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">';
    ['str','dex','con','int','wis','cha'].forEach(function(k){
      html+='<button class="btn btn-ghost" style="padding:10px" onclick="applyIndomitable(\''+c.id+'\',\''+k+'\')">'+STAT_NAMES[k]+'</button>';
    });
    html+='</div>';
    openModal('🛡 Упорный', html, null, {noForm:true});
  } else {
    // Для остальных просто тратим ресурс
    ind.used+=1;
    save(); renderAll();
    showToast(c.name+': 🛡 Упорный! Перебросьте спасбросок. Осталось: '+(ind.max-ind.used)+'/'+ind.max,'success');
  }
}

function applyIndomitable(id, statKey){
  var c=findChar(id);if(!c)return;
  var ind=(c.resources||[]).find(r=>(r.name||'').toLowerCase()==='упорный');
  if(!ind)return;

  ind.used+=1;
  save(); renderAll(); closeModal();

  var isMental = (statKey==='int' || statKey==='wis' || statKey==='cha');
  var statName = STAT_NAMES[statKey];

  showToast(c.name+': 🛡 Упорный! Перебросьте спасбросок '+statName+'. Осталось: '+(ind.max-ind.used)+'/'+ind.max, 'success');

  // 15-й уровень: Оплот срабатывает только на ИНТ, МДР, ХАР И если рыцарь не недееспособен (ХП > 0)
  if(c.fighterArchetype==='purple_dragon' && getFighterLevel(c)>=15 && isMental && c.hpCur > 0){
    setTimeout(function() {
        showToast('🛡 Оплот! Выберите союзника в 60 фт, провалившего спасбросок '+statName+', чтобы он перебросил его.', 'success');
    }, 500);
  }
}
function useManeuverDie(id,mKey){const c=findChar(id);if(!c)return;const sd=(c.resources||[]).find(r=>(r.name||'').toLowerCase()==='кости превосходства');if(!sd||sd.used>=sd.max){showToast('Нет костей превосходства','fail');return}sd.used+=1;const dieSize=getSuperiorityDieSize(getFighterLevel(c));const roll=Math.floor(Math.random()*dieSize)+1;const m=MANEUVERS.find(x=>x.key===mKey);const dc=getManeuverSaveDC(c);save();renderAll();const name=m?m.name:'Приём';let msg=c.name+': '+name+'! Кость d'+dieSize+'('+roll+')';if(m&&m.save){msg+='. Сл спасброска: '+dc}showToast(msg,'success')}
function openManeuverModal(id){const c=findChar(id);if(!c)return;const fLvl=getFighterLevel(c);if(c.fighterArchetype!=='battlemaster'||fLvl<3){showToast('Требуется Мастер 3+','fail');return}const sd=(c.resources||[]).find(r=>(r.name||'').toLowerCase()==='кости превосходства');if(!sd||sd.max<=0){showToast('Нет костей','fail');return}if(sd.used>=sd.max){showToast('Все кости потрачены','fail');return}const known=c.maneuvers||[];if(!known.length){showToast('Не выбраны приёмы','fail');return}const dc=getManeuverSaveDC(c);const dieSize=getSuperiorityDieSize(fLvl);let overlay=document.getElementById('maneuver-overlay');if(!overlay){overlay=document.createElement('div');overlay.id='maneuver-overlay';overlay.className='modal-overlay';overlay.style.zIndex='200';document.body.appendChild(overlay)}let btns='';known.forEach(function(k){const m=MANEUVERS.find(x=>x.key===k);if(!m)return;btns+='<div class="maneuver-pick" data-key="'+m.key+'"><div class="mp-name">'+m.name+'</div><div class="mp-desc">'+m.desc+'</div></div>'});overlay.innerHTML='<div class="modal"><div class="modal-header"><h2>Использовать приём</h2><button type="button" class="modal-close" onclick="closeManeuverModal()">X</button></div><div class="modal-body"><div style="margin-bottom:16px;padding:10px 14px;background:rgba(0,0,0,.22);border-left:2px solid var(--gold-dim);border-radius:0 6px 6px 0;font-size:13px;color:var(--text-dim)">Костей: <b style="color:var(--gold-bright)">'+(sd.max-sd.used)+' / '+sd.max+'</b> · Сл: <b style="color:var(--gold-bright)">'+dc+'</b> · Кость: d'+dieSize+'</div>'+btns+'</div></div>';overlay.querySelectorAll('.maneuver-pick').forEach(function(el){el.addEventListener('click',function(){const k=el.getAttribute('data-key');closeManeuverModal();useManeuverDie(id,k)})});overlay.classList.add('active')}
function closeManeuverModal(){const o=document.getElementById('maneuver-overlay');if(o){o.classList.remove('active');o.innerHTML=''}}
function restoreManeuverDieOnInitiative(c){if(!c||!c.classes)return false;const fl=getFighterLevel(c);if(c.fighterArchetype!=='battlemaster'||fl<15)return false;const sd=(c.resources||[]).find(r=>(r.name||'').toLowerCase()==='кости превосходства');if(!sd)return false;if(sd.used>=sd.max){sd.used=Math.max(0,sd.used-1);showToast(c.name+': 🎲 Неослабевающий! +1 кость при инициативе','success');return true}return false}
function openArchetypeModal(id){const c=findChar(id);if(!c)return;const fl=getFighterLevel(c);if(fl<3){showToast('Требуется Воин 3 ур.','fail');return}const opts=FIGHTER_ARCHETYPES.map(a=>'<option value="'+a.key+'" '+((c.fighterArchetype||'')===a.key?'selected':'')+'>'+a.name+'</option>').join('');let overlay=document.getElementById('arch-overlay');if(!overlay){overlay=document.createElement('div');overlay.id='arch-overlay';overlay.className='modal-overlay';overlay.style.zIndex='200';document.body.appendChild(overlay)}overlay.innerHTML='<div class="modal"><div class="modal-header"><h2>Воинский архетип</h2><button type="button" class="modal-close" onclick="closeArchModal()">X</button></div><form id="arch-form"><div class="modal-body"><p style="margin-bottom:16px;color:var(--text-dim);font-size:14px">3-й уровень Воина.</p><label>Выберите архетип<select name="archetype" style="margin-top:6px">'+opts+'</select></label><div class="fighting-style-info" id="arch-modal-desc" style="margin-top:12px"></div></div><div class="modal-footer"><button type="button" class="btn btn-ghost" onclick="closeArchModal()">Отмена</button><button type="submit" class="btn btn-gold">Сохранить</button></div></form></div>';overlay.classList.add('active');const sel=overlay.querySelector('[name=archetype]');const desc=overlay.querySelector('#arch-modal-desc');function upd(){const a=FIGHTER_ARCHETYPES.find(x=>x.key===sel.value);desc.innerHTML=a&&a.desc?'<b>'+esc(a.name)+':</b> '+esc(a.desc):''}sel.addEventListener('change',upd);upd();document.getElementById('arch-form').addEventListener('submit',function(e){e.preventDefault();c.fighterArchetype=sel.value;syncFighterResources(c);save();renderAll();closeArchModal();const a=FIGHTER_ARCHETYPES.find(x=>x.key===c.fighterArchetype);showToast('Архетип: '+(a?a.name:'—'),'success')})}
function closeArchModal(){const o=document.getElementById('arch-overlay');if(o){o.classList.remove('active');o.innerHTML=''}}
function openFighterToolModal(id){const c=findChar(id);if(!c)return;const fl=getFighterLevel(c);if(c.fighterArchetype!=='battlemaster'||fl<3){showToast('Требуется Мастер 3+','fail');return}const current=c.toolProf||'';let overlay=document.getElementById('fighter-tool-overlay');if(!overlay){overlay=document.createElement('div');overlay.id='fighter-tool-overlay';overlay.className='modal-overlay';overlay.style.zIndex='250';document.body.appendChild(overlay)}const opts=ARTISAN_TOOLS.map(t=>'<option value="'+t+'" '+(current===t?'selected':'')+'>'+t+'</option>').join('');overlay.innerHTML='<div class="modal"><div class="modal-header"><h2>Ученик войны</h2><button type="button" class="modal-close" onclick="closeFighterToolModal()">X</button></div><form id="fighter-tool-form"><div class="modal-body"><p style="margin-bottom:16px;color:var(--text-dim);font-size:14px"><b style="color:var(--gold-bright)">3-й уровень, умение мастера боевых искусств.</b> Вы осваиваете владение одним ремесленным инструментом на выбор.</p><label>Ремесленный инструмент<select name="tool" style="margin-top:6px"><option value="">— не выбран —</option>'+opts+'</select></label></div><div class="modal-footer"><button type="button" class="btn btn-ghost" onclick="closeFighterToolModal()">Отмена</button><button type="submit" class="btn btn-gold">Сохранить</button></div></form></div>';overlay.classList.add('active');document.getElementById('fighter-tool-form').addEventListener('submit',function(e){e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());c.toolProf=data.tool||'';save();renderAll();closeFighterToolModal();showToast('Ученик войны: '+(c.toolProf||'не выбран'),'success')})}
function closeFighterToolModal(){const o=document.getElementById('fighter-tool-overlay');if(o){o.classList.remove('active');o.innerHTML=''}}
function openKnowEnemyModal(id){const c=findChar(id);if(!c)return;const fl=getFighterLevel(c);if(c.fighterArchetype!=='battlemaster'||fl<7){showToast('Требуется Мастер 7+','fail');return}const items=[{name:'Сила',val:c.str+' ('+mod(c.str)+')'},{name:'Ловкость',val:c.dex+' ('+mod(c.dex)+')'},{name:'Телосложение',val:c.con+' ('+mod(c.con)+')'},{name:'Класс Доспеха',val:calcAC(c)},{name:'Текущие хиты',val:c.hpCur+'/'+c.hpMax},{name:'Общий уровень',val:c.level},{name:'Уровней Воина',val:fl}];let overlay=document.getElementById('know-enemy-overlay');if(!overlay){overlay=document.createElement('div');overlay.id='know-enemy-overlay';overlay.className='modal-overlay';overlay.style.zIndex='250';document.body.appendChild(overlay)}const rows=items.map(it=>'<div class="view-row" style="border-bottom:1px solid var(--border-soft)"><span class="key">'+it.name+'</span><span class="val">'+it.val+'</span></div>').join('');overlay.innerHTML='<div class="modal"><div class="modal-header"><h2>Познай своего врага</h2><button type="button" class="modal-close" onclick="closeKnowEnemyModal()">X</button></div><div class="modal-body"><p style="margin-bottom:16px;color:var(--text-dim);font-size:14px"><b style="color:var(--gold-bright)">7-й уровень, умение мастера боевых искусств.</b> Если вы потратите как минимум 1 минуту, взаимодействуя с существом вне боя, вы можете узнать информацию о его способностях. Мастер сообщит, равняется ли существо, превосходит или уступает вам в двух характеристиках на ваш выбор.</p><div style="padding:10px 14px;background:rgba(0,0,0,.22);border-left:2px solid var(--gold-dim);border-radius:0 6px 6px 0;margin-bottom:16px;font-size:13px;color:var(--text-dim);font-style:italic">Ваши значения для сравнения:</div>'+rows+'</div><div class="modal-footer"><button type="button" class="btn btn-gold" onclick="closeKnowEnemyModal()">Закрыть</button></div></div>';overlay.classList.add('active')}
function closeKnowEnemyModal(){const o=document.getElementById('know-enemy-overlay');if(o){o.classList.remove('active');o.innerHTML=''}}
function openChampionCritModal(){openModal('Улучшенные критические попадания','<div style="padding:8px 0"><div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:10px">3-й уровень, умение чемпиона</div><p style="font-size:16px;line-height:1.7">Ваши атаки оружием совершают критическое попадание при выпадении «19» или «20» на кости атаки.</p></div>',null,{noForm:true})}
function openChampionAthleteModal(){openModal('Выдающийся атлет','<div style="padding:8px 0"><div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:10px">7-й уровень, умение чемпиона</div><p style="font-size:16px;line-height:1.7;margin-bottom:10px">Вы можете добавлять половину бонуса мастерства, округлённую в большую сторону, ко всем проверкам Силы, Ловкости или Телосложения, куда этот бонус еще не включён.</p><p style="font-size:16px;line-height:1.7">Кроме того, если вы совершаете прыжок в длину с разбега, дальность прыжка увеличивается на количество футов, равное модификатору Силы.</p></div>',null,{noForm:true})}
function openChampionSecondStyleModal(id){const c=findChar(id);if(!c)return;const firstStyle=c.fightingStyle;const opts=FIGHTING_STYLES.filter(s=>s.key!==''&&s.key!==firstStyle);let h='<div class="modal"><div class="modal-header"><h2>Дополнительный боевой стиль</h2><button type="button" class="modal-close" onclick="closeModal()">X</button></div><form id="second-style-form"><div class="modal-body"><p style="margin-bottom:16px;color:var(--text-dim);font-size:14px">10-й уровень, умение чемпиона. Выберите второй боевой стиль (нельзя выбрать тот же, что и первый).</p><div style="display:flex;flex-direction:column;gap:6px">';opts.forEach(s=>{h+='<label class="skill-item" style="cursor:pointer;align-items:flex-start;padding:10px"><input type="radio" name="secondStyle" value="'+s.key+'" required style="margin-top:4px"><div style="flex:1"><div class="nm" style="color:var(--gold-bright);font-weight:600">'+s.name+'</div><div class="mp-desc" style="font-family:EB Garamond,serif;font-size:12px;text-transform:none;letter-spacing:0;margin-top:2px">'+s.desc+'</div></div></label>'});h+='</div></div><div class="modal-footer"><button type="button" class="btn btn-ghost" onclick="closeModal()">Отмена</button><button type="submit" class="btn btn-gold">Применить</button></div></form></div>';let overlay=document.getElementById('modal-overlay');overlay.innerHTML=h;overlay.classList.add('active');document.body.style.overflow='hidden';document.getElementById('second-style-form').addEventListener('submit',function(e){e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());if(!data.secondStyle){showToast('Выберите стиль','fail');return;}c.fightingStyle2=data.secondStyle;save();renderAll();closeModal();const s=FIGHTING_STYLES.find(x=>x.key===data.secondStyle);showToast('Дополнительный стиль: '+(s?s.name:'—'),'success')})}
function openChampionSuperiorCritModal(){openModal('Превосходные критические попадания','<div style="padding:8px 0"><div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:10px">15-й уровень, умение чемпиона</div><p style="font-size:16px;line-height:1.7">Ваши атаки оружием совершают критическое попадание при выпадении «18–20» на кости атаки.</p></div>',null,{noForm:true})}
function openCardASIModal(id){const c=findChar(id);if(!c)return;const fl=getFighterLevel(c);const total=getFighterASILevels(fl).length;const applied=(c.fighterASIHistory||[]).length;const available=total-applied;if(available<=0){showToast('Нет доступных повышений','fail');return}const cur={};['str','dex','con','int','wis','cha'].forEach(k=>{cur[k]=num(c[k],10)});const opts=['str','dex','con','int','wis','cha'].map(k=>{const dis=cur[k]>=20?'disabled':'';return'<option value="'+k+'" '+dis+'>'+STAT_NAMES[k]+' ('+cur[k]+')</option>'}).join('');let overlay=document.getElementById('card-asi-overlay');if(!overlay){overlay=document.createElement('div');overlay.id='card-asi-overlay';overlay.className='modal-overlay';overlay.style.zIndex='200';document.body.appendChild(overlay)}const lvls=getFighterASILevels(fl).join(', ');overlay.innerHTML='<div class="modal"><div class="modal-header"><h2>Увеличение характеристик</h2><button type="button" class="modal-close" onclick="closeCardASIModal()">X</button></div><form id="card-asi-form"><div class="modal-body"><p style="margin-bottom:16px;color:var(--text-dim);font-size:14px">Доступно: <b style="color:var(--gold-bright)">'+available+'</b> из '+total+' (уровни: '+lvls+')</p><div style="margin-bottom:16px;display:flex;flex-direction:column;gap:8px"><label style="flex-direction:row;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-family:EB Garamond,serif;font-size:15px"><input type="radio" name="asiType" value="single" checked onchange="onCardASIChange()"><span>+2 к одной</span></label><label style="flex-direction:row;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-family:EB Garamond,serif;font-size:15px"><input type="radio" name="asiType" value="double" onchange="onCardASIChange()"><span>+1 к двум</span></label></div><div id="card-asi-single"><label>Характеристика<select name="asiSingleStat">'+opts+'</select></label></div><div id="card-asi-double" style="display:none"><label>Первая<select name="asiStat1">'+opts+'</select></label><label style="margin-top:10px">Вторая<select name="asiStat2">'+opts+'</select></label></div></div><div class="modal-footer"><button type="button" class="btn btn-ghost" onclick="closeCardASIModal()">Отмена</button><button type="submit" class="btn btn-gold">Применить</button></div></form></div>';overlay.classList.add('active');document.getElementById('card-asi-form').addEventListener('submit',function(e){e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());if(applyCardASI(id,data)){const newApplied=(c.fighterASIHistory||[]).length;closeCardASIModal();if(newApplied<total){setTimeout(()=>openCardASIModal(id),150)}}})}
function closeCardASIModal(){const o=document.getElementById('card-asi-overlay');if(o){o.classList.remove('active');o.innerHTML=''}}
function onCardASIChange(){const form=document.getElementById('card-asi-form');if(!form)return;const type=form.querySelector('[name=asiType]:checked').value;form.querySelector('#card-asi-single').style.display=type==='single'?'block':'none';form.querySelector('#card-asi-double').style.display=type==='double'?'block':'none'}
function applyCardASI(id,data){const c=findChar(id);if(!c)return false;const fl=getFighterLevel(c);const cur={};['str','dex','con','int','wis','cha'].forEach(k=>{cur[k]=num(c[k],10)});if(data.asiType==='single'){const stat=data.asiSingleStat;if(!stat){showToast('Выберите','fail');return false}if(cur[stat]>=20){showToast('Уже 20','fail');return false}const gain=Math.min(2,20-cur[stat]);c[stat]=cur[stat]+gain;if(!c.fighterASIHistory)c.fighterASIHistory=[];c.fighterASIHistory.push({level:fl,type:'single',stat:stat,amount:gain});save();renderAll();showToast(STAT_NAMES[stat]+' +'+gain,'success');return true}else{const s1=data.asiStat1,s2=data.asiStat2;if(!s1||!s2){showToast('Выберите обе','fail');return false}if(s1===s2){showToast('Разные','fail');return false}const c1=cur[s1],c2=cur[s2];if(c1>=20&&c2>=20){showToast('Обе 20','fail');return false}const g1=Math.min(1,20-c1);const g2=Math.min(1,20-c2);if(g1>0)c[s1]=c1+g1;if(g2>0)c[s2]=c2+g2;if(!c.fighterASIHistory)c.fighterASIHistory=[];c.fighterASIHistory.push({level:fl,type:'double',stats:[s1,s2],amounts:[g1,g2]});save();renderAll();showToast(STAT_NAMES[s1]+' +'+g1+', '+STAT_NAMES[s2]+' +'+g2,'success');return true}}
function openManeuversPickerModal(id){const c=findChar(id);if(!c)return;const fl=getFighterLevel(c);if(c.fighterArchetype!=='battlemaster'||fl<3){showToast('Требуется Мастер 3+','fail');return}const max=getMaxManeuvers(fl);const current=(c.maneuvers||[]).slice();let overlay=document.getElementById('maneuvers-picker');if(!overlay){overlay=document.createElement('div');overlay.id='maneuvers-picker';overlay.className='modal-overlay';overlay.style.zIndex='250';document.body.appendChild(overlay)}const cbHtml=MANEUVERS.map(m=>{const checked=current.indexOf(m.key)!==-1?'checked':'';return'<label class="skill-item" style="margin-bottom:4px"><input type="checkbox" data-pick="'+m.key+'" '+checked+' onchange="updateManeuversPickerCount(\''+id+'\','+max+')"><span class="nm">'+m.name+(m.optional?' <span style="color:var(--text-dim);font-size:10px">(TCE)</span>':'')+'</span></label>'}).join('');const dc=getManeuverSaveDC(c);overlay.innerHTML='<div class="modal"><div class="modal-header"><h2>Выбор приёмов</h2><button type="button" class="modal-close" onclick="closeManeuversPickerModal()">X</button></div><div class="modal-body"><div style="margin-bottom:16px;padding:10px 14px;background:rgba(0,0,0,.22);border-left:2px solid var(--gold-dim);border-radius:0 6px 6px 0;font-size:13px;color:var(--text-dim)">Макс.: <b style="color:var(--gold-bright)">'+max+'</b> · Выбрано: <b id="mp-count" style="color:var(--gold-bright)">'+current.length+'</b> / '+max+' · Сл: <b style="color:var(--gold-bright)">'+dc+'</b></div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">'+cbHtml+'</div></div><div class="modal-footer"><button type="button" class="btn btn-ghost" onclick="closeManeuversPickerModal()">Отмена</button><button type="button" class="btn btn-gold" onclick="saveManeuversPicker(\''+id+'\','+max+')">Сохранить</button></div></div>';overlay.classList.add('active')}
function updateManeuversPickerCount(id,max){const overlay=document.getElementById('maneuvers-picker');if(!overlay)return;const checked=overlay.querySelectorAll('[data-pick]:checked').length;const el=document.getElementById('mp-count');if(el){el.textContent=checked;el.style.color=checked>max?'var(--danger-bright)':'var(--gold-bright)'}}
function saveManeuversPicker(id,max){const c=findChar(id);if(!c)return;const overlay=document.getElementById('maneuvers-picker');if(!overlay)return;const checked=[];overlay.querySelectorAll('[data-pick]:checked').forEach(cb=>{checked.push(cb.getAttribute('data-pick'))});if(checked.length>max){showToast('Выбрано больше '+max,'fail');return}c.maneuvers=checked;save();renderAll();closeManeuversPickerModal();showToast('Приёмы сохранены: '+checked.length+' / '+max,'success')}
function closeManeuversPickerModal(){const o=document.getElementById('maneuvers-picker');if(o){o.classList.remove('active');o.innerHTML=''}}
function openVersatilityModal(id){const c=findChar(id);if(!c){showToast('Не найден','fail');return}const fl=getFighterLevel(c);if(fl<4){showToast('Требуется Воин 4+','fail');return}if(c.versatilityDone){showToast('Уже применена','fail');return}const curStyle=c.fightingStyle||'';const isBM=c.fighterArchetype==='battlemaster';const styleOpts=FIGHTING_STYLES.filter(s=>s.key!==''&&s.key!==curStyle).map(s=>'<option value="'+s.key+'">'+s.name+'</option>').join('');let overlay=document.getElementById('versa-overlay');if(!overlay){overlay=document.createElement('div');overlay.id='versa-overlay';overlay.className='modal-overlay';overlay.style.zIndex='200';document.body.appendChild(overlay)}const curStyleName=curStyle?((FIGHTING_STYLES.find(s=>s.key===curStyle)||{}).name||'—'):'— не выбран —';const knownM=c.maneuvers||[];const knownOpts=knownM.map(k=>{const m=MANEUVERS.find(x=>x.key===k);return m?'<option value="'+k+'">'+m.name+'</option>':''}).join('');const availOpts=MANEUVERS.filter(m=>knownM.indexOf(m.key)===-1).map(m=>'<option value="'+m.key+'">'+m.name+'</option>').join('');let html='<div class="modal"><div class="modal-header"><h2>Универсальность воина</h2><button type="button" class="modal-close" onclick="closeVersatilityModal()">X</button></div><form id="versa-form"><div class="modal-body">';html+='<p style="margin-bottom:16px;color:var(--text-dim);font-size:14px">4-й уровень. Предложение появляется один раз.</p>';html+='<div style="margin-bottom:16px;padding:10px 14px;background:rgba(0,0,0,.22);border-left:2px solid var(--gold-dim);border-radius:0 6px 6px 0;font-size:13px;color:var(--text-dim)"><b style="color:var(--gold-bright)">Текущий стиль:</b> '+esc(curStyleName)+'</div>';html+='<div style="margin-bottom:16px;display:flex;flex-direction:column;gap:8px">';html+='<label style="flex-direction:row;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-family:EB Garamond,serif;font-size:15px"><input type="radio" name="versaType" value="style" checked onchange="onVersaChange()"><span>'+(curStyle?'Сменить боевой стиль':'Выбрать боевой стиль')+'</span></label>';if(isBM){html+='<label style="flex-direction:row;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-family:EB Garamond,serif;font-size:15px"><input type="radio" name="versaType" value="maneuver" onchange="onVersaChange()"><span>Сменить приём</span></label>'}html+='</div>';html+='<div id="versa-style-fields"><label>Новый стиль<select name="newStyle" id="versa-new-style" onchange="onVersaStyleChange()" style="margin-top:6px"><option value="">— выберите —</option>'+styleOpts+'</select></label><div class="fighting-style-info" id="versa-style-desc" style="margin-top:12px"></div></div>';if(isBM){html+='<div id="versa-maneuver-fields" style="display:none">';if(knownM.length>0&&availOpts){html+='<label>Заменить приём<select name="oldManeuver" style="margin-top:6px">'+knownOpts+'</select></label><label style="margin-top:10px;display:block">На новый<select name="newManeuver" style="margin-top:6px">'+availOpts+'</select></label>'}else if(knownM.length===0){html+='<p style="padding:12px;background:rgba(0,0,0,.22);border-radius:6px;color:var(--text-dim);font-style:italic">Нет известных приёмов.</p>'}else{html+='<p style="padding:12px;background:rgba(0,0,0,.22);border-radius:6px;color:var(--text-dim);font-style:italic">Все приёмы известны.</p>'}html+='</div>'}html+='</div><div class="modal-footer"><button type="button" class="btn btn-ghost" onclick="closeVersatilityModal()">Отмена</button><button type="button" class="btn btn-ghost" style="color:var(--danger-bright);border-color:var(--danger)" onclick="declineVersatility(\''+c.id+'\')">Отказаться</button><button type="submit" class="btn btn-gold">Применить</button></div></form></div>';overlay.innerHTML=html;overlay.classList.add('active');document.getElementById('versa-form').addEventListener('submit',function(e){e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());if(data.versaType==='style'){if(!data.newStyle){showToast('Выберите стиль','fail');return}applyVersatility(c,data);closeVersatilityModal()}else if(data.versaType==='maneuver'){if(!data.oldManeuver){showToast('Выберите приём','fail');return}if(!data.newManeuver){showToast('Выберите новый','fail');return}const idx=(c.maneuvers||[]).indexOf(data.oldManeuver);if(idx<0){showToast('Не найден','fail');return}if((c.maneuvers||[]).indexOf(data.newManeuver)>=0){showToast('Уже известен','fail');return}const oldM=MANEUVERS.find(m=>m.key===data.oldManeuver);const newM=MANEUVERS.find(m=>m.key===data.newManeuver);c.maneuvers[idx]=data.newManeuver;c.versatilityDone=true;save();renderAll();closeVersatilityModal();showToast('Приём: '+(oldM?oldM.name:'—')+' → '+(newM?newM.name:'—'),'success')}})}
function onVersaStyleChange(){const sel=document.getElementById('versa-new-style');const desc=document.getElementById('versa-style-desc');if(!sel||!desc)return;const s=FIGHTING_STYLES.find(x=>x.key===sel.value);desc.innerHTML=s&&s.desc?'<b>'+esc(s.name)+':</b> '+esc(s.desc):''}
function onVersaChange(){const form=document.getElementById('versa-form');if(!form)return;const type=form.querySelector('[name=versaType]:checked');if(!type)return;const s=form.querySelector('#versa-style-fields');const m=form.querySelector('#versa-maneuver-fields');if(s)s.style.display=type.value==='style'?'block':'none';if(m)m.style.display=type.value==='maneuver'?'block':'none'}
function closeVersatilityModal(){const o=document.getElementById('versa-overlay');if(o){o.classList.remove('active');o.innerHTML=''}}
function declineVersatility(id){const c=findChar(id);if(!c)return;c.versatilityDone=true;save();renderAll();closeVersatilityModal();showToast('Универсальность: отказ','success')}
function applyVersatility(c,data){if(!c)return;if(data.versaType==='style'){if(!data.newStyle){showToast('Выберите','fail');return}if(data.newStyle===c.fightingStyle){showToast('Это уже текущий','fail');return}const oldName=(FIGHTING_STYLES.find(s=>s.key===c.fightingStyle)||{}).name||'—';const newName=(FIGHTING_STYLES.find(s=>s.key===data.newStyle)||{}).name||'—';c.fightingStyle=data.newStyle;c.versatilityDone=true;save();renderAll();showToast('Стиль: '+oldName+' → '+newName,'success')}}
function useSurvivor(id){const c=findChar(id);if(!c)return;const amt = 5 + modNum(c.con);c.hpCur = Math.min(c.hpMax, c.hpCur + amt);save(); renderAll();showToast(c.name + ': Уцелевший! +' + amt + ' ХП', 'success');}
function triggerSurvivor(idx){const comb = state.initiative.combatants[idx];if(!comb || !comb.charId) return;const c = findChar(comb.charId);if(!c) return;const isChamp = (c.fighterArchetype||'').toLowerCase().indexOf('champion')>=0;const fl = getFighterLevel(c);if(isChamp && fl >= 18 && c.hpCur > 0 && c.hpCur <= Math.floor(c.hpMax / 2)) {const amt = 5 + modNum(c.con);c.hpCur = Math.min(c.hpMax, c.hpCur + amt);comb.hp = c.hpCur;save();showToast(c.name + ': Уцелевший (начало хода) +' + amt + ' ХП', 'success');}}

// --- ОТОБРАЖЕНИЕ КАРТОЧЕК ПЕРСОНАЖЕЙ ---
function onCardClick(e,id){if(e.target.closest('button')||e.target.closest('.stat-chip')||e.target.closest('.hp-block')||e.target.closest('.hd-block')||e.target.closest('.death-block')||e.target.closest('.resources-block')||e.target.closest('.xp-block'))return;openCharView(id)}
function renderCharacters(){const el=document.getElementById('characters-list');const q=searchQuery.characters.toLowerCase().trim();
  const filtered=q?state.characters.filter(c=>{const hay=[c.name,c.class,c.race,c.notes,c.features,formatClasses(c)].join(' ').toLowerCase();return hay.includes(q)}):state.characters;
  if(!filtered.length){el.innerHTML='<div class="empty">'+(q?'Ничего не найдено':'Пока нет персонажей')+'</div>';return}
  el.innerHTML=filtered.map(c=>{const wn=worldName(c.worldId);const stats=[['str','СИЛ'],['dex','ЛОВ'],['con','ТЕЛ'],['int','ИНТ'],['wis','МДР'],['cha','ХАР']];const passive=10+(c.skillProf['perception']?profBonus(c.level):0)+modNum(c.wis);
    const enc=getEncumbrance(c);const effSpeed=getEffectiveSpeed(c);
    const coinsArr=[];if(c.coins.gp)coinsArr.push('ЗМ <b>'+c.coins.gp+'</b>');if(c.coins.sp)coinsArr.push('СМ <b>'+c.coins.sp+'</b>');if(c.coins.cp)coinsArr.push('ММ <b>'+c.coins.cp+'</b>');
    const deathHTML=renderDeathSavesInner(c);const slotsHTML=renderSlotsCompactInner(c);const resHTML=renderResourcesInner(c);const ekSpellsHTML=renderEldritchKnightSpellsBlockInner(c);
    const canLevel=canLevelUp(c);const levelBtn=canLevel?'<button class="btn btn-gold" style="padding:4px 10px;font-size:10px;margin-left:auto" onclick="event.stopPropagation();levelUpCharacter(\''+c.id+'\')">⬆ До '+(c.level+1)+' ур.</button>':'';
    const lrStatus=getLongRestStatus(c);
    const encBadge=enc.status==='over'?'<div style="color:var(--danger-bright);font-family:Cinzel,serif;font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-top:4px">⚠ Превышена грузоподъёмность</div>':'';
    const _fl=getFighterLevel(c);
    const _needsPD = c.fighterArchetype==='purple_dragon' && _fl>=7 && !c.purpleDragonSkill;
    const _needsCavProf = c.fighterArchetype==='cavalier' && _fl>=3 && !c.cavalierProf;
    const archName=c.fighterArchetype&&c.fighterArchetype!==''?((FIGHTER_ARCHETYPES.find(function(x){return x.key===c.fighterArchetype})||{}).name||''):'';
    const _needsArch=_fl>=3&&(!c.fighterArchetype||c.fighterArchetype==='');
    const _asiLvls=getFighterASILevels(_fl);
    const _asiApplied=(c.fighterASIHistory||[]).length;
    const _asiAvail=Math.max(0,_asiLvls.length-_asiApplied);
    const _hasStyle=(c.fightingStyle||'')!=='';
    const _isBattlemaster=c.fighterArchetype==='battlemaster';
    const _canVersa=_fl>=4&&!c.versatilityDone&&(_hasStyle||_isBattlemaster);
    const _maneuverMax=_isBattlemaster?getMaxManeuvers(_fl):0;
    const _maneuverSel=(c.maneuvers||[]).length;
    const _needsManeuvers=_isBattlemaster&&_fl>=3&&_maneuverSel<_maneuverMax;
    const _needsTool=_isBattlemaster&&_fl>=3&&!c.toolProf;
    const _hasKnowEnemy=_isBattlemaster&&_fl>=7;
    const _hasCritBoost=((c.fighterArchetype||'').toLowerCase().trim()==='champion'&&_fl>=3);
    const _hasAthlete=((c.fighterArchetype||'').toLowerCase().indexOf('champion')>=0&&_fl>=7);
    const _canChooseSecondStyle=((c.fighterArchetype||'').toLowerCase().indexOf('champion')>=0&&_fl>=10&&!!c.fightingStyle&&!c.fightingStyle2);
    const _hasSuperiorCrit=((c.fighterArchetype||'').toLowerCase().trim()==='champion'&&_fl>=15);
    const atkCount=getFighterAttacks(c);
    
    // Бейдж Мистического рыцаря
    const _isEK = c.fighterArchetype === 'eldritch';
        const ekBadge = '';

    let warnHTML='';
    if(_needsArch||_asiAvail>0||_canVersa||_needsManeuvers||_needsTool||_hasKnowEnemy||_hasCritBoost||_hasAthlete||_hasSuperiorCrit||_canChooseSecondStyle||_needsPD||_needsCavProf){
      warnHTML='<div class="warn-row">';
      if(_needsPD)warnHTML+='<button class="versa-badge" onclick="event.stopPropagation();openPurpleDragonSkillModal(\''+c.id+'\')">📜 Посланник короны</button>';
      if(_needsCavProf)warnHTML+='<button class="versa-badge" onclick="event.stopPropagation();openCavalierProfModal(\''+c.id+'\')">📜 Владения кавалериста</button>';
      if(_needsArch)warnHTML+='<button class="warn-badge" onclick="event.stopPropagation();openArchetypeModal(\''+c.id+'\')">⚠ Архетип не выбран</button>';
      if(_asiAvail>0)warnHTML+='<button class="warn-badge" onclick="event.stopPropagation();openCardASIModal(\''+c.id+'\')">⚠ Повысить характеристики ('+_asiAvail+')</button>';
      if(_canVersa)warnHTML+='<button class="versa-badge" onclick="event.stopPropagation();openVersatilityModal(\''+c.id+'\')">🔄 Универсальность</button>';
      if(_needsTool)warnHTML+='<button class="warn-badge" onclick="event.stopPropagation();openFighterToolModal(\''+c.id+'\')">⚠ Ученик войны</button>';
      if(_needsManeuvers)warnHTML+='<button class="warn-badge" onclick="event.stopPropagation();openManeuversPickerModal(\''+c.id+'\')">⚠ Приёмы: '+_maneuverSel+'/'+_maneuverMax+'</button>';
      if(_hasKnowEnemy)warnHTML+='<button class="versa-badge" onclick="event.stopPropagation();openKnowEnemyModal(\''+c.id+'\')">🔍 Познай врага</button>';
      if(_hasSuperiorCrit)warnHTML+='<button class="versa-badge" onclick="event.stopPropagation();openChampionSuperiorCritModal()">🏆 Превосходные крит. попадания</button>';
      else if(_hasCritBoost)warnHTML+='<button class="versa-badge" onclick="event.stopPropagation();openChampionCritModal()">🏆 Улучшенные крит. попадания</button>';
      if(_hasAthlete)warnHTML+='<button class="versa-badge" onclick="event.stopPropagation();openChampionAthleteModal()">💪 Выдающийся атлет</button>';
      if(_canChooseSecondStyle)warnHTML+='<button class="versa-badge" onclick="event.stopPropagation();openChampionSecondStyleModal(\''+c.id+'\')">🛡 Доп. стиль</button>';
      warnHTML+='</div>';
    }
    return'<div class="card" onclick="onCardClick(event,\''+c.id+'\')"><div class="char-head">'+avatarHTML(c)+'<div style="flex:1;min-width:0"><div class="card-head"><h3>'+esc(c.name)+'</h3><div class="card-actions" onclick="event.stopPropagation()"><button class="insp-btn '+(c.inspiration?'active':'')+'" onclick="toggleInspiration(\''+c.id+'\')">✨</button><button class="icon-btn" onclick="editCharacter(\''+c.id+'\')">✎</button><button class="icon-btn danger" onclick="deleteItem(\'characters\',\''+c.id+'\')">✕</button></div></div><div class="card-sub" style="margin-bottom:0">'+esc(c.race||'—')+' · '+formatClasses(c)+(c.background?' · '+esc(c.background):'')+(archName?' · '+esc(archName):'')+' · '+c.level+' ур.</div></div></div>'+
      (wn?'<div class="tag" style="margin-top:8px">'+esc(wn)+'</div>':'')+ekBadge+warnHTML+
      '<div class="card-stats">'+stats.map(([k,l])=>'<div class="stat-chip" onclick="event.stopPropagation();rollCheck(\''+c.id+'\',\''+k+'\')"><span class="lbl">'+l+'</span><span class="val">'+c[k]+'</span><span class="mod">'+mod(c[k])+'</span></div>').join('')+'</div>'+
      '<div class="card-meta" style="padding-top:0;border:none"><span>БМ <b>'+fmt(profBonus(c.level))+'</b></span><span>Иниц. <b>'+fmt(modNum(c.dex))+'</b></span><span>Пасс. вним. <b>'+passive+'</b></span>'+(atkCount>1?'<span style="color:var(--gold-bright);font-weight:600">⚔ Атак: '+atkCount+'</span>':'')+'</div>'+
      '<div class="xp-block" onclick="event.stopPropagation()">'+renderXPInner(c)+'</div>'+
      '<div class="hp-block">'+renderHPInner(c)+'</div>'+renderHitDiceInner(c)+deathHTML+
      '<div class="card-meta" style="border-top:none;padding-top:0;align-items:center;flex-wrap:wrap"><span>🛡 КД <b>'+calcAC(c)+'</b></span><span>👣 <b>'+effSpeed+'</b> фт</span><span>⚖ <b>'+enc.weight.toFixed(1)+'</b> / '+enc.cap.toFixed(0)+' фнт'+(enc.status==='over'?' ⚠':'')+'</span>'+levelBtn+'<button class="btn btn-ghost" style="padding:4px 10px;font-size:10px;'+(lrStatus.available?'':'opacity:.5')+'" onclick="event.stopPropagation();openLongRest(\''+c.id+'\')">🌙 '+lrStatus.label+'</button><button class="btn btn-ghost" style="padding:4px 10px;font-size:10px" onclick="event.stopPropagation();openInventoryModal(\''+c.id+'\')">🎒 ('+c.inventory.length+')</button><button class="btn btn-ghost" style="padding:4px 10px;font-size:10px" onclick="event.stopPropagation();openTransportListModal(\''+c.id+'\')">🐴 ('+(c.transports||[]).length+')</button></div>'+encBadge+
      ekSpellsHTML+slotsHTML+(resHTML?'<div class="resources-block" onclick="event.stopPropagation()">'+resHTML+'</div>':'')+
      (coinsArr.length?'<div class="coins-row">'+coinsArr.join(' · ')+'</div>':'')+
      (c.notes?'<div class="card-note">'+esc(c.notes)+'</div>':'')+'</div>'}).join('')}
// --- ФУНКЦИИ ПРЕДЫСТОРИЙ (ВОССТАНОВЛЕНЫ) ---
function hasBgChoices(bgName){const bg=BACKGROUNDS_DB[bgName];if(!bg)return false;return((bg.toolChoices&&bg.toolChoices.length)||(bg.equipmentChoices&&bg.equipmentChoices.length)||(bg.variants&&bg.variants.length)||bg.languageCount)>0}
function renderBgChoiceField(choice,currentVal){if(!choice)return '';const val=currentVal||'';if(choice.type==='select'){const isCustom=val&&choice.options.indexOf(val)===-1;let h='<div class="form-grid" style="margin-bottom:10px"><label>'+esc(choice.label)+'<select data-bg-choice="'+choice.key+'">';h+='<option value="">— выберите —</option>';choice.options.forEach(function(o){h+='<option value="'+esc(o)+'" '+(val===o?'selected':'')+'>'+esc(o)+'</option>'});if(choice.allowCustom)h+='<option value="__custom__" '+(isCustom?'selected':'')+'>Свой</option>';h+='</select></label>';if(choice.allowCustom){h+='<label data-bg-custom-wrap="'+choice.key+'" style="display:'+(isCustom?'flex':'none')+'">Своё название<input type="text" data-bg-custom="'+choice.key+'" value="'+(isCustom?esc(val):'')+'" placeholder="Введите"></label>'}h+='</div>';return h}if(choice.type==='text'){return '<div class="form-grid" style="margin-bottom:10px"><label>'+esc(choice.label)+'<input type="text" data-bg-choice="'+choice.key+'" value="'+esc(val)+'" placeholder="'+esc(choice.placeholder||'')+'"></label></div>'}return ''}
function renderBackgroundChoicesHTML(bgName,choices){const bg=BACKGROUNDS_DB[bgName];if(!bg)return '';choices=choices||{};const vKey=choices.variant||'standard';const v=bg.variants?bg.variants.find(function(x){return x.key===vKey}):null;const isMerchant=bgName==='Гильдейский ремесленник'&&vKey==='merchant';if(!hasBgChoices(bgName)&&!(bg.languageCount>0)&&!isMerchant)return '';let h='<h4 class="form-h">Настройка предыстории</h4>';
if(bg.variants&&bg.variants.length>0){let vOpts=bg.variants.map(function(vv){return '<option value="'+vv.key+'" '+(vKey===vv.key?'selected':'')+'>'+vv.name+'</option>'}).join('');h+='<div class="form-grid" style="margin-bottom:10px"><label>Разновидность<select data-bg-choice="variant">'+vOpts+'</select></label></div>'}
if(isMerchant){let curL=choices.language||'';let lOpts='<option value="">— выберите —</option>'+LANGUAGES_DB.map(function(l){return '<option value="'+esc(l)+'" '+(curL===l?'selected':'')+'>'+l+'</option>'}).join('')+'<option value="__custom__" '+(curL&&LANGUAGES_DB.indexOf(curL)===-1?'selected':'')+'>Свой</option>';const isCL=curL&&LANGUAGES_DB.indexOf(curL)===-1;h+='<div class="form-grid" style="margin-bottom:10px"><label>Язык (на выбор)<select data-bg-choice="language">'+lOpts+'</select></label><label data-bg-custom-wrap="language" style="display:'+(isCL?'flex':'none')+'">Свой язык<input type="text" data-bg-custom="language" value="'+(isCL?esc(curL):'')+'" placeholder="Введите"></label></div>';
  const mp=choices.merchantProf||'navigator';h+='<div class="form-grid" style="margin-bottom:10px"><label>Владение (вместо инструментов)<select data-bg-choice="merchantProf"><option value="navigator" '+(mp==='navigator'?'selected':'')+'>Инструменты навигатора</option><option value="language" '+(mp==='language'?'selected':'')+'>Дополнительный язык</option></select></label></div>';
  if(mp==='language'){let curL2=choices.bonusLanguage||'';let lOpts2='<option value="">— выберите —</option>'+LANGUAGES_DB.map(function(l){return '<option value="'+esc(l)+'" '+(curL2===l?'selected':'')+'>'+l+'</option>'}).join('')+'<option value="__custom__" '+(curL2&&LANGUAGES_DB.indexOf(curL2)===-1?'selected':'')+'>Свой</option>';const isCL2=curL2&&LANGUAGES_DB.indexOf(curL2)===-1;h+='<div class="form-grid" style="margin-bottom:10px"><label>Дополнительный язык<select data-bg-choice="bonusLanguage">'+lOpts2+'</select></label><label data-bg-custom-wrap="bonusLanguage" style="display:'+(isCL2?'flex':'none')+'">Свой язык<input type="text" data-bg-custom="bonusLanguage" value="'+(isCL2?esc(curL2):'')+'" placeholder="Введите"></label></div>'}
  h+='<div class="class-hint" style="font-style:normal;color:var(--gold-bright)">📦 При старте выдаётся: Мул, Телега (в разделе 🐴 Транспорт)</div>';return h}
const toolBase=bg.toolChoices||[];const toolVar=(v&&v.toolChoices)?v.toolChoices:[];const toolKeys=new Set(toolVar.map(function(cc){return cc.key}));const toolAll=toolVar.concat(toolBase.filter(function(cc){return !toolKeys.has(cc.key)}));const eqBase=bg.equipmentChoices||[];const eqVar=(v&&v.equipmentChoices)?v.equipmentChoices:[];const eqKeys=new Set(eqVar.map(function(cc){return cc.key}));const eqAll=eqVar.concat(eqBase.filter(function(cc){return !eqKeys.has(cc.key)}));const seen={};toolAll.concat(eqAll).forEach(function(ch){if(seen[ch.key])return;seen[ch.key]=true;h+=renderBgChoiceField(ch,choices[ch.key]||'')});if(bg.languageCount>0){for(var li=0;li<bg.languageCount;li++){var lk=li===0?'language':'language'+(li+1);var lbl=bg.languageCount>1?'Язык '+(li+1)+' (на выбор)':'Язык (на выбор)';var curL3=choices[lk]||'';var lOpts3='<option value="">— выберите —</option>'+LANGUAGES_DB.map(function(l){return '<option value="'+esc(l)+'" '+(curL3===l?'selected':'')+'>'+l+'</option>'}).join('')+'<option value="__custom__" '+(curL3&&LANGUAGES_DB.indexOf(curL3)===-1?'selected':'')+'>Свой</option>';var isCL3=curL3&&LANGUAGES_DB.indexOf(curL3)===-1;h+='<div class="form-grid" style="margin-bottom:10px"><label>'+lbl+'<select data-bg-choice="'+lk+'">'+lOpts3+'</select></label><label data-bg-custom-wrap="'+lk+'" style="display:'+(isCL3?'flex':'none')+'">Свой язык<input type="text" data-bg-custom="'+lk+'" value="'+(isCL3?esc(curL3):'')+'" placeholder="Введите"></label></div>'}}return h}
function onVariantChange(sel){const form=sel.form||sel.closest('form');if(!form)return;const bgS=form.querySelector('[name=background]');const bgName=bgS?bgS.value:'';const bg=BACKGROUNDS_DB[bgName];if(!bg||!bg.variants)return;const variant=bg.variants.find(function(v){return v.key===sel.value});if(variant){applyBackgroundProficiencies(form,bgName)}}
function collectBackgroundChoices(formEl){const r={};if(!formEl)return r;formEl.querySelectorAll('[data-bg-choice]').forEach(function(el){const k=el.getAttribute('data-bg-choice');let v=el.value||'';if(v==='__custom__'){const cu=formEl.querySelector('[data-bg-custom="'+k+'"]');if(cu)v=cu.value||''}r[k]=v});return r}
function attachBgChoiceHandlers(formEl,bgName){if(!formEl)return;formEl.querySelectorAll('[data-bg-choice]').forEach(function(el){el.onchange=function(){const k=el.getAttribute('data-bg-choice');const cw=formEl.querySelector('[data-bg-custom-wrap="'+k+'"]');if(cw)cw.style.display=el.value==='__custom__'?'flex':'none';if(k==='variant'||k==='merchantProf'){const bgS=formEl.querySelector('[name=background]');const bn=bgS?bgS.value:bgName;const curChoices=collectBackgroundChoices(formEl);const bgWrap=formEl.querySelector('#bg-choices-wrap');if(bgWrap){const html=renderBackgroundChoicesHTML(bn,curChoices);if(html){bgWrap.innerHTML=html;bgWrap.style.display='block';attachBgChoiceHandlers(formEl,bn)}else{bgWrap.innerHTML='';bgWrap.style.display='none'}}applyBackgroundProficiencies(formEl,bn);return}applyBackgroundProficiencies(formEl,bgName)}})}
function applyBackgroundChoicesToInventory(char,oldChar){const bg=BACKGROUNDS_DB[char.background];if(!bg)return;const newC=char.backgroundChoices||{};const oldC=oldChar?(oldChar.backgroundChoices||{}):{};const oldBgName=oldChar?oldChar.background:'';const oldVariant=oldC.variant||'standard';const newVariant=newC.variant||'standard';const bgChanged=oldBgName!==char.background;const variantChanged=oldVariant!==newVariant;const isMerchant=char.background==='Гильдейский ремесленник'&&newVariant==='merchant';const isKnight=char.background==='Благородный'&&newVariant==='knight';
const oldItems=[];if(!bgChanged&&oldChar){Object.keys(oldC).forEach(function(k){if(oldC[k]&&k!=='variant'&&k!=='merchantProf'&&k!=='bonusLanguage')oldItems.push(oldC[k])});(bg.equipmentFixed||[]).forEach(function(f){oldItems.push(f.name)});const oldV=bg.variants?bg.variants.find(function(v){return v.key===oldVariant}):null;if(oldV&&oldV.equipmentChoices)Object.keys(oldC).forEach(function(k){if(oldC[k]&&oldV.equipmentChoices.some(function(ec){return ec.key===k}))oldItems.push(oldC[k])})}
const newItems=[];(bg.equipmentFixed||[]).forEach(function(f){newItems.push(f.name)});if(isMerchant){if(newC.talisman)newItems.push(newC.talisman);char.inventory=char.inventory.filter(function(it){return !(typeof TOOLS_DB!=='undefined'&&TOOLS_DB[it.name]&&TOOLS_DB[it.name].cat==='artisan')&&it.name!=='Мул'&&it.name!=='Телега'})}else{if(bg.equipmentChoices)bg.equipmentChoices.forEach(function(ch){const v=newC[ch.key];if(v)newItems.push(v)});const v0=bg.variants?bg.variants.find(function(vv){return vv.key===newVariant}):null;if(v0&&v0.equipmentChoices)v0.equipmentChoices.forEach(function(ch){const v=newC[ch.key];if(v)newItems.push(v)})}
oldItems.forEach(function(n){const i=char.inventory.findIndex(function(it){return it.name===n});if(i>=0)char.inventory.splice(i,1)});newItems.forEach(function(n){const ex=char.inventory.find(function(it){return it.name===n});if(ex)return;const b=buildItemFromName(n,1,1,'Предыстория');if(b)char.inventory.push(b)});
if(!Array.isArray(char.transports))char.transports=[];
if(!char._merchantTransportsInit||bgChanged||variantChanged){char.transports=char.transports.filter(function(t){return !(t.notes&&t.notes.indexOf('Из предыстории (Купец)')>=0)});if(isMerchant){char.transports.push({id:uid(),name:'Осёл или мул',category:'mount',speed:'40 фт',capacity:420,cargo:[],notes:'Из предыстории (Купец)'});char.transports.push({id:uid(),name:'Телега',category:'vehicle',speed:'—',capacity:200,cargo:[],notes:'Из предыстории (Купец)'})}char._merchantTransportsInit=true}else if(!isMerchant){char.transports=char.transports.filter(function(t){return !(t.notes&&t.notes.indexOf('Из предыстории (Купец)')>=0)})}
if(!Array.isArray(char.servants))char.servants=[];
if(!char._knightServantsInit||bgChanged||variantChanged){if(isKnight&&char.servants.length===0){char.servants=[{name:'Слуга 1',desc:'Дворецкий'},{name:'Слуга 2',desc:'Сквайр'},{name:'Слуга 3',desc:'Конюх'}]}char._knightServantsInit=true}}
function markBackgroundSkills(formEl,bgName){if(!formEl)return;const bg=BACKGROUNDS_DB[bgName];if(!bg||!bg.skills)return;bg.skills.forEach(function(key){const cb=formEl.querySelector('[name=skill-'+key+']');if(cb&&cb.checked){cb.setAttribute('data-from-bg','true');const r=cb.closest('.skill-item');if(r)r.classList.add('bg-skill')}})}
function applyBackgroundSkills(formEl,bgName,notify){if(!formEl)return[];const bg=BACKGROUNDS_DB[bgName];formEl.querySelectorAll('[data-from-bg="true"]').forEach(function(cb){if(!bg||(bg.skills||[]).indexOf(cb.value)===-1){cb.checked=false;cb.removeAttribute('data-from-bg');const r=cb.closest('.skill-item');if(r)r.classList.remove('bg-skill');cb.dispatchEvent(new Event('change',{bubbles:true}))}});if(!bg||!bg.skills)return[];const conflicts=[];bg.skills.forEach(function(key){const cb=formEl.querySelector('[name=skill-'+key+']');if(!cb)return;const wasChecked=cb.checked&&!cb.hasAttribute('data-from-bg');cb.checked=true;cb.setAttribute('data-from-bg','true');const r=cb.closest('.skill-item');if(r)r.classList.add('bg-skill');if(wasChecked)conflicts.push(key);cb.dispatchEvent(new Event('change',{bubbles:true}))});if(notify&&conflicts.length){const names=conflicts.map(function(k){const s=SKILLS.find(function(x){return x.key===k});return s?s.name:k}).join(', ');showToast('Навык(и) '+names+' уже выбраны классом. По правилам выберите другой навык взамен.','fail')}return conflicts}
function applyBackgroundProficiencies(formEl,bgName){if(!formEl)return;const bg=BACKGROUNDS_DB[bgName];const choices=collectBackgroundChoices(formEl);const isMerchant=bgName==='Гильдейский ремесленник'&&choices.variant==='merchant';const ta=formEl.querySelector('[name=proficiencies]');if(ta){const lines=ta.value.split('\n').filter(function(l){return l.indexOf('Предыстория:')!==0});if(bg){let toolsText='';if(isMerchant){const mp=choices.merchantProf||'navigator';if(mp==='navigator')toolsText='Инструменты навигатора'}else{toolsText=(bg.toolsText||'').replace(/\{(\w+)\}/g,function(m,k){return choices[k]||'(на выбор)'})}if(toolsText)lines.push('Предыстория: '+bgName+' — '+toolsText)}ta.value=lines.join('\n').trim()}
const taL=formEl.querySelector('[name=languages]');if(taL){const linesL=taL.value.split('\n').filter(function(l){return l.indexOf('Предыстория:')!==0});const langArr=[];if(isMerchant){if(choices.language)langArr.push(choices.language);if(choices.merchantProf==='language'&&choices.bonusLanguage)langArr.push(choices.bonusLanguage)}else if(bg&&bg.languageCount>0){for(var li=0;li<bg.languageCount;li++){var lk=li===0?'language':'language'+(li+1);if(choices[lk])langArr.push(choices[lk])}}langArr.forEach(function(lang){linesL.push('Предыстория: '+lang)});taL.value=linesL.join('\n').trim()}}
function onBackgroundChange(sel){const form=sel.form||sel.closest('form');if(!form)return;const wrap=form.querySelector('#background-custom-wrap');if(wrap)wrap.style.display=sel.value==='__custom__'?'flex':'none';const bgName=sel.value==='__custom__'?((form.querySelector('[name=backgroundCustom]')||{}).value||''):sel.value;applyBackgroundSkills(form,bgName,true);const bgWrap=form.querySelector('#bg-choices-wrap');if(bgWrap){const html=renderBackgroundChoicesHTML(bgName,{});if(html){bgWrap.innerHTML=html;bgWrap.style.display='block';attachBgChoiceHandlers(form,bgName)}else{bgWrap.innerHTML='';bgWrap.style.display='none'}}applyBackgroundProficiencies(form,bgName)}
function getPropertySectionHTML(c){if(!c.property||!c.property.length)return'';return'<div class="view-section"><h3>Имущество</h3>'+c.property.map(function(it){return'<div class="view-row"><span class="key">'+esc(it.name)+'</span><span class="val">'+esc(it.desc||'—')+'</span></div>'}).join('')+'</div>'}
function getServantsSectionHTML(c){if(!c.servants||!c.servants.length)return'<div class="view-section"><h3>Свита (Слуги)</h3><div class="view-text" style="font-style:italic;color:var(--text-dim)">Слуг нет. <button class="btn btn-ghost" style="padding:2px 8px;font-size:10px" onclick="event.stopPropagation();addServant(\''+c.id+'\')">+ Добавить слугу</button></div></div>';return'<div class="view-section"><h3>Свита (Слуги)</h3>'+c.servants.map(function(s,i){return'<div class="view-row" style="align-items:center"><span class="key"><b style="color:var(--gold-bright)">'+esc(s.name||'Слуга')+'</b> — '+esc(s.desc||'—')+'</span><span style="display:flex;gap:4px"><button class="icon-btn" style="width:24px;height:24px;font-size:12px" onclick="event.stopPropagation();editServant(\''+c.id+'\','+i+')">✎</button><button class="icon-btn danger" style="width:24px;height:24px;font-size:12px" onclick="event.stopPropagation();delServant(\''+c.id+'\','+i+')">✕</button></span></div>'}).join('')+'<button class="btn btn-ghost" style="padding:3px 10px;font-size:10px;margin-top:6px" onclick="event.stopPropagation();addServant(\''+c.id+'\')">+ Добавить слугу</button></div>'}
function addServant(charId){const c=findChar(charId);if(!c)return;if(!Array.isArray(c.servants))c.servants=[];const name=prompt('Имя слуги?','Слуга');if(name===null)return;const desc=prompt('Описание (роль)?','Помощник')||'';c.servants.push({name:name.trim()||'Слуга',desc:desc.trim()});save();renderAll();showToast('Слуга добавлен','success');setTimeout(function(){openCharView(charId)},100)}
function editServant(charId,idx){const c=findChar(charId);if(!c||!c.servants[idx])return;const s=c.servants[idx];const name=prompt('Имя слуги?',s.name||'');if(name===null)return;const desc=prompt('Описание (роль)?',s.desc||'');if(desc===null)return;s.name=name.trim()||'Слуга';s.desc=desc.trim();save();renderAll();setTimeout(function(){openCharView(charId)},100)}
function delServant(charId,idx){const c=findChar(charId);if(!c||!c.servants[idx])return;if(!confirm('Удалить «'+c.servants[idx].name+'»?'))return;c.servants.splice(idx,1);save();renderAll();setTimeout(function(){openCharView(charId)},100)}
function getBackgroundSectionHTML(c){if(!c||!c.background)return'';const bg=BACKGROUNDS_DB[c.background];if(!bg)return'<div class="view-section"><h3>Предыстория</h3><div class="view-text">'+esc(c.background)+'</div></div>';const skillNames=(bg.skills||[]).map(function(k){const s=SKILLS.find(function(x){return x.key===k});return s?s.name:k}).join(', ');const choices=c.backgroundChoices||{};const isMerchant=c.background==='Гильдейский ремесленник'&&choices.variant==='merchant';let v=null;if(bg.variants&&bg.variants.length>0){const vKey=choices.variant||'standard';v=bg.variants.find(function(x){return x.key===vKey})||bg.variants[0]}
let toolsText='';if(isMerchant){const mp=choices.merchantProf||'navigator';if(mp==='navigator')toolsText='Инструменты навигатора'}else{toolsText=(bg.toolsText||'').replace(/\{(\w+)\}/g,function(m,k){return choices[k]||'(на выбор)'})}
const langArr=[];if(isMerchant){if(choices.language)langArr.push(choices.language);if(choices.merchantProf==='language'&&choices.bonusLanguage)langArr.push(choices.bonusLanguage)}else if(bg.languageCount>0){for(var li=0;li<bg.languageCount;li++){var lk=li===0?'language':'language'+(li+1);if(choices[lk])langArr.push(choices[lk])}}
const langText=langArr.length?'<div class="view-row"><span class="key">Языки</span><span class="val">'+esc(langArr.join(', '))+'</span></div>':'';
let fName=bg.feature||'';let fDesc=bg.featureDesc||'';if(v){fName=v.feature;fDesc=v.desc}const eqText=(v&&v.equipmentText)||bg.equipmentText;return'<div class="view-section"><h3>Предыстория: '+esc(c.background)+'</h3><div class="view-text" style="margin-bottom:10px">'+esc(bg.desc||'')+'</div>'+(skillNames?'<div class="view-row"><span class="key">Владение навыками</span><span class="val">'+esc(skillNames)+'</span></div>':'')+(toolsText?'<div class="view-row"><span class="key">Владение инструментами</span><span class="val">'+esc(toolsText)+'</span></div>':'')+langText+(eqText?'<div class="view-row"><span class="key">Снаряжение</span><span class="val">'+esc(eqText)+'</span></div>':'')+(fName?'<div class="view-section" style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border-soft)"><h4 style="font-family:Cinzel,serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:8px">Умение: '+esc(fName)+'</h4><div class="view-text">'+esc(fDesc)+'</div></div>':'')+'</div>'}
function syncEldritchKnightResources(c) {
    if (!c || !Array.isArray(c.resources)) return;
    const fLvl = getFighterLevel(c);
    const isEK = c.fighterArchetype === 'eldritch';
    
    if (isEK && fLvl >= 3 && typeof ELDRITCH_KNIGHT_TABLE !== 'undefined') {
        const row = ELDRITCH_KNIGHT_TABLE[fLvl];
        if (row) {
            for (let i = 1; i <= 4; i++) {
                if (!c.spellSlots[i]) c.spellSlots[i] = { max: 0, used: 0 };
                c.spellSlots[i].max = row.slots[i - 1];
                if (c.spellSlots[i].used > c.spellSlots[i].max) {
                    c.spellSlots[i].used = c.spellSlots[i].max;
                }
            }
        }
    }
}
// --- КНИГА ЗАКЛИНАНИЙ МИСТИЧЕСКОГО РЫЦАРЯ ---
function getEldritchSpellStats(c){
  if(!c)return null;
  var pb=profBonus(c.level);
  var intMod=modNum(c.int);
  return { pb:pb, intMod:intMod, saveDC:8+pb+intMod, attackMod:pb+intMod };
}

function rollEldritchSpellAttack(charId){
  var c=findChar(charId);if(!c)return;
  var st=getEldritchSpellStats(c);if(!st)return;
  rollDice(20, st.attackMod, c.name+': атака заклинанием');
}
function renderEldritchKnightSpellsBlockInner(c){
  if(!c||c.fighterArchetype!=='eldritch')return'';
  var fl=getFighterLevel(c);
  if(fl<3)return'';
  var stats=getEldritchSpellStats(c);
  if(!stats)return'';
  var cantrips=(c.spells||[]).filter(function(s){return s.level===0});
  var levelsWithSlots=[];
  for(var lvl=1;lvl<=9;lvl++){var s=c.spellSlots[lvl];if(s&&s.max>0)levelsWithSlots.push(lvl)}
  if(!cantrips.length&&levelsWithSlots.length===0)return'';
  
  var buttons='';
  buttons+='<button class="ek-spell-btn cantrip" onclick="event.stopPropagation();openEldritchSpellList(\''+c.id+'\',0)">✨ Заговоры (∞)'+(cantrips.length?' · '+cantrips.length:'')+'</button>';
  levelsWithSlots.forEach(function(lvl){
    var s=c.spellSlots[lvl];var free=s.max-s.used;var cnt=(c.spells||[]).filter(function(x){return x.level===lvl}).length;
    buttons+='<button class="ek-spell-btn" onclick="event.stopPropagation();openEldritchSpellList(\''+c.id+'\','+lvl+')">📖 Ур. '+lvl+' ('+free+'/'+s.max+')'+(cnt?' · '+cnt:'')+'</button>';
  });
  
  var infoBar='<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;padding:8px 10px;background:rgba(0,0,0,.22);border:1px solid var(--border-soft);border-radius:6px;font-family:Cinzel,serif;font-size:12px">'
    +'<span style="color:var(--text-dim)">Сл спас. <b style="color:var(--gold-bright)">'+stats.saveDC+'</b></span>'
    +'<span style="color:var(--text-dim);cursor:pointer;padding:2px 6px;border-radius:4px;background:rgba(126,200,224,.12)" onclick="event.stopPropagation();rollEldritchSpellAttack(\''+c.id+'\')" title="Клик — бросок d20 '+fmt(stats.attackMod)+'">Мод атаки <b style="color:var(--temp);text-decoration:underline dotted">'+fmt(stats.attackMod)+'</b> 🎲</span>'
    +'<span style="color:var(--text-dim)">ИНТ <b style="color:var(--gold-bright)">'+fmt(stats.intMod)+'</b></span>'
    +'</div>';
    
  var bondBtn='<button class="ek-spell-btn" style="border-color:var(--temp);color:var(--temp)" onclick="event.stopPropagation();openWeaponBondModal(\''+c.id+'\')">🔗 Связь с оружием</button>';
  
  // --- Боевая магия (7 ур.) и Улучшенная (18 ур.) ---
  var warMagicHtml='';
  if(fl>=7){
    var wmTitle = fl>=18 ? 'Улучшенная боевая магия' : 'Боевая магия';
    var wmHint = fl>=18 ? 'Сначала используйте любое заклинание' : 'Сначала используйте заговор';
    if(c.warMagicReady){
      warMagicHtml='<button class="ek-spell-btn" style="background:rgba(201,162,39,.3);border-color:var(--gold-bright);color:#fff;animation:pulse 1.5s infinite;box-shadow:0 0 10px rgba(232,200,92,.5)" onclick="event.stopPropagation();useWarMagicAttack(\''+c.id+'\')">⚔ Атака ('+wmTitle+')</button>';
    }else{
      warMagicHtml='<button class="ek-spell-btn" style="opacity:.5;cursor:not-allowed" title="'+wmHint+'" onclick="event.stopPropagation();showToast(\''+wmHint+'\',\'fail\')">⚔ Атака (нет заклинания)</button>';
    }
  }

  // --- Мистический удар (10 ур.) ---
  var eldritchStrikeHtml='';
  if(fl>=10){
    if(c.eldritchStrikeActive){
      eldritchStrikeHtml='<button class="ek-spell-btn" style="background:rgba(126,200,224,.2);border-color:var(--temp);color:var(--temp);box-shadow:0 0 8px rgba(126,200,224,.4)" onclick="event.stopPropagation();toggleEldritchStrike(\''+c.id+'\')">🌀 Мистический удар: АКТИВЕН</button>';
    }else{
      eldritchStrikeHtml='<button class="ek-spell-btn" onclick="event.stopPropagation();toggleEldritchStrike(\''+c.id+'\')">🌀 Мистический удар</button>';
    }
  }

  var extraBtns = warMagicHtml + eldritchStrikeHtml;

  return'<div class="ek-spells-block" onclick="event.stopPropagation()"><div class="ek-spells-header"><span class="ek-spells-label">Книга заклинаний</span></div>'+infoBar+'<div class="ek-spells-buttons">'+buttons+bondBtn+extraBtns+'</div></div>';
}

function openEldritchSpellList(charId,level){
  var c=findChar(charId);if(!c)return;
  var levelLabel=level===0?'Заговоры':'Уровень '+level;
  var spells=(c.spells||[]).filter(function(s){return s.level===level});
  var slots=c.spellSlots[level]||{max:0,used:0};
  var slotsInfo=level===0?'∞ (заговоры не тратят ячейки)':'Ячейки: '+(slots.max-slots.used)+' / '+slots.max;
  var listHTML='';
  if(!spells.length){listHTML='<div class="empty" style="padding:20px;font-size:14px">Нет заклинаний этого уровня.</div>'}
  else{listHTML=spells.map(function(s){return'<div class="ek-spell-item" onclick="openEldritchSpellView(\''+c.id+'\',\''+s.id+'\')"><span class="ek-spell-name">'+esc(s.name)+'</span><span class="ek-spell-info">'+(level===0?'Заговор':'Ур. '+level)+'</span></div>'}).join('')}
  var body='<div class="view-row" style="padding:10px 14px;background:rgba(0,0,0,.22);border-radius:8px;margin-bottom:12px"><span class="key">'+esc(levelLabel)+'</span><span class="val">'+esc(slotsInfo)+'</span></div>'+listHTML+'<button class="btn btn-gold" style="margin-top:16px" onclick="addEldritchSpell(\''+c.id+'\','+level+')">+ Добавить заклинание</button>';
  openModal('📖 '+levelLabel+' — '+c.name,body,null,{noForm:true,wide:true});
}

function openEldritchSpellView(charId,spellId){
  var c=findChar(charId);if(!c)return;
  var spell=(c.spells||[]).find(function(s){return s.id===spellId});if(!spell)return;
  var isCantrip=spell.level===0;
  var slots=c.spellSlots[spell.level]||{max:0,used:0};
  var slotsFree=slots.max-slots.used;
  var canUse=isCantrip||slotsFree>0;
  var slotLine=isCantrip?'<div class="ek-spell-slot-info">Заговор — не тратит ячейки</div>':'<div class="ek-spell-slot-info">Доступно ячеек '+spell.level+' ур.: '+slotsFree+' / '+slots.max+'</div>';
  var body='<div style="text-align:center;padding:16px 0;margin-bottom:16px;border-bottom:1px solid var(--border-soft)"><div style="font-family:Cinzel,serif;font-size:20px;letter-spacing:1px;color:var(--gold-bright)">'+esc(spell.name)+'</div><div style="font-style:italic;color:var(--text-dim);font-size:14px;margin-top:4px">'+(isCantrip?'Заговор':'Заклинание '+spell.level+' уровня')+'</div></div><div style="padding:16px;background:rgba(0,0,0,.22);border-left:2px solid var(--gold-dim);border-radius:0 6px 6px 0;min-height:80px"><div style="font-style:italic;color:var(--text-dim);font-size:15px">'+(spell.description?esc(spell.description):'Описание заклинания будет добавлено позже. Пока это заглушка.')+'</div></div>'+slotLine+'<div style="display:flex;gap:8px;justify-content:center;margin-top:16px;flex-wrap:wrap"><button class="btn btn-ghost" onclick="openEldritchSpellList(\''+c.id+'\','+spell.level+')">← Назад</button><button class="btn btn-gold" '+(canUse?'':'disabled')+' onclick="useEldritchSpell(\''+c.id+'\',\''+spell.id+'\')">'+(isCantrip?'✨ Использовать':'🔥 Использовать')+'</button><button class="btn btn-ghost" style="color:var(--danger-bright);border-color:var(--danger)" onclick="deleteEldritchSpell(\''+c.id+'\',\''+spell.id+'\')">🗑 Удалить</button></div>';
  openModal(spell.name,body,null,{noForm:true});
}

function useEldritchSpell(charId,spellId){
  var c=findChar(charId);if(!c)return;
  var spell=(c.spells||[]).find(function(s){return s.id===spellId});if(!spell)return;
  var fl=getFighterLevel(c);
  
  if(spell.level===0){
    if(fl>=7){
      c.warMagicReady=true;save();renderAll();
      showToast(c.name+': заговор «'+spell.name+'» использован. Доступна бонусная атака (Боевая магия)!','success');
    }else{
      showToast(c.name+': заговор «'+spell.name+'» использован (ячейки не тратятся)','success');
    }
    setTimeout(function(){closeModal()},100);
    return;
  }
  
  // Для заклинаний с ячейками
  var slots=c.spellSlots[spell.level];
  if(!slots||slots.used>=slots.max){showToast('Нет свободных ячеек '+spell.level+' уровня','fail');return}
  slots.used+=1;
  
  // 18-й уровень: Улучшенная боевая магия (любое заклинание даёт бонусную атаку)
  if(fl>=18){
    c.warMagicReady=true;
    save();renderAll();
    showToast(c.name+': «'+spell.name+'» использовано. Ячейка '+spell.level+' ур. потрачена ('+(slots.max-slots.used)+'/'+slots.max+'). Доступна атака (Улучшенная боевая магия)!','success');
    setTimeout(function(){closeModal()},100);
  } else {
    save();renderAll();
    showToast(c.name+': «'+spell.name+'» использовано. Ячейка '+spell.level+' ур. потрачена ('+(slots.max-slots.used)+'/'+slots.max+')','success');
    setTimeout(function(){openEldritchSpellList(charId,spell.level)},50);
  }
}

function addEldritchSpell(charId,level){
  var c=findChar(charId);if(!c)return;
  var name=prompt('Название заклинания'+(level===0?' (заговор)':' (уровень '+level+')')+':','');
  if(name===null)return;
  if(!name.trim()){showToast('Название не может быть пустым','fail');return}
  if(!Array.isArray(c.spells))c.spells=[];
  c.spells.push({id:uid(),name:name.trim(),level:level,school:'',description:''});
  save();renderAll();showToast('Добавлено: '+name,'success');
  setTimeout(function(){openEldritchSpellList(charId,level)},50);
}

function deleteEldritchSpell(charId,spellId){
  var c=findChar(charId);if(!c)return;
  var spell=(c.spells||[]).find(function(s){return s.id===spellId});if(!spell)return;
  if(!confirm('Удалить «'+spell.name+'» из книги заклинаний?'))return;
  c.spells=c.spells.filter(function(s){return s.id!==spellId});
  save();renderAll();showToast('Удалено: '+spell.name);
  setTimeout(function(){openEldritchSpellList(charId,spell.level)},50);
}
// --- БОЕВАЯ МАГИЯ И МИСТИЧЕСКИЙ УДАР ---
function useWarMagicAttack(charId){
  var c=findChar(charId);if(!c)return;
  if(!c.warMagicReady){showToast('Сначала используйте заговор (действием)!','fail');return}
  c.warMagicReady=false;
  var strMod=modNum(c.str);var dexMod=modNum(c.dex);
  var useDex=dexMod>strMod;var atkMod=(useDex?dexMod:strMod)+profBonus(c.level);
  save();renderAll();
  var label=c.name+': Боевая магия (атака оружием '+(useDex?'ЛОВ':'СИЛ')+')';
  rollDice(20,atkMod,label);
  showToast('Потрачено бонусное действие на атаку.','success');
}

function toggleEldritchStrike(charId){
  var c=findChar(charId);if(!c)return;
  c.eldritchStrikeActive=!c.eldritchStrikeActive;
  save();renderAll();
  if(c.eldritchStrikeActive){
    showToast(c.name+': Мистический удар активен! Цель имеет помеху на спасбросок.','success');
  }else{
    showToast(c.name+': Мистический удар сброшен.','');
  }
}
// --- СВЯЗЬ С ОРУЖИЕМ (Мистический рыцарь) ---
function getBondedWeapons(c){
  var list=[];
  (c.inventory||[]).forEach(function(it,idx){
    if(it.itemType==='weapon'&&it.bonded)list.push({source:'inv',idx:idx,item:it});
  });
  (c.transports||[]).forEach(function(t,tIdx){
    (t.cargo||[]).forEach(function(it,idx){
      if(it.itemType==='weapon'&&it.bonded)list.push({source:'trans',tIdx:tIdx,idx:idx,item:it});
    });
  });
  return list;
}

function openWeaponBondModal(charId){
  var c=findChar(charId);if(!c)return;
  var bonded=getBondedWeapons(c);
  var limitReached=bonded.length>=2;
  var html='';
  html+='<div style="margin-bottom:16px;padding:10px 14px;background:rgba(126,200,224,.08);border:1px solid var(--temp);border-radius:6px;font-family:Cinzel,serif;font-size:13px;color:var(--temp);text-align:center">Привязано оружий: <b>'+bonded.length+' / 2</b></div>';
  
  // Инвентарь
  var invWeapons=(c.inventory||[]).map(function(it,idx){return{it:it,idx:idx}}).filter(function(x){return x.it.itemType==='weapon'});
  html+='<h4 class="form-h">Оружие в инвентаре ('+invWeapons.length+')</h4>';
  if(!invWeapons.length)html+='<div class="empty" style="padding:16px;font-size:13px">Нет оружия в инвентаре.</div>';
  else{
    html+='<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">';
    invWeapons.forEach(function(w){
      var isBonded=!!w.it.bonded;
      var canBond=!isBonded&&!limitReached;
      var btnHtml=isBonded?'<button class="btn btn-ghost" style="padding:4px 10px;font-size:10px;color:var(--danger-bright);border-color:var(--danger)" onclick="toggleWeaponBond(\''+c.id+'\',\'inv\',null,'+w.idx+')">Разорвать</button>':'<button class="btn btn-gold" style="padding:4px 10px;font-size:10px" '+(canBond?'':'disabled style="opacity:.4"')+' onclick="toggleWeaponBond(\''+c.id+'\',\'inv\',null,'+w.idx+')">Связать</button>';
      var badge=isBonded?'<span style="color:var(--temp);font-size:11px;font-weight:600;margin-left:8px">🔗 Оружие связано</span>':'';
      html+='<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(0,0,0,.22);border:1px solid '+(isBonded?'var(--temp)':'var(--border-soft)')+';border-radius:6px"><div><b style="font-family:Cinzel,serif;color:var(--gold-bright)">'+esc(w.it.name)+'</b>'+(w.it.qty>1?' × '+w.it.qty:'')+badge+'</div>'+btnHtml+'</div>';
    });
    html+='</div>';
  }

  // Транспорт
  var transWeapons=[];
  (c.transports||[]).forEach(function(t,tIdx){
    (t.cargo||[]).forEach(function(it,idx){if(it.itemType==='weapon')transWeapons.push({it:it,tIdx:tIdx,idx:idx,tName:t.name})});
  });
  if(transWeapons.length){
    html+='<h4 class="form-h">Оружие в транспорте ('+transWeapons.length+')</h4>';
    html+='<div style="display:flex;flex-direction:column;gap:6px">';
    transWeapons.forEach(function(w){
      var isBonded=!!w.it.bonded;
      var canBond=!isBonded&&!limitReached;
      var btnHtml=isBonded?'<button class="btn btn-ghost" style="padding:4px 10px;font-size:10px;color:var(--danger-bright);border-color:var(--danger)" onclick="toggleWeaponBond(\''+c.id+'\',\'trans\','+w.tIdx+','+w.idx+')">Разорвать</button>':'<button class="btn btn-gold" style="padding:4px 10px;font-size:10px" '+(canBond?'':'disabled style="opacity:.4"')+' onclick="toggleWeaponBond(\''+c.id+'\',\'trans\','+w.tIdx+','+w.idx+')">Связать</button>';
      var badge=isBonded?'<span style="color:var(--temp);font-size:11px;font-weight:600;margin-left:8px">🔗 Оружие связано</span>':'';
      html+='<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(0,0,0,.22);border:1px solid '+(isBonded?'var(--temp)':'var(--border-soft)')+';border-radius:6px"><div><b style="font-family:Cinzel,serif;color:var(--gold-bright)">'+esc(w.it.name)+'</b>'+(w.it.qty>1?' × '+w.it.qty:'')+' <span style="font-size:11px;color:var(--text-dim)">('+esc(w.tName)+')</span>'+badge+'</div>'+btnHtml+'</div>';
    });
    html+='</div>';
  }
  openModal('🔗 Связь с оружием — '+c.name,html,null,{noForm:true,wide:true});
}

function toggleWeaponBond(charId,source,tIdx,idx){
  var c=findChar(charId);if(!c)return;
  var item;
  if(source==='inv')item=c.inventory[idx];
  else if(source==='trans'&&c.transports[tIdx]&&c.transports[tIdx].cargo)item=c.transports[tIdx].cargo[idx];
  if(!item)return;

  if(item.bonded){
    item.bonded=false;
    showToast('Связь с «'+item.name+'» разорвана','');
  }else{
    var bondedCount=getBondedWeapons(c).length;
    if(bondedCount>=2){showToast('Можно привязать максимум 2 оружия. Разорвите связь сначала.','fail');return}
    item.bonded=true;
    showToast('Создана связь с «'+item.name+'»','success');
  }
  save();renderAll();openWeaponBondModal(charId);
}
// --- ПОСЛАННИК КОРОНЫ (Рыцарь Пурпурного Дракона) ---
function openPurpleDragonSkillModal(charId){
  var c=findChar(charId);if(!c)return;
  
  // Если Убеждение уже есть — даем выбрать из 4-х
  if(c.skillProf['persuasion']){
    var opts = [
      {key:'animalHandling', name:'Уход за животными'},
      {key:'insight', name:'Проницательность'},
      {key:'intimidation', name:'Запугивание'},
      {key:'performance', name:'Выступление'}
    ];
    var html = '<p style="margin-bottom:16px;color:var(--text-dim);font-size:15px">Вы уже владеете навыком <b>Убеждение</b>. Согласно умению «Посланник короны», выберите владение другим навыком из списка:</p>';
    html += '<div style="display:flex;flex-direction:column;gap:8px">';
    opts.forEach(function(o){
      var already = c.skillProf[o.key] ? ' (уже есть)' : '';
      html += '<button class="btn btn-ghost" style="justify-content:flex-start;padding:10px" onclick="applyPurpleDragonSkill(\''+c.id+'\',\''+o.key+'\')" '+(c.skillProf[o.key]?'disabled':'')+'>'+o.name+already+'</button>';
    });
    html += '</div>';
    openModal('📜 Посланник короны', html, null, {noForm:true});
  } else {
    // Если Убеждения нет — просто выдаем его
    applyPurpleDragonSkill(charId, 'persuasion');
  }
}

function applyPurpleDragonSkill(charId, skillKey){
  var c=findChar(charId);if(!c)return;
  c.skillProf[skillKey]=true;
  c.purpleDragonSkill=skillKey;
  save(); renderAll(); closeModal();
  var skillObj = SKILLS.find(function(s){return s.key===skillKey});
  var skillName = skillObj ? skillObj.name : skillKey;
  showToast(c.name+': Посланник короны — получено владение ('+skillName+') и компетентность в Убеждении!', 'success');
}
// --- КАВАЛЕРИСТ: ДОП. ВЛАДЕНИЯ ---
function openCavalierProfModal(charId){
  var c=findChar(charId);if(!c)return;
  var html='<p style="margin-bottom:16px;color:var(--text-dim);font-size:15px">Выберите навык или язык (Дополнительные владения):</p>';
  html+='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">';
  var opts=[{k:'performance',n:'Выступление'},{k:'history',n:'История'},{k:'insight',n:'Проницательность'},{k:'persuasion',n:'Убеждение'},{k:'animalHandling',n:'Уход за животными'}];
  opts.forEach(function(o){
    var dis = c.skillProf[o.k] ? 'disabled' : '';
    var already = c.skillProf[o.k] ? ' (уже есть)' : '';
    html+='<button class="btn btn-ghost" style="padding:10px" '+dis+' onclick="applyCavalierProf(\''+c.id+'\',\''+o.k+'\',\''+o.n+'\')">'+o.n+already+'</button>';
  });
  html+='</div><hr style="border-color:var(--border-soft);margin:16px 0"><label style="font-family:Cinzel,serif;font-size:11px;color:var(--gold)">Или выучить язык:</label><div style="margin-top:8px">';
  html+='<select id="cav-lang-select" style="width:100%;margin-bottom:10px">'+LANGUAGES_DB.map(function(l){return '<option value="'+l+'">'+l+'</option>'}).join('')+'</select>';
  html+='<button class="btn btn-gold" onclick="applyCavalierLanguage(\''+c.id+'\')">Выучить язык</button></div>';
  openModal('📜 Дополнительные владения', html, null, {noForm:true, wide:true});
}

function applyCavalierProf(charId, skillKey, skillName){
  var c=findChar(charId);if(!c)return;
  c.skillProf[skillKey]=true;
  c.cavalierProf=skillName;
  save();renderAll();closeModal();
  showToast(c.name+': получено владение ('+skillName+')','success');
}

function applyCavalierLanguage(charId){
  var c=findChar(charId);if(!c)return;
  var sel=document.getElementById('cav-lang-select');if(!sel)return;
  var lang=sel.value;
  c.languages = c.languages ? c.languages + ', ' + lang : lang;
  c.cavalierProf = 'Язык: ' + lang;
  save();renderAll();closeModal();
  showToast(c.name+': выучен язык ('+lang+')','success');
}
// --- КАВАЛЕРИСТ: КНОПКИ НА КАРТОЧКЕ ПЕРСОНАЖА ---
function useCavalierMarkAttackCard(charId){
  var c=findChar(charId);if(!c)return;
  var res=(c.resources||[]).find(r=>(r.name||'').toLowerCase()==='спец. атака (метка)');
  if(!res||res.used>=res.max){showToast('Нет использований','fail');return}
  
  res.used+=1;
  var r1=Math.floor(Math.random()*20)+1;
  var r2=Math.floor(Math.random()*20)+1;
  var chosen=Math.max(r1,r2);
  var strMod=modNum(c.str);
  var pb=profBonus(c.level);
  var totalHit=chosen+strMod+pb;
  var fl=getFighterLevel(c);
  var extraDmg=Math.floor(fl/2);
  
  var msg=c.name+': Спец. атака (Метка)! Преим: d20('+r1+','+r2+')→'+chosen+' +'+strMod+'+'+pb+' = '+totalHit;
  showToast(msg,'success');
  setTimeout(()=>showToast('Доп. урон метки: +'+extraDmg+' (при попадании)','success'),500);
  
  save();renderAll();
}

function useWardingManeuverCard(charId){
  var c=findChar(charId);if(!c)return;
  var res=(c.resources||[]).find(r=>(r.name||'').toLowerCase()==='защитный маневр');
  if(!res||res.used>=res.max){showToast('Защитный маневр закончился','fail');return}
  
  res.used+=1;
  var roll=Math.floor(Math.random()*8)+1;
  
  showToast('🛡 Защитный маневр! +'+roll+' к КД цели (если атака попадёт — сопротивление).','success');
  save();renderAll();
}