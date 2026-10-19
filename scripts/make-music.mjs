// Original, synthesized instrumental sample. No third-party recording is used.
import { writeFileSync, mkdirSync } from 'node:fs';
const rate=22050, beat=.62;
const chords=[[60,64,67,71],[57,60,64,69],[53,57,60,65],[55,59,62,67]];
const notes=[];
for(let bar=0;bar<16;bar++){
  const chord=chords[bar%4];
  for(let j=0;j<8;j++)notes.push({midi:chord[[0,1,2,3,2,1,2,1][j]]+12,start:(bar*8+j)*beat,duration:2.5,volume:.14});
  notes.push({midi:chord[0]-12,start:bar*8*beat,duration:4.6,volume:.22});
}
const duration=16*8*beat+4, data=new Float32Array(Math.ceil(rate*duration));
for(const n of notes){
 const freq=440*2**((n.midi-69)/12),start=Math.floor(n.start*rate);
 for(let i=0;i<n.duration*rate&&start+i<data.length;i++){
  const t=i/rate,env=Math.min(t/.015,1)*Math.exp(-t*2.05)*(1-t/n.duration);
  const fundamental=Math.sin(2*Math.PI*freq*t),partial=Math.sin(2*Math.PI*freq*2.003*t)*.24+Math.sin(2*Math.PI*freq*3*t)*.08;
  data[start+i]+=(fundamental+partial)*env*n.volume;
 }
}
for(let i=data.length-1;i>=Math.floor(rate*.18);i--)data[i]+=data[i-Math.floor(rate*.18)]*.16;
const buffer=Buffer.alloc(44+data.length*2);
buffer.write('RIFF',0);buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVE',8);buffer.write('fmt ',12);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*2,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(data.length*2,40);
for(let i=0;i<data.length;i++)buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,data[i]))*32767),44+i*2);
mkdirSync(new URL('../public/media/',import.meta.url),{recursive:true});
writeFileSync(new URL('../public/media/garden-piano.wav',import.meta.url),buffer);
console.log('Created original garden-piano.wav');
