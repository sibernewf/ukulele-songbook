(function(){
  'use strict';
  const DRAFT_KEY='ukulele-songbook-tab-composer-draft-v1';
  const STRINGS=['G','C','E','A'];
  const LABELS=['1','&','2','&','3','&','4','&'];
  const POSITIONS=8;
  const CELL_WIDTH=5;
  const TRAILING_WIDTH=CELL_WIDTH*2;
  let project=null, saveTimer=null, activeSection=0;
  const $=id=>document.getElementById(id);
  const uid=()=> 'cmp-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
  const blankNotes=()=>Object.fromEntries(STRINGS.map(s=>[s,Array(POSITIONS).fill('')]));
  function emptyMeasure(){return {chords:Array(POSITIONS).fill(''),notes:blankNotes()};}
  function emptySystem(){return {id:uid(),measures:[emptyMeasure(),emptyMeasure()],lyrics:'',lyricMode:'auto',lyricSlots:Array(POSITIONS*2).fill('')};}
  function emptySection(name='Verse'){return {id:uid(),name,repeat:1,systems:[emptySystem()]};}
  function newProject(){return {version:3,id:'',title:'',artist:'',arrangement:'TAB arrangement',key:'',tempo:'',time:'4/4',tags:'TAB, Melody',usedChords:'',strummingPattern:'',tuningLabels:['G','C','E','A'],sections:[emptySection('Intro')]};}
  function normaliseMeasure(m){
    const out=m||{};
    if(!Array.isArray(out.chords)){
      const old=out.chord||'';
      out.chords=Array(POSITIONS).fill('');
      if(old) out.chords[0]=old;
      delete out.chord;
    }
    out.chords=Array.from({length:POSITIONS},(_,i)=>String(out.chords[i]||''));
    out.notes=out.notes||blankNotes();
    STRINGS.forEach(s=>out.notes[s]=Array.from({length:POSITIONS},(_,i)=>String((out.notes[s]||[])[i]||'')));
    return out;
  }
  function normaliseProject(p){
    const out=p||newProject();
    out.version=3;
    out.strummingPattern=out.strummingPattern||'';
    out.tuningLabels=Array.from({length:4},(_,i)=>String((out.tuningLabels||['G','C','E','A'])[i]||['G','C','E','A'][i]).trim()||['G','C','E','A'][i]);
    out.sections=(out.sections||[]).map(sec=>{
      sec.systems=(sec.systems||[]).map(sys=>{
        sys.measures=(sys.measures||[]).map(normaliseMeasure);
        while(sys.measures.length<2)sys.measures.push(emptyMeasure());
        sys.measures=sys.measures.slice(0,2);
        sys.lyrics=sys.lyrics||'';
        sys.lyricMode=['auto','aligned','preserve'].includes(sys.lyricMode)?sys.lyricMode:'auto';
        sys.lyricSlots=Array.from({length:POSITIONS*2},(_,i)=>String((sys.lyricSlots||[])[i]||''));
        return sys;
      });
      return sec;
    });
    if(!out.sections.length)out.sections=[emptySection('Intro')];
    return out;
  }
  function loadDraft(){try{return normaliseProject(JSON.parse(localStorage.getItem(DRAFT_KEY)||'null'));}catch{return null;}}
  function setStatus(text){if($('composerStatus')) $('composerStatus').textContent=text;}
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function showComposer(){
    ['performanceBar','setModeBar','songTitle','songInfo','autoScrollBar','songTools','songNotesPanel','songText'].forEach(id=>$(id)?.classList.add('song-view-hidden'));
    $('tabComposer')?.classList.add('active'); render();
  }
  function hideComposer(){
    $('tabComposer')?.classList.remove('active');
    ['performanceBar','setModeBar','songTitle','songInfo','autoScrollBar','songTools','songText'].forEach(id=>$(id)?.classList.remove('song-view-hidden'));
  }
  function syncMetaFromUI(){
    project.title=$('composerTitle').value; project.artist=$('composerArtist').value; project.arrangement=$('composerVersion').value;
    project.key=$('composerKey').value; project.tempo=$('composerTempo').value; project.time=$('composerTime').value;
    project.tags=$('composerTags').value; project.usedChords=$('composerChords').value; project.strummingPattern=$('composerStrumming').value;
    project.tuningLabels=['composerTuningG','composerTuningC','composerTuningE','composerTuningA'].map((id,i)=>($(id)?.value||['G','C','E','A'][i]).trim()||['G','C','E','A'][i]);
  }
  function fillMeta(){
    $('composerTitle').value=project.title||''; $('composerArtist').value=project.artist||''; $('composerVersion').value=project.arrangement||'';
    $('composerKey').value=project.key||''; $('composerTempo').value=project.tempo||''; $('composerTime').value=project.time||'4/4';
    $('composerTags').value=project.tags||''; $('composerChords').value=project.usedChords||''; $('composerStrumming').value=project.strummingPattern||'';
    ['composerTuningG','composerTuningC','composerTuningE','composerTuningA'].forEach((id,i)=>{if($(id))$(id).value=(project.tuningLabels||['G','C','E','A'])[i]||['G','C','E','A'][i];});
  }
  function fillChordOptions(){
    const list=$('composerChordOptions'); if(!list)return;
    const names=(typeof CHORDS!=='undefined')?Object.keys(CHORDS).sort():[];
    list.innerHTML=names.map(n=>`<option value="${escapeHtml(n)}"></option>`).join('');
  }
  function scheduleSave(){
    syncMetaFromUI(); setStatus('Unsaved changes…'); clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>{localStorage.setItem(DRAFT_KEY,JSON.stringify(project)); setStatus('Draft autosaved'); updatePreview();},700);
  }
  function render(){fillMeta();renderSections();updatePreview();}
  function renderSections(){
    const root=$('composerSections'); root.innerHTML='';
    project.sections.forEach((section,si)=>{
      const box=document.createElement('section'); box.className='composer-section';
      box.innerHTML=`<div class="composer-section-header"><strong>Section</strong><input class="section-name" value="${escapeHtml(section.name)}" aria-label="Section name"><label>Repeat <input class="section-repeat" type="number" min="1" max="99" value="${section.repeat||1}" style="width:70px"></label><button class="add-system" type="button">+ Two measures</button><button class="duplicate-section" type="button">Duplicate</button><button class="delete-section" type="button">Delete</button></div><div class="composer-systems"></div>`;
      const systems=box.querySelector('.composer-systems'); section.systems.forEach((system,yi)=>systems.appendChild(buildSystem(system,si,yi)));
      if(!section.systems.length){const empty=document.createElement('div');empty.className='composer-empty-section';empty.innerHTML='<p>This section has no measures.</p><button type="button" class="add-first-system">+ Add first two measures</button>';empty.querySelector('.add-first-system').onclick=()=>{section.systems.push(emptySystem());activeSection=si;renderSections();scheduleSave();};systems.appendChild(empty);}
      box.querySelector('.section-name').oninput=e=>{section.name=e.target.value;scheduleSave();};
      box.querySelector('.section-repeat').oninput=e=>{section.repeat=Math.max(1,+e.target.value||1);scheduleSave();};
      box.querySelector('.add-system').onclick=()=>{section.systems.push(emptySystem());activeSection=si;renderSections();scheduleSave();};
      box.querySelector('.duplicate-section').onclick=()=>{const copy=JSON.parse(JSON.stringify(section));copy.id=uid();copy.name+=' Copy';copy.systems.forEach(s=>s.id=uid());project.sections.splice(si+1,0,copy);renderSections();scheduleSave();};
      box.querySelector('.delete-section').onclick=()=>{if(project.sections.length===1)return alert('An arrangement needs at least one section.');if(confirm(`Delete section "${section.name}"?`)){project.sections.splice(si,1);renderSections();scheduleSave();}};
      root.appendChild(box);
    });
  }
  function buildSystem(system,si,yi){
    const wrap=document.createElement('div'); wrap.className='composer-system';
    const measures=document.createElement('div'); measures.className='composer-measures';
    system.measures.forEach((measure,mi)=>measures.appendChild(buildMeasure(measure,si,yi,mi))); wrap.appendChild(measures);
    const lyricEditor=document.createElement('div'); lyricEditor.className='composer-lyric-editor';
    lyricEditor.innerHTML=`<div class="lyric-toolbar"><strong>Lyrics</strong><label>Layout <select class="lyric-mode"><option value="auto">Automatic wrap</option><option value="aligned">Align words/syllables to beats</option><option value="preserve">Preserve typed spacing</option></select></label><span class="lyric-help"></span></div>`;
    const mode=lyricEditor.querySelector('.lyric-mode'); mode.value=system.lyricMode||'auto';
    const lyrics=document.createElement('textarea'); lyrics.className='system-lyrics'; lyrics.value=system.lyrics||'';
    const aligned=document.createElement('div'); aligned.className='lyric-align-grid';
    const alignHead=document.createElement('div'); alignHead.className='lyric-align-head'; alignHead.innerHTML='<span></span>'+LABELS.concat(LABELS).map(x=>`<span>${x}</span>`).join(''); aligned.appendChild(alignHead);
    const alignRow=document.createElement('div'); alignRow.className='lyric-align-row'; const rowLabel=document.createElement('span'); rowLabel.textContent='Words'; alignRow.appendChild(rowLabel);
    system.lyricSlots=Array.from({length:POSITIONS*2},(_,i)=>String((system.lyricSlots||[])[i]||''));
    system.lyricSlots.forEach((value,pi)=>{const input=document.createElement('input');input.className='lyric-slot';input.value=value;input.placeholder=pi===0?"Here's":"";input.setAttribute('aria-label',`Lyric at ${LABELS[pi%POSITIONS]} in measure ${pi<POSITIONS?1:2}`);input.oninput=e=>{system.lyricSlots[pi]=e.target.value;scheduleSave();};input.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='Enter'){e.preventDefault();nextInput(e.target,'.lyric-slot',1);}else if(e.key==='ArrowLeft'){e.preventDefault();nextInput(e.target,'.lyric-slot',-1);}else if(e.key==='Delete'){system.lyricSlots[pi]='';e.target.value='';scheduleSave();}};alignRow.appendChild(input);}); aligned.appendChild(alignRow);
    lyricEditor.append(lyrics,aligned); wrap.appendChild(lyricEditor);
    function refreshLyricMode(){const m=mode.value;system.lyricMode=m;lyrics.hidden=m==='aligned';aligned.hidden=m!=='aligned';const help=lyricEditor.querySelector('.lyric-help');if(m==='auto'){lyrics.placeholder='Type or paste lyrics normally. The preview wraps them to the width of these two measures.';help.textContent='Best for quick entry.';}else if(m==='preserve'){lyrics.placeholder='Type or paste lyrics. Spaces and line breaks are retained, but long lines are safely wrapped.';help.textContent='Best for manually spaced lyrics.';}else{help.textContent='Put each word or syllable beneath the beat where it begins.';}scheduleSave();}
    mode.onchange=refreshLyricMode; lyrics.oninput=e=>{system.lyrics=e.target.value;scheduleSave();}; refreshLyricMode();
    const actions=document.createElement('div'); actions.className='composer-system-actions'; actions.innerHTML='<button type="button" class="duplicate-system">Duplicate two measures</button><button type="button" class="clear-system">Clear notes and chords</button><button type="button" class="delete-system">Delete two measures</button>';
    actions.querySelector('.duplicate-system').onclick=()=>{const copy=JSON.parse(JSON.stringify(system));copy.id=uid();project.sections[si].systems.splice(yi+1,0,copy);renderSections();scheduleSave();};
    actions.querySelector('.clear-system').onclick=()=>{if(confirm('Clear all notes, chord changes and lyrics in these two measures?')){system.measures=[emptyMeasure(),emptyMeasure()];system.lyrics='';system.lyricSlots=Array(POSITIONS*2).fill('');system.lyricMode='auto';renderSections();scheduleSave();}};
    actions.querySelector('.delete-system').onclick=()=>{const list=project.sections[si].systems;if(confirm('Delete these two measures?')){list.splice(yi,1);renderSections();scheduleSave();}};
    wrap.appendChild(actions); return wrap;
  }
  function nextInput(current,selector,direction=1){
    const cells=[...document.querySelectorAll(selector)]; const i=cells.indexOf(current); if(i<0)return;
    cells[Math.max(0,Math.min(cells.length-1,i+direction))]?.focus();
  }
  function buildMeasure(measure,si,yi,mi){
    measure=normaliseMeasure(measure);
    const box=document.createElement('div'); box.className='composer-measure';
    box.innerHTML=`<div class="measure-heading"><strong>Measure ${yi*2+mi+1}</strong><span>Blank chord cells continue the previous chord</span></div><div class="chord-change-label">Chord changes</div>`;
    const chordGrid=document.createElement('div'); chordGrid.className='chord-change-grid';
    const spacer=document.createElement('span'); chordGrid.appendChild(spacer);
    LABELS.forEach((label,pi)=>{
      const holder=document.createElement('label');
      const cap=document.createElement('div');cap.className='chord-caption';cap.textContent=label;
      const input=document.createElement('input');input.className='chord-position';input.value=measure.chords[pi]||'';input.placeholder=pi===0?'C':'';input.setAttribute('list','composerChordOptions');input.setAttribute('aria-label',`Chord change at ${label}`);
      input.oninput=e=>{measure.chords[pi]=e.target.value.trim();scheduleSave();};
      input.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='Enter'){e.preventDefault();nextInput(e.target,'.chord-position',1);}else if(e.key==='ArrowLeft'){e.preventDefault();nextInput(e.target,'.chord-position',-1);}else if(e.key==='Delete'){measure.chords[pi]='';e.target.value='';scheduleSave();}};
      holder.append(cap,input);chordGrid.appendChild(holder);
    });
    box.appendChild(chordGrid);
    const beats=document.createElement('div'); beats.className='beat-labels'; beats.innerHTML='<span></span>'+LABELS.map(x=>`<span>${x}</span>`).join(''); box.appendChild(beats);
    const grid=document.createElement('div'); grid.className='tab-grid';
    STRINGS.forEach(string=>{
      const label=document.createElement('span');label.className='tab-string';label.textContent=string+'|';grid.appendChild(label);
      measure.notes[string].forEach((value,pi)=>{
        const input=document.createElement('input');input.className='tab-cell';input.inputMode='text';input.maxLength=3;input.value=value;input.setAttribute('aria-label',`${string} string ${LABELS[pi]}`);
        input.oninput=e=>{e.target.value=e.target.value.replace(/[^0-9xXhHpP\/\\-]/g,'').slice(0,3);measure.notes[string][pi]=e.target.value;scheduleSave();};
        input.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='Tab'&&!e.shiftKey){if(e.key==='ArrowRight'){e.preventDefault();nextInput(e.target,'.tab-cell',1);}}else if(e.key==='ArrowLeft'){e.preventDefault();nextInput(e.target,'.tab-cell',-1);}else if(e.key==='Enter'){e.preventDefault();nextInput(e.target,'.tab-cell',POSITIONS);}else if(e.key==='Delete'){measure.notes[string][pi]='';e.target.value='';scheduleSave();}};
        grid.appendChild(input);
      });
    }); box.appendChild(grid); return box;
  }
  const pad=(v,n)=>String(v||'').padEnd(n,' ');
  function chordDiagram(name){const shape=(typeof CHORDS!=='undefined'&&CHORDS[name])||'';return shape?`${name} (${shape})`:name;}
  // Every beat contains two equal timing slots (the beat and its '&').
  // A '+' is drawn after each complete beat, followed by a final blank tail.
  // Chords, beat labels, TAB notes and aligned lyrics all use these same starts.
  function slotStarts(){
    const starts=[];
    for(let beat=0;beat<4;beat++){
      const beatStart=beat*((CELL_WIDTH*2)+1);
      starts.push(beatStart,beatStart+CELL_WIDTH);
    }
    const width=(4*((CELL_WIDTH*2)+1))+TRAILING_WIDTH;
    return {starts,width};
  }
  function timedLine(values,fill=' ',showBeatDividers=false){
    const {starts,width}=slotStarts();
    const chars=Array(width).fill(fill);
    if(showBeatDividers){
      for(let beat=0;beat<4;beat++){
        const divider=((beat+1)*(CELL_WIDTH*2))+beat;
        chars[divider]='+';
      }
    }
    values.forEach((value,i)=>{
      if(!value)return;
      const text=String(value).slice(0,CELL_WIDTH);
      const start=starts[i]+Math.max(0,Math.floor((CELL_WIDTH-text.length)/2));
      for(let j=0;j<text.length&&start+j<chars.length;j++)chars[start+j]=text[j];
    });
    return chars.join('');
  }
  function guideStarts(){
    // Keep the TAB geometry untouched. Overlay chords, count labels and
    // beat-aligned lyrics onto that established grid:
    //   1,2,3,4 sit directly above the four '+' beat markers;
    //   each '&' sits halfway between that beat marker and the next one.
    const {width}=slotStarts();
    const beatMarkers=[];
    for(let beat=0;beat<4;beat++)beatMarkers.push(((beat+1)*(CELL_WIDTH*2))+beat);
    const starts=[];
    beatMarkers.forEach((marker,beat)=>{
      starts.push(marker);
      const next=beatMarkers[beat+1] ?? width;
      starts.push(marker+Math.floor((next-marker)/2));
    });
    return {starts,width};
  }
  function overlayLine(values){
    const {starts,width}=guideStarts();
    const chars=Array(width).fill(' ');
    values.forEach((value,i)=>{
      if(!value)return;
      const text=String(value).slice(0,CELL_WIDTH);
      const centre=starts[i]??0;
      const start=Math.max(0,Math.min(width-text.length,centre-Math.floor(text.length/2)));
      for(let j=0;j<text.length&&start+j<chars.length;j++)chars[start+j]=text[j];
    });
    return chars.join('');
  }
  function tabLine(measure,string){
    // Keep the established TAB staff and '+' beat markers exactly as they are.
    // Place notes using the same timing coordinates as chords and beat labels:
    // beats 1-4 sit on the four '+' markers, while each '&' sits midway between.
    const {width}=slotStarts();
    const chars=timedLine([], '-', true).split('');
    const {starts}=guideStarts();
    measure.notes[string].forEach((value,i)=>{
      if(!value)return;
      const text=String(value).slice(0,CELL_WIDTH);
      const centre=starts[i]??0;
      const start=Math.max(0,Math.min(width-text.length,centre-Math.floor(text.length/2)));
      for(let j=0;j<text.length&&start+j<chars.length;j++)chars[start+j]=text[j];
    });
    return chars.join('');
  }
  function chordLine(measure){return overlayLine(measure.chords);}
  function beatLine(){return overlayLine(LABELS);}
  function textWidth(){const {width}=slotStarts();return 2+width+1+5+2+width+1;}
  function wrapWords(text,width){
    const out=[]; String(text||'').split(/\r?\n/).forEach(raw=>{
      const words=raw.trim().split(/\s+/).filter(Boolean); if(!words.length){out.push('');return;}
      let line=''; words.forEach(word=>{if(!line)line=word;else if(line.length+1+word.length<=width)line+=' '+word;else{out.push(line);line=word;}}); if(line)out.push(line);
    }); return out;
  }
  function wrapPreserved(text,width){
    const out=[]; String(text||'').split(/\r?\n/).forEach(raw=>{if(raw===''){out.push('');return;}let line=raw;while(line.length>width){out.push(line.slice(0,width));line=line.slice(width);}out.push(line);}); return out;
  }
  function alignedLyricLines(slots){
    const {starts,width}=guideStarts(),total=textWidth(),m2=2+width+1+5+2, positions=starts.map(x=>2+x).concat(starts.map(x=>m2+x));
    const lines=[Array(total).fill(' ')]; let line=0,lastEnd=-1;
    (slots||[]).forEach((value,i)=>{const text=String(value||'').trim();if(!text)return;let start=Math.max(positions[i]||0,lastEnd+1);if(start+text.length>total){line++;lines[line]=Array(total).fill(' ');start=Math.min(positions[i]||0,Math.max(0,total-text.length));lastEnd=-1;}for(let j=0;j<text.length&&start+j<total;j++)lines[line][start+j]=text[j];lastEnd=start+text.length-1;});
    return lines.map(chars=>chars.join('').replace(/\s+$/,'')).filter(Boolean);
  }
  function lyricLines(system){
    const mode=system.lyricMode||'auto'; if(mode==='aligned')return alignedLyricLines(system.lyricSlots);
    if(!system.lyrics)return []; return mode==='preserve'?wrapPreserved(system.lyrics,textWidth()):wrapWords(system.lyrics,textWidth());
  }
  function renderText(){
    const rule='='.repeat(105), gap='     ', lines=[rule,'',`Title : ${project.title||'Untitled arrangement'}`,'',`Artist: ${project.artist||''}`,'',`Key   : ${project.key||''}                         Tempo: ${project.tempo||''}                         Time: ${project.time||'4/4'}`];
    if(project.strummingPattern)lines.push('',`Strumming pattern: ${project.strummingPattern}`);
    lines.push('',rule,'');
    const chords=String(project.usedChords||'').split(',').map(x=>x.trim()).filter(Boolean); if(chords.length)lines.push('Chords: '+chords.map(chordDiagram).join('     '),'',rule,'');
    project.sections.forEach(section=>{
      lines.push(`[${(section.name||'SECTION').toUpperCase()}${section.repeat>1?' x '+section.repeat:''}]`,'');
      section.systems.forEach((system,index)=>{
        const m1=normaliseMeasure(system.measures[0]),m2=normaliseMeasure(system.measures[1]);
        const betweenMeasures=' '.repeat(1+gap.length+2);
        lines.push('  '+chordLine(m1)+betweenMeasures+chordLine(m2));
        if(index===0)lines.push('  '+beatLine()+betweenMeasures+beatLine());
        STRINGS.forEach((str,i)=>{const label=String((project.tuningLabels||STRINGS)[i]||str).slice(0,3).padStart(1);lines.push(`${label}|${tabLine(m1,str)}|${gap}${label}|${tabLine(m2,str)}|`);});
        const renderedLyrics=lyricLines(system); if(renderedLyrics.length)lines.push('',...renderedLyrics); lines.push('');
      });
    }); return lines.join('\n');
  }
  function updatePreview(){if($('composerPreview'))$('composerPreview').textContent=renderText();}
  function saveToMySongs(){
    syncMetaFromUI(); if(!project.title.trim())return alert('Please enter a title first.'); const body=renderText();
    try{const saved=window.ukuleleMySongs.saveExternalSong({id:project.id,title:project.title,artist:project.artist,version:project.arrangement,type:'chords-tabs',tags:project.tags.split(',').map(x=>x.trim()).filter(Boolean),tuning:(project.tuningLabels||STRINGS).join(' '),key:project.key,tempo:project.tempo,strumming:project.strummingPattern,body,composerProject:project});project.id=saved.id;localStorage.setItem(DRAFT_KEY,JSON.stringify(project));setStatus('Saved to My Songs');}catch(e){alert(e.message);}
  }
  function download(){syncMetaFromUI();const blob=new Blob([renderText()],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(project.title||'ukulele-arrangement').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);}
  async function copyPreview(){
    syncMetaFromUI(); updatePreview();
    const text=renderText();
    try{
      if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);}
      else{
        const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();
        if(!document.execCommand('copy'))throw new Error('Copy command failed');
        area.remove();
      }
      setStatus('Preview copied to clipboard');
    }catch(e){alert('Could not copy automatically. Please select the preview text and copy it manually.');}
  }
  function deleteArrangement(){
    const title=(project.title||'Untitled arrangement').trim();
    const savedId=project.id;
    if(!confirm(`Delete the entire arrangement "${title}"?\n\nThis removes the autosaved draft${savedId?' and its saved My Songs entry':''}. This cannot be undone.`))return;
    if(savedId&&window.ukuleleMySongs?.deleteExternalSong)window.ukuleleMySongs.deleteExternalSong(savedId);
    localStorage.removeItem(DRAFT_KEY);
    project=newProject(); activeSection=0; render();
    localStorage.setItem(DRAFT_KEY,JSON.stringify(project));
    setStatus('Arrangement deleted — ready for a new song');
  }
  function resetProject(){if(project&&project.title&&!confirm('Start a new arrangement? Your current draft is autosaved.'))return;project=newProject();activeSection=0;render();scheduleSave();}
  function init(){
    project=loadDraft()||newProject(); fillChordOptions();
    $('openTabComposer')?.addEventListener('click',showComposer); $('newTabComposer')?.addEventListener('click',()=>{project=newProject();showComposer();scheduleSave();});
    $('composerBack')?.addEventListener('click',hideComposer); $('composerNew')?.addEventListener('click',resetProject); $('composerSave')?.addEventListener('click',saveToMySongs); $('composerCopy')?.addEventListener('click',copyPreview); $('composerDownload')?.addEventListener('click',download); $('composerDelete')?.addEventListener('click',deleteArrangement);
    $('composerPrint')?.addEventListener('click',()=>{
      syncMetaFromUI();
      updatePreview();

      // The fretboard chart intentionally prints in landscape, but TAB
      // arrangements are designed for an A4 portrait song sheet. Add this
      // page rule only while printing the composer so the two print modes do
      // not interfere with one another.
      let pageStyle=document.getElementById('composerPortraitPageStyle');
      if(!pageStyle){
        pageStyle=document.createElement('style');
        pageStyle.id='composerPortraitPageStyle';
        pageStyle.textContent='@page { size: A4 portrait; margin: 12mm; }';
        document.head.appendChild(pageStyle);
      }

      document.body.classList.add('composer-printing');
      window.print();
      setTimeout(()=>{
        document.body.classList.remove('composer-printing');
        pageStyle?.remove();
      },500);
    });
    $('composerAddSection')?.addEventListener('click',()=>{project.sections.push(emptySection('Verse'));activeSection=project.sections.length-1;renderSections();scheduleSave();});
    $('composerAddSystem')?.addEventListener('click',()=>{project.sections[activeSection]?.systems.push(emptySystem());renderSections();scheduleSave();});
    ['composerTitle','composerArtist','composerVersion','composerKey','composerTempo','composerTime','composerTags','composerChords','composerStrumming','composerTuningG','composerTuningC','composerTuningE','composerTuningA'].forEach(id=>$(id)?.addEventListener('input',scheduleSave));
    fillMeta(); setStatus(loadDraft()?'Recovered autosaved draft':'Draft ready');
  }
  window.ukuleleTabComposer={
    loadProject(raw){
      project=normaliseProject(JSON.parse(JSON.stringify(raw||newProject())));
      activeSection=0;
      localStorage.setItem(DRAFT_KEY,JSON.stringify(project));
      showComposer();
      setStatus('Arrangement loaded from My Songs');
    },
    newProject(){project=newProject();activeSection=0;localStorage.setItem(DRAFT_KEY,JSON.stringify(project));showComposer();setStatus('Ready for a new arrangement');}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
