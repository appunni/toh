import { GameState } from './TowerOfHanoi';

const isTouch = () => matchMedia('(pointer:coarse)').matches;

export class UIRenderer {
  private container:HTMLElement; private onMove:(f:number,t:number)=>boolean; private onReset:()=>void; private onDifficulty:(n:number)=>void; private state:GameState={towers:[],moves:0,isComplete:false};
  private dragFrom:number|null=null; private tapSel:number|null=null; private lastTapTime=0; private lastMovedTower:number|null=null;
  private showTouchHelp = true; // show banner once on touch devices
  constructor(container:HTMLElement,onMove:(f:number,t:number)=>boolean,onReset:()=>void,onDifficulty:(n:number)=>void){ this.container=container; this.onMove=onMove; this.onReset=onReset; this.onDifficulty=onDifficulty; }
  render(state:GameState,optimal:number){
    this.state=state; const touch=isTouch(); if(state.moves>0 && this.showTouchHelp){ this.showTouchHelp=false; }
    this.container.innerHTML=`
    <header class="header" aria-label="Game controls">
      <div class="header-group">
        <h1>Hanoi</h1>
        <select id="difficulty" aria-label="Select difficulty">
          ${[3,4,5].map(n=>`<option value="${n}" ${state.towers[0].disks.length===n? 'selected':''}>${n} disks</option>`).join('')}
        </select>
      </div>
      <div class="header-group" role="group" aria-label="Stats and actions">
        <div class="stat" aria-live="polite" aria-label="Moves used"><div class="stat-value" id="moves">${state.moves}</div><div class="stat-label">Moves</div></div>
        <div class="stat" aria-label="Optimal moves"><div class="stat-value">${optimal}</div><div class="stat-label">Optimal</div></div>
        <button class="btn btn-danger" id="reset" aria-label="Reset game">Reset</button>
        <button class="btn" id="rules" aria-haspopup="dialog" aria-controls="rules-modal">How</button>
      </div>
    </header>
    ${touch && this.showTouchHelp ? this.renderTouchHelp():''}
    <main class="board" aria-label="Game board">
      <div class="towers" role="list">${state.towers.map(t=>this.renderTower(t.id)).join('')}</div>
    </main>
    ${state.isComplete? this.renderWin(optimal):''}
    ${this.renderRulesModal()}`;
    this.paintDisks(touch); this.bind();
  }
  private renderTouchHelp(){ return `<div class="touch-help" id="touch-help" role="note">Tap a tower to pick the top disk, then tap a destination tower to place it. <button class="btn btn-ghost" id="dismiss-help" aria-label="Dismiss help">✕</button></div>`; }
  private renderTower(id:number){ const labels=['Source','Auxiliary','Destination']; return `<div class="tower" data-id="${id}" tabindex="0" role="group" aria-label="${labels[id]} tower"><div class="tower-label">${['SRC','AUX','DST'][id]}</div><div class="tower-base"></div></div>`; }
  private paintDisks(touch:boolean){
    const layout=document.documentElement.getAttribute('data-layout');
    this.state.towers.forEach(t=>{
      const towerEl=this.container.querySelector(`.tower[data-id='${t.id}']`) as HTMLElement; if(!towerEl) return;
      towerEl.querySelectorAll('.disk').forEach(d=>d.remove());
      const count=t.disks.length; const towerH=towerEl.clientHeight || 300; const isPortrait=layout==='mobilePortrait';
      let diskH:number; if(isPortrait){ diskH = count>5?18:20; } else { if(towerH < 190) diskH=18; else if(towerH<210) diskH=20; else if(towerH<240) diskH=22; else if(towerH<280) diskH=24; else diskH=28; }
      let baseOffset = isPortrait ? 34 : 50; const headroom = isPortrait?6:12; const usable = towerH - baseOffset - diskH - headroom; let step = count>1 ? Math.floor(usable / (count-1)) : 0;
      if(isPortrait){ const maxPortraitStep = count>5?20:24; step = Math.min(step, maxPortraitStep); step = Math.max(step, 14); } else { step = Math.min(step, 32); step = Math.max(step, Math.min(20, usable)); }
      const needed = baseOffset + diskH + step*(count-1); if(needed > towerH - headroom){ const available = towerH - headroom - baseOffset; if(count>1){ step = Math.max(10, Math.floor((available - diskH)/(count-1))); } const afterSpacing = diskH + step*(count-1); if(afterSpacing > available){ diskH = Math.max(14, Math.floor(available - step*(count-1))); } }
      t.disks.forEach((d,i)=>{ const top=i===t.disks.length-1; const width=50 + d.size*26; const bottom=baseOffset + i*step; const el=document.createElement('div'); el.className='disk'+(top?' top':'')+((top && this.lastMovedTower===t.id)?' pulse':''); el.style.width=width+'px'; el.style.bottom=bottom+'px'; el.style.height=diskH+'px'; el.dataset.size=String(d.size); el.dataset.tower=String(t.id); el.textContent=String(d.size); el.setAttribute('role','button'); el.setAttribute('aria-label',`Disk size ${d.size}`); if(top && !touch) el.setAttribute('draggable','true'); towerEl.appendChild(el); });
    });
    // reset pulse marker so animation only runs once
    this.lastMovedTower=null;
  }
  private bind(){
    (this.container.querySelector('#reset') as HTMLElement).onclick=()=>this.onReset();
    (this.container.querySelector('#difficulty') as HTMLSelectElement).onchange=e=>{ const n=parseInt((e.target as HTMLSelectElement).value,10); this.onDifficulty(n); };
    const helpDismiss=this.container.querySelector('#dismiss-help') as HTMLElement|null; if(helpDismiss) helpDismiss.onclick=()=>{ this.showTouchHelp=false; helpDismiss.parentElement?.remove(); };
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
        t.addEventListener('drop',e=>{ const to=parseInt((e.currentTarget as HTMLElement).dataset.id||'0',10); if(this.dragFrom!=null){ this.lastMovedTower=to; this.onMove(this.dragFrom,to); } this.dragFrom=null; this.clearHighlights(); });
      });
    }
    this.container.querySelectorAll('.tower').forEach(t=>{ t.addEventListener('click',()=>this.handleTap(parseInt(t.getAttribute('data-id')||'0',10))); });
    // Win modal buttons
    const againBtn=this.container.querySelector('#again-btn') as HTMLElement|null; if(againBtn) againBtn.onclick=()=>this.onReset();
    const closeWin=this.container.querySelector('#close-win') as HTMLElement|null; if(closeWin) closeWin.onclick=()=>{ const backdrop=closeWin.closest('.modal-backdrop') as HTMLElement|null; backdrop?.remove(); };
  }
  private validMove(from:number,to:number){ if(from===to) return false; const f=this.state.towers[from]; const t=this.state.towers[to]; if(!f.disks.length) return false; const disk=f.disks[f.disks.length-1]; const top=t.disks[t.disks.length-1]; if(top && top.size<disk.size) return false; return true; }
  private highlight(tower:number){ const el=this.container.querySelector(`.tower[data-id='${tower}']`) as HTMLElement; if(el) el.classList.add('drag-over'); }
  private clearHighlights(){ this.container.querySelectorAll('.tower').forEach(el=>el.classList.remove('drag-over','invalid','tap-invalid')); }
  private handleTap(tower:number){
    const now=Date.now(); if(now - this.lastTapTime < 120) return; this.lastTapTime=now;
    if(this.tapSel==null){
      if(this.state.towers[tower].disks.length){ const picked=this.state.towers[tower].disks[this.state.towers[tower].disks.length-1]; this.tapSel=tower; this.highlight(tower); this.announce(`Picked disk ${picked.size} from tower ${tower+1}.`); } else { this.flashInvalid(tower,'No disk to pick'); }
    } else {
      if(this.tapSel===tower){ this.clearHighlights(); this.tapSel=null; this.announce('Selection cleared'); return; }
      const from=this.tapSel; const to=tower; const valid=this.validMove(from,to);
      if(valid){ this.lastMovedTower=to; this.onMove(from,to); if(this.showTouchHelp){ this.showTouchHelp=false; document.getElementById('touch-help')?.remove(); } this.announce(`Moved disk to tower ${to+1}. Moves ${this.state.moves+1}`); }
      else { this.flashInvalid(to,'Invalid move'); }
      this.tapSel=null; this.clearHighlights();
    }
  }
  private flashInvalid(tower:number,msg:string){
    const el=this.container.querySelector(`.tower[data-id='${tower}']`) as HTMLElement; if(!el) return;
    el.classList.remove('tap-invalid','shake'); // reset if rapid
    // force reflow so animation restarts
    void el.offsetWidth;
    el.classList.add('tap-invalid','shake');
    this.announce(msg);
    setTimeout(()=>{ el.classList.remove('tap-invalid','shake'); },480);
    navigator.vibrate?.(55);
  }
  private announce(text:string){ const live=document.getElementById('live-region'); if(live){ live.textContent=''; setTimeout(()=>{ live.textContent=text; },40); } }
  private renderWin(optimal:number){ return `<div class="modal-backdrop"><div class="modal win"><button class="close-btn" id="close-win">✕</button><h3>Solved!</h3><div class="win-grid"><div class="win-item"><div class="win-label">Moves</div><div class="win-value">${this.state.moves}</div></div><div class="win-item"><div class="win-label">Optimal</div><div class="win-value">${optimal}</div></div></div><div class="modal-actions"><button class="btn btn-accent" id="again-btn">Play Again</button></div></div></div>`; }
  private renderRulesModal(){ return `<div class="modal-backdrop" id="rules-modal" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="rules-title"><div class="modal"><button class="close-btn" id="close-rules" aria-label="Close help">✕</button><h2 id="rules-title">How to Play</h2><p>Goal: move all disks to the Destination tower.<br/>Tap a tower to pick its top disk, then tap another to place it. Larger disks cannot go on smaller ones. Complete it in the fewest moves (optimal shown above).</p><div class="modal-actions"><button class="btn btn-accent" id="rules-ok">Got it</button></div></div></div>`; }
  public recalcForLayoutChange(){
    // Recalculate disk sizing after orientation/layout attribute changes without rebuilding entire UI
    if(!this.state.towers.length) return;
    this.paintDisks(isTouch());
  }
}
