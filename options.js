function send(type){
    chrome.tabs.query({active:true, currentWindow:true}, (tabs)=>{
        if(!tabs[0]) return;
        const name = document.getElementById('profile').value||'';
        chrome.tabs.sendMessage(tabs[0].id, {type, profile:name});
    });
}
// 追加でcontent.js側のsave/loadをprofile引数対応にするなら、メッセージのデータを読むよう微修正してください。
(document.getElementById('save')).onclick=()=>send('save_profile');
(document.getElementById('load')).onclick=()=>send('load_profile');