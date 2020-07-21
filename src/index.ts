import { rootQuestion } from "./questions";
import { QuestionRenderer } from "./questionRenderer";

async function main() {
    const qr = new QuestionRenderer(rootQuestion);
    const answers = await qr.render();
    const write = console;
    write.log(JSON.stringify(answers, null, 2));
}

if (require.main === module) {
    // note: main returns a Promise<void>, but we don't need to do anything
    // special with it, so we use the void operator to indicate to eslint that
    // we left this dangling intentionally...
    try {
        void main();
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (err && err.stack) {
            // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-member-access
            console.error(`Unhandled promise rejection: ${err.stack as string}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        } else if (err && err.message) {
            // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-member-access
            console.error(`Unhandled promise rejection: ${err.message as string}`);
        } else if (err) {
            // eslint-disable-next-line no-console
            console.error(`Unhandled promise rejection: ${err as string}`);
        } else {
            // eslint-disable-next-line no-console
            console.error(`Unhandled promise rejection: unknown error`);
        }
    }
}