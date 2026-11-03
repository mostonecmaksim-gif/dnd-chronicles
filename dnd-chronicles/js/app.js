// js/app.js — Главный файл, связывающий всё вместе

function renderWorlds(){const el=document.getElementById('worlds-list');const q=searchQuery.worlds.toLowerCase().trim();const filtered=q?state.worlds.filter(w=>[w.name,w.tagline,w.description].join(' ').toLowerCase().includes(q)):state.worlds;if(!filtered.length){el.innerHTML='<div class="empty">'+(q?'Ничего не найдено':'Нет миров')+'</div>';return}el.innerHTML=filtered.map(w=>{const chars=state.characters.filter(c=>c.worldId===w.id).length;const gods=state.gods.filter(g=>g.worldId===w.id).length;return'<div class="card" onclick="editWorld(\''+w.id+'\')"><div class="card-head"><h3>'+esc(w.name)+'</h3><div class="card-actions" onclick="event.stopPropagation()"><button class="icon-btn" onclick="editWorld(\''+w.id+'\')">✎</button><button class="icon-btn danger" onclick="deleteItem(\'worlds\',\''+w.id+'\')">✕</button></div></div>'+(w.tagline?'<div class="card-sub">'+esc(w.tagline)+'</div>':'')+(w.description?'<div class="card-note">'+esc(w.description)+'</div>':'')+'<div class="card-meta" style="margin-top:12px"><span>🧙 <b>'+chars+'</b></span><span>⚡ <b>'+gods+'</b></span></div></div>'}).join('')}
function renderGods(){const el=document.getElementById('gods-list');const q=searchQuery.gods.toLowerCase().trim();const filtered=q?state.gods.filter(g=>[g.name,g.title,g.domain,g.description].join(' ').toLowerCase().includes(q)):state.gods;if(!filtered.length){el.innerHTML='<div class="empty">'+(q?'Ничего не найдено':'Пантеон пуст')+'</div>';return}el.innerHTML=filtered.map(g=>{const wn=worldName(g.worldId);return'<div class="card" onclick="editGod(\''+g.id+'\')"><div class="card-head"><h3>'+esc(g.name)+'</h3><div class="card-actions" onclick="event.stopPropagation()"><button class="icon-btn" onclick="editGod(\''+g.id+'\')">✎</button><button class="icon-btn danger" onclick="deleteItem(\'gods\',\''+g.id+'\')">✕</button></div></div>'+(g.title?'<div class="card-sub">«'+esc(g.title)+'»</div>':'')+(g.domain?'<div class="tag">'+esc(g.domain)+'</div>':'')+(g.description?'<div class="card-note">'+esc(g.description)+'</div>':'')+'</div>'}).join('')}
function renderNotes(){const el=document.getElementById('notes-list');const q=searchQuery.notes.toLowerCase().trim();const filtered=q?state.notes.filter(n=>[n.title,n.text].join(' ').toLowerCase().includes(q)):state.notes;if(!filtered.length){el.innerHTML='<div class="empty">'+(q?'Ничего не найдено':'Нет заметок')+'</div>';return}el.innerHTML=filtered.map(n=>{const wn=worldName(n.worldId);return'<div class="card" onclick="editNote(\''+n.id+'\')"><div class="card-head"><h3>'+esc(n.title)+'</h3><div class="card-actions" onclick="event.stopPropagation()"><button class="icon-btn" onclick="editNote(\''+n.id+'\')">✎</button><button class="icon-btn danger" onclick="deleteItem(\'notes\',\''+n.id+'\')">✕</button></div></div>'+(wn?'<div class="tag">'+esc(wn)+'</div>':'')+(n.text?'<div class="card-note" style="max-height:220px">'+esc(n.text)+'</div>':'')+'</div>'}).join('')}

function renderAll(){renderCharacters();renderWorlds();renderGods();renderNotes()}

function worldForm(w){w=w||{};return'<div class="form-grid"><label class="full">Название<input name="name" required value="'+esc(w.name)+'"></label><label class="full">Краткое описание<input name="tagline" value="'+esc(w.tagline)+'"></label><label class="full">Описание<textarea name="description" rows="6">'+esc(w.description)+'</textarea></label></div>'}
function newWorld(){openModal('Новый мир',worldForm(),data=>saveWorld(data,null))}
function editWorld(id){const w=state.worlds.find(x=>x.id===id);if(!w)return;openModal('Редактировать мир',worldForm(w),data=>saveWorld(data,id))}
function saveWorld(data,id){const w={id:id||uid(),name:(data.name||'').trim()||'Безымянный',tagline:(data.tagline||'').trim(),description:(data.description||'').trim()};if(id){const i=state.worlds.findIndex(x=>x.id===id);if(i>-1)state.worlds[i]=w}else state.worlds.push(w);save();renderAll()}
function godForm(g){g=g||{};const wo=state.worlds.map(w=>'<option value="'+w.id+'" '+(g.worldId===w.id?'selected':'')+'>'+esc(w.name)+'</option>').join('');return'<div class="form-grid"><label>Имя<input name="name" required value="'+esc(g.name)+'"></label><label>Мир<select name="worldId"><option value="">— Не привязан —</option>'+wo+'</select></label><label>Домен<input name="domain" value="'+esc(g.domain)+'"></label><label>Мировоззрение<input name="alignment" value="'+esc(g.alignment)+'"></label><label>Символ<input name="symbol" value="'+esc(g.symbol)+'"></label><label>Титул<input name="title" value="'+esc(g.title)+'"></label><label class="full">Описание<textarea name="description" rows="5">'+esc(g.description)+'</textarea></label></div>'}
function newGod(){openModal('Новое божество',godForm(),data=>saveGod(data,null))}
function editGod(id){const g=state.gods.find(x=>x.id===id);if(!g)return;openModal('Редактировать божество',godForm(g),data=>saveGod(data,id))}
function saveGod(data,id){const g={id:id||uid(),name:(data.name||'').trim()||'Безымянный',worldId:data.worldId||'',domain:(data.domain||'').trim(),alignment:(data.alignment||'').trim(),symbol:(data.symbol||'').trim(),title:(data.title||'').trim(),description:(data.description||'').trim()};if(id){const i=state.gods.findIndex(x=>x.id===id);if(i>-1)state.gods[i]=g}else state.gods.push(g);save();renderAll()}
function noteForm(n){n=n||{};const wo=state.worlds.map(w=>'<option value="'+w.id+'" '+(n.worldId===w.id?'selected':'')+'>'+esc(w.name)+'</option>').join('');return'<div class="form-grid"><label>Заголовок<input name="title" required value="'+esc(n.title)+'"></label><label>Мир<select name="worldId"><option value="">— Не привязана —</option>'+wo+'</select></label><label class="full">Текст<textarea name="text" rows="10">'+esc(n.text)+'</textarea></label></div>'}
function newNote(){openModal('Новая заметка',noteForm(),data=>saveNote(data,null))}
function editNote(id){const n=state.notes.find(x=>x.id===id);if(!n)return;openModal('Редактировать заметку',noteForm(n),data=>saveNote(data,id))}
function saveNote(data,id){const n={id:id||uid(),title:(data.title||'').trim()||'Без названия',worldId:data.worldId||'',text:(data.text||'').trim()};if(id){const i=state.notes.findIndex(x=>x.id===id);if(i>-1)state.notes[i]=n}else state.notes.push(n);save();renderAll()}
function deleteItem(type,id){const labels={characters:'персонажа',worlds:'мир',gods:'божество',notes:'заметку'};if(!confirm('Удалить '+labels[type]+'?'))return;state[type]=state[type].filter(x=>x.id!==id);save();renderAll()}

function sortInitiative(){state.initiative.combatants.sort((a,b)=>b.init-a.init)}
function openInitiativeModal(){openModal('⚔ Бой','<div id="init-content"></div>',null,{noForm:true,wide:true,onOpen:refreshInitiative})}
function refreshInitiative(){const el=document.getElementById('init-content');if(el)el.innerHTML=renderInitiativeHTML()}

function getCombatantHP(comb) {
  if (comb.charId) {
    const c = findChar(comb.charId);
    if (c) return { cur: c.hpCur, max: c.hpMax };
  }
  return { cur: comb.hp, max: comb.hpMax };
}

            function renderInitiativeHTML() {
  const ini = state.initiative;
  const activeComb = ini.combatants[ini.currentTurn];
  const targetIdx = ini.targetIdx !== undefined ? ini.targetIdx : -1;
  const targetComb = targetIdx >= 0 ? ini.combatants[targetIdx] : null;
  const charOpts = state.characters.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  
  let topPanel = '';
  
  // Собираем доп. кнопки архетипов
  let extraArchetypeBtns = '';
  if (activeComb && activeComb.charId) {
    const c2 = findChar(activeComb.charId);
    if (c2) {
      const fl = getFighterLevel(c2);
      
      if (c2.fighterArchetype === 'battlemaster' && fl >= 3) {
        const sd = (c2.resources || []).find(r => (r.name || '').toLowerCase() === 'кости превосходства');
        const left = sd ? (sd.max - sd.used) : 0;
        extraArchetypeBtns += '<button class="action-btn" style="border-color:var(--gold)" onclick="openCombatManeuver(' + ini.currentTurn + ')">🎲 Приём (' + left + ')</button>';
      }
      
      if (c2.fighterArchetype === 'eldritch' && fl >= 7 && c2.warMagicReady) {
        extraArchetypeBtns += '<button class="action-btn" style="background:rgba(201,162,39,.3);border-color:var(--gold-bright);color:#fff;animation:pulse 1.5s infinite" onclick="useWarMagicAttackInCombat(' + ini.currentTurn + ')">⚔ Боевая магия</button>';
      }
      
            if (c2.fighterArchetype === 'cavalier' && fl >= 3) {
        // 7+ Защитный маневр
        if (fl >= 7) {
          const wardingRes = (c2.resources || []).find(r => (r.name || '').toLowerCase() === 'защитный маневр');
          const wardingUses = wardingRes ? (wardingRes.max - wardingRes.used) : 0;
          extraArchetypeBtns += '<button class="action-btn" style="border-color:var(--temp);color:var(--temp)" onclick="useWardingManeuver(' + ini.currentTurn + ')" '+(wardingUses<=0||activeComb.reactionUsed?'disabled':'')+'>🛡 Защ. маневр (' + wardingUses + ')</button>';
        }
        
        // 10+ Держать строй
        if (fl >= 10) {
          extraArchetypeBtns += '<button class="action-btn" style="border-color:var(--danger)" onclick="useCavalierHoldTheLine(' + ini.currentTurn + ')" '+(activeComb.reactionUsed?'disabled':'')+'>🛑 Держать строй</button>';
        }
        
        // 15+ Свирепый натиск
        if (fl >= 15) {
          const usedCharge = activeComb.cavalierChargeUsed || false;
          extraArchetypeBtns += '<button class="action-btn" style="border-color:var(--gold)" onclick="useCavalierFerociousCharge(' + ini.currentTurn + ')" '+(usedCharge?'disabled':'')+'>🐎 Натиск</button>';
        }
        
        // 18+ Бдительный защитник
        if (fl >= 18) {
          extraArchetypeBtns += '<button class="action-btn" style="border-color:var(--success)" onclick="useVigilantDefender(' + ini.currentTurn + ')" '+(activeComb.reactionUsed?'disabled':'')+'>👁 Бдит. защитник</button>';
        }

        // 3+ Метка и Спец. атака
        if (activeComb.cavalierMarkActive) {
          const cavRes = (c2.resources || []).find(r => (r.name || '').toLowerCase() === 'спец. атака (метка)');
          const cavUses = cavRes ? (cavRes.max - cavRes.used) : 0;
          extraArchetypeBtns += '<button class="action-btn" style="background:rgba(176,74,58,.3);border-color:var(--danger-bright);color:#fff" onclick="doCavalierMarkAttackInCombat(' + ini.currentTurn + ')" '+(cavUses<=0||activeComb.bonusUsed?'disabled':'')+'>🎯 Спец. атака (' + cavUses + ')</button>';
        } else {
          extraArchetypeBtns += '<button class="action-btn" style="border-color:var(--gold)" onclick="doCavalierMark(' + ini.currentTurn + ')" '+(activeComb.actionUsed?'disabled':'')+'>🎯 Пометить</button>';
        }
      }
    }
  }

  if (activeComb) {
    const hp = getCombatantHP(activeComb);
    if (hp.cur <= 0) {
      topPanel = `<div class="combat-top-panel dead-panel">☠ ${esc(activeComb.name)} — без сознания / мёртв</div>`;
    } else {
      const c = activeComb.charId ? findChar(activeComb.charId) : null;
      const speed = c ? getEffectiveSpeed(c) : 30;
      const maxSpeed = activeComb.dashUsed ? speed * 2 : speed;
      
      let targetLine = '';
      if (targetComb) {
        const tHp = getCombatantHP(targetComb);
        targetLine = `<div style="font-family:Cinzel,serif;font-size:13px;color:var(--danger-bright);margin-bottom:8px;text-align:center">🎯 Цель: <b>${esc(targetComb.name)}</b> (${tHp.cur}/${tHp.max} ХП)</div>`;
      } else {
        targetLine = `<div style="font-family:Cinzel,serif;font-size:13px;color:var(--text-dim);margin-bottom:8px;text-align:center">🎯 Цель не выбрана (кликните по бойцу в списке)</div>`;
      }
      
      topPanel = `
        <div class="combat-top-panel">
          <div class="combat-turn-name">🎯 Ход: <b>${esc(activeComb.name)}</b></div>
          ${targetLine}
          <div class="combat-economy">
            <button class="eco-btn ${activeComb.actionUsed ? 'used' : ''}" onclick="toggleCombatStat('actionUsed')">
              <span>Действие</span><span>${activeComb.actionUsed ? '❌' : '✅'}</span>
            </button>
            <button class="eco-btn ${activeComb.bonusUsed ? 'used' : ''}" onclick="toggleCombatStat('bonusUsed')">
              <span>Бонусное</span><span>${activeComb.bonusUsed ? '❌' : '✅'}</span>
            </button>
            <button class="eco-btn ${activeComb.reactionUsed ? 'used' : ''}" onclick="toggleCombatStat('reactionUsed')">
              <span>Реакция</span><span>${activeComb.reactionUsed ? '❌' : '✅'}</span>
            </button>
          </div>
          <div class="eco-move">
            <span>👣 <span id="move-display">${activeComb.movementUsed}/${maxSpeed} фт</span></span>
            <input type="range" min="0" max="${maxSpeed}" value="${activeComb.movementUsed}" oninput="updateMovement(this.value)" style="flex:1;accent-color:var(--gold)">
          </div>
          <div class="combat-actions-row">
           ${activeComb.isProne ? '<button class="action-btn" style="background:rgba(126,200,224,.2);border-color:var(--temp);color:var(--temp)" onclick="standUp()">🧍 Встать</button>' : ''}
            <button class="action-btn" onclick="openCombatAttack()">⚔ Атака</button>
             ${extraArchetypeBtns}
            ${c ? '<button class="action-btn" onclick="openCombatSpell()">✨ Заклинание</button>' : ''}
            <button class="action-btn" onclick="openCombatGrapple()">🤜 Захват</button>
            <button class="action-btn" onclick="openCombatShove()">💥 Толчок</button>
            <button class="action-btn" onclick="openCombatEscape()">🏃 Высвобождение</button>
            <button class="action-btn" onclick="openCombatHelp()">🤝 Помощь</button>
            <button class="action-btn" onclick="openCombatUseItem()">🎒 Предмет</button>
            <button class="action-btn" onclick="combatAction('dash')">🏃 Рывок</button>
            <button class="action-btn" onclick="combatAction('dodge')">🛡 Уклонение</button>
            <button class="action-btn" onclick="combatAction('disengage')">↩ Отход</button>
            ${activeComb.ammoFired && Object.values(activeComb.ammoFired).some(v => v > 0) ? '<button class="action-btn" style="background:rgba(126,200,126,.2);border-color:var(--success);color:var(--success)" onclick="openAmmoRecovery(' + ini.currentTurn + ')">🏹 Собрать (🔍)</button>' : ''}
          </div>
        </div>
      `;
    }
  } else {
    topPanel = '<div class="combat-top-panel" style="text-align:center;color:var(--text-dim);font-style:italic">Нет участников</div>';
  }
  
  const listHTML = ini.combatants.length
    ? ini.combatants.map((comb, idx) => {
        const isActive = idx === ini.currentTurn;
        const hp = getCombatantHP(comb);
        const isDead = hp.cur <= 0;
        const isTarget = targetIdx === idx;
        const badges = [];
        if (comb.isGrappled) badges.push('🤜 Схвачен');
        if (comb.isProne) badges.push('⬇️ Лежит');
        if (comb.hasAdvantage) badges.push('🎯 Преим.');
        return `
          <div class="init-row-v2 ${isActive ? 'active' : ''} ${isDead ? 'dead' : ''} ${isTarget ? 'target' : ''}" onclick="selectTarget(${idx})">
            <div class="init-init">${comb.init}</div>
            <div class="init-name">${esc(comb.name)} ${badges.map(b => `<span class="status-badge">${b}</span>`).join('')}</div>
            <div class="init-hp">❤️ <b>${hp.cur}</b>/${hp.max}</div>
            <div class="init-actions" onclick="event.stopPropagation()">
              <button class="init-btn" title="Сделать активным" onclick="setTurnTo(${idx})">🎯</button>
              <button class="init-btn" onclick="changeInitHP(${idx}, -1)">−</button>
              <button class="init-btn" onclick="changeInitHP(${idx}, 1)">+</button>
              <button class="init-btn" onclick="rollInitFor(${idx})">🎲</button>
              <button class="init-btn danger" onclick="removeInit(${idx})">✕</button>
            </div>
          </div>
        `;
      }).join('')
    : '<div class="init-empty">Трекер пуст</div>';
  return `
    <div class="init-controls">
      <span class="init-round">Раунд ${ini.round}</span>
      <button class="btn btn-ghost" onclick="nextTurn()">Следующий →</button>
      <button class="btn btn-ghost" onclick="nextRound()">Раунд +1</button>
      <button class="btn btn-ghost" onclick="rollAllInit()">🎲 Всем</button>
      <button class="btn btn-ghost" onclick="clearInitiative()" style="color:var(--danger-bright)">Очистить</button>
    </div>
    ${topPanel}
    <div class="init-list-v2">${listHTML}</div>
    <h4 class="form-h">Добавить участника</h4>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
      <select id="init-char-select" style="flex:2"><option value="">— Персонаж —</option>${charOpts}</select>
      <button class="btn btn-gold" onclick="addCharToInitiative()">+</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <input type="text" id="init-manual-name" placeholder="Монстр / NPC" style="flex:2">
      <input type="number" id="init-manual-init" placeholder="Иниц." value="10" style="flex:1">
      <input type="number" id="init-manual-hp" placeholder="ХП" value="10" style="flex:1">
      <button class="btn btn-gold" onclick="addManualToInitiative()">+</button>
    </div>
  `;
}
function addCharToInitiative() {
  const sel = document.getElementById('init-char-select');
  if (!sel || !sel.value) return;
  const c = findChar(sel.value);
  if (!c) return;
  const init = Math.floor(Math.random() * 20) + 1 + modNum(c.dex);
  state.initiative.combatants.push({
    id: uid(), name: c.name, init, hp: c.hpCur, hpMax: c.hpMax, charId: c.id,
    actionUsed: false, bonusUsed: false, reactionUsed: false,
    movementUsed: 0, dashUsed: false, dodging: false,
    isGrappled: false, isProne: false, hasAdvantage: false,
    cavalierMarkActive: false, cavalierMarkTarget: undefined,
    cavalierChargeUsed: false
  });
  sortInitiative();
  if (typeof restoreManeuverDieOnInitiative === 'function') restoreManeuverDieOnInitiative(c);
  save(); refreshInitiative();
}

function addManualToInitiative() {
  const name = document.getElementById('init-manual-name').value.trim();
  if (!name) return;
  const init = num(document.getElementById('init-manual-init').value, 10);
  const hp = num(document.getElementById('init-manual-hp').value, 10);
  state.initiative.combatants.push({
    id: uid(), name, init, hp, hpMax: hp, charId: null,
    actionUsed: false, bonusUsed: false, reactionUsed: false,
    movementUsed: 0, dashUsed: false, dodging: false,
    isGrappled: false, isProne: false, hasAdvantage: false,
    cavalierMarkActive: false, cavalierMarkTarget: undefined,
    cavalierChargeUsed: false
  });
  sortInitiative(); save(); refreshInitiative();
}

function changeInitHP(idx, delta) {
  const comb = state.initiative.combatants[idx];
  if (!comb) return;
  if (comb.charId) {
    if (delta < 0) applyDamage(comb.charId, -delta);
    else applyHeal(comb.charId, delta);
    const c = findChar(comb.charId);
    if (c) comb.hp = c.hpCur;
    refreshInitiative();
  } else {
    comb.hp = Math.max(0, Math.min(comb.hpMax, comb.hp + delta));
    save(); refreshInitiative();
  }
}

function nextTurn() {
  if (!state.initiative.combatants.length) return;
  state.initiative.currentTurn++;
  if (state.initiative.currentTurn >= state.initiative.combatants.length) {
    state.initiative.currentTurn = 0;
    state.initiative.round++;
  }
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (comb) {
       comb.cavalierMarkActive = false;
    comb.cavalierMarkTarget = undefined;
    comb.cavalierChargeUsed = false;
  }
  triggerSurvivor(state.initiative.currentTurn);
  save(); refreshInitiative();
}

function nextRound() {
  state.initiative.round++;
  state.initiative.currentTurn = 0;
  const comb = state.initiative.combatants[0];
  if (comb) {
        comb.cavalierMarkActive = false;
    comb.cavalierMarkTarget = undefined;
    comb.cavalierChargeUsed = false;
  }
  triggerSurvivor(0);
  save(); refreshInitiative();
}
function clearInitiative(){
  const withAmmo = state.initiative.combatants.filter(c => c.ammoFired && Object.values(c.ammoFired).some(v => v > 0));
  if (withAmmo.length > 0) {
    if (!confirm('Есть неподобранные боеприпасы (' + withAmmo.map(c => c.name).join(', ') + '). Собрать их перед закрытием боя?')) {
      if (!confirm('Точно очистить без подбора?')) return;
    } else {
      // Автосбор: берём всё что было выпущено
      withAmmo.forEach(c => {
        // Открываем по очереди? Проще: автоматически собрать всё
        const idx = state.initiative.combatants.indexOf(c);
        const c2 = findChar(c.charId);
        if (!c2) return;
        Object.keys(c.ammoFired).forEach(type => {
          const toRecover = c.ammoFired[type];
          if (toRecover === 0) return;
          let whole = 0, broken = 0;
          for (let i = 0; i < toRecover; i++) {
            const roll = Math.floor(Math.random() * 4) + 1;
            if (roll === 1) broken++; else whole++;
          }
          if (whole > 0) {
            const ex = c2.inventory.find(it => it.name === type && !it.broken);
            if (ex) ex.qty = (ex.qty || 0) + whole;
            else c2.inventory.push(buildItemFromName(type, whole));
          }
          if (broken > 0) {
            const bn = type + ' (сломанные)';
            const exb = c2.inventory.find(it => it.name === bn);
            if (exb) exb.qty = (exb.qty || 0) + broken;
            else c2.inventory.push(buildItemFromName(bn, broken));
          }
        });
        c.ammoFired = {};
      });
      renderAll();
    }
  } else {
    if (!confirm('Очистить?')) return;
  }
  state.initiative={combatants:[],currentTurn:0,round:1};
  save(); refreshInitiative();
}

function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='dnd-chronicles-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(url)}
document.getElementById('import-file').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{try{const data=JSON.parse(ev.target.result);if(!confirm('Импорт заменит все данные. Продолжить?'))return;state={characters:[],worlds:[],gods:[],notes:[],initiative:{combatants:[],currentTurn:0,round:1},...data};state.characters=state.characters.map(normalizeCharacter);if(!state.initiative)state.initiative={combatants:[],currentTurn:0,round:1};save();renderAll();alert('Импорт завершён.')}catch(err){alert('Ошибка: '+err.message)}};r.readAsText(file);e.target.value=''});

function openModal(title,bodyHTML,onSubmit,opts){opts=opts||{};const overlay=document.getElementById('modal-overlay');
  if(opts.noForm){overlay.innerHTML='<div class="modal '+(opts.wide?'wide':'')+'"><div class="modal-header"><h2>'+esc(title)+'</h2><button class="modal-close" type="button" onclick="closeModal()">✕</button></div><div class="modal-body">'+bodyHTML+'</div></div>';overlay.classList.add('active');document.body.style.overflow='hidden';if(opts.onOpen)opts.onOpen();return}
  overlay.innerHTML='<div class="modal '+(opts.wide?'wide':'')+'"><div class="modal-header"><h2>'+esc(title)+'</h2><button class="modal-close" type="button" onclick="closeModal()">✕</button></div><form id="modal-form"><div class="modal-body">'+bodyHTML+'</div><div class="modal-footer"><button type="button" class="btn btn-ghost" onclick="closeModal()">Отмена</button><button type="submit" class="btn btn-gold">Сохранить</button></div></form></div>';
  overlay.classList.add('active');document.body.style.overflow='hidden';
  const formEl=document.getElementById('modal-form');
  formEl.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target).entries());const r=onSubmit(data,formEl);if(r!==false)closeModal()});
  if(opts.onOpen)opts.onOpen(formEl)}
function closeModal(){const overlay=document.getElementById('modal-overlay');overlay.classList.remove('active');overlay.innerHTML='';document.body.style.overflow=''}

document.addEventListener('DOMContentLoaded',()=>{
  const overlay=document.getElementById('modal-overlay');
  overlay.addEventListener('mousedown',e=>{if(e.target===overlay)closeModal()});
const overlay2 = document.getElementById('modal-overlay-2');
if (overlay2) overlay2.addEventListener('mousedown', e => { if (e.target === overlay2) closeSubModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const o2 = document.getElementById('modal-overlay-2');
    if (o2 && o2.classList.contains('active')) { closeSubModal(); return; }
    const o1 = document.getElementById('modal-overlay');
    if (o1 && o1.classList.contains('active')) closeModal();
  }
});
  document.querySelectorAll('.tab').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');document.getElementById('tab-'+btn.dataset.tab).classList.add('active')})});
  document.querySelectorAll('.ref-tab').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.ref-tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.ref-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');document.getElementById('ref-'+btn.dataset.ref).classList.add('active')})});
  document.querySelectorAll('.class-sel-btn').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.class-sel-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.class-ref-content').forEach(p=>p.classList.remove('active'));btn.classList.add('active');document.getElementById('ref-class-'+btn.dataset.classRef).classList.add('active')})});
  document.querySelectorAll('.arch-tab').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.arch-tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.arch-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');document.getElementById('arch-panel-'+btn.dataset.archRef).classList.add('active')})});
  load();renderAll();
});
// ===== БОЕВАЯ ПАНЕЛЬ (НОВАЯ) =====
function openSubModal(title, bodyHTML) {
  const overlay = document.getElementById('modal-overlay-2');
  if (!overlay) { showToast('Ошибка: окно не найдено', 'fail'); return; }
  overlay.innerHTML = '<div class="modal"><div class="modal-header"><h2>' + esc(title) + '</h2><button class="modal-close" type="button" onclick="closeSubModal()">✕</button></div><div class="modal-body">' + bodyHTML + '</div></div>';
  overlay.classList.add('active');
}
function closeSubModal() {
  const overlay = document.getElementById('modal-overlay-2');
  if (!overlay) return;
  overlay.classList.remove('active');
  overlay.innerHTML = '';
}

function setTurnTo(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb) return;
  state.initiative.currentTurn = idx;
  comb.actionUsed = false; comb.bonusUsed = false; comb.reactionUsed = false;
  comb.movementUsed = 0; comb.dashUsed = false; comb.dodging = false;
  comb.cavalierChargeUsed = false; // <--- ВОТ ЭТА СТРОКА
  save(); refreshInitiative();
}

function toggleCombatStat(stat) {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  comb[stat] = !comb[stat];
  save(); refreshInitiative();
}

function updateMovement(val) {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  comb.movementUsed = Math.max(0, parseInt(val, 10) || 0);
  save();
  const disp = document.getElementById('move-display');
  if (disp) {
    const c = comb.charId ? findChar(comb.charId) : null;
    const speed = c ? getEffectiveSpeed(c) : 30;
    const maxSpeed = comb.dashUsed ? speed * 2 : speed;
    disp.textContent = comb.movementUsed + '/' + maxSpeed + ' фт';
  }
}

function combatAction(action) {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  if (comb.actionUsed) { showToast('Действие уже использовано', 'fail'); return; }
  if (action === 'dash') {
    comb.actionUsed = true; comb.dashUsed = true;
    showToast(comb.name + ': 🏃 Рывок! Скорость удвоена', 'success');
  } else if (action === 'dodge') {
    comb.actionUsed = true; comb.dodging = true;
    showToast(comb.name + ': 🛡 Уклонение! Атаки по нему с помехой', 'success');
  } else if (action === 'disengage') {
    comb.actionUsed = true;
    showToast(comb.name + ': ↩ Отход! Перемещение не провоцирует атаки', 'success');
  }
  save(); refreshInitiative();
}

function openCombatAttack() {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  const targetIdx = state.initiative.targetIdx !== undefined ? state.initiative.targetIdx : -1;
  const target = targetIdx >= 0 ? state.initiative.combatants[targetIdx] : null;
  if (!target) { showToast('Сначала выберите цель (кликните по бойцу в списке)', 'fail'); return; }
  if (targetIdx === state.initiative.currentTurn) { showToast('Нельзя атаковать самого себя', 'fail'); return; }
  if (comb.actionUsed && comb.bonusUsed) { showToast('Оба действия уже потрачены', 'fail'); return; }

  let weapons = [], attackMod = 0, c = null;
  if (comb.charId) {
    c = findChar(comb.charId);
    if (c) {
      weapons = (c.inventory || []).filter(i => i.itemType === 'weapon' && i.equipped);
      attackMod = Math.max(modNum(c.str), modNum(c.dex)) + profBonus(c.level);
    }
  }

  let html = '<p style="margin-bottom:12px;color:var(--text-dim);font-size:14px">Выберите оружие:</p>';
  if (weapons.length > 0) {
    html += weapons.map((w, i) => `
      <button class="maneuver-pick" style="width:100%;margin-bottom:6px;text-align:left" onclick="selectCombatWeapon(${i}, ${attackMod})">
        <div class="mp-name">${esc(w.name)}</div>
        <div class="mp-desc">${w.damage || '—'} ${w.damageType || ''} · Мод атаки: ${attackMod >= 0 ? '+' + attackMod : attackMod}</div>
      </button>
    `).join('');
  } else if (c) {
    html += `<button class="maneuver-pick" style="width:100%;margin-bottom:6px;text-align:left" onclick="selectCombatWeapon(-1, ${attackMod})">
      <div class="mp-name">Без оружия (кулак)</div>
      <div class="mp-desc">1 дробящий · Мод атаки: ${attackMod >= 0 ? '+' + attackMod : attackMod}</div>
    </button>`;
  }
    if (!comb.charId) {
    html += '<hr style="border-color:var(--border-soft);margin:12px 0">';
    html += '<p style="color:var(--gold);font-size:13px;font-family:Cinzel,serif;margin-bottom:8px;letter-spacing:0.5px">Бонус к попаданию:</p>';
    html += '<input type="number" id="monster-atk-mod" value="3" style="width:100%;margin-bottom:12px;text-align:center;font-size:16px">';
    html += '<p style="color:var(--gold);font-size:13px;font-family:Cinzel,serif;margin-bottom:8px;letter-spacing:0.5px">Кубик урона:</p>';
    html += '<select id="monster-damage-die" style="width:100%;margin-bottom:12px;font-size:15px">';
    ['1d4','1d6','1d8','1d10','1d12','2d4','2d6','2d8','2d10','3d6','3d8','4d6','4d8','5d6','6d6','8d6','10d6'].forEach(d => {
      html += '<option value="' + d + '"' + (d === '1d6' ? ' selected' : '') + '>' + d + '</option>';
    });
    html += '</select>';
    html += '<p style="color:var(--gold);font-size:13px;font-family:Cinzel,serif;margin-bottom:8px;letter-spacing:0.5px">Бонус к урону:</p>';
    html += '<input type="number" id="monster-dmg-mod" value="0" style="width:100%;margin-bottom:12px;text-align:center;font-size:16px">';
    html += '<button class="btn btn-gold" style="width:100%" onclick="rollMonsterAttack()">⚔ Бросить атаку</button>';
  }

  openSubModal('⚔ Атака — ' + comb.name + ' → ' + target.name, html);
}

function selectCombatWeapon(weaponIdx, attackMod) {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  let w = { name: 'Без оружия (кулак)', damage: '1', damageType: 'дробящий' };
  if (comb.charId && weaponIdx >= 0) {
    const c = findChar(comb.charId);
    if (c) {
      const weapons = (c.inventory || []).filter(i => i.itemType === 'weapon' && i.equipped);
      w = weapons[weaponIdx] || w;
    }
  }
  window._combatWeapon = w;
  window._combatAtkMod = attackMod;
  const html = `
    <p style="margin-bottom:12px;color:var(--text-dim);font-size:14px">Оружие: <b>${esc(w.name)}</b> · Мод: ${attackMod >= 0 ? '+' + attackMod : attackMod}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-gold" style="flex:1" onclick="doCombatAttackRoll('normal')">Обычный</button>
      <button class="btn btn-ghost" style="flex:1" onclick="doCombatAttackRoll('adv')">С преимуществом</button>
      <button class="btn btn-ghost" style="flex:1;color:var(--danger-bright)" onclick="doCombatAttackRoll('dis')">С помехой</button>
    </div>
  `;
  openSubModal('🎲 Бросок атаки', html);
}

function doCombatAttackRoll(mode) {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb || !window._combatWeapon) return;
  const targetIdx = state.initiative.targetIdx !== undefined ? state.initiative.targetIdx : -1;
  const target = targetIdx >= 0 ? state.initiative.combatants[targetIdx] : null;
  if (!target) { showToast('Цель не выбрана', 'fail'); closeSubModal(); return; }

  if (mode === 'normal' && target.hasAdvantage) {
    mode = 'adv';
    target.hasAdvantage = false;
    showToast('Помощь союзника даёт преимущество!', 'success');
  }
  if (mode === 'normal' && target.isProne) mode = 'adv';
  if (comb.isProne) mode = 'dis';

    const w = window._combatWeapon;
  const attackMod = window._combatAtkMod || 0;
  
  // Расход боеприпасов для дальнобойного оружия
  if (comb.charId) {
    const ammoType = getAmmoType(w.name);
    if (ammoType) {
      if (!consumeAmmo(comb.charId, ammoType)) {
        showToast('Нет ' + ammoType.toLowerCase() + ' в инвентаре!', 'fail');
        closeSubModal();
        return;
      }
      trackAmmoFired(comb, ammoType);
    }
  }
  
  let r1 = Math.floor(Math.random() * 20) + 1;
  let r2 = Math.floor(Math.random() * 20) + 1;
  let chosen = r1;
  let rollText = 'd20(' + r1 + ')';
  if (mode === 'adv') { chosen = Math.max(r1, r2); rollText = 'преим d20(' + r1 + ',' + r2 + ')→' + chosen; }
  else if (mode === 'dis') { chosen = Math.min(r1, r2); rollText = 'помеха d20(' + r1 + ',' + r2 + ')→' + chosen; }

  const total = chosen + attackMod;
  let critThreshold = 20;
  if (comb.charId) {
    const ctc = findChar(comb.charId);
    if (ctc) critThreshold = getCritThreshold(ctc);
  }
  const crit = chosen >= critThreshold;
  let msg = comb.name + ': ' + w.name + ' по ' + target.name + '. ' + rollText + ' ' + (attackMod >= 0 ? '+' + attackMod : attackMod) + ' = ' + total;
  if (crit) msg += ' 🎯 КРИТ!';
  if (chosen === 1) msg += ' 💀 ПРОМАХ!';
  showToast(msg, crit ? 'crit-success' : (chosen === 1 ? 'crit-fail' : ''));

  // Износ оружия при критическом промахе (нат. 1)
  if (chosen === 1 && comb.charId) {
    damageItemDurability(comb.charId, w.name, 1);
  }
  // Износ брони при критическом попадании врага по вам (нат. 20)
  if (target.charId && crit) {
    const tc = findChar(target.charId);
    if (tc) {
      const armor = tc.inventory.find(it => it.equipped && (it.itemType === 'armor' || it.itemType === 'shield') && !it.broken);
      if (armor) damageItemDurability(tc.id, armor.name, 1);
    }
  }

  let hit = chosen !== 1;
  if (chosen === 20) hit = true;

  if (hit && w.damage && w.damage !== '—') {
    const m = w.damage.match(/(\d*)к(\d+)/i);
    if (m) {
      const count = parseInt(m[1] || '1', 10);
      const sides = parseInt(m[2], 10);
      const rollCount = crit ? count * 2 : count;
      let rolls = [], ttl = 0;
      for (let i = 0; i < rollCount; i++) {
        const dr = Math.floor(Math.random() * sides) + 1;
        rolls.push(dr); ttl += dr;
      }
      if (attackMod > 0) ttl += attackMod;
      if (target.charId) {
        const tc = findChar(target.charId);
        if (tc) {
          applyDamage(tc.id, ttl);
          target.hp = tc.hpCur;
          if (tc.hpCur <= 0) showToast('☠ ' + tc.name + ' падает без сознания!', 'fail');
        }
      } else {
        target.hp = Math.max(0, target.hp - ttl);
        if (target.hp <= 0) showToast('☠ ' + target.name + ' повержен!', 'fail');
      }
      const dmgStr = rolls.join('+') + (attackMod > 0 ? '+' + attackMod : '');
      setTimeout(() => showToast(w.name + ': урон ' + dmgStr + ' = ' + ttl + ' ' + (w.damageType || '') + ' по ' + target.name, 'success'), 500);
    }
  }
  
  if (!comb.actionUsed) comb.actionUsed = true;
  else if (!comb.bonusUsed) comb.bonusUsed = true;
  save(); refreshInitiative(); closeSubModal();
}
function rollMonsterAttack() {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  const targetIdx = state.initiative.targetIdx !== undefined ? state.initiative.targetIdx : -1;
  const target = targetIdx >= 0 ? state.initiative.combatants[targetIdx] : null;
  if (!target) { showToast('Выберите цель', 'fail'); closeSubModal(); return; }
  
  const mod = parseInt((document.getElementById('monster-atk-mod') || {}).value, 10) || 0;
  const dmgDie = (document.getElementById('monster-damage-die') || {}).value || '1d6';
  const dmgMod = parseInt((document.getElementById('monster-dmg-mod') || {}).value, 10) || 0;
  
  const r = Math.floor(Math.random() * 20) + 1;
  const total = r + mod;
  let msg = comb.name + ' атакует ' + target.name + ': d20(' + r + ') ' + (mod >= 0 ? '+' + mod : mod) + ' = ' + total;
  if (r === 20) msg += ' 🎯 КРИТ!';
  if (r === 1) msg += ' 💀 ПРОМАХ!';
  showToast(msg, r === 20 ? 'crit-success' : (r === 1 ? 'crit-fail' : ''));
  
  const hit = r !== 1;
  if (hit) {
    const m = dmgDie.match(/(\d+)d(\d+)/i);
    if (m) {
      const count = parseInt(m[1], 10);
      const sides = parseInt(m[2], 10);
      const rollCount = r === 20 ? count * 2 : count;
      let rolls = [], ttl = 0;
      for (let i = 0; i < rollCount; i++) {
        const dr = Math.floor(Math.random() * sides) + 1;
        rolls.push(dr); ttl += dr;
      }
      ttl += dmgMod;
      if (target.charId) {
        const tc = findChar(target.charId);
        if (tc) { applyDamage(tc.id, ttl); target.hp = tc.hpCur; }
      } else {
        target.hp = Math.max(0, target.hp - ttl);
      }
      const dmgStr = dmgDie + '(' + rolls.join('+') + ')' + (dmgMod ? (dmgMod >= 0 ? '+' + dmgMod : dmgMod) : '');
      setTimeout(() => showToast('Урон: ' + dmgStr + ' = ' + ttl + ' по ' + target.name, 'success'), 500);
    }
  }
  
  if (!comb.actionUsed) comb.actionUsed = true;
  else if (!comb.bonusUsed) comb.bonusUsed = true;
  save(); refreshInitiative(); closeSubModal();
}
function openCombatSpell() {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  if (!comb.charId) { showToast('Заклинания только у персонажей', 'fail'); return; }
  const c = findChar(comb.charId);
  if (!c) return;
  if (!c.spells || c.spells.length === 0) { showToast('У ' + c.name + ' нет заклинаний в книге', 'fail'); return; }
  let html = '<p style="margin-bottom:12px;color:var(--text-dim);font-size:14px">Выберите заклинание:</p>';
  html += c.spells.map((s, i) => {
    const lvl = s.level === 0 ? 'Заговор' : 'Ур. ' + s.level;
    const slots = c.spellSlots[s.level] || { max: 0, used: 0 };
    const avail = s.level === 0 ? '∞' : (slots.max - slots.used) + '/' + slots.max;
    return `<button class="maneuver-pick" style="width:100%;margin-bottom:6px;text-align:left" onclick="castCombatSpell(${i})">
      <div class="mp-name">${esc(s.name)}</div>
      <div class="mp-desc">${lvl} · Ячеек: ${avail}</div>
    </button>`;
  }).join('');
  openSubModal('✨ Заклинание — ' + comb.name, html);
}

function castCombatSpell(spellIdx) {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb || !comb.charId) return;
  const c = findChar(comb.charId);
  if (!c) return;
  const s = c.spells[spellIdx];
  if (!s) return;
  if (comb.actionUsed) { showToast('Действие уже потрачено', 'fail'); return; }
    if (s.level === 0) {
    comb.actionUsed = true;
    showToast(c.name + ': заговор «' + s.name + '»', 'success');
    const fl = getFighterLevel(c);
    if (c.fighterArchetype === 'eldritch' && fl >= 7) {
      c.warMagicReady = true;
      save();
      setTimeout(() => showToast('⚔ Боевая магия! Можете атаковать бонусным действием', 'success'), 500);
    }
  }
  save(); refreshInitiative(); closeSubModal();
}
function selectTarget(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb) return;
  if (state.initiative.targetIdx === idx) state.initiative.targetIdx = -1;
  else state.initiative.targetIdx = idx;
  save(); refreshInitiative();
}
// ===== ДОПОЛНИТЕЛЬНЫЕ ДЕЙСТВИЯ В БОЮ =====

function getGrappleMods(comb, target) {
  const atkMod = comb.charId ? (modNum(findChar(comb.charId).str) + (findChar(comb.charId).skillProf['athletics'] ? profBonus(findChar(comb.charId).level) : 0)) : 3;
  const defMod = target.charId ? Math.max(modNum(findChar(target.charId).str), modNum(findChar(target.charId).dex)) + (findChar(target.charId).skillProf['acrobatics'] ? profBonus(findChar(target.charId).level) : 0) : 2;
  return { atkMod, defMod };
}

function openCombatGrapple() {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  const targetIdx = state.initiative.targetIdx !== undefined ? state.initiative.targetIdx : -1;
  const target = targetIdx >= 0 ? state.initiative.combatants[targetIdx] : null;
  if (!target) { showToast('Выберите цель', 'fail'); return; }
  if (comb.actionUsed) { showToast('Действие уже потрачено', 'fail'); return; }
  
  const { atkMod, defMod } = getGrappleMods(comb, target);
  const atkRoll = Math.floor(Math.random() * 20) + 1 + atkMod;
  const defRoll = Math.floor(Math.random() * 20) + 1 + defMod;
  let msg = `${comb.name} пытается схватить ${target.name}. Атлетика: ${atkRoll} vs ${defRoll}. `;
  if (atkRoll > defRoll) {
    target.isGrappled = true;
    msg += '✅ Успех! Цель схвачена.';
    showToast(msg, 'success');
  } else {
    msg += '❌ Провал.';
    showToast(msg, 'fail');
  }
  comb.actionUsed = true;
  save(); refreshInitiative();
}

function openCombatShove() {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  const targetIdx = state.initiative.targetIdx !== undefined ? state.initiative.targetIdx : -1;
  const target = targetIdx >= 0 ? state.initiative.combatants[targetIdx] : null;
  if (!target) { showToast('Выберите цель', 'fail'); return; }
  if (comb.actionUsed) { showToast('Действие уже потрачено', 'fail'); return; }
  
  const { atkMod, defMod } = getGrappleMods(comb, target);
  const atkRoll = Math.floor(Math.random() * 20) + 1 + atkMod;
  const defRoll = Math.floor(Math.random() * 20) + 1 + defMod;
  let msg = `${comb.name} толкает ${target.name}. Атлетика: ${atkRoll} vs ${defRoll}. `;
  if (atkRoll > defRoll) {
    const choice = confirm('Успех! ОК — сбить с ног. Отмена — оттолкнуть на 5 футов.');
    if (choice) {
      target.isProne = true;
      msg += '⬇️ Цель сбита с ног!';
    } else {
      msg += '💨 Цель оттолкнута на 5 футов.';
    }
    showToast(msg, 'success');
  } else {
    msg += '❌ Провал.';
    showToast(msg, 'fail');
  }
  comb.actionUsed = true;
  save(); refreshInitiative();
}

function openCombatEscape() {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  if (!comb.isGrappled) { showToast('Вы не схвачены', 'fail'); return; }
  if (comb.actionUsed) { showToast('Действие уже потрачено', 'fail'); return; }
  
  const mod = comb.charId ? Math.max(modNum(findChar(comb.charId).str), modNum(findChar(comb.charId).dex)) + (findChar(comb.charId).skillProf['acrobatics'] ? profBonus(findChar(comb.charId).level) : 0) : 2;
  const roll = Math.floor(Math.random() * 20) + 1 + mod;
  if (roll >= 12) {
    comb.isGrappled = false;
    showToast(`${comb.name} высвобождается! (Атлетика: ${roll})`, 'success');
  } else {
    showToast(`${comb.name} не может высвободиться (Атлетика: ${roll})`, 'fail');
  }
  comb.actionUsed = true;
  save(); refreshInitiative();
}

function openCombatHelp() {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  const targetIdx = state.initiative.targetIdx !== undefined ? state.initiative.targetIdx : -1;
  const target = targetIdx >= 0 ? state.initiative.combatants[targetIdx] : null;
  if (!target) { showToast('Выберите союзника', 'fail'); return; }
  if (comb.actionUsed) { showToast('Действие уже потрачено', 'fail'); return; }
  target.hasAdvantage = true;
  comb.actionUsed = true;
  save(); refreshInitiative();
  showToast(`${comb.name} помогает ${target.name}! Следующая атака по цели с преимуществом.`, 'success');
}

function openCombatUseItem() {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  if (comb.actionUsed) { showToast('Действие уже потрачено', 'fail'); return; }
  comb.actionUsed = true;
  save(); refreshInitiative();
  showToast(`${comb.name} использует предмет.`, 'success');
}
function damageItemDurability(charId, itemName, amount) {
  const c = findChar(charId); if (!c) return;
  const idx = c.inventory.findIndex(it => it.name === itemName && it.equipped && !it.broken);
  if (idx < 0) return;
  const it = c.inventory[idx];
  it.hpCur = Math.max(0, (it.hpCur || it.hpMax || 10) - amount);
  if (it.hpCur <= 0) {
    it.broken = true;
    it.equipped = false;
    showToast('💔 ' + it.name + ' сломалось и снято!', 'crit-fail');
  } else if (it.hpCur <= Math.ceil(it.hpMax * 0.25)) {
    showToast('⚠ ' + it.name + ' на грани поломки! (Прочность ' + it.hpCur + '/' + it.hpMax + ')', 'fail');
  }
  save();
}
function standUp() {
  const comb = state.initiative.combatants[state.initiative.currentTurn];
  if (!comb) return;
  if (!comb.isProne) { showToast('Вы не лежите', 'fail'); return; }
  const c = comb.charId ? findChar(comb.charId) : null;
  const speed = c ? getEffectiveSpeed(c) : 30;
  const halfSpeed = Math.floor(speed / 2);
  if (comb.movementUsed + halfSpeed > speed) {
    showToast('Недостаточно движения! Нужно ' + halfSpeed + ' фт.', 'fail');
    return;
  }
  comb.movementUsed += halfSpeed;
  comb.isProne = false;
  showToast(comb.name + ' встаёт (потрачено ' + halfSpeed + ' фт)', 'success');
  save(); refreshInitiative();
}
function getAmmoType(weaponName) {
  if (!weaponName) return null;
  const n = weaponName.toLowerCase();
  if (n.indexOf('арбалет') >= 0) return 'Болты';
  if (n.indexOf('лук') >= 0) return 'Стрелы';
  return null;
}

function consumeAmmo(charId, ammoType) {
  const c = findChar(charId); if (!c) return false;
  const idx = c.inventory.findIndex(it => it.name === ammoType && !it.broken);
  if (idx < 0) return false;
  const ammo = c.inventory[idx];
  ammo.qty = (ammo.qty || 1) - 1;
  if (ammo.qty <= 0) c.inventory.splice(idx, 1);
  save();
  return true;
}

function trackAmmoFired(combatant, ammoType) {
  if (!combatant.ammoFired) combatant.ammoFired = {};
  combatant.ammoFired[ammoType] = (combatant.ammoFired[ammoType] || 0) + 1;
}

function openAmmoRecovery(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb || !comb.charId) { showToast('Только для персонажей', 'fail'); return; }
  if (!comb.ammoFired) { showToast('Нет выпущенных боеприпасов', 'fail'); return; }
  const c = findChar(comb.charId);
  if (!c) return;
  
  let rows = '';
  let totalFired = 0;
  Object.keys(comb.ammoFired).forEach(type => {
    const fired = comb.ammoFired[type];
    if (fired > 0) {
      totalFired += fired;
      rows += '<div style="margin-bottom:12px;padding:12px 14px;background:rgba(0,0,0,.25);border:1px solid var(--border-soft);border-radius:8px">' +
        '<div style="font-family:Cinzel,serif;font-size:13px;color:var(--gold-bright);margin-bottom:10px">' + esc(type) + ' <span style="color:var(--text-dim);font-size:12px">(выпущено: ' + fired + ')</span></div>' +
        '<div style="display:flex;gap:10px;align-items:center">' +
          '<input type="range" min="0" max="' + fired + '" value="' + fired + '" id="recover-range-' + type + '" style="flex:1;accent-color:var(--gold)" oninput="document.getElementById(\'recover-' + type + '\').value=this.value;document.getElementById(\'recover-val-' + type + '\').textContent=this.value">' +
          '<input type="number" min="0" max="' + fired + '" value="' + fired + '" id="recover-' + type + '" style="width:70px;text-align:center" oninput="document.getElementById(\'recover-range-' + type + '\').value=this.value;document.getElementById(\'recover-val-' + type + '\').textContent=this.value">' +
        '</div>' +
      '</div>';
    }
  });
  if (totalFired === 0) { showToast('Нечего подбирать', 'fail'); return; }
  
  const html = '<p style="margin-bottom:14px;color:var(--text-dim);font-size:14px">После боя можно поискать выпущенные боеприпасы. Выберите, сколько подобрать (остальное потеряно). Часть может быть сломана (1к4).</p>' + 
    rows + 
    '<button class="btn btn-gold" style="width:100%;margin-top:10px" onclick="doAmmoRecovery(' + idx + ')">🔍 Собрать выбранное</button>';
  openSubModal('🏹 Подбор боеприпасов — ' + comb.name, html);
}

function doAmmoRecovery(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb || !comb.charId || !comb.ammoFired) return;
  const c = findChar(comb.charId);
  if (!c) return;
  
  let results = [];
  let nothing = true;
  Object.keys(comb.ammoFired).forEach(type => {
    const inp = document.getElementById('recover-' + type);
    if (!inp) return;
    const toRecover = Math.max(0, Math.min(comb.ammoFired[type], parseInt(inp.value, 10) || 0));
    if (toRecover === 0) { comb.ammoFired[type] = 0; return; }
    nothing = false;
    
    let whole = 0, broken = 0;
    for (let i = 0; i < toRecover; i++) {
      const roll = Math.floor(Math.random() * 4) + 1;
      if (roll === 1) broken++; else whole++;
    }
    
    if (whole > 0) {
      const ex = c.inventory.find(it => it.name === type && !it.broken);
      if (ex) ex.qty = (ex.qty || 0) + whole;
      else c.inventory.push(buildItemFromName(type, whole));
    }
    if (broken > 0) {
      const brokenName = type + ' (сломанные)';
      const exb = c.inventory.find(it => it.name === brokenName);
      if (exb) exb.qty = (exb.qty || 0) + broken;
      else c.inventory.push(buildItemFromName(brokenName, broken));
    }
    results.push(type + ': целых ' + whole + ', сломано ' + broken);
    comb.ammoFired[type] = 0;
  });
  
  save(); renderAll(); closeSubModal();
  if (nothing) showToast('Ничего не собрано', '');
  else showToast('Подобрано — ' + results.join('; '), 'success');
}
function getCritThreshold(c) {
  if (!c) return 20;
  const fl = getFighterLevel(c);
  if (c.fighterArchetype === 'champion') {
    if (fl >= 15) return 18;
    if (fl >= 3) return 19;
  }
  return 20;
}
// ===== АРХЕТИПЫ В БОЮ =====

function openCombatManeuver(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb || !comb.charId) return;
  const c = findChar(comb.charId);
  if (!c) return;
  const fl = getFighterLevel(c);
  if (c.fighterArchetype !== 'battlemaster' || fl < 3) { showToast('Требуется Battlemaster 3+', 'fail'); return; }
  const sd = (c.resources||[]).find(r=>(r.name||'').toLowerCase()==='кости превосходства');
  if (!sd || sd.used >= sd.max) { showToast('Нет костей превосходства', 'fail'); return; }
  const known = c.maneuvers || [];
  if (!known.length) { showToast('Не выбраны приёмы', 'fail'); return; }
  const dc = getManeuverSaveDC(c);
  const dieSize = getSuperiorityDieSize(fl);
  
  let html = '<div style="padding:10px 14px;background:rgba(0,0,0,.22);border-left:2px solid var(--gold-dim);border-radius:0 6px 6px 0;font-size:13px;color:var(--text-dim);margin-bottom:14px">Костей: <b style="color:var(--gold-bright)">' + (sd.max - sd.used) + ' / ' + sd.max + '</b> · Сл: <b style="color:var(--gold-bright)">' + dc + '</b> · Кость: d' + dieSize + '</div>';
  known.forEach(function(k){
    const m = MANEUVERS.find(x => x.key === k);
    if (!m) return;
    html += '<button class="maneuver-pick" style="width:100%;margin-bottom:6px;text-align:left" onclick="useCombatManeuver(' + idx + ',\'' + m.key + '\')">' +
      '<div class="mp-name">' + esc(m.name) + '</div>' +
      '<div class="mp-desc">' + esc(m.desc) + '</div>' +
    '</button>';
  });
  openSubModal('🎲 Приём — ' + comb.name, html);
}

function useCombatManeuver(idx, mKey) {
  const comb = state.initiative.combatants[idx];
  if (!comb || !comb.charId) return;
  const c = findChar(comb.charId);
  if (!c) return;
  const sd = (c.resources||[]).find(r=>(r.name||'').toLowerCase()==='кости превосходства');
  if (!sd || sd.used >= sd.max) { showToast('Нет костей', 'fail'); return; }
  sd.used += 1;
  const dieSize = getSuperiorityDieSize(getFighterLevel(c));
  const roll = Math.floor(Math.random() * dieSize) + 1;
  const m = MANEUVERS.find(x => x.key === mKey);
  const dc = getManeuverSaveDC(c);
  if (!comb.actionUsed) comb.actionUsed = true;
  else if (!comb.bonusUsed) comb.bonusUsed = true;
  save(); refreshInitiative(); closeSubModal();
  let msg = comb.name + ': ' + (m ? m.name : 'Приём') + '! Кость d' + dieSize + ' = ' + roll;
  if (m && m.save) msg += '. Сл спасброска: ' + dc;
  showToast(msg, 'success');
}

function useWarMagicAttackInCombat(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb || !comb.charId) return;
  const c = findChar(comb.charId);
  if (!c) return;
  if (!c.warMagicReady) { showToast('Сначала кастуйте заговор', 'fail'); return; }
  if (comb.bonusUsed) { showToast('Бонусное действие уже потрачено', 'fail'); return; }
  c.warMagicReady = false;
  // Открываем атаку как бонусную
  openCombatAttack();
  // Помечаем что это бонусная
  window._warMagicBonus = true;
}

function doCavalierMark(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb || !comb.charId) return;
  const targetIdx = state.initiative.targetIdx !== undefined ? state.initiative.targetIdx : -1;
  const target = targetIdx >= 0 ? state.initiative.combatants[targetIdx] : null;
  if (!target) { showToast('Сначала выберите цель', 'fail'); return; }
  if (comb.actionUsed) { showToast('Действие уже потрачено', 'fail'); return; }
  if (comb.charId) {
    const c = findChar(comb.charId);
    if (c && c.hpCur <= 0) { showToast('Вы недееспособны', 'fail'); return; }
  }
  comb.cavalierMarkActive = true;
  comb.cavalierMarkTarget = targetIdx;
  comb.actionUsed = true;
  save(); refreshInitiative();
  showToast('🎯 Цель «' + target.name + '» помечена!', 'success');
}

function doCavalierMarkAttackInCombat(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb || !comb.charId) return;
  const c = findChar(comb.charId);
  if (!c) return;
  if (!comb.cavalierMarkActive) { showToast('Нет активной метки', 'fail'); return; }
  const sd = (c.resources||[]).find(r=>(r.name||'').toLowerCase()==='непоколебимая метка');
  if (!sd || sd.used >= sd.max) { showToast('Метки закончились', 'fail'); return; }
  if (comb.bonusUsed) { showToast('Бонусное действие потрачено', 'fail'); return; }
  
  const targetIdx = comb.cavalierMarkTarget;
  const target = targetIdx !== undefined && targetIdx >= 0 ? state.initiative.combatants[targetIdx] : null;
  if (!target) { showToast('Цель метки пропала', 'fail'); comb.cavalierMarkActive = false; save(); return; }
  
  sd.used += 1;
  comb.cavalierMarkActive = false;
  comb.bonusUsed = true;
  comb.cavalierMarkTarget = undefined;
  
  const r1 = Math.floor(Math.random()*20)+1;
  const r2 = Math.floor(Math.random()*20)+1;
  const chosen = Math.max(r1, r2);
  const strMod = modNum(c.str);
  const pb = profBonus(c.level);
  const totalHit = chosen + strMod + pb;
  const fl = getFighterLevel(c);
  const extraDmg = Math.floor(fl / 2);
  
  let msg = c.name + ': Спец. атака (Метка) по ' + target.name + '. Преим: d20(' + r1 + ',' + r2 + ')→' + chosen + ' +' + strMod + '+' + pb + ' = ' + totalHit;
  showToast(msg, 'success');
  
  if (chosen !== 1) {
    const targetComb = target;
    if (targetComb.charId) {
      const tc = findChar(targetComb.charId);
      if (tc) {
        applyDamage(tc.id, extraDmg);
        targetComb.hp = tc.hpCur;
      }
    } else {
      targetComb.hp = Math.max(0, targetComb.hp - extraDmg);
    }
    setTimeout(() => showToast('Доп. урон метки: +' + extraDmg + ' по ' + target.name, 'success'), 500);
  }
  
  save(); refreshInitiative();
}

function useWardingManeuver(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb || !comb.charId) return;
  const c = findChar(comb.charId);
  if (!c) return;
  
  if (comb.reactionUsed) { showToast('Реакция уже использована в этом ходу', 'fail'); return; }
  
  const res = (c.resources || []).find(r => (r.name || '').toLowerCase() === 'защитный маневр');
  if (!res || res.used >= res.max) { showToast('Защитный маневр закончился (нужен отдых)', 'fail'); return; }

  res.used++;
  comb.reactionUsed = true;
  const roll = Math.floor(Math.random() * 8) + 1;
  
  save(); refreshInitiative();
  showToast(`🛡 Защитный маневр! +${roll} к КД цели. Если атака всё равно попадёт — урон будет с сопротивлением.`, 'success');
}
function useCavalierHoldTheLine(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb || !comb.charId) return;
  const c = findChar(comb.charId);
  if (!c) return;
  
  if (comb.reactionUsed) { showToast('Реакция уже использована', 'fail'); return; }
  const targetIdx = state.initiative.targetIdx !== undefined ? state.initiative.targetIdx : -1;
  const target = targetIdx >= 0 ? state.initiative.combatants[targetIdx] : null;
  if (!target) { showToast('Сначала выберите цель', 'fail'); return; }

  comb.reactionUsed = true;
  
  // Бросаем атаку
  const atkMod = Math.max(modNum(c.str), modNum(c.dex)) + profBonus(c.level);
  const r = Math.floor(Math.random() * 20) + 1;
  const totalHit = r + atkMod;
  const crit = r === 20;
  
  let msg = `🛑 Держать строй! Атака по ${target.name}: d20(${r}) + ${atkMod} = ${totalHit}`;
  showToast(msg, crit ? 'crit-success' : '');
  
  if (r !== 1) {
    // Наносим урон (упрощенно 1к8 + мод)
    const dmg = Math.floor(Math.random() * 8) + 1 + Math.max(modNum(c.str), modNum(c.dex));
    if (target.charId) {
      const tc = findChar(target.charId);
      if (tc) { applyDamage(tc.id, dmg); target.hp = tc.hpCur; }
    } else {
      target.hp = Math.max(0, target.hp - dmg);
    }
    target.isProne = false; // Если лежал, сбиваем эффект? Нет, просто обнуляем скорость.
    target.speedZero = true; // Имитация скорости 0
    setTimeout(() => showToast(`Попадание! Урон: ${dmg}. Скорость ${target.name} уменьшена до 0!`, 'success'), 500);
  }
  
  save(); refreshInitiative();
}

function useCavalierFerociousCharge(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb || !comb.charId) return;
  const c = findChar(comb.charId);
  if (!c) return;
  
  if (comb.cavalierChargeUsed) { showToast('Натиск уже использован в этот ход', 'fail'); return; }
  const targetIdx = state.initiative.targetIdx !== undefined ? state.initiative.targetIdx : -1;
  const target = targetIdx >= 0 ? state.initiative.combatants[targetIdx] : null;
  if (!target) { showToast('Сначала выберите цель', 'fail'); return; }

  comb.cavalierChargeUsed = true;
  
  const dc = 8 + profBonus(c.level) + modNum(c.str);
  showToast(`🐎 Свирепый натиск! ${target.name} должен пройти спасбросок СИЛ (Сл ${dc}), иначе упадет.`, 'success');
  
  if (target.charId) {
    const tc = findChar(target.charId);
    if (tc) {
      // Для упрощения: если мод СИЛ маленький, шанс упасть выше.
      const saveRoll = Math.floor(Math.random() * 20) + 1 + modNum(tc.str);
      if (saveRoll < dc) {
        target.isProne = true;
        setTimeout(() => showToast(`Провал спасброска (${saveRoll} < ${dc}). ${target.name} сбит с ног!`, 'success'), 500);
      } else {
        setTimeout(() => showToast(`Успех спасброска (${saveRoll} >= ${dc}). Устоял.`, ''), 500);
      }
    }
  } else {
    // Для монстров (без статов) кидаем чистый d20
    const saveRoll = Math.floor(Math.random() * 20) + 1;
    if (saveRoll < dc) {
      target.isProne = true;
      setTimeout(() => showToast(`Провал спасброска (${saveRoll} < ${dc}). ${target.name} сбит с ног!`, 'success'), 500);
    } else {
      setTimeout(() => showToast(`Успех спасброска (${saveRoll} >= ${dc}). Устоял.`, ''), 500);
    }
  }
  
  save(); refreshInitiative();
}

function useVigilantDefender(idx) {
  const comb = state.initiative.combatants[idx];
  if (!comb) return;
  if (!comb.reactionUsed) { showToast('У вас еще есть обычная реакция', 'fail'); return; }
  
  comb.reactionUsed = false; // Возвращаем реакцию для провоцированной атаки
  save(); refreshInitiative();
  showToast('👁 Бдительный защитник! Вы получаете особую реакцию для провоцированной атаки.', 'success');
}