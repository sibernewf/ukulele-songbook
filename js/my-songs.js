(function(){
  const STORAGE_KEY = 'ukuleleMySongsV1';
  const EXPORT_VERSION = 1;
  let songs = loadStoredSongs();

  function loadStoredSongs(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') || []; }
    catch { return []; }
  }
  function saveStoredSongs(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  }
  function slugify(value){
    return String(value || 'song')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || 'song';
  }
  function makeId(title){
    return 'user-' + slugify(title) + '-' + new Date().toISOString().replace(/[-:T.Z]/g,'').slice(0,14);
  }
  function splitTags(value){
    return String(value || '').split(',').map(t=>t.trim()).filter(Boolean);
  }
  function buildMetadata(song){
    const parts=[];
    if(song.tuning) parts.push(`Tuning: ${song.tuning}`);
    if(song.key) parts.push(`Key: ${song.key}`);
    if(song.capo) parts.push(`Capo: ${song.capo}`);
    if(song.difficulty) parts.push(`Difficulty: ${song.difficulty}`);
    if(song.tempo) parts.push(`Tempo: ${song.tempo}`);
    if(song.strumming) parts.push(`Strumming: ${song.strumming}`);
    if(song.notes) parts.push(`Notes: ${song.notes}`);
    return parts.join(' | ');
  }
  function getSongText(id){
    const s=songs.find(song=>song.id===id);
    if(!s) return '';
    const meta=buildMetadata(s);
    return (meta ? meta + '\n\n' : '') + (s.body || '');
  }
  function toSongListItem(song){
    return {
      title: song.title || 'Untitled Song',
      artist: song.artist || '',
      file: 'user:' + song.id,
      favourite: !!song.favourite,
      tags: Array.isArray(song.tags) ? song.tags : [],
      type: song.type || 'chords',
      isUserSong: true,
      userSongId: song.id
    };
  }
  function injectSongsIntoLibrary(){
    if(!Array.isArray(window.SONGS) && typeof SONGS === 'undefined') return;
    const target = window.SONGS || SONGS;
    for(const song of songs){
      if(!target.some(s=>s.isUserSong && s.userSongId === song.id)) target.push(toSongListItem(song));
    }
  }
  function syncLibraryAfterChange(){
    const target = window.SONGS || SONGS;
    for(let i=target.length-1;i>=0;i--) if(target[i].isUserSong) target.splice(i,1);
    for(const song of songs) target.push(toSongListItem(song));
    if(window.ukuleleApp){
      window.ukuleleApp.renderLibraryStats();
      window.ukuleleApp.renderTagFilters();
      window.ukuleleApp.renderSetManager();
      window.ukuleleApp.applyFilters();
    }
    renderMySongList();
  }
  function $(id){ return document.getElementById(id); }
  function setStatus(msg){ const el=$('mySongsStatus'); if(el) el.textContent=msg || ''; }
  function fillForm(song){
    $('mySongId').value = song?.id || '';
    $('mySongTitle').value = song?.title || '';
    $('mySongArtist').value = song?.artist || '';
    $('mySongVersion').value = song?.version || '';
    $('mySongType').value = song?.type || 'chords';
    $('mySongTags').value = (song?.tags || []).join(', ');
    $('mySongTuning').value = song?.tuning || 'G C E A';
    $('mySongKey').value = song?.key || '';
    $('mySongCapo').value = song?.capo || 'No capo';
    $('mySongDifficulty').value = song?.difficulty || '';
    $('mySongTempo').value = song?.tempo || '';
    $('mySongStrumming').value = song?.strumming || '';
    $('mySongNotes').value = song?.notes || '';
    $('mySongBody').value = song?.body || '';
  }
  function readForm(){
    const existingId = $('mySongId').value.trim();
    const title = $('mySongTitle').value.trim();
    const body = $('mySongBody').value.replace(/\r/g,'').trim();
    if(!title) throw new Error('Please enter a song title.');
    if(!body) throw new Error('Please paste the song text.');
    return {
      id: existingId || makeId(title),
      title,
      artist: $('mySongArtist').value.trim(),
      version: $('mySongVersion').value.trim(),
      type: $('mySongType').value,
      tags: splitTags($('mySongTags').value),
      tuning: $('mySongTuning').value.trim(),
      key: $('mySongKey').value.trim(),
      capo: $('mySongCapo').value.trim(),
      difficulty: $('mySongDifficulty').value.trim(),
      tempo: $('mySongTempo').value.trim(),
      strumming: $('mySongStrumming').value.trim(),
      notes: $('mySongNotes').value.trim(),
      body,
      favourite: false,
      updatedAt: new Date().toISOString(),
      createdAt: songs.find(s=>s.id===existingId)?.createdAt || new Date().toISOString()
    };
  }
  function saveForm(){
    try{
      const song=readForm();
      const idx=songs.findIndex(s=>s.id===song.id);
      if(idx>=0) songs[idx]=song; else songs.unshift(song);
      saveStoredSongs();
      syncLibraryAfterChange();
      fillForm(song);
      setStatus('Saved to My Songs in this browser.');
    }catch(e){ setStatus(e.message); }
  }
  function deleteCurrent(){
    const id=$('mySongId').value.trim();
    if(!id) return setStatus('Choose a My Song to delete first.');
    const song=songs.find(s=>s.id===id);
    if(!song) return;
    if(!confirm(`Delete "${song.title}" from My Songs on this device?`)) return;
    songs=songs.filter(s=>s.id!==id);
    saveStoredSongs();
    fillForm(null);
    syncLibraryAfterChange();
    setStatus('Deleted from My Songs.');
  }
  function previewForm(){
    try{
      const song=readForm();
      const preview=$('mySongPreview');
      const meta=buildMetadata(song);
      preview.textContent=(meta?meta+'\n\n':'')+song.body;
      preview.hidden=false;
      setStatus('Preview generated.');
    }catch(e){ setStatus(e.message); }
  }
  function renderMySongList(){
    const list=$('mySongsList');
    if(!list) return;
    list.innerHTML='';
    if(!songs.length){ list.innerHTML='<p class="hint compact-hint">No My Songs yet. Paste one below and save it.</p>'; return; }
    songs.forEach(song=>{
      const row=document.createElement('div');
      row.className='my-song-row';
      const label=document.createElement('button');
      label.type='button';
      label.className='my-song-link';
      label.textContent=`${song.title}${song.version?' — '+song.version:''}${song.artist?' — '+song.artist:''}`;
      label.onclick=()=>{ fillForm(song); setStatus('Loaded for editing.'); };
      row.appendChild(label);
      list.appendChild(row);
    });
  }
  function uniquePermanentFilename(song){
    const base=slugify([song.title, song.version].filter(Boolean).join('-'));
    const existing=new Set((window.SONGS||SONGS).filter(s=>s.file).map(s=>String(s.file).split('/').pop().toLowerCase()));
    let name=base+'.txt', n=2;
    while(existing.has(name.toLowerCase())) name=`${base}-${n++}.txt`;
    return name;
  }
  function downloadText(filename, text){
    const blob=new Blob([text], {type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),500);
  }
  function exportPermanent(){
    try{
      const song=readForm();
      const filename=uniquePermanentFilename(song);
      const meta=buildMetadata(song);
      const txt=(meta?meta+'\n\n':'')+song.body;
      const title=song.version ? `${song.title} — ${song.version}` : song.title;
      const entry=`{\n  title: ${JSON.stringify(title)},\n  artist: ${JSON.stringify(song.artist)},\n  file: ${JSON.stringify('songs/'+filename)},\n  favourite: false,\n  tags: ${JSON.stringify(song.tags)},\n  type: ${JSON.stringify(song.type)}\n}`;
      downloadText(filename, txt);
      setTimeout(()=>downloadText(filename.replace(/\.txt$/,'')+'-song-list-entry.txt', entry),250);
      setStatus('Downloaded TXT file and song-list entry. Add both to the project to make it permanent.');
    }catch(e){ setStatus(e.message); }
  }
  function exportBackup(){
    const data={app:'Ukulele Songbook',type:'my-songs-backup',version:EXPORT_VERSION,exportedAt:new Date().toISOString(),songs};
    downloadText('my-ukulele-songs-backup.json', JSON.stringify(data,null,2));
    setStatus('Exported My Songs backup.');
  }
  function importBackup(file){
    if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const data=JSON.parse(String(reader.result||''));
        const imported=Array.isArray(data) ? data : data.songs;
        if(!Array.isArray(imported)) throw new Error('This does not look like a My Songs backup.');
        let added=0, updated=0;
        for(const raw of imported){
          if(!raw.title || !raw.body) continue;
          const song={...raw,id:raw.id||makeId(raw.title),tags:Array.isArray(raw.tags)?raw.tags:splitTags(raw.tags),type:raw.type||'chords'};
          const idx=songs.findIndex(s=>s.id===song.id);
          if(idx>=0){songs[idx]=song;updated++;}else{songs.push(song);added++;}
        }
        saveStoredSongs(); syncLibraryAfterChange();
        setStatus(`Imported ${added} new and ${updated} updated songs.`);
      }catch(e){ setStatus('Import failed: '+e.message); }
    };
    reader.readAsText(file);
  }
  function onSongLoaded(song){
    if(song && song.isUserSong){
      const found=songs.find(s=>s.id===song.userSongId);
      if(found) fillForm(found);
    }
  }
  function initUI(){
    renderMySongList();
    $('newMySong')?.addEventListener('click',()=>{fillForm(null);setStatus('Ready for a new song.');});
    $('saveMySong')?.addEventListener('click',saveForm);
    $('previewMySong')?.addEventListener('click',previewForm);
    $('deleteMySong')?.addEventListener('click',deleteCurrent);
    $('exportPermanentSong')?.addEventListener('click',exportPermanent);
    $('exportMySongs')?.addEventListener('click',exportBackup);
    $('importMySongsFile')?.addEventListener('change',e=>importBackup(e.target.files[0]));
  }

  window.ukuleleMySongs={getSongText,onSongLoaded,loadStoredSongs:()=>songs.slice()};
  injectSongsIntoLibrary();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initUI); else initUI();
})();
