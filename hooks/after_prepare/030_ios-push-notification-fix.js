#!/usr/bin/env node

// disable push_notifications
// v1.0

var fs = require('fs');
var path = require('path');
var sys = require('sys')

var rootdir = process.argv[2];

function findFile(rootDir, fileName) {
    if (fs.existsSync(rootDir)) {
        var files = fs.readdirSync(rootDir), finded = false;
        for (var i in files){
            if(finded)
                continue ;
            var name = rootDir + '/' + files[i];
            if (fs.statSync(name).isDirectory()){
                var inDir = findFile(name, fileName) ;
                if(inDir)
                    return inDir ;
            } else if((new RegExp(fileName)).test(name)) {
                return name;
            }
        }
        return null ;
    }
}
if (rootdir) {
    var configfile = path.join(rootdir, "ionic.project"), configobj = JSON.parse(fs.readFileSync(configfile, 'utf8'));
    var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);
    for (var x = 0; x < platforms.length; x++) {
        try {
            var platform = platforms[x].trim().toLowerCase();
            if (platform === 'ios') {
                var fn = findFile(path.join('platforms', platform), 'AppDelegate.m'), Datas = '', datas = [], outputs = [], paramSet = false;
                if (fs.existsSync(fn)) {
                    Datas = fs.readFileSync(fn, 'utf8') ;
                    datas = Datas.split("\n") ;
                    for(var i=0; i<datas.length; i++) {
                        if(configobj.disablePushNotifications) {
                            if(datas[i].indexOf('#define DISABLE_PUSH_NOTIFICATIONS') !== -1) {
                                console.log('PUSH_NOTIFICATIONS disabled') ;
                                paramSet = true ;
                            } else if(!paramSet && datas[i].indexOf('#import') !== -1) {
                                console.log('define PUSH_NOTIFICATIONS') ;
                                outputs.push("#define DISABLE_PUSH_NOTIFICATIONS true") ;
                                paramSet = true ;
                            }
                        } else if(datas[i].indexOf('#define DISABLE_PUSH_NOTIFICATIONS') !== -1) {
                            console.log('remove PUSH_NOTIFICATIONS definition') ;
                            continue ;
                        }
                        outputs.push(datas[i]) ;
                    }
                    fs.writeFileSync(fn, outputs.join("\n"), 'utf8');
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}