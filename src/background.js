gesture = {

  init: function() {
    browser.runtime.onMessage.addListener(gesture.doIt);
  },
  
  doIt: function( msg) {
    browser.tabs.query({active:true,currentWindow:true},t=>{
      switch(msg.m) {
        case 'closeTab':
          browser.tabs.remove(t[0].id);
          break;
        case 'prevTab':
          browser.tabs.query({currentWindow:true},e=>{
            var w=(t[0].index-1+e.length)%e.length;
            browser.tabs.update(e[w].id,{active:true});
          });
          break;
        case 'nextTab':
          browser.tabs.query({currentWindow:true},e=>{
            var n=(t[0].index+1)%e.length;
            browser.tabs.update(e[n].id,{active:true});
          });
          break;
        case 'minWin':
          browser.windows.update(t[0].windowId,{state:'minimized'});
          break;
      }
    });
  }
};
gesture.init();
