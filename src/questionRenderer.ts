import { QuestionTree, AnswerMap, QuestionOption } from "./questions/types";
import readline, { ReadLine } from "readline";

export class QuestionRenderer {
    private _questions: QuestionTree;
    private _forceDefaults: boolean;

    constructor(questions: QuestionTree, forceDefaults?: boolean) {
        this._questions = questions;
        this._forceDefaults = !!forceDefaults;
    }

    async render(): Promise<AnswerMap> {

        const answers: AnswerMap = {};

        const rl = readline.createInterface(process.stdin, process.stdout);
        try {
            let question: QuestionTree | undefined = this._questions;

            while (question) {
                if (question.options) {
                    question = await this._handleOptionsQuestion(rl, question, answers);
                } else if (question.transformerValidator) {
                    question = await this._handleTransformerQuestion(rl, question, answers);
                } else {
                    throw new Error(`BUG! Question '${question.name}' does not include multiple choice options or a free form input transformer.`);
                }
            }
        } finally {
            rl.close();
        }

        return answers;
    }

    async _handleOptionsQuestion(rl: ReadLine, question: QuestionTree, answers: AnswerMap): Promise<QuestionTree | undefined> {
        let prompt = question.prompt + "\n";

        if (!question.options) {
            throw new Error(`BUG! Question '${question.name}' does not include any options from which to select`);
        }

        let defaultOption: QuestionOption | null = null;

        for (let i = 1; i < question.options.length + 1; i++) {
            const option = question.options[i - 1];
            if (option.default && !defaultOption) {
                defaultOption = option;
            }
            prompt += `\t${i}. ${option.label}\n`;
        }

        const rawInput = await this._askQuestion(rl, prompt);
        const choice = parseInt(rawInput, 10);

        if (choice >= 1 && choice <= question.options.length) {
            const selectedOption = question.options[choice - 1]; // we're 1 indexed on the answers here

            if (question.transformerValidator) {
                return this._handleTransformerAnswer(
                    question,
                    selectedOption.value,
                    answers,
                    selectedOption.nextQuestion
                );
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                answers[question.name] = selectedOption.value;

                return selectedOption.nextQuestion;
            }
        } else if (rawInput === "" && defaultOption !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            answers[question.name] = defaultOption.value;
            return defaultOption.nextQuestion;
        } else {
            return question;
        }
    }

    async _handleTransformerQuestion(rl: ReadLine, question: QuestionTree, answers: AnswerMap): Promise<QuestionTree | undefined> {
        const prompt = question.prompt;

        if (!question.transformerValidator) {
            throw new Error(`BUG! Question '${question.name}' does not include a transformer to handle free form entry.`);
        }

        const rawInput = await this._askQuestion(rl, prompt);

        return this._handleTransformerAnswer(question, rawInput.trim(), answers);
    }

    async _handleTransformerAnswer(
        question: QuestionTree,
        rawInput: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
        answers: AnswerMap,
        fallbackQuestion?: QuestionTree
    ): Promise<QuestionTree | undefined> {
        if (!question.transformerValidator) {
            throw new Error(`BUG! Question '${question.name}' does not include a transformer to handle free form entry.`);
        }

        try {
            let nextQuestion = question.transformerValidator(rawInput, answers);
            if (
                nextQuestion &&
                typeof (nextQuestion as Promise<QuestionTree | undefined>).then === 'function'
            ) {
                nextQuestion = await nextQuestion;
            }

            return nextQuestion ? nextQuestion : fallbackQuestion;
        } catch {
            return question;
        }
    }

    _askQuestion(rl: ReadLine, prompt: string): Promise<string> {
        const forceDefaults = this._forceDefaults;

        if (!prompt.endsWith("\n")) {
            prompt += "\n";
        }

        return new Promise((resolve, reject) => {
            try {
                if (forceDefaults) {
                    resolve("");
                } else {
                    rl.question(prompt, resolve);
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}
