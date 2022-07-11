var fs = require('fs'), path = require('path');
const semver = require('semver');

const getConfigParser = (context, configPath) => {
      let ConfigParser;

      if (semver.lt(context.opts.cordova.version, '5.4.0')) {
        ConfigParser = context.requireCordovaModule('cordova-lib/src/ConfigParser/ConfigParser');
      } else {
        ConfigParser = context.requireCordovaModule('cordova-common/src/ConfigParser/ConfigParser');
      }

      return new ConfigParser(configPath);
    };

module.exports = function(context) {

    const args = process.argv

    var localizationStringsJSON;
    /*for (const arg of args) {  
      if (arg.includes('LOCALIZATION_STRINGS_JSON')){
        var stringArray = arg.split("=");
        localizationStringsJSON = stringArray.slice(-1).pop();
      }
    }*/

    localizationStringsJSON = '{"languages":["pt","it", "en"], "translations": {"pt": {"config_ios": {"NSCameraUsageDescription": "Precisamos aceder a tua câmera!", "NSLocationWhenInUseUsageDescription": "Precisamos da tua localização!", "NSLocationAlwaysAndWhenInUseUsageDescription": "Precisamos da tua localização!", "NSLocationAlwaysUsageDescription": "Precisamos da tua localização!"}},"it": {"config_ios": {"NSCameraUsageDescription": "Dobbiamo accedere alla tua fotocamera!", "NSLocationWhenInUseUsageDescription": "Dobbiamo accedere alla tua posizione!", "NSLocationAlwaysAndWhenInUseUsageDescription": "Dobbiamo accedere alla tua posizione!", "NSLocationAlwaysUsageDescription": "Dobbiamo accedere alla tua posizione!"}},"en": {"config_ios": {"NSCameraUsageDescription": "We need to access your camera!", "NSLocationWhenInUseUsageDescription": "We need to access your position!", "NSLocationAlwaysAndWhenInUseUsageDescription": "We need to access your position!", "NSLocationAlwaysUsageDescription": "We need to access your position!"}} }}';


    //{ "config_ios": {"NSCameraUsageDescription": "Take pictures", "NSLocationWhenInUseUsageDescription": "Hey I want to track you!", "NSLocationAlwaysAndWhenInUseUsageDescription": "Hey I want to track you!", "NSLocationAlwaysUsageDescription": "Hey I want to track you!"}}

    //JSON parsing
    const localizations = JSON.parse(localizationStringsJSON);

    //Create root translations directory
    var translationsDir = path.join(context.opts.projectRoot, 'translations', 'app');

    if (!fs.existsSync(translationsDir)){
        fs.mkdirSync(translationsDir, { recursive: true });
    }

    //Checks required languages array and create respective files
    for (let i = 0; i < localizations.languages.length; i++) {
      let translationFilePath = path.join(translationsDir, localizations.languages[i] + ".json");
      let translation = localizations.translations[localizations.languages[i]];

      fs.writeFile(translationFilePath, translation, function(err) {
        if(err) {
            return console.log("🚨 Error writing translation file " + localizations.languages[i] + ".json: " + err);
        }
        console.log("The file was saved!");
      }); 
    }
/*
    const projectRoot = context.opts.projectRoot;
    const platformPath = path.join(projectRoot, 'platforms', 'ios');
    const config = getConfigParser(context, path.join(projectRoot, 'config.xml'));

    let projectName = config.name();
    let projectPath = path.join(platformPath, projectName);

    var swiftFile = path.join(projectPath, 'Plugins/cordova-plugin-anagog-jedai/JemaWrapper.swift');
    
    if (fs.existsSync(swiftFile)) {
     
      fs.readFile(swiftFile, 'utf8', function (err,data) {
        
        if (err) {
          throw new Error('>>> Unable to read JemaWrapper.swift: ' + err);
        }
        
        var result = data.replace(/let API_KEY = ""/g, 'let API_KEY = "' + localizationStringsJSON + '"');
        
        fs.writeFile(swiftFile, result, 'utf8', function (err) {
        if (err) 
          {throw new Error('>>> Unable to write into JemaWrapper.swift: ' + err);}
        else 
          {console.log(">>> JemaWrapper.swift edited successfuly <<<");}
        });
      });
    } else {
        throw new Error(">>> WARNING: JemaWrapper.swift was not found <<<");
    }
*/
}

