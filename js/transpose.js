(function(){
  const sharpNotes=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const noteIndex={C:0,'B#':0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,Fb:4,'E#':5,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11,Cb:11};
  const chordToken=/(?<![A-Za-z])([A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|add)?(?:\d+)?(?:\/[A-G](?:#|b)?)?)(?![A-Za-z])/g;
  function normaliseSteps(steps){let n=Number(steps)||0;n=((n%12)+12)%12;return n}
  function transposeNote(note,steps){let idx=noteIndex[note];if(idx===undefined)return note;return sharpNotes[(idx+normaliseSteps(steps))%12]}
  function transposeChord(chord,steps){let value=String(chord||'').trim();let m=value.match(/^([A-G](?:#|b)?)([^\/]*)(?:\/([A-G](?:#|b)?))?$/);if(!m)return chord;let root=transposeNote(m[1],steps),suffix=m[2]||'',bass=m[3]?'/'+transposeNote(m[3],steps):'';return root+suffix+bass}
  function isTabLine(line){return/^[gGCEA]\|[-0-9hHpPbBrRsSxX/\\~\s]+$/.test(String(line||'').trim())}
  function looksMostlyLikeChords(line){if(!line||isTabLine(line))return false;let matches=[...line.matchAll(chordToken)].length;if(!matches)return false;let cleaned=line.replaceAll('|',' ').replace(/\[[^\]]+\]/g,' ').replace(chordToken,' ').replace(/[()\-,.]/g,' ').replace(/\bx\d+\b/gi,' ').trim();return cleaned.length<=Math.max(4,line.length*.35)}
  function transposeText(text,steps,type){if(!steps||type==='tabs')return text;return String(text||'').split(/\n/).map(line=>{let trimmed=line.trim();if(isTabLine(trimmed))return line;let shouldTranspose=line.includes('|')||looksMostlyLikeChords(line);if(!shouldTranspose)return line;return line.replace(chordToken,(match)=>transposeChord(match,steps))}).join('\n')}
  function transposeKey(key,steps){if(!key||!steps)return key;let value=String(key).trim();return value.replace(/^[A-G](?:#|b)?/,m=>transposeNote(m,steps))}
  function formatAmount(steps){let n=Number(steps)||0;return n>0?'+'+n:String(n)}
  window.ukuleleTranspose={transposeNote,transposeChord,transposeText,transposeKey,formatAmount};
})();
