function key(profile){ return `formkit:${location.origin}${location.pathname}:${profile||'default'}`; }
function collect(){
    const data={};
    document.querySelectorAll('input, textarea, select').forEach(el=>{
        if(el.type==='password' || el.type==='hidden') return;
        const name = el.name||el.id||el.getAttribute('aria-label')||el.type+':'+Array.from(document.querySelectorAll(el.tagName)).indexOf(el);
        if(el.type==='checkbox') data[name]=el.checked;
        else if(el.type==='radio'){ if(el.checked) data[name]=el.value; }
        else if(el.tagName==='SELECT') data[name]=el.value;
        else data[name]=el.value;
    });
    return data;
}
function apply(data){
    let filled=0;
    document.querySelectorAll('input, textarea, select').forEach(el=>{
        if(el.type==='password' || el.type==='hidden') return;
        const name = el.name||el.id||el.getAttribute('aria-label')||el.type+':'+Array.from(document.querySelectorAll(el.tagName)).indexOf(el);
        if(!(name in data)) return;
        const v = data[name];
        if(el.type==='checkbox'){ el.checked=!!v; filled++; }
        else if(el.type==='radio'){ if(el.value==v){ el.checked=true; filled++; } }
        else if(el.tagName==='SELECT'){ el.value=v; el.dispatchEvent(new Event('change',{bubbles:true})); filled++; }
        else { el.value=v; el.dispatchEvent(new Event('input',{bubbles:true})); filled++; }
    });
    return filled;
}
async function save(){
    const p = prompt('Profile name? (default=空でOK)','');
    const data = collect();
    const obj={}; obj[key(p)] = data;
    await chrome.storage.local.set(obj);
    alert('Saved '+Object.keys(data).length+' fields');
}
async function load(){
    const p = prompt('Load profile name? (default=空でOK)','');
    const k = key(p);
    const obj = await chrome.storage.local.get(k);
    const data = obj[k];
    if(!data) return alert('No saved data');
    const n = apply(data);
    alert('Filled '+n+' fields');
}
chrome.runtime.onMessage.addListener((msg)=>{
    if(msg.type==='save_profile') save();
    if(msg.type==='load_profile') load();
});