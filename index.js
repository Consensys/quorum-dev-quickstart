#!/usr/bin/env node
const main = require("./build").main;

if (require.main === module) {
    // note: main returns a Promise<void>, but we don't need to do anything
    // special with it, so we use the void operator to indicate to eslint that
    // we left this dangling intentionally...
    try {
        void main();
    } catch (err) {
        if (err && err.stack && process.argv.length >= 3 && process.argv[2] === "--stackTraceOnError") {
            console.error(`Fatal error: ${err.stack}`);
        } else if (err && err.message) {
            console.error(`Fatal error: ${err.message}`);
        } else if (err) {
            console.error(`Fatal error: ${err}`);
        } else {
            console.error(`Fatal error: unknown`);
        }
        process.exit(1);
    }
}