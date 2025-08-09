import { GameState } from './TowerOfHanoi';

const isTouch = () => matchMedia('(pointer:coarse)').matches;

export class UIRenderer {
  private container:HTMLElement; private onMove:(f:number,t:number)=>boolean; private onReset:()=>void; private onDifficulty:(n:number)=>void; private state:GameState={towers:[],moves:0,isComplete:false};
  private dragFrom:number|null=null; private tapSel:number|null=null; private lastTapTime=0;
  constructor(container:HTMLElement,onMove:(f:number,t:number)=>boolean,onReset:()=>void,onDifficulty:(n:number)=>void){ this.container=container; this.onMove=onMove; this.onReset=onReset; this.onDifficulty=onDifficulty; }
  render(state:GameState,optimal:number){ this.state=state; const touch=isTouch(); this.container.innerHTML=`
    <header class="header" aria-label="Game controls">
      <div class="header-group">
        <h1>Hanoi</h1>
        <select id="difficulty" aria-label="Select difficulty">
          ${[3,4,5,6].map(n=>`<option value="${n}" ${state.towers[0].disks.length===n? 'selected':''}>${n} disks</option>`).join('')}
        </select>
      </div>
      <div class="header-group" role="group" aria-label="Stats and actions">
        <div class="stat" aria-live="polite" aria-label="Moves used"><div class="stat-value" id="moves">${state.moves}</div><div class="stat-label">Moves</div></div>
        <div class="stat" aria-label="Optimal moves"><div class="stat-value">${optimal}</div><div class="stat-label">Optimal</div></div>
        <button class="btn btn-danger" id="reset" aria-label="Reset game">Reset</button>
        <button class="btn" id="rules" aria-haspopup="dialog" aria-controls="rules-modal">How</button>
      </div>
    </header>
    ${touch ? this.renderTouchHelp():''}
    <main class="board" aria-label="Game board">
      <div class="towers" role="list">
        ${state.towers.map(t=>this.renderTower(t.id)).join('')}
      </div>
    </main>
    ${state.isComplete? this.renderWin(optimal):''}
    ${this.renderRulesModal()}`;
    this.paintDisks(touch);
    this.bind();
  }
  private renderTouchHelp(){ return `<div class="touch-help" id="touch-help" role="note">Tap a tower to pick the top disk, then tap a destination tower to place it. <button class="btn btn-ghost" id="dismiss-help" aria-label="Dismiss help">✕</button></div>`; }
  private renderTower(id:number){ const labels=['Source','Auxiliary','Destination']; return `<div class="tower" data-id="${id}" role="group" aria-label="${labels[id]} tower"><div class="tower-label">${['SRC','AUX','DST'][id]}</div><div class="tower-base"></div></div>`; }
  private paintDisks(touch:boolean){ this.state.towers.forEach(t=>{ const towerEl=this.container.querySelector(`.tower[data-id='${t.id}']`) as HTMLElement; if(!towerEl) return; t.disks.forEach((d,i)=>{ const top=i===t.disks.length-1; const width=50 + d.size*26; const bottom=50 + i*26; const el=document.createElement('div'); el.className='disk'+(top?' top':''); el.style.width=width+'px'; el.style.bottom=bottom+'px'; el.dataset.size=String(d.size); el.dataset.tower=String(t.id); el.textContent=String(d.size); el.setAttribute('role','button'); el.setAttribute('aria-label',`Disk size ${d.size}`); if(top && !touch) el.setAttribute('draggable','true'); towerEl.appendChild(el); }); }); }
  private bind(){
    (this.container.querySelector('#reset') as HTMLElement).onclick=()=>this.onReset();
    (this.container.querySelector('#difficulty') as HTMLSelectElement).onchange=e=>{ const n=parseInt((e.target as HTMLSelectElement).value,10); this.onDifficulty(n); };
    const helpDismiss=this.container.querySelector('#dismiss-help') as HTMLElement|null; if(helpDismiss) helpDismiss.onclick=()=>helpDismiss.parentElement?.remove();
    const rulesBtn=this.container.querySelector('#rules') as HTMLElement; const rulesModal=this.container.querySelector('#rules-modal') as HTMLElement; const closeRules=this.container.querySelector('#close-rules') as HTMLElement; const okRules=this.container.querySelector('#rules-ok') as HTMLElement;
    rulesBtn.onclick=()=>{ rulesModal.style.display='flex'; (rulesModal.querySelector('h2') as HTMLElement)?.focus(); };
    const close=()=>{ rulesModal.style.display='none'; }; closeRules.onclick=close; okRules.onclick=close; rulesModal.onclick=e=>{ if(e.target===rulesModal) close(); };
    const touch=isTouch();
    // Drag only if not touch
    if(!touch){
      this.container.querySelectorAll('.disk.top').forEach(d=>{
        d.addEventListener('dragstart',e=>{ const tower=parseInt((e.target as HTMLElement).dataset.tower||'0',10); this.dragFrom=tower; (e.target as HTMLElement).classList.add('dragging'); });
        d.addEventListener('dragend',e=>{ (e.target as HTMLElement).classList.remove('dragging'); this.dragFrom=null; this.clearHighlights(); });
      });
      this.container.querySelectorAll('.tower').forEach(t=>{
        t.addEventListener('dragover',e=>e.preventDefault());
        t.addEventListener('dragenter',e=>{ if(this.dragFrom==null) return; const to=parseInt((e.currentTarget as HTMLElement).dataset.id||'0',10); if(this.validMove(this.dragFrom,to)) (e.currentTarget as HTMLElement).classList.add('drag-over'); else (e.currentTarget as HTMLElement).classList.add('invalid'); });
        t.addEventListener('dragleave',e=>{ (e.currentTarget as HTMLElement).classList.remove('drag-over','invalid'); });
        t.addEventListener('drop',e=>{ const to=parseInt((e.currentTarget as HTMLElement).dataset.id||'0',10); if(this.dragFrom!=null) this.onMove(this.dragFrom,to); this.dragFrom=null; this.clearHighlights(); });
      });
    }
    // Tap handling (always available; primary for touch)
    this.container.querySelectorAll('.tower').forEach(t=>{
      t.addEventListener('click',()=>this.handleTap(parseInt(t.getAttribute('data-id')||'0',10)));
    });
    // Win modal buttons
    const againBtn=this.container.querySelector('#again-btn') as HTMLElement|null; if(againBtn) againBtn.onclick=()=>this.onReset();
    const closeWin=this.container.querySelector('#close-win') as HTMLElement|null; if(closeWin) closeWin.onclick=()=>{ const backdrop=closeWin.closest('.modal-backdrop') as HTMLElement|null; backdrop?.remove(); };
  }
  private validMove(from:number,to:number){ if(from===to) return false; const f=this.state.towers[from]; const t=this.state.towers[to]; if(!f.disks.length) return false; const disk=f.disks[f.disks.length-1]; const top=t.disks[t.disks.length-1]; if(top && top.size<disk.size) return false; return true; }
  private handleTap(tower:number){ const now=Date.now(); if(now - this.lastTapTime < 120) return; this.lastTapTime=now; if(this.tapSel==null){ if(this.state.towers[tower].disks.length){ const picked=this.state.towers[tower].disks[this.state.towers[tower].disks.length-1]; this.tapSel=tower; this.highlight(tower); this.announce(`Picked disk ${picked.size} from tower ${tower+1}`); } else { this.flashInvalid(tower,'No disk to pick'); } } else { if(this.tapSel===tower){ this.clearHighlights(); this.tapSel=null; this.announce('Selection cleared'); return; } if(this.validMove(this.tapSel,tower)){ this.onMove(this.tapSel,tower); this.announce(`Moved disk to tower ${tower+1}. Moves ${this.state.moves+1}`); } else { this.flashInvalid(tower,'Invalid move'); } this.tapSel=null; this.clearHighlights(); } }
  private highlight(tower:number){ const el=this.container.querySelector(`.tower[data-id='${tower}']`) as HTMLElement; if(el) el.classList.add('drag-over'); }
  private clearHighlights(){ this.container.querySelectorAll('.tower').forEach(el=>el.classList.remove('drag-over','invalid','tap-invalid')); }
  private flashInvalid(tower:number,msg:string){ const el=this.container.querySelector(`.tower[data-id='${tower}']`) as HTMLElement; if(!el) return; el.classList.add('tap-invalid'); this.announce(msg); setTimeout(()=>el.classList.remove('tap-invalid'),420); navigator.vibrate?.(40); }
  private announce(text:string){ const live=document.getElementById('live-region'); if(live){ live.textContent=''; setTimeout(()=>{ live.textContent=text; },40); } }
  private renderWin(optimal:number){ return `<div class="modal-backdrop"><div class="modal win"><button class="close-btn" id="close-win">✕</button><h3>Solved!</h3><div class="win-grid"><div class="win-item"><div class="win-label">Moves</div><div class="win-value">${this.state.moves}</div></div><div class="win-item"><div class="win-label">Optimal</div><div class="win-value">${optimal}</div></div></div><div class="modal-actions"><button class="btn btn-accent" id="again-btn">Play Again</button></div></div></div>`; }
  private renderRulesModal(){ return `<div class="modal-backdrop" id="rules-modal" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="rules-title"><div class="modal"><button class="close-btn" id="close-rules" aria-label="Close help">✕</button><h2 id="rules-title">How to Play</h2><p>Goal: move all disks to the Destination tower.<br/>Tap a tower to pick its top disk, then tap another to place it. Larger disks cannot go on smaller ones. Complete it in the fewest moves (optimal shown above).</p><div class="modal-actions"><button class="btn btn-accent" id="rules-ok">Got it</button></div></div></div>`; }
}
