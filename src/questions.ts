export interface AnswerMap {
    [index: string]: any;
}

/**
 * Represents a tree of questions that can be used to build up a template context
 */
export interface QuestionTree {
    /**
     * The text that the user is shown before waiting for answer input
     */
    prompt: string;

    /**
     * The name of the question, also used as a variable name in the resulting
     * template context
     */
    name: string;

    /**
     * An optional list of options for multiple-choice questions.
     */
    options?: QuestionOption[];

    /**
     * Transformation and validation function that can be used for both free
     * form and multiple choice question types.
     *
     * @param transformerValidator a function that transforms valid input to
     * the answer data desired and throws on invalid input. Mutates the given
     * AnswerMap as needed. Returns a follow-up question, if necessary. Can be
     * async.
     */
    transformerValidator?: (rawInput: any, answers: AnswerMap) => Promise<QuestionTree | undefined> | QuestionTree | undefined;
}

/**
 * Represents a single option in a list of options for a multiple choice
 * question.
 */
export interface QuestionOption {
    /**
     * The text shown to the user to describe this option.
     */
    label: string;

    /**
     * The value that should be used when this option is selected. If the
     * question also contains a transformerValidator, this is data will be
     * passed as rawInput.
     */
    value: any;

    /**
     * The follow-up question that should be given to the user after this one,
     * if applicable.
     */
    nextQuestion?: QuestionTree;
}

const _tacoBoutIt: QuestionTree = {
    name: "tacoBoutIt",
    prompt: "Go ahead and taco 'bout it!",
    transformerValidator: (rawInput: any, answers: AnswerMap) => {
        if (typeof rawInput !== 'string' || rawInput.length === 0) {
            return _tacoBoutIt;
        }

        answers.tacoBoutIt = rawInput;
        return;
    }
};

const _monster: QuestionTree = {
    name: "tacos",
    prompt: `What about tacos?`,
    options: [
        { label: "Yes", value: true, nextQuestion: _tacoBoutIt },
        { label: "No", value: false }
    ]
};

export const questions: QuestionTree = {
    prompt: `Do you like pizza?`,
    name: `pizza`,
    options: [
        { label: "Yes", value: true },
        { label: "No", value: false, nextQuestion: _monster }
    ]
};
