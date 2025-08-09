export interface Disk { id:number; size:number; }
export interface Tower { id:number; disks:Disk[]; }
export interface GameState { towers:Tower[]; moves:number; isComplete:boolean; }

export class TowerOfHanoi {
  private state:GameState; private diskCount:number; private onChange:(state:GameState)=>void;
  constructor(diskCount=3,onChange:(state:GameState)=>void){ this.diskCount=diskCount; this.onChange=onChange; this.state=this.init(); }
  private init():GameState { const disks:Disk[]=[]; for(let i=this.diskCount;i>=1;i--) disks.push({id:i,size:i}); return {towers:[{id:0,disks:[...disks]},{id:1,disks:[]},{id:2,disks:[]}],moves:0,isComplete:false}; }
  getState():GameState { return JSON.parse(JSON.stringify(this.state)); }
  move(from:number,to:number):boolean { const f=this.state.towers[from]; const t=this.state.towers[to]; if(!f||!t||f.disks.length===0) return false; const disk=f.disks[f.disks.length-1]; const top=t.disks[t.disks.length-1]; if(top && top.size<disk.size) return false; f.disks.pop(); t.disks.push(disk); this.state.moves++; if(this.state.towers[2].disks.length===this.diskCount) this.state.isComplete=true; this.onChange(this.state); return true; }
  reset(){ this.state=this.init(); this.onChange(this.state); }
  setDiskCount(n:number){ this.diskCount=n; this.reset(); }
  optimalMoves():number { return Math.pow(2,this.diskCount)-1; }
}
