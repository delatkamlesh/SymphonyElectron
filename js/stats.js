const os = require('os');
const { app } = require('electron');

const config = require('./config');

const log = require('./log.js');
const logLevels = require('./enums/logLevels.js');

const MB_IN_BYTES = 1048576;

const logSystemStats = () => {
    log.send(logLevels.INFO, `-----------------Gathering system information-----------------`);
    log.send(logLevels.INFO, `Network Info -> ${JSON.stringify(os.networkInterfaces())}`);
    log.send(logLevels.INFO, `CPU Info -> ${JSON.stringify(os.cpus())}`);
    log.send(logLevels.INFO, `Operating System -> ${JSON.stringify(os.type())}`);
    log.send(logLevels.INFO, `Platform -> ${JSON.stringify(os.platform())}`);
    log.send(logLevels.INFO, `Architecture -> ${JSON.stringify(os.arch())}`);
    log.send(logLevels.INFO, `Hostname -> ${JSON.stringify(os.hostname())}`);
    log.send(logLevels.INFO, `Temp Directory -> ${JSON.stringify(os.tmpdir())}`);
    log.send(logLevels.INFO, `Home Directory -> ${JSON.stringify(os.homedir())}`);
    log.send(logLevels.INFO, `Total Memory (MB) -> ${JSON.stringify(os.totalmem() / MB_IN_BYTES)}`);
    log.send(logLevels.INFO, `Free Memory (MB) -> ${JSON.stringify(os.freemem() / MB_IN_BYTES)}`);
    log.send(logLevels.INFO, `Load Average -> ${JSON.stringify(os.loadavg())}`);
    log.send(logLevels.INFO, `Uptime -> ${JSON.stringify(os.uptime())}`);
    log.send(logLevels.INFO, `User Info (OS Returned) -> ${JSON.stringify(os.userInfo())}`);
};

const logGPUStats = () => {
    log.send(logLevels.INFO, `-----------------Gathering GPU information-----------------`);
    log.send(logLevels.INFO, `GPU Feature Status -> ${JSON.stringify(app.getGPUFeatureStatus())}`);    
};

const logPodStats = () => {
    const fields = ['url', 'minimizeOnClose', 'launchOnStartup', 'alwaysOnTop', 'bringToFront', 'whitelistUrl', 'isCustomTitleBar', 'memoryRefresh', 'devToolsEnabled', 'ctWhitelist', 'notificationSettings', 'crashReporter', 'customFlags', 'permissions', 'autoLaunchPath'];
    config.getMultipleConfigField(fields)
        .then((data) => {
            log.send(logLevels.INFO, `-----------------Gathering POD & App information-----------------`);
            log.send(logLevels.INFO, `Is app packaged? ${app.isPackaged}`);
            for (let field in data) {
                if (Object.prototype.hasOwnProperty.call(data, field)) {
                    log.send(logLevels.INFO, `${field} -> ${JSON.stringify(data[field])}`);
                }
            }
        });
};

const logAppMetrics = () => {
    log.send(logLevels.INFO, `-----------------Gathering App Metrics-----------------`);
    const metrics = app.getAppMetrics();
    metrics.forEach((metric) => {
        log.send(logLevels.INFO, `PID -> ${metric.pid}, Type -> ${metric.type}, CPU Usage -> ${JSON.stringify(metric.cpu)}`);
    });
};

const logAppEvents = () => {

    const events = [
        'will-finish-launching', 'ready', 'window-all-closed', 'before-quit', 'will-quit', 'quit',
        'open-file', 'open-url', 'activate',
        'browser-window-created', 'web-contents-created', 'certificate-error', 'login', 'gpu-process-crashed',
        'accessibility-support-changed', 'session-created', 'second-instance'
    ];

    events.forEach((appEvent) => {
        app.on(appEvent, () => {
            log.send(logLevels.INFO, `App Event Occurred: ${appEvent}`)
        });
    });
};

const logProcessInfo = () => {
    log.send(logLevels.INFO, `Is default app? ${process.defaultApp}`);
    log.send(logLevels.INFO, `Is Mac Store app? ${process.mas}`);
    log.send(logLevels.INFO, `Is Windows Store app? ${process.windowsStore}`);
    log.send(logLevels.INFO, `Resources Path? ${process.resourcesPath}`);
    log.send(logLevels.INFO, `Sandboxed? ${process.sandboxed}`);
    log.send(logLevels.INFO, `Chrome Version? ${process.versions.chrome}`);
    log.send(logLevels.INFO, `Electron Version? ${process.versions.electron}`);
    // log.send(logLevels.INFO, `Creation Time? ${process.getCreationTime()}`);
}

logSystemStats();
logGPUStats();
logPodStats();
logAppMetrics();
logAppEvents();
logProcessInfo();

module.exports = {
    getSystemStats: logSystemStats,
    getGPUStats: logGPUStats,
    getPodStats: logPodStats,
    getAppMetrics: logAppMetrics
};