(function(){
  'use strict';
  const search=document.getElementById('helpSearch');
  const topics=[...document.querySelectorAll('.help-topic')];
  const status=document.getElementById('helpSearchStatus');
  const noResults=document.getElementById('noResults');
  if(!search)return;
  function normalise(value){return String(value||'').toLowerCase().replace(/[^a-z0-9\\/\\\\~]+/g,' ').trim();}
  function runSearch(){
    const query=normalise(search.value);
    let shown=0;
    topics.forEach(topic=>{
      const haystack=normalise(topic.textContent+' '+(topic.dataset.keywords||''));
      const match=!query||query.split(/\\s+/).every(word=>haystack.includes(word));
      topic.hidden=!match;
      if(match)shown++;
    });
    noResults.hidden=shown!==0;
    status.textContent=query ? `${shown} matching help topic${shown===1?'':'s'}.` : 'Showing all help topics.';
  }
  search.addEventListener('input',runSearch);
  document.querySelectorAll('.help-nav a').forEach(link=>link.addEventListener('click',()=>{
    if(search.value){search.value='';runSearch();}
  }));
})();
