import cliSpinners, { Spinner as CLISpinner, SpinnerName } from "cli-spinners";
import logUpdate from "log-update";

export class Spinner {

  public text: string;
  private _spinner: CLISpinner;
  private _intervalHandle: NodeJS.Timeout | null;

  constructor(text: string, spinnerName: SpinnerName = "dots3") {
    this.text = text;
    if (!cliSpinners[spinnerName]) {
      const spinnerNames = Object.keys(cliSpinners).join(", ");
      throw new Error(`Invalid spinner name ${spinnerName} specified. Expected one of the following: ${spinnerNames}`);
    }

    this._spinner = cliSpinners[spinnerName];
    this._intervalHandle = null;
  }

  get isRunning(): boolean {
    return this._intervalHandle !== null;
  }

  start(): Spinner {
    if (this._intervalHandle !== null) {
      return this;
    }

    let i = 0;

    this._intervalHandle = setInterval(() => {
      const spinnerFrame = this._spinner.frames[i = ++i % this._spinner.frames.length];
      const line = `${spinnerFrame} ${this.text}`;
      logUpdate(line);
    }, this._spinner.interval);

    return this;
  }

  stop(finalText?: string): Promise<void> {
    if (this._intervalHandle === null) {
      return Promise.resolve();
    }

    const handle = this._intervalHandle;
    this._intervalHandle = null;
    clearInterval(handle);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          logUpdate.clear();
          if (finalText) {
            logUpdate(finalText);
          }
          logUpdate.done();
          resolve();
        } catch (err) {
          reject(err);
        }
      }, this._spinner.interval);
    });
  }

  succeed(finalText: string): Promise<void> {
    return this.stop(`✅ ${finalText}`);
  }

  fail (finalText: string): Promise<void> {
    return this.stop(`❌ ${finalText}`);
  }
}

if (require.main === module) {
  const spinner = new Spinner("This is a test").start();
  setTimeout(() => {
    spinner.text = "the text changed!";
    setTimeout(() => {
      void spinner.stop("Test complete");
      const spinner2 = new Spinner("This is a test again").start();
      setTimeout(() => {
        void spinner2.succeed("Test completed successfully");
        const spinner3 = new Spinner("This is a test one last time").start();
        setTimeout(() => {
          void spinner3.fail("Test failed (this is expected and desirable)");
        }, 3000);
      }, 3000);
    }, 3000);
  }, 3000);

}