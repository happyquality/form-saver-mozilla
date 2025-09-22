chrome.commands.onCommand.addListener((cmd)=>{
    if(cmd==='save_profile' || cmd==='load_profile'){
        chrome.tabs.query({active:true, currentWindow:true}, tabs=>{
            if(!tabs[0]) return;
            chrome.tabs.sendMessage(tabs[0].id, {type:cmd});
        });
    }
});