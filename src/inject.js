'use strict';

var gesture = {
    mvtrack: "",
    pdir: "",
    dist: 10,

    load: function() {
        addEventListener( 'mousedown', gesture.mDown, true);
        addEventListener( 'mouseup', gesture.mUp, true);
    },

    mDown: function(e) {
        gesture.mvtrack = '';
        if ( e.button == 2 ) {
            gesture.startX = e.screenX;
            gesture.startY = e.screenY;
            gesture.pdir = '';
            addEventListener( "mousemove", gesture.mCoor, true);
            var elem = e.target;
            while (elem.parentNode) elem = elem.parentNode;
            gesture.doc = elem;
        }
    },

    mCoor: function(e) {
        var dir  = "";
        var dX = gesture.startX - e.screenX;

        if (dX > 40 || dX < -40) {
            dir =  (dX < 0) ? 'RT' : 'LF';
        }
        var dY = gesture.startY - e.screenY;
        if (dY > 40 || dY < -40)
            dir =  (dY < 0) ? 'DN' : 'UP';
        if (dir !== "") {

            addEventListener( 'contextmenu',gesture.mClick, true);
            if  (dir !== gesture.pdir) {
                gesture.pdir = dir;
                gesture.mvtrack += dir;

                var a;
                if (a = document.getElementById('gestmsgtrack')) { a.remove() }
                var abox = document.createElement('div');
                abox.id = 'gestmsgtrack';
                abox.style.position = 'fixed';
                abox.style.top = '30px';
                abox.style.padding = '30px';
                abox.style.backgroundColor = 'rgba(17, 32, 59, 0.9)';
                abox.style.fontSize = '36px';
                abox.style.fontFamily = 'Verdana';
                abox.style.width = '100%';
                abox.style.zIndex = '9999999';
                abox.style.color = '#eeeeee';
                var mvtrack = document.createTextNode("[" + gesture.mvtrack.toString() + "] " + gesture.getAction());
                abox.appendChild(mvtrack);
                var fragment = document.createDocumentFragment();
                fragment.appendChild(abox);
                document.body.appendChild(fragment);

            }
            gesture.startX = e.screenX;
            gesture.startY = e.screenY;
            dir = "";
        }
    },

    mUp: function(e) {
        var a;
        if (a = document.getElementById('gestmsgtrack')) { a.remove() }
        removeEventListener( 'mousemove', gesture.mCoor, true);
        var where = gesture.doc;
        switch(gesture.mvtrack) {
          case 'UP':
            where.defaultView.scroll( 0, 0);
            break;
          case 'DN':
            where.defaultView.scroll( 0, 1E9);
            break;
          case 'LF':
            browser.runtime.sendMessage( {m: 'prevTab'});
            break;
          case 'RT':
            browser.runtime.sendMessage( {m: 'nextTab'});
            break;
          case 'DNRT':
            browser.runtime.sendMessage( {m: 'closeTab'});
            break;
          case 'DNLF':
            browser.runtime.sendMessage( {m: 'minWin'});
            break;
          case 'UPDN':
            location.reload();
            break;
          default:
            //where.defaultView.scroll( 0, 1E9);
            break;
        }
    },
    mClick: function( event) {
        event.preventDefault();
        removeEventListener( 'contextmenu',gesture.mClick, true);
    },
    getAction: function () {
        switch(gesture.mvtrack){
        case 'UP':
            return 'Go Up';
          case 'DN':
            return 'Go Down';
          case 'LF':
            return 'Previos Tab';
          case 'RT':
            return 'Next Tab';
          case 'DNRT':
            return 'Close Tab';
          case 'DNLF':
            return 'Minimize Window';
          case 'UPDN':
            return 'Reload Page';
          default:
            return '';
        }
    }

}

gesture.load();
