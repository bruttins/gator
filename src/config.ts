import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string;
    currentUserName?: string;
};

export function setUser(username: string): void {
    const cfg = readConfig();
    cfg.currentUserName = username;
    writeConfig(cfg)
}

export function readConfig() {
    const jsonConfig = fs.readFileSync(getConfigFilePath(), {encoding: 'utf-8'});
    const rawConfig = JSON.parse(jsonConfig)
    return validateConfig(rawConfig)
}

function getConfigFilePath(): string {
    const homedir = os.homedir();
    return path.join(homedir, '.gatorconfig.json')
}

function validateConfig(rawConfig: any): Config {
    if (!rawConfig.db_url) {
        throw new Error('no URL set');
    }
    else return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name
    };
}

function writeConfig(cfg: Config): void {
    const jsonFile = {
        "db_url": cfg.dbUrl,
        "current_user_name": cfg.currentUserName
    }
    const jsonString = JSON.stringify(jsonFile)
    const filepath = getConfigFilePath();
    fs.writeFileSync(filepath, jsonString);
}