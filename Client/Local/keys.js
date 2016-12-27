let keys = {};

c.onkeydown = function(e) {
    //console.log(e.which);
    if(!keys[e.which]) keys[e.which] = new Date;
    switch(e.which) {
        case 37: // Arrow left
            scroll(-5,0);
            break;
        case 38: // Arrow up
            scroll(0,5);
            break;
        case 39: // Arrow right
            scroll(5,0);
            break;
        case 40: // Arrow down
            scroll(0,-5);
            break;
        case 36: // Home
            scroll(-offset.x,-offset.y);
            break;
        case 46: // Delete
            if(selecting) {
                for(let i of selecting.components) {
                    if(components.includes(i)) remove(i);
                }

                selecting = null;
                contextMenu.hide();
            } else {
                remove(
                    find(mouse.grid.x,mouse.grid.y)
                );
            }
            break;
        case 33: // Page Up
            changeZoom(zoom / 2);
            break;
        case 34: // Page Down
            changeZoom(zoom / -2);
            break;
        case 13: // Enter
            break;
        case 27: // Escape
            document.getElementById("list").style.display = "none";
            contextMenu.hide();
            waypointsMenu.hide();
            selecting = null;
            break;
        case 49: // 1
            document.getElementsByClassName("slot")[0].onmousedown();
            break;
        case 50: // 2
            document.getElementsByClassName("slot")[1].onmousedown();
            break;
        case 51: // 3
            document.getElementsByClassName("slot")[2].onmousedown();
            break;
        case 52: // 4
            document.getElementsByClassName("slot")[3].onmousedown();
            break;
        case 53: // 5
            document.getElementsByClassName("slot")[4].onmousedown();
            break;
        case 54: // 6
            document.getElementsByClassName("slot")[5].onmousedown();
            break;
        case 55: // 7
            document.getElementsByClassName("slot")[6].onmousedown();
            break;
        case 56: // 8
            break;
        case 57: // 9
            break;
        case 58: // 0
            break;
        case 67: // C
            if(e.ctrlKey) {
                if(selecting) {
                    clipbord.copy(selecting.components, selecting);
                } else {
                    clipbord.copy([find(mouse.grid.x,mouse.grid.y)]);
                }
            }
            break;
        case 69: // E:
            var component = find(mouse.grid.x,mouse.grid.y);
            if(component && component.constructor == Wire) {
                popup.color_picker.show(
                    color => color
                    && (color.match(/\#((\d|[a-f]){6}|(\d|[a-f]){3})/g) || [])[0] == color
                    && !edit(component,"color_off",n => color) && edit(component,"color_on",n => lighter(color,50))
                );
            }
            else if(component && component.name) {
                popup.prompt.show(
                    "Edit name",
                    "Enter a name for this component:",
                    name => name && name.length < 18 && edit(component,"name",n => name)
                );
            }
            return false;
            break;
        case 79: // O
            // if(components.length) {
            //     popup.confirm.show(
            //         "Open file",
            //         "Are you sure you want to open another project? If you don't want to lose your work, press 'cancel' and save this project.",
            //         () => document.getElementById("open_file").click()
            //     );
            // } else document.getElementById("open_file").click();

            popup.openproject.show();
            return false;
            break;
        case 82: // R
            var component = find(mouse.grid.x,mouse.grid.y);
            if(component && component.height) {
                const t = component.height;
                component.height = component.width;
                component.width = t;
            }
            break;
        case 83: // S
            if(e.ctrlKey) {
                popup.prompt.show(
                    "Export",
                    "Enter export file name:",
                    name => name ? download(name,stringify({components})) : download(undefined,stringify({components}))
                );
            } else {
                waypointsMenu.hide();

                const component = find(mouse.grid.x,mouse.grid.y);
                setWaypoint(
                    mouse.grid.x,mouse.grid.y,
                    component && component.name
                );
            }
            break;
        case 84:
            Console.show();
            Console.input.focus();
            return false;
            break;
        case 86: // V
            if(e.ctrlKey) {
                clipbord.paste(mouse.grid.x,mouse.grid.y);
            }
            break;
        case 87: // W
            waypointsMenu.show(Object.assign({},mouse.grid));
            // gotoWaypoint(waypoints.length - 1);
            break;
        case 90: // Z
            if(e.ctrlKey) {
                if(e.shiftKey) redo();
                else undo();
            }
            break;
        case 9: // Tab
            var component = find(mouse.grid.x, mouse.grid.y);
            if(component && component.constructor != Wire) {
                select(component.constructor);
            }
            keys[9] = true;
            return false;
            break;
        case 114: // F3
            if(keys[114] instanceof Date && new Date - keys[114] > 50) {
                settings.show_debugInfo = !settings.show_debugInfo;
                keys[114] = true;
            }
            return false;
            break;
        case 93: // Context menu
            contextMenu.show({ x: mouse.screen.x, y: mouse.screen.y });
            break;
    }

    if(e.ctrlKey) return false;
}

c.onkeyup = function(e) { keys[e.which] = false }

c.onblur = function() {
    for(let i in keys) keys[i] = false;
}
